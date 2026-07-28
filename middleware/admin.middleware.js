import jwt from "jsonwebtoken"
import User from "../models/user.js"

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ Auth Failed: No Bearer Token provided in Header");
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    const token = authHeader.split(" ")[1]

    try {
        // 1. JWT Verification Check
        const secretKey = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey); 
        console.log("🔑 Decoded Payload:", decoded);

        // 2. User ID Extraction
        const userId = decoded.id || decoded._id || decoded.userId;
        console.log("👤 Searching for User ID:", userId);

        // 3. Find User in DB
        const user = await User.findById(userId);

        if (!user) {
            console.log("❌ Auth Failed: User not found in MongoDB for ID:", userId);
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        console.log("✅ Auth Success for User:", user.email);

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
        // ❌ Render Logs වල 401 එන්න ඇත්තම හේතුව මෙතනින් Print වේ!
        console.log("❌ JWT Verification Error Details:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}

export default authMiddleware