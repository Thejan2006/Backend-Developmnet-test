import express from "express"
import mongoose from "mongoose"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import reviewRouter from "./routes/review.routes.js"
import adminRouter from "./routes/admin.routes.js"
import notFound from "./middleware/not-found.middleware.js"
import errorHandler from "./middleware/error.middleware.js"
import dns from "dns";
dns.setServers(["8.8.8.8"]);

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3003
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

let server

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later"
    }
})

app.disable("x-powered-by")
app.set("trust proxy", 1)
app.use(helmet())
app.use(cors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials: true
}))
app.use(express.json({ limit: "10kb" }))
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))
app.use(apiLimiter)

app.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "API is healthy"
    })
})

app.use("/api/auth", authRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/admin/reviews", adminRouter)

app.use(notFound)
app.use(errorHandler)

const shutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`)

    if (server) {
        server.close(async () => {
            try {
                await mongoose.connection.close()
                process.exit(0)
            } catch (error) {
                console.error("Error during shutdown", error)
                process.exit(1)
            }
        })
        return
    }

    try {
        await mongoose.connection.close()
    } finally {
        process.exit(0)
    }
}

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))

const startServer = async () => {
    await connectDB()

    server = app.listen(PORT, () => {
        console.log("Server started successfully on port " + PORT)
    })
}

startServer()
