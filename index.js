import express from "express"
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

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3003
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000"

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

app.use(helmet())
app.use(cors({
    origin: clientUrl,
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

const startServer = async () => {
    await connectDB()

    app.listen(PORT, () => {
        console.log("Server started successfully on port " + PORT)
    })
}

startServer()
