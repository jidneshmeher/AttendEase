import { asyncHandler } from "../utils/asyncHandler.js";
import { Attendance } from "../models/attendance.model.js";
import { Student } from "../models/student.model.js"; // Import the Student model
import { errorHandler } from "../utils/errorHandler.js";
import { apiResponse } from "../utils/ApiResponse.js";

export const getTodaysAttendance = asyncHandler(async (req, res, next) => {
    // Get today's date range
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const tomorrowMidnight = new Date(todayMidnight);
    tomorrowMidnight.setDate(todayMidnight.getDate() + 1);

    // Fetch today's attendance
    const todaysAttendance = await Attendance.find({
        date: {
            $gte: todayMidnight,
            $lt: tomorrowMidnight,
        },
    });

    const allStudents = await Student.find();

    const presentStudentEmail = new Set(todaysAttendance.map(attendance => attendance.email));


    const attendanceResponse = allStudents.map(student => {
        return {
            studentId: student._id,
            name: student.name,
            email: student.email,
            status: presentStudentEmail.has(student.email) ? 'Present' : 'Absent'
        };
    });

    return res.status(200).json(new apiResponse(200, "Attendance fetched successfully", attendanceResponse));
});

export const getTodaysAttendanceSummary = asyncHandler(async (req, res, next) => {
    // Get today's date range
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const tomorrowMidnight = new Date(todayMidnight);
    tomorrowMidnight.setDate(todayMidnight.getDate() + 1);

    // Fetch today's attendance
    const todaysAttendance = await Attendance.find({
        date: {
            $gte: todayMidnight,
            $lt: tomorrowMidnight,
        },
    });

    // Fetch all students
    const allStudents = await Student.find();
    const totalStudents = allStudents.length;

    // Create a set of present students
    const presentStudentEmails = new Set(todaysAttendance.map(attendance => attendance.email));

    // Count present and absent students
    const presentCount = todaysAttendance.length;
    const absentCount = totalStudents - presentCount;

    const summary = {
        totalStudents,
        presentCount,
        absentCount,
        presentPercentage: (presentCount / totalStudents) * 100,
        absentPercentage: (absentCount / totalStudents) * 100,
    };

    return res.status(200).json(new apiResponse(200, "Attendance summary fetched successfully", summary));
});

// Assuming you already have this handler in place.
export const getAttendanceByDateRange = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return next(errorHandler(400, "Start date and end date are required."));
    }

    const start = new Date(startDate)
    start.setHours(0,0,0,0)

    const end = new Date(endDate)
    end.setHours(0,0,0,0)

    // Fetch attendance records within the date range (include start, exclude end)
    const attendanceRecords = await Attendance.find({
        date: {
            $gte: start, // Include start date
            $lt: end,    // Exclude end date
        },
    }).sort({ date: 1 }); // Sort by date for consistent display

    if (!attendanceRecords || attendanceRecords.length === 0) {
        return next(errorHandler(404, "No attendance records found for the given date range."));
    }

    const allStudents = await Student.find();

    // Create a Set of present student emails
    const presentStudentEmail = new Set(attendanceRecords.map(attendance => attendance.email));

    // Create attendance summary for each student
    const attendanceSummary = allStudents.map(student => {
        
        const studentAttendance = {
            studentId: student._id,
            name: student.name,
            email: student.email,
            presentCount: 0,
            absentCount: 0,
        };

        // Count attendance for the specified date range
        attendanceRecords.forEach(record => {
            // Count presents for each date
            if (record.email === student.email) {
                studentAttendance.presentCount += 1;
            }
        });

        // Calculate absent count based on the total days in the range
        const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)); // Include both start and end date
        studentAttendance.absentCount = totalDays - studentAttendance.presentCount;

        return studentAttendance;
    });

    return res.status(200).json(new apiResponse(200, "Attendance records fetched successfully.", attendanceSummary));
});




