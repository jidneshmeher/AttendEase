import cookieParser from "cookie-parser"
import express from "express"

const app = express()


app.use(express.json())
app.use(cookieParser())

// Route imports

import attendanceRouter from "./routes/attendance.routes.js"

app.use('/api/v1/attendance',attendanceRouter)

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