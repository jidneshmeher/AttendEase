import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
    status:{
        type:String,
        default:"Absent"
    },
    date:{
        type:Date,
        required:true,
        default:Date.now()
    }
},{timestamps:true})

export const Attendance = mongoose.model("Attendance",attendanceSchema)

