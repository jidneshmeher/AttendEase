import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import App from './App';
import Overview from './pages/Overview';
import Attendance from './pages/Attendance';
import StudentList from './pages/StudentList'
import Analysis from './pages/Analysis.jsx';
import './index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/dashboard/overview" element={<Overview />} />
      <Route path="/dashboard/list" element={<StudentList />} />
      <Route path="/dashboard/attendance" element={<Attendance />} />
      <Route path='/dashboard/analysis' element={<Analysis />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
