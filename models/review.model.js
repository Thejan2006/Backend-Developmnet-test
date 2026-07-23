import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
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
        // 🟢 productId එක අනිවාර්යයෙන්ම Schema එකට එකතු කළ යුතුයි
        productId: {
            type: String,
            required: true,
            index: true
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

// 🟢 වැදගත්: එක් User කෙනෙකුට එකම Product එකකට දැමිය හැක්කේ එක Review එකකි.
// නමුත් වෙනත් Product එකකට Review එකක් දැමීමට මෙයින් කිසිදු බාධාවක් සිදු නොවේ.
reviewSchema.index({ user: 1, productId: 1 }, { unique: true })

reviewSchema.index({ status: 1, createdAt: -1 })

const Review = mongoose.model("Review", reviewSchema)


Review.syncIndexes()
    .then(() => console.log("✅ Review indexes synced successfully!"))
    .catch((err) => console.error("❌ Index sync error:", err));

export default Review