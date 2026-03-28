import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routers/userRouter.js'
import authenticate from './middlewares/authenticate.js'
import productRouter from './routers/productRouter.js'
import dotenv from 'dotenv'
dotenv.config()

// Changed from mongodb+srv format to standard format to bypass local DNS querySrv errors
const mongoDBURI = process.env.MONGODB_URI

mongoose.connect(mongoDBURI).then(
    ()=>{
        console.log("Connected to MongoDB successfully")
    }
).catch(err => {
    console.error("MongoDB connection error:", err.message);
    if(err.message.includes('bad auth')) {
      console.error("\n---> Action Required: Your MongoDB password '1234' for user 'admin' is incorrect, or your IP address is not whitelisted in MongoDB Atlas. Please update your connection string credentials.");
    }
})
const app = express()

app.use( express.json() )

app.use(authenticate)


app.use("/users" , userRouter)
app.use("/products" , productRouter)

app.listen(
    3003 ,
    ()=>{
        console.log('Server started successfully')
        console.log('Listening on port 3003')
    }
)