import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export default function authenticate(req, res, next) {
    const header = req.header("Authorization")

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized. Please log in first." })
    }

    const token = header.replace("Bearer ", "")

    //  JWT_SECRET_KEY වෙනුවට Login එකේ පාවිච්චි කරන නමම (JWT_SECRET) මෙතැනට දෙන්න
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token please login again" })
        } else {
            req.user = decoded
            next()
        }
    })
}