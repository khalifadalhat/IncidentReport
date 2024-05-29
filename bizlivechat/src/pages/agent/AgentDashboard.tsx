import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import AgentCustomers from './AgentCustomers';
import AgentPending from './AgentPending';
import AgentResolved from './AgentResolved';
import AgentChat from './AgentChat';
import AgentSettings from './AgentSettings';
import AgentCases from './AgentCases';
import { DecodedToken } from '../interface/Icase';


const AgentDashboard: React.FC = () => {
  const token = Cookies.get('token');
  let agentId: string | null = null;

  if (token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      agentId = decodedToken.userId;
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }

  if (!agentId) {
    return <div>Error: Agent ID is missing.</div>;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav>
          <ul>
            <li><Link to="/agent/dashboard">Cases</Link></li>
            <li><Link to="/agent/pending">Pending</Link></li>
            <li><Link to="/agent/customers">Customers</Link></li>
            <li><Link to="/agent/chat">Chat</Link></li>
            <li><Link to="/agent/resolved">Resolved</Link></li>
            <li><Link to="/agent/settings">Settings</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/dashboard" element={<AgentCases agentId={agentId} />} />
          <Route path="/pending" element={<AgentPending />} />
          <Route path="/customers" element={<AgentCustomers />} />
          <Route path="/chat" element={<AgentChat />} />
          <Route path="/resolved" element={<AgentResolved />} />
          <Route path="/settings" element={<AgentSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AgentDashboard;
