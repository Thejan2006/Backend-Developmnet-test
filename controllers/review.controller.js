import Review from "../models/review.model.js"
import User from "../models/user.model.js"

const formatReview = (review) => ({
    id: review._id,
    userId: typeof review.user === "object" && review.user?._id ? review.user._id.toString() : review.user.toString(),
    userName: review.userName,
    userProfileImage: review.userProfileImage || "",
    productId: review.productId || "",
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
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // 🟢 Frontend එකෙන් Body එකෙන් එවන productId එක නිවැරදිව ලබා ගැනීම
        const { rating, comment, productId } = req.body

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required in request body" })
        }

        if (!comment || typeof comment !== "string") {
            return res.status(400).json({ success: false, message: "Valid comment is required" })
        }

        // 🟢 මෙම User සහ productId එක සඳහා දැනටමත් Review එකක් ඇත්දැයි බැලීම
        const existingReview = await Review.findOne({ user: user._id, productId })

        if (existingReview) {
            return res.status(409).json({ success: false, message: "You have already submitted a review for this product" })
        }

        const review = await Review.create({
            user: user._id,
            userName: user.name,
            userProfileImage: user.profileImage || "",
            productId: productId, // අනිවාර්යයෙන්ම save වීම සඳහා
            rating: Number(rating) || 5,
            comment: comment.trim(),
            status: "approved"
        })

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: { review: formatReview(review) }
        })
    } catch (error) {
        // 🟢 500 Error එක එන්න හේතුව VS Code Terminal එකේ Print වීම සඳහා
        console.error("🔴 DETAILED REVIEW CREATE ERROR:", error);
        
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}

export const getReviews = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query)
        const filter = { status: "approved" }

        if (req.query.productId || req.params.productId) {
            filter.productId = req.query.productId || req.params.productId
        }

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
        console.error("Get Reviews Error:", error)
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
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
        console.error("Get Review By ID Error:", error)
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
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
                rating: Number(rating) || review.rating,
                comment: comment ? comment.trim() : review.comment,
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
        console.error("Update Review Error:", error)
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
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
        console.error("Delete Review Error:", error)
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}