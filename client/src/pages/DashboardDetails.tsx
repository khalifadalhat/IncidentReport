import React from 'react';
import { Link } from 'react-router-dom';

const DashboardDetails: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-black mb-2">Real-Time Customer Support Platform</h1>
      <h2>Support Made Simple</h2>
      <p>Customers, agents, and admins — all working together to solve problems efficiently.</p>

      <Link to="signup/customer">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-700">
          Start
        </button>
      </Link>
      <hr />
      <p className="text-sm font-light text-gray-500 mt-4 dark:text-gray-400">
        Already an admin/agent?{' '}
        <a
          href="/login"
          className="font-medium text-primary-600 hover:underline dark:text-primary-500">
          Login
        </a>
      </p>
    </div>
  );
};

export default DashboardDetails;
