import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ICase } from '../interface/Icase';

const AgentCases: React.FC = () => {
  const [cases, setCases] = useState<ICase[]>([]);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cases');
      setCases(response.data.cases);
    } catch (error) {
      console.error('Error fetching cases:', error);
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

export default AgentCases;
