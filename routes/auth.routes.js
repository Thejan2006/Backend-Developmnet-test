import express from "express"
import rateLimit from "express-rate-limit"
import authMiddleware from "../middleware/auth.middleware.js"
import validateRequest from "../middleware/validate.middleware.js"
import { loginUser, logoutUser, registerUser, getCurrentUser } from "../controllers/auth.controller.js"
import { loginValidation, registerValidation } from "../validators/auth.validators.js"

const authRouter = express.Router()

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts, please try again later"
    }
})

authRouter.use(authLimiter)

authRouter.post("/register", registerValidation, validateRequest, registerUser)
authRouter.post("/login", loginValidation, validateRequest, loginUser)
authRouter.post("/logout", authMiddleware, logoutUser)
authRouter.get("/me", authMiddleware, getCurrentUser)

export default authRouter
