import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role:{
        type:String,
        required:true,
        default:"Student"
    },
},{timestamps:true})

export const User = mongoose.model("User",userSchema)

