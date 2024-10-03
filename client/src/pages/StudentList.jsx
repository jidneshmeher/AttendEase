import React, { useEffect, useState } from 'react';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [editStudent, setEditStudent] = useState(null); // For editing a student

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/student/get');
      const data = await response.json();
      setStudents(data.data); // Assuming data comes in the format { data: [...] }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const addStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) {
      alert('Please enter both name and email.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/student/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        const data = await response.json();
        setStudents((prev) => [...prev, data.data]); // Assuming the new student is returned in { data: ... }
        setNewStudent({ name: '', email: '' }); // Reset form
      } else {
        console.error('Error adding student:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const updateStudent = async (e) => {
    e.preventDefault();
    if (!editStudent.name || !editStudent.email) {
      alert('Please enter both name and email.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v1/student/update/${editStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editStudent),
      });

      if (response.ok) {
        const data = await response.json();
        setStudents((prev) => prev.map(student => student._id === data.data._id ? data.data : student)); // Update the student in the list
        setEditStudent(null); // Reset the edit state
      } else {
        console.error('Error updating student:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/student/delete/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setStudents((prev) => prev.filter(student => student._id !== id)); // Remove the deleted student from the list
        } else {
          console.error('Error deleting student:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {students.map((student) => (
            <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6">{student.name}</td>
              <td className="py-3 px-6">{student.email}</td>
              <td className="py-3 px-6">
                <button 
                  onClick={() => setEditStudent(student)} 
                  className="bg-yellow-500 text-white font-semibold py-1 px-2 rounded-md hover:bg-yellow-600 transition mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteStudent(student._id)} 
                  className="bg-red-500 text-white font-semibold py-1 px-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-xl font-semibold mt-6 mb-2">{editStudent ? 'Edit Student' : 'Add Student'}</h2>
      <form onSubmit={editStudent ? updateStudent : addStudent} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={editStudent ? editStudent.name : newStudent.name}
          onChange={(e) => editStudent 
            ? setEditStudent({ ...editStudent, name: e.target.value }) 
            : setNewStudent({ ...newStudent, name: e.target.value })}
          required
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={editStudent ? editStudent.email : newStudent.email}
          onChange={(e) => editStudent 
            ? setEditStudent({ ...editStudent, email: e.target.value }) 
            : setNewStudent({ ...newStudent, email: e.target.value })}
          required
          className="border border-gray-300 rounded-md p-2"
        />
        <button type="submit" className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition">
          {editStudent ? 'Update Student' : 'Add Student'}
        </button>
      </form>
    </div>
  );
}
