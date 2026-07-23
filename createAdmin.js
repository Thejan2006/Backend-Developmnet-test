import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "./models/user.js"; // path eka adjust karanna
import dotenv from "dotenv";
dotenv.config();
import dns from "dns";
dns.setServers(["8.8.8.8"]);

dotenv.config()
async function createAdmin() {
    await mongoose.connect(process.env.MONGO_URI);

    const plainPassword = "MyNewAdmin123"; // oyage danna password eka methana danna
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newAdmin = new User({
        email: "admin@yourdomain.com",   // aluth admin email eka methana danna
        firstName: "Admin",
        lastName: "User",
        password: hashedPassword,
        isAdmin: true,
        isBlocked: false,
        isEmailVerified: true   // login walata email verify wena eka block karanna epa nisa true widihata danna
    });

    const result = await newAdmin.save();
    console.log("Admin created:", result);

    mongoose.disconnect();
}

createAdmin();