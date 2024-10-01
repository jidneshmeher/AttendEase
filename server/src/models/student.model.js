import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
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
    status:{
        type:String,
        default:"Absent"
    },
},{timestamps:true})

export const Student = mongoose.model("Attendance",studentSchema)