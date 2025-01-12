import React, { useEffect, useState } from 'react';
import { ICustomer } from '../interface/Icase';
import api from '../../api';

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([])
  useEffect(() => {
    api.get('customers').then(response => {
      setCustomers(response.data.customers);
    });
  }, []);

  return (
    <div className='bg-white'>
      <h2 className="text-4xl px-20 py-10 font-semi-bold mb-4 text-black">Manage Customers</h2>
      <hr className="h-px my-8 bg-black border-0 dark:bg-gray-700" />
      <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Customer ID</th>
            <th className="px-6 py-3">Full Name</th>
            <th className="px-6 py-3">Location</th>
            <th className="px-6 py-3">Phone Number</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={customer._id}>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{customer._id}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{customer.fullname}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{customer.location}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{customer.phone}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{customer.email}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <button className="bg-blue-500 text-white p-2 rounded">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomers;
