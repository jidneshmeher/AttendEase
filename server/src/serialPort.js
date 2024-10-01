import { SerialPort } from 'serialport'; 
import { ReadlineParser } from '@serialport/parser-readline';
import { Attendance } from './models/attendance.model.js';

const port = new SerialPort({ path: process.env.PORT_PATH, baudRate: Number(process.env.PORT_BAUDRATE) });  
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

export const fetchSerialPortData = () => {
    parser.on('data', async (data) => {
        try {
            const trimmedData = data.trim();

            if (trimmedData.startsWith('["') && trimmedData.endsWith('"]')) {
                const parsedData = JSON.parse(trimmedData);
                let [name, email] = parsedData;

                console.log(name,email)

                if (name && email) {

                    const today = new Date();
                    today.setHours(0,0,0,0)

                    const existingAttendance = await Attendance.findOne({ 
                        email,
                        date: {$gte:today} 
                    });

                    if (existingAttendance) {
                        console.log("Attendance Exist");
                        return;
                    }

                    const status = "Present";
                    const newAttendance = new Attendance({ name, email, status });
                    await newAttendance.save();
                }
            }
        } catch (err) {
            console.error('Error handling data from Arduino:', err);
        }    
    });
}

port.on('error', (err) => {
    console.error('Serial Port Error:', err.message);
});
