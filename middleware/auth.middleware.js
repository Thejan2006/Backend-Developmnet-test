import jwt from "jsonwebtoken"
import User from "../models/user.js" // 👈 Import එක user.js විදිහට හැදුවා

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    const token = authHeader.split(" ")[1]

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || process.env.JWT_SECRET) 

        const user = await User.findById(decoded.id || decoded._id)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        
        req.user = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked,
            image: user.image
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