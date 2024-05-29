import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IAdmin, IAgent } from '../interface/Icase';

const AdminCases: React.FC = () => {
  const [cases, setCases] = useState<IAdmin[]>([]);
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    fetchCases();
    fetchAgents();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cases');
      setCases(response.data.cases);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/agents');
      setAgents(response.data.agents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleAssignAgent = async (caseId: string, agentId?: string) => {
    const selectedAgentId = agentId || selectedAgent;
    if (!selectedAgentId) {
      alert('Please select an agent.');
      return;
    }
  
    try {
      await axios.put(`http://localhost:5000/cases/${caseId}/assign`, { caseId, agentId: selectedAgentId });
     
      setCases(prevCases => prevCases.map(singleCase => {
        if (singleCase._id === caseId) {
          return { ...singleCase, agent: selectedAgentId };
        }
        return singleCase;
      }));
      setSelectedAgent(null);
    } catch (error) {
      console.error('Error assigning agent:', error);
      alert('Failed to assign agent. Please try again.');
    }
  };

  const handleChangeStatus = async (caseId: string, status: string) => {
    try {
      await axios.put(`http://localhost:5000/cases/${caseId}/status`, { status });
      setCases(prevCases => prevCases.map(singleCase => {
        if (singleCase._id === caseId) {
          return { ...singleCase, status };
        }
        return singleCase;
      }));
    } catch (error) {
      console.error('Error changing status:', error);
      alert('Failed to change status. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Manage Cases</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2">Customer Name</th>
            <th className="py-2">Issue</th>
            <th className="py-2">Department</th>
            <th className="py-2">Status</th>
            <th className="py-2">Location</th>
            <th className="py-2">Agent</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(singleCase => (
            <tr key={singleCase._id}>
              <td className="border px-4 py-2">{singleCase.customerName}</td>
              <td className="border px-4 py-2">{singleCase.issue}</td>
              <td className="border px-4 py-2">{singleCase.department}</td>
              <td className="border px-4 py-2">
                <select value={singleCase.status} onChange={(e) => handleChangeStatus(singleCase._id, e.target.value)}>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="pending">Pending</option>
                </select>
              </td>
              <td className="border px-4 py-2">{singleCase.location}</td>
              <td className="border px-4 py-2">{singleCase.agent}</td>
              <td className="border px-4 py-2">
                <select value={singleCase.agent || ''} onChange={(e) => handleAssignAgent(singleCase._id, e.target.value as string)}>
                  <option value="">Select Agent</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>{agent.fullname}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCases;
