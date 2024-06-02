import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IAgent } from '../interface/Icase';

const SupervisorSettings: React.FC = () => {
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
    <div>
      <h2 className="text-2xl mb-4">Settings</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Full Name"
          value={newAgent.fullname}
          onChange={e => setNewAgent({ ...newAgent, fullname: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Email"
          value={newAgent.email}
          onChange={e => setNewAgent({ ...newAgent, email: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <select
          value={newAgent.department}
          onChange={e => setNewAgent({ ...newAgent, department: e.target.value })}
          className="border p-2 mr-2 rounded"
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          value={newAgent.role}
          onChange={e => setNewAgent({ ...newAgent, role: e.target.value })}
          className="border p-2 mr-2 rounded"
        >
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button onClick={handleCreateOrUpdateAgent} className="bg-blue-500 text-white p-2 rounded">
          {currentAgent ? 'Update Agent' : 'Add Agent'}
        </button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2">Full Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Department</th>
            <th className="py-2">Role</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(agent => (
            <tr key={agent._id}>
              <td className="border px-4 py-2">{agent.fullname}</td>
              <td className="border px-4 py-2">{agent.email}</td>
              <td className="border px-4 py-2">{agent.department}</td>
              <td className="border px-4 py-2">{agent.role}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEditAgent(agent)} className="bg-yellow-500 text-white p-2 rounded">Edit</button>
                <button onClick={() => handleDeleteAgent(agent._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupervisorSettings;
