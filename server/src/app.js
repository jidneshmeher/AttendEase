import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

// Route imports

import attendanceRouter from "./routes/attendance.routes.js"
import studentRouter from "./routes/student.routes.js"
import userRouter from "./routes/user.routes.js"

app.use('/api/v1/attendance',attendanceRouter)
app.use('/api/v1/student',studentRouter)
app.use('/api/v1/user',userRouter)

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res
    .status(statusCode)
    .json({
        statusCode,
        message,
        success:false
    })
})

export { app }