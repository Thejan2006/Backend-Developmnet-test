import dotenv from "dotenv"
import connectDB from "../config/db.js"
import User from "../models/user.model.js"
import { hashPassword } from "../services/auth.service.js"

dotenv.config()

const run = async () => {
    const name = process.env.SEED_ADMIN_NAME || "Admin User"
    const email = process.env.SEED_ADMIN_EMAIL
    const password = process.env.SEED_ADMIN_PASSWORD

    if (!email || !password) {
        console.log("Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD")
        process.exit(1)
    }

    await connectDB()

    const normalizedEmail = email.toLowerCase().trim()
    const existingAdmin = await User.findOne({ email: normalizedEmail })

    if (existingAdmin) {
        existingAdmin.name = name.trim()
        existingAdmin.role = "admin"
        existingAdmin.password = await hashPassword(password)
        await existingAdmin.save()

        console.log(`Admin user updated: ${normalizedEmail}`)
        process.exit(0)
    }

    const hashedPassword = await hashPassword(password)

    await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "admin"
    })

    console.log(`Admin user created: ${normalizedEmail}`)
    process.exit(0)
}

run().catch((error) => {
    console.error("Failed to seed admin user")
    console.error(error.message)
    process.exit(1)
})
