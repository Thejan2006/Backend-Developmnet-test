import Review from "../models/review.model.js"

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
    const limit = Math.max(1, Math.min(100, Number.parseInt(query.limit || "10", 10) || 10))
    const skip = (page - 1) * limit

    return { page, limit, skip }
}

export const getAllReviewsAdmin = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query)
        const filter = {}

        if (req.query.status && ["pending", "approved", "hidden"].includes(req.query.status)) {
            filter.status = req.query.status
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
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        })
    }
}

export const updateReviewAdmin = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        const updates = {
            rating: req.body.rating,
            comment: req.body.comment.trim()
        }

        if (req.body.status) {
            updates.status = req.body.status
        }

        const updatedReview = await Review.findByIdAndUpdate(review._id, updates, {
            new: true,
            runValidators: true
        })

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

export const deleteReviewAdmin = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
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

const updateStatus = async (req, res, status) => {
    try {
        const review = await Review.findById(req.params.id)

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        review.status = status
        await review.save()

        return res.status(200).json({
            success: true,
            message: `Review ${status} successfully`,
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

export const hideReview = async (req, res) => {
    return updateStatus(req, res, "hidden")
}

export const approveReview = async (req, res) => {
    return updateStatus(req, res, "approved")
}

