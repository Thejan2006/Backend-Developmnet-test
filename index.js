 import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routers/userRouter.js'
import authenticate from './middleware/authenticate.js'
import productRouter from './routers/productRouter.js'
import dotenv from 'dotenv'



dotenv.config();  // mongoDB connectivity section

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log(err));
const app = express()

app.use(express.json())


app.use(authenticate)

app.use("/users", userRouter)
app.use("/products", productRouter)

app.listen(
    3003,
    () => {
        console.log('Server started successfully')
        console.log('Listening on port 3003')
    }


)
