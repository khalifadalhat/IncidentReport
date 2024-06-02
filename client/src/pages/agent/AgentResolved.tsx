import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ICase } from '../interface/Icase';

const AgentResolved: React.FC = () => {
  const [cases, setCases] = useState<ICase[]>([]);

  useEffect(() => {
    axios.get('http:192.168.0.168/cases/resolved').then(response => {
      setCases(response.data.cases);
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">Resolved Cases</h2>
      <table className="min-w-full bg-white">
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
                <button className="bg-blue-500 text-white p-2 rounded">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentResolved;
