import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import adminMiddleware from "../middleware/admin.middleware.js"
import validateRequest from "../middleware/validate.middleware.js"
import { approveReview, deleteReviewAdmin, getAllReviewsAdmin, hideReview, updateReviewAdmin } from "../controllers/admin.controller.js"
import { adminReviewValidation, reviewIdValidation } from "../validators/review.validators.js"

const adminRouter = express.Router()

adminRouter.use(authMiddleware, adminMiddleware)

adminRouter.get("/", getAllReviewsAdmin)
adminRouter.put("/:id", reviewIdValidation, adminReviewValidation, validateRequest, updateReviewAdmin)
adminRouter.delete("/:id", reviewIdValidation, validateRequest, deleteReviewAdmin)
adminRouter.patch("/:id/hide", reviewIdValidation, validateRequest, hideReview)
adminRouter.patch("/:id/approve", reviewIdValidation, validateRequest, approveReview)

export default adminRouter
