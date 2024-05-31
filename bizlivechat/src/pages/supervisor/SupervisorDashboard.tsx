import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import SupervisorAgents from './SupervisorAgents';
import SupervisorCustomers from './SupervisorCustomers';
import SupervisorCases from './SupervisorCases';
import SupervisorMessages from './SuperviMessages';
import SupervisorSettings from './SupervisorSettings';

const SupervisorDashboard: React.FC = () => {

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav>
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/agents">Agents</Link></li>
            <li><Link to="/admin/customers">Customers</Link></li>
            <li><Link to="/admin/cases">Cases</Link></li>
            <li><Link to="/admin/messages">Messages</Link></li>
            <li><Link to="/admin/settings">Settings</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <Routes>
        <Route path="/dashboard" element={<SupervisorDashboardContent />} />
          <Route path="/agents" element={<SupervisorAgents />} />
          <Route path="/customers" element={<SupervisorCustomers />} />
          <Route path="/cases" element={<SupervisorCases />} />
          <Route path="/messages" element={<SupervisorMessages />} />
          <Route path="/settings" element={<SupervisorSettings />} />
        </Routes>
      </main>
    </div>
  );
};

const SupervisorDashboardContent =()=>{
  return (
    <div>
      <h1 className="text-2xl">Supervisor Dashboard</h1>
       
    </div>
  );
};

export default SupervisorDashboard;
