// const date = new Date("2024-10-01T19:12:12.616+00:00")

// // Convert to IST (Indian Standard Time)
// const istDate = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

// console.log("IST Time:", istDate);

//@ Moment Library

// const moment = require('moment-timezone'); // Use moment-timezone for handling timezone conversions

// // Define the start and end of the day in IST
// const startDateIST = moment.tz('2024-10-01 00:00:00', 'Asia/Kolkata').toDate();
// const endDateIST = moment.tz('2024-10-01 23:59:59', 'Asia/Kolkata').toDate();

// // Query to get attendance for the specific date
// const attendanceRecords = await Attendance.find({
//   date: {
//     $gte: startDateIST, // 2024-09-30T18:30:00.000Z in UTC
//     $lt: endDateIST     // 2024-10-01T18:29:59.999Z in UTC
//   }
// });

// console.log(attendanceRecords);