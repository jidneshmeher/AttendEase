import { Student } from "../models/student.model.js";

export const addStudent = async(req,res) => {
    try{
        const { studentName, studentID, status } = req.body;

        const newEntry = new Student({
          studentName,
          studentID,
          status
        });

        await newEntry.save()
        res.status(200).send('Attendance saved successfully');

    }catch(err){
        res.status(500).send('Error saving attendance: ' + error.message);
        console.log(err)
    }
}