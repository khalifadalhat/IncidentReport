import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import AdminCases from './AdminCases';
import AdminAgents from './AdminAgents';
import AdminCustomers from './AdminCustomers';
import AdminMessages from './AdminMessages';
import AdminSettings from './AdminSettings';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const AdminDashboard: React.FC = () => {
  const data = [
    { name: 'Active', value: 20 },
    { name: 'Closed', value: 10 },
    { name: 'Pending', value: 15 },
  ];

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
          <Route path="/dashboard" element={<AdminDashboardContent data={data} />} />
          <Route path="/agents" element={<AdminAgents />} />
          <Route path="/customers" element={<AdminCustomers />} />
          <Route path="/cases" element={<AdminCases />} />
          <Route path="/messages" element={<AdminMessages />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminDashboardContent: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  const activeCasesData = [
    { name: 'Active', value: 20 },
    { name: 'Total', value: 100 },
  ];

  const closedCasesData = [
    { name: 'Closed', value: 10 },
    { name: 'Total', value: 100 },
  ];

  const pendingCasesData = [
    { name: 'Pending', value: 15 },
    { name: 'Total', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F'];
  return (
    <div>
      <h1 className="text-2xl">Admin Dashboard</h1>
      <div className="flex">
        <div className="w-1/3">
          <h2 className="text-lg">Active Cases</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={activeCasesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {activeCasesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
        <div className="w-1/3">
          <h2 className="text-lg">Closed Cases</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={closedCasesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {closedCasesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
        <div className="w-1/3">
          <h2 className="text-lg">Pending Cases</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={pendingCasesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pendingCasesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
