import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ICase } from '../interface/Icase';

const AgentPending: React.FC = () => {
  const [cases, setCases] = useState<ICase[]>([]);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cases');
      const casesWithAgents = await Promise.all(response.data.cases.map(async (singleCase: ICase) => {
        if (singleCase.assignedAgent) {
          const agentResponse = await axios.get(`http://localhost:5000/agents/${singleCase.assignedAgent}`);
          return { ...singleCase, agent: agentResponse.data.agent.fullname };
        } else {
          return { ...singleCase, agent: 'Not Assigned' };
        }
      }));
      setCases(casesWithAgents);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  const acceptCase = async (caseId: string) => {
    try {
      await axios.put(`http://localhost:5000/cases/${caseId}/accept`);
      fetchCases(); 
    } catch (error) {
      console.error('Error accepting case:', error);
    }
  };

  const rejectCase = async (caseId: string) => {
    try {
      await axios.put(`http://localhost:5000/cases/${caseId}/reject`);
      fetchCases(); 
    } catch (error) {
      console.error('Error rejecting case:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Pending Cases</h2>
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
              <td className="border px-4 py-2">{singleCase.status}</td>
              <td className="border px-4 py-2">{singleCase.location}</td>
              <td className="border px-4 py-2">{singleCase.agent}</td>
              <td className="border px-4 py-2">
                {singleCase.status === 'pending' && (
                  <>
                    <button onClick={() => acceptCase(singleCase._id)} className="bg-green-500 text-white p-2 rounded mr-2">Accept</button>
                    <button onClick={() => rejectCase(singleCase._id)} className="bg-red-500 text-white p-2 rounded">Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentPending;
