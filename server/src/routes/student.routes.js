import { Router } from "express";
import { addStudent, deleteStudent, getStudents, updateStudent } from "../controllers/student.controller.js";

const router = Router()

router.post('/add', addStudent);
router.get('/get', getStudents);
router.put('/update/:id', updateStudent); 
router.delete('/delete/:id', deleteStudent);

export default router
