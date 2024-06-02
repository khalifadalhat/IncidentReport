import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ProblemType: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, department } = location.state;
  const { fullname, location: customerLocation } = customer;
  const [problem, setProblem] = useState('');

  const handleSubmit = () => {
    axios.post('http://localhost:5000/cases', {
      customerName: fullname,
      issue: problem,
      department,
      status: 'pending',
      location: customerLocation,
    }).then(response => {
      console.log(response.data);
      navigate('/customer/chat-with-agent', { state: { department, problem } });
    }).catch(error => {
      console.error(error);
    });
  };

  return (
    <div className="bg-white">
      <p className='text-sm text-gray-700 px-20 py-10'>Problem Type</p>
      <hr className="h-px my-4 bg-black border-0 dark:bg-gray-700" />
      <div className="px-6 py-2 mx-auto md:h-screen w-[50vw] lg:py-0">
      <form className="space-y-4 w-full md:space-y-6 text-gray-900" onSubmit={(e) => e.preventDefault()}>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Please tell us what the problem is</label>
      <textarea
        className='mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm'
        rows={10}
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
      />
      <button className="bg-blue-500  text-white font-medium text-sm px-5 py-2.5 text-center rounded-md w-full" onClick={handleSubmit}>Submit</button>
      </form>
      </div>
    </div>
  );
};

export default ProblemType;
