import { Router } from "express";
import { getAttendanceByDateRange, getTodaysAttendance, getTodaysAttendanceSummary } from "../controllers/attendance.controller.js";

const router = Router();

router.get('/today', getTodaysAttendance);
router.get('/date-range', getAttendanceByDateRange);
router.get('/today-summary', getTodaysAttendanceSummary);

export default router;
