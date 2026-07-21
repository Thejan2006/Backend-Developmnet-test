import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },
        userName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        userProfileImage: {
            type: String,
            default: ""
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        status: {
            type: String,
            enum: ["pending", "approved", "hidden"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

const Review = mongoose.model("Review", reviewSchema)

export default Review
