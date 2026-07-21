import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import validateRequest from "../middleware/validate.middleware.js"
import { createReview, deleteReview, getReviewById, getReviews, updateReview } from "../controllers/review.controller.js"
import { reviewIdValidation, reviewValidation } from "../validators/review.validators.js"

const reviewRouter = express.Router()

reviewRouter.get("/", getReviews)
reviewRouter.get("/:id", reviewIdValidation, validateRequest, getReviewById)
reviewRouter.post("/", authMiddleware, reviewValidation, validateRequest, createReview)
reviewRouter.put("/:id", authMiddleware, reviewIdValidation, reviewValidation, validateRequest, updateReview)
reviewRouter.delete("/:id", authMiddleware, reviewIdValidation, validateRequest, deleteReview)

export default reviewRouter
