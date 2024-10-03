import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Automatically register all required chart components

const Analysis = () => {
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [dateRangeData, setDateRangeData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch today's attendance summary on component mount
  useEffect(() => {
    fetch('http://localhost:3000/api/v1/attendance/today-summary')
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          setAttendanceSummary(data.data);
        }
      })
      .catch(err => console.error('Error fetching attendance summary:', err));
  }, []);

  // Fetch attendance records by date range
  const fetchDateRangeAnalysis = () => {
    if (startDate && endDate) {
      fetch(`http://localhost:3000/api/v1/attendance/date-range?startDate=${startDate}&endDate=${endDate}`)
        .then(res => res.json())
        .then(data => {
          if (data.statusCode === 200) {
            setDateRangeData(data.data);
          } else {
            setDateRangeData([]); // Reset data if no records found
          }
        })
        .catch(err => console.error('Error fetching date range data:', err));
    }
  };

  // Prepare pie chart data for today's attendance
  const pieChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: attendanceSummary
          ? [attendanceSummary.presentCount, attendanceSummary.totalStudents - attendanceSummary.presentCount]
          : [0, 0], // Default data until API loads
        backgroundColor: ['#4CAF50', '#F44336'], // Green for Present, Red for Absent
      },
    ],
  };

  // Prepare bar chart data for the date range analysis
  const barChartData = {
    labels: dateRangeData.map(record => record.name), // Student names as labels
    datasets: [
      {
        label: 'Students Present',
        data: dateRangeData.map(record => record.presentCount || 0), // Count of Present Students
        backgroundColor: '#4CAF50', // Green color for present students
      },
      {
        label: 'Students Absent',
        data: dateRangeData.map(record => record.absentCount || 0), // Count of Absent Students
        backgroundColor: '#F44336', // Red color for absent students
      },
    ],
  };

  // Prepare bar chart data for today's attendance
  const todayBarChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: 'Attendance',
        data: attendanceSummary
          ? [attendanceSummary.presentCount, attendanceSummary.totalStudents - attendanceSummary.presentCount]
          : [0, 0], // Default data until API loads
        backgroundColor: ['#4CAF50', '#F44336'], // Green for Present, Red for Absent
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Attendance Analysis</h1>

      {/* Show today's attendance summary */}
      {attendanceSummary ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Today's Summary</h2>
          <p className="text-lg mb-2">Total Students: {attendanceSummary.totalStudents}</p>
          <p className="text-lg mb-2">Present: {attendanceSummary.presentCount} ({attendanceSummary.presentPercentage.toFixed(2)}%)</p>
          <p className="text-lg mb-2">Absent: {attendanceSummary.totalStudents - attendanceSummary.presentCount} ({((attendanceSummary.totalStudents - attendanceSummary.presentCount) / attendanceSummary.totalStudents * 100).toFixed(2)}%)</p>

          {/* Chart Layout */}
          <div className="flex justify-between">
            {/* Pie Chart */}
            <div className="w-1/2">
              <Pie data={pieChartData} />
            </div>

            {/* Bar Chart for Today's Attendance */}
            <div className="w-1/2">
              <Bar data={todayBarChartData} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading attendance summary...</p>
      )}

      {/* Date Range Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Date Range Attendance Analysis</h2>
        <div className="flex justify-between mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md p-2 text-gray-700"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md p-2 text-gray-700"
            placeholder="End Date"
          />
          <button
            onClick={fetchDateRangeAnalysis}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Get Analysis
          </button>
        </div>

        {/* Bar Chart for Date Range Analysis */}
        {dateRangeData.length > 0 ? (
          <div className="mt-8">
            <Bar data={barChartData} />
          </div>
        ) : (
          <p className="text-center">No data available for the selected date range.</p>
        )}
      </div>
    </div>
  );
};

export default Analysis;
