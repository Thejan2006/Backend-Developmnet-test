import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const getSaltRounds = () => Number(process.env.BCRYPT_SALT_ROUNDS || 10)

export const hashPassword = async (password) => {
    return bcrypt.hash(password, getSaltRounds())
}

export const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword)
}

export const generateToken = (user) => {
    const jwtSecret = process.env.JWT_SECRET
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d"

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined")
    }

    return jwt.sign(
        {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage || ""
        },
        jwtSecret,
        {
            expiresIn: jwtExpiresIn
        }
    )
}
