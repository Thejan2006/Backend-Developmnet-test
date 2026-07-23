import jwt from "jsonwebtoken"
import User from "../models/user.model.js" // 👈 User model එක import කරගන්න

const authMiddleware = async (req, res, next) => { // async කරන්න
    const authHeader = req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 👈 Token එකේ ID එකෙන් කෙලින්ම Database එකෙන් Current User ව ගන්න.
        // එවිට MongoDB Compass එකේ role එක වෙනස් කළ සැණින් එය මෙහිදී වැඩ කරයි!
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, // 👈 Database එකේ තියෙන අලුත්ම role එක මෙතැනට වැටේ
            profileImage: user.profileImage || ""
        }

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}

export default authMiddleware