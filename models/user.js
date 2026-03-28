import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

    {
        email: {

            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true


        },
        firstname: {

            type: String,
            require: true,

        },

        lasttname: {

            type: String,
            require: true,

        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        age: {

            type: Number,
            required: true,
            min: 1,
            max: 120,
        },
        isAdmin: {

            type: Boolean,
            default: false,
            required: true,
        },
        isBlocked: {

            type: Boolean,
            default: false,
            required: true,
        },

        isEmailVerified: {

            type: Boolean,  
            required: true,
            default: false,
        },
        image: {

            type: String,
            required: true,
            default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
        },
      }  
)    

const User = mongoose.model("user",userSchema)


export default User