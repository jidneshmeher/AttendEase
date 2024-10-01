import mongoose from "mongoose"
import { connectDB } from "./db/index.js";
import { Student } from "./models/student.model.js";

import { SerialPort } from 'serialport' 
import { ReadlineParser } from '@serialport/parser-readline'

connectDB()
.then(() => console.log('Connected to MongoDB Atlas'))

const port = new SerialPort({ path: process.env.PORT_PATH, baudRate: Number(process.env.PORT_BAUDRATE) });  
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', async (data) => {
  console.log('Data from Arduino:', data);

  // const [label, studentName] = data.split(': ');
  // const status = 'Present';

  // if (label === 'Student') {
  //   const newStudent = new Student({
  //     studentName: studentName.trim(),
  //     status
  //   });

  //   try {
  //     await newStudent.save();
  //     console.log(`Student saved for ${studentName}`);
  //   } catch (error) {
  //     console.error('Error saving Student:', error);
  //   }
  // }

});

port.on('error', (err) => {
  console.error('Serial Port Error:', err.message);
});

