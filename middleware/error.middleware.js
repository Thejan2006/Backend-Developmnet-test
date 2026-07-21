const errorHandler = (err, req, res, next) => {
    console.error(err)

    if (res.headersSent) {
        return next(err)
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid resource id"
        })
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map((item) => item.message).join(", ")
        })
    }

    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate value already exists"
        })
    }

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server error"
    })
}

export default errorHandler
