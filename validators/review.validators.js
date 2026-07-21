import { body, param } from "express-validator"

export const reviewIdValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid review id")
]

export const reviewValidation = [
    body("rating")
        .exists()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5")
        .toInt(),
    body("comment")
        .trim()
        .notEmpty()
        .withMessage("Comment cannot be empty")
        .isLength({ max: 500 })
        .withMessage("Comment cannot exceed 500 characters")
]

export const adminReviewValidation = [
    ...reviewValidation,
    body("status")
        .optional()
        .isIn(["pending", "approved", "hidden"])
        .withMessage("Invalid review status")
]
