import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI

        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined")
        }

        await mongoose.connect(mongoURI)
        console.log("Connected with MongoDB successfully")
    } catch (error) {
        console.error("Error while connecting with MongoDB")
        console.error(error.message)
        process.exit(1)
    }
}

export default connectDB
