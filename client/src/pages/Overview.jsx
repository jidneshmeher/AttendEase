import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const Overview = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/attendance/today');
        if (!response.ok) {
          throw new Error("Failed to fetch today's attendance");
        }
        const data = await response.json();
        setAttendanceData(data.data); // Assuming attendance data is in 'data' key
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching attendance data");
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  if (loading) return <p>Loading attendance data...</p>;
  if (error) return <p>Error: {error}</p>;

  const presentCount = attendanceData.filter(a => a.status === 'Present').length;
  const absentCount = attendanceData.filter(a => a.status === 'Absent').length;

  const pieData = [
    { name: 'Present', value: presentCount },
    { name: 'Absent', value: absentCount },
  ];

  const barData = [
    { name: 'Present', count: presentCount },
    { name: 'Absent', count: absentCount },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Today's Attendance</h3>
          <p className="text-3xl font-bold">{presentCount + absentCount}</p>
          <p className="text-gray-500">Total Students</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Present</h3>
          <p className="text-3xl font-bold">{presentCount}</p>
          <p className="text-gray-500">Students Present Today</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Absent</h3>
          <p className="text-3xl font-bold">{absentCount}</p>
          <p className="text-gray-500">Students Absent Today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Attendance Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#82ca9d" : "#ff6384"} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Overview;
