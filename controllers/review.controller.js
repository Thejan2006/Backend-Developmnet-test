import Review from "../models/review.model.js"
import User from "../models/user.model.js"

const formatReview = (review) => ({
    id: review._id,
    userId: typeof review.user === "object" && review.user?._id ? review.user._id.toString() : review.user.toString(),
    userName: review.userName,
    userProfileImage: review.userProfileImage || "",
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt
})

const parsePagination = (query) => {
    const page = Math.max(1, Number.parseInt(query.page || "1", 10) || 1)
    const limit = Math.max(1, Math.min(50, Number.parseInt(query.limit || "10", 10) || 10))
    const skip = (page - 1) * limit

    return { page, limit, skip }
}

export const createReview = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const existingReview = await Review.findOne({ user: user._id })

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "You have already submitted a review"
            })
        }

        const { rating, comment } = req.body

        const review = await Review.create({
            user: user._id,
            userName: user.name,
            userProfileImage: user.profileImage || "",
            rating,
            comment: comment.trim(),
            status: "pending"
        })

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: {
                review: formatReview(review)
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        })
    }
}

export const getReviews = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query)
        const filter = { status: "approved" }

        const [totalReviews, reviews] = await Promise.all([
            Review.countDocuments(filter),
            Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
        ])

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: {
                reviews: reviews.map(formatReview),
                page,
                limit,
                totalReviews,
                totalPages: Math.ceil(totalReviews / limit)
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        })
    }
}

export const getReviewById = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            status: "approved"
        })

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Review fetched successfully",
            data: {
                review: formatReview(review)
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        })
    }
}

export const updateReview = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const review = await Review.findById(req.params.id)

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        const isOwner = review.user.toString() === req.user.id
        const isAdmin = req.user.role === "admin"

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            })
        }

        const { rating, comment } = req.body
        const updatedReview = await Review.findByIdAndUpdate(
            review._id,
            {
                rating,
                comment: comment.trim(),
                status: isAdmin ? review.status : "pending"
            },
            {
                new: true,
                runValidators: true
            }
        )

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: {
                review: formatReview(updatedReview)
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        })
    }
}

export const deleteReview = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const review = await Review.findById(req.params.id)

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        const isOwner = review.user.toString() === req.user.id
        const isAdmin = req.user.role === "admin"

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            })
        }

        await Review.findByIdAndDelete(review._id)

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: {}
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        })
    }
}

