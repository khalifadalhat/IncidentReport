import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ICustomer } from '../../Types/Icase';

const SupervisorCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  useEffect(() => {
    axios.get('http://localhost:5000/customers').then(response => {
      setCustomers(response.data.customers);
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">Manage Customers</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2">Customer ID</th>
            <th className="py-2">Full Name</th>
            <th className="py-2">Location</th>
            <th className="py-2">Phone Number</th>
            <th className="py-2">Email</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer._id}>
              <td className="border px-4 py-2">{customer._id}</td>
              <td className="border px-4 py-2">{customer.fullname}</td>
              <td className="border px-4 py-2">{customer.location}</td>
              <td className="border px-4 py-2">{customer.phone}</td>
              <td className="border px-4 py-2">{customer.email}</td>
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

export default SupervisorCustomers;
