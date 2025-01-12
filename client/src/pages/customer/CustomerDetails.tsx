import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const CustomerDetails: React.FC = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await api.post('/customers', {
        fullname,
        email,
        phone,
        location,
      });
      const customer = response.data;
      navigate('/customer/departments', { state: { customer } });
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  return (
    <div className="bg-white">
      <h2 className="text-4xl px-20 py-10 font-semi-bold mb-4 text-black">
        Customer Details
      </h2>
      <hr className="h-px my-4 bg-black border-0 dark:bg-gray-700" />
      <div className="flex flex-col items-center justify-center px-6 py-2 mx-auto md:h-screen w-[50vw] lg:py-0">
        <form className="space-y-4 w-full md:space-y-6 text-gray-900" onSubmit={(e) => e.preventDefault()}>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name*</label>
      <input className='mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm' value={fullname} onChange={(e) => setFullname(e.target.value)} />
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email*</label>
      <input className='mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm' value={email} onChange={(e) => setEmail(e.target.value)} />
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone*</label>
      <input className='mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm' value={phone} onChange={(e) => setPhone(e.target.value)} />
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location*</label>
      <input className='mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm' value={location} onChange={(e) => setLocation(e.target.value)} />
      <button className="bg-blue-500  text-white font-medium text-sm px-5 py-2.5 text-center rounded-md w-full" onClick={handleSubmit}>Submit</button>
      </form>
      </div>
    </div>
  );
};

export default CustomerDetails;
