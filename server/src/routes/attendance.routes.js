import { Router } from "express";
import { getTodaysAttendance } from "../controllers/attendance.controller.js";
// import { addAttendance } from "../controllers/attendance.controller.js";

const router = Router()

router.get('/today',getTodaysAttendance)
// router.get('/add',addAttendance)

export default router