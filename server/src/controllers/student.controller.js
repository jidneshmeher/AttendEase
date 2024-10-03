import { Student } from '../models/student.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { errorHandler } from '../utils/errorHandler.js';
import { apiResponse } from '../utils/ApiResponse.js';

export const addStudent = asyncHandler(async (req, res, next) => {

    let { name, email } = req.body;

    name = name?.trim()
    email = email?.trim()

    if (!name || !email) {
        return next(errorHandler(400, 'Name and email are required'));
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
        return next(errorHandler(400, 'Student with this email already exists'));
    }

    const newStudent = new Student({ name, email });
    await newStudent.save();

    return res
    .status(201)
    .json(new apiResponse(201, 'Student added successfully', newStudent));
});

export const getStudents = asyncHandler(async (req, res, next) => {
    const students = await Student.find(); 
    return res.status(200).json(new apiResponse(200, 'Students fetched successfully', students));
});

export const updateStudent = asyncHandler(async (req, res, next) => {
    const { id } = req.params; 
    let { name, email } = req.body;

    name = name?.trim();
    email = email?.trim();

    if (!name || !email) {
        return next(errorHandler(400, 'Name and email are required'));
    }

    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
        return next(errorHandler(404, 'Student not found'));
    }

    existingStudent.name = name;
    existingStudent.email = email;
    await existingStudent.save();

    return res
        .status(200)
        .json(new apiResponse(200, 'Student updated successfully', existingStudent));
});

export const deleteStudent = asyncHandler(async (req, res, next) => {
    const { id } = req.params; // Get the student ID from the URL

    const student = await Student.findByIdAndDelete(id);
    if (!student) {
        return next(errorHandler(404, 'Student not found'));
    }

    return res
        .status(200)
        .json(new apiResponse(200, 'Student deleted successfully'));
});
