import React, { useEffect, useState } from 'react';
import { IAgent } from '../../Types/Icase';
import api from '../../utils/api';

const AdminAgents: React.FC = () => {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [newAgent, setNewAgent] = useState({
    fullname: '',
    email: '',
    department: 'Funding Wallet',
    role: 'agent',
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/agents');
      setAgents(response.data.agents);
    } catch (error) {
      console.error('There was an error fetching the agents!', error);
      showMessage('Error fetching agents', 'error');
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleCreateAgent = async () => {
    // Basic validation
    if (!newAgent.fullname || !newAgent.email) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAgent.email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/agents', newAgent);
      setAgents([...agents, response.data.agent]);
      setNewAgent({
        fullname: '',
        email: '',
        department: 'Funding Wallet',
        role: 'agent',
      });
      showMessage(
        `Agent created successfully! Credentials have been sent to ${newAgent.email}`,
        'success'
      );
    } catch (error: any) {
      console.error('There was an error creating the agent!', error);
      const errorMessage = error.response?.data?.error || 'Error creating agent';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      await api.delete(`/agents/${id}`);
      setAgents(agents.filter(agent => agent._id !== id));
      showMessage('Agent deleted successfully', 'success');
    } catch (error) {
      console.error('There was an error deleting the agent!', error);
      showMessage('Error deleting agent', 'error');
    }
  };

  const handleResetPassword = async (id: string, email: string) => {
    if (!window.confirm(`Reset password for agent with email: ${email}?`)) {
      return;
    }

    try {
      await api.post(`/agents/${id}/reset-password`);
      showMessage('Password reset successfully and sent via email', 'success');
    } catch (error) {
      console.error('There was an error resetting password!', error);
      showMessage('Error resetting password', 'error');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <h2 className="text-4xl px-20 py-10 font-semibold mb-4 text-black">Manage Agents</h2>

      {/* Message Display */}
      {message && (
        <div
          className={`mx-20 mb-4 p-4 rounded ${
            messageType === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
          {message}
        </div>
      )}

      {/* Form Section */}
      <div className="px-20 mb-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-black">Create New Agent</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={newAgent.fullname}
              onChange={e => setNewAgent({ ...newAgent, fullname: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Email *"
              value={newAgent.email}
              onChange={e => setNewAgent({ ...newAgent, email: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <select
              value={newAgent.department}
              onChange={e => setNewAgent({ ...newAgent, department: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}>
              <option value="Funding Wallet">Funding Wallet</option>
              <option value="Buying Airtime">Buying Airtime</option>
              <option value="Buying Internet Data">Buying Internet Data</option>
              <option value="E-commerce Section">E-commerce Section</option>
              <option value="Fraud Related Problems">Fraud Related Problems</option>
              <option value="General Services">General Services</option>
            </select>
            <select
              value={newAgent.role}
              onChange={e => setNewAgent({ ...newAgent, role: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}>
              <option value="agent">Agent</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <button
            onClick={handleCreateAgent}
            disabled={loading}
            className={`${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white px-6 py-3 rounded-lg font-medium transition-colors`}>
            {loading ? 'Creating...' : 'Create Agent'}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            * A secure password will be generated and sent to the agent's email
          </p>
        </div>
      </div>

      <hr className="mx-20 h-px my-8 bg-gray-300 border-0" />

      {/* Agents Table */}
      <div className="px-20">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full table-auto text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No agents found. Create your first agent above.
                  </td>
                </tr>
              ) : (
                agents.map(agent => (
                  <tr className="bg-white border-b hover:bg-gray-50" key={agent._id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{agent.fullname}</td>
                    <td className="px-6 py-4 text-gray-900">{agent.email}</td>
                    <td className="px-6 py-4 text-gray-900">{agent.department}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          agent.role === 'supervisor'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {agent.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          agent.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleResetPassword(agent._id, agent.email)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                          Reset Password
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAgents;
