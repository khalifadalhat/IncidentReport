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
      
      const pendingCases = casesWithAgents.filter(singleCase => singleCase.status === 'pending');
      setCases(pendingCases);
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
    <div className='bg-white'>
      <h2 className="text-4xl px-20 py-10 font-semi-bold mb-4 text-black">Pending Cases</h2>
      <hr className="h-px my-8 bg-black border-0 dark:bg-gray-700" />
      <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th className="px-6 py-3">Customer Name</th>
            <th className="px-6 py-3">Issue</th>
            <th className="px-6 py-3">Department</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Location</th>
            <th className="px-6 py-3">Agent</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(singleCase => (
            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700' key={singleCase._id}>
              <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal dark:text-white">{singleCase.customerName}</td>
              <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal dark:text-white">{singleCase.issue}</td>
              <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal dark:text-white">{singleCase.department}</td>
              <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal dark:text-white">{singleCase.status}</td>
              <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal dark:text-white">{singleCase.location}</td>
              <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal dark:text-white">{singleCase.agent}</td>
              <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal dark:text-white">
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
