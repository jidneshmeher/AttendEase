import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen sticky top-0 bg-gray-800 text-white">
      <ul className="p-4 space-y-2">
        <li>
          <Link to="/dashboard/overview" className="block p-2 hover:bg-gray-700 rounded">
            Overview
          </Link>
        </li>
        <li>
          <Link to="/dashboard/list" className="block p-2 hover:bg-gray-700 rounded">
            Student List
          </Link>
        </li>
        <li>
          <Link to="/dashboard/attendance" className="block p-2 hover:bg-gray-700 rounded">
            Attendance
          </Link>
        </li>
        <li>
          <Link to="/dashboard/analysis" className="block p-2 hover:bg-gray-700 rounded">
            Analysis
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
