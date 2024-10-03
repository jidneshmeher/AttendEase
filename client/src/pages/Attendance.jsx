import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Importing the autotable plugin

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/attendance/today');
            const data = await response.json();
            if (data && data.data) {
                setAttendanceData(data.data); // Assuming your API returns the attendance data in this format
            } else {
                console.error("Unexpected response format:", data);
                setAttendanceData([]); // Set to an empty array if the structure is not as expected
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            setAttendanceData([]); // Ensure attendanceData is always an array
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Adding title
        doc.text('Today\'s Attendance', 14, 16);
        doc.autoTable({
            head: [['Name', 'Email', 'Status']],
            body: attendanceData.map(entry => [entry.name, entry.email, entry.status]),
            startY: 20, // Start below the title
            theme: 'grid', // You can choose 'striped', 'grid', or 'plain'
            headStyles: { fillColor: [22, 160, 133] }, // Custom head styles (teal color)
            styles: { cellPadding: 5, fontSize: 10 },
            margin: { top: 10 },
        });

        // Save the PDF
        doc.save('attendance.pdf');
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Today's Attendance</h2>
            <button onClick={downloadPDF} className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Download PDF
            </button>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData && attendanceData.length > 0 ? (
                        attendanceData.map((entry) => (
                            <tr key={entry.studentId}>
                                <td className="border border-gray-300 p-2">{entry.name}</td>
                                <td className="border border-gray-300 p-2">{entry.email}</td>
                                <td className="border border-gray-300 p-2">{entry.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="border border-gray-300 p-2 text-center">No attendance data available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance;
