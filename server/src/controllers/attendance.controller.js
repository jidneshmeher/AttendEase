import { asyncHandler } from "../utils/asyncHandler.js";
import {Attendance}  from "../models/attendance.model.js"
import { errorHandler } from "../utils/errorHandler.js";
import { apiResponse } from "../utils/ApiResponse.js";

export const getTodaysAttendance = asyncHandler(async(req,res,next) => {

    const todayMidnight = new Date()
    todayMidnight.setHours(0,0,0,0)

    const tomorrowMidnight = new Date(todayMidnight);
    tomorrowMidnight.setDate(todayMidnight.getDate() + 1);

    const todaysAttendance = await Attendance.find({
        date: {
            $gte: todayMidnight,
            $lt: tomorrowMidnight, 
        },
    });

    if(!todaysAttendance || todaysAttendance.length === 0){
        return next(errorHandler(404,"Attendance Data was not found"))
    }
 
    return res
    .status(200)
    .json(new apiResponse(200,"Attendance fetched successfully",todaysAttendance))

})

// export const addAttendance = asyncHandler(async(req,res) => {

//     const name = "JIDNESH MEHER"
//     const email = "jidnesh@gmail.com"
//     const status = "Present"

//     const date = new Date()
//     date.setDate(date.getDate() + 1)

//     const attendance = new Attendance({ name, email, status, date })
//     attendance.save()

//     return res.status(200).json({message:"Done"})
    
// })