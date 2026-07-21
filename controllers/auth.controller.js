import User from "../models/user.model.js"
import { comparePassword, generateToken, hashPassword } from "../services/auth.service.js"

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImage } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            })
        }

        const normalizedEmail = email.toLowerCase().trim()
        const existingUser = await User.findOne({ email: normalizedEmail })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            profileImage: profileImage || ""
        })

        const token = generateToken(user)

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user,
                token
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

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        const normalizedEmail = email.toLowerCase().trim()
        const user = await User.findOne({ email: normalizedEmail }).select("+password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await comparePassword(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = generateToken(user)

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user,
                token
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

export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
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

        return res.status(200).json({
            success: true,
            message: "Current user fetched successfully",
            data: {
                user
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

export const logoutUser = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logout successful",
        data: {}
    })
}
