import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IAgent } from '../interface/Icase';

const AdminSettings: React.FC = () => {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [currentAgent, setCurrentAgent] = useState<IAgent | null>(null);
  const [newAgent, setNewAgent] = useState({ fullname: '', email: '', department: 'Funding Wallet', role: 'agent' });

  const departments = ['Funding Wallet', 'Buying Airtime', 'Buying Internet Data', 'E-commerce Section', 'Fraud Related Problems', 'General Services'];
  const roles = ['agent', 'supervisor'];

  useEffect(() => {
    axios.get('http://localhost:5000/agents').then(response => {
      setAgents(response.data.agents);
    });
  }, []);

  const handleCreateOrUpdateAgent = async () => {
    if (currentAgent) {
      // Update existing agent
      await axios.put(`http://localhost:5000/agents/${currentAgent._id}`, newAgent).then(response => {
        setAgents(agents.map(agent => (agent._id === currentAgent._id ? response.data.agent : agent)));
        setNewAgent({ fullname: '', email: '', department: 'Funding Wallet', role: 'agent' });
        setCurrentAgent(null);
      });
    } else {
      // Create new agent
      await axios.post('http://localhost:5000/agents', newAgent).then(response => {
        setAgents([...agents, response.data.agent]);
        setNewAgent({ fullname: '', email: '', department: 'Funding Wallet', role: 'agent' });
      });
    }
  };

  const handleDeleteAgent = async (id: string) => {
    await axios.delete(`http://localhost:5000/agents/${id}`).then(() => {
      setAgents(agents.filter(agent => agent._id !== id));
    });
  };

  const handleEditAgent = (agent: IAgent) => {
    setCurrentAgent(agent);
    setNewAgent({ fullname: agent.fullname, email: agent.email, department: agent.department, role: agent.role });
  };

  return (
    <div className='bg-white'>
      <h2 className="text-4xl px-20 py-10 font-semi-bold mb-4 text-black">Settings</h2>
      <hr className="h-px my-8 bg-black border-0 dark:bg-gray-700" />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Full Name"
          value={newAgent.fullname}
          onChange={e => setNewAgent({ ...newAgent, fullname: e.target.value })}
          className="border p-2 mr-2 rounded text-black"
        />
        <input
          type="text"
          placeholder="Email"
          value={newAgent.email}
          onChange={e => setNewAgent({ ...newAgent, email: e.target.value })}
          className="border p-2 mr-2 rounded text-black"
        />
        <select
          value={newAgent.department}
          onChange={e => setNewAgent({ ...newAgent, department: e.target.value })}
          className="border p-2 mr-2 rounded text-black"
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          value={newAgent.role}
          onChange={e => setNewAgent({ ...newAgent, role: e.target.value })}
          className="border p-2 mr-2 rounded text-black"
        >
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button onClick={handleCreateOrUpdateAgent} className="bg-blue-500 text-white p-2 rounded">
          {currentAgent ? 'Update Agent' : 'Add Agent'}
        </button>
      </div>
      <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Full Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Department</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(agent => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={agent._id}>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-xs overflow-hidden overflow-ellipsis">{agent.fullname}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-xs overflow-hidden overflow-ellipsis">{agent.email}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-xs overflow-hidden overflow-ellipsis">{agent.department}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-xs overflow-hidden overflow-ellipsis">{agent.role}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-xs overflow-hidden overflow-ellipsis">
                <button onClick={() => handleEditAgent(agent)} className="bg-yellow-500 text-white mx-2 p-2 rounded">Edit</button>
                <button onClick={() => handleDeleteAgent(agent._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSettings;
