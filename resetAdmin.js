import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "./models/user.js"; // path eka oyage project ekata match karanna
import dotenv from "dotenv";
dotenv.config();
import dns from "dns";
dns.setServers(["8.8.8.8"]);

dotenv.config()

async function resetAdminPassword() {
    await mongoose.connect(process.env.MONGO_URI);

    const newPassword = "YourNewPassword123"; // aluth password eka methana danna
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await User.updateOne(
        { email: "test@gmail.com" },
        { $set: { password: hashedPassword } }
    );

    console.log(result);
    mongoose.disconnect();
}

resetAdminPassword();