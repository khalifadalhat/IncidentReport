import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Departments: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customer = location.state?.customer;

  const handleDepartmentSelect = (department: string) => {
    navigate('/customer/problem-type', { state: { customer, department } });
  };
  if (!customer) {
    return <p>Customer information is missing. Please go back and fill out the form.</p>;
  }

  return (
    <div className="bg-white">
      <h2 className="text-4xl px-20 py-10 font-semi-bold mb-4 text-black">
        Hello! {customer.fullname}
      </h2>
      <p className='text-sm text-gray-400 px-20 py-10'>What are your complains about?</p>
      <hr className="h-px my-4 bg-black border-0 dark:bg-gray-700" />
      <div className="px-6 py-2 mx-auto md:h-screen w-[50vw] lg:py-0">

      <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal text-center dark:text-white">
      <button onClick={() => handleDepartmentSelect('Funding Wallet')}>Funding Wallet</button>
      </td>
      </tr>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal text-center dark:text-white">
      <button onClick={() => handleDepartmentSelect('Buying Airtime')}>Buying Airtime</button>
      </td>
      </tr>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal text-center dark:text-white">
        <button onClick={() => handleDepartmentSelect('Buying Internet Data')}>Buying Internet Data</button>
        </td>
      </tr>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal text-center dark:text-white">
        <button onClick={() => handleDepartmentSelect('E-commerce Section')}>E-commerce Section</button>
        </td>
      </tr>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal text-center dark:text-white">
        <button onClick={() => handleDepartmentSelect('Fraud Related Problems')}>Fraud Related Problems</button>
        </td>
      </tr>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal text-center dark:text-white">
        <button onClick={() => handleDepartmentSelect('General Services')}>General Services</button>
        </td>
      </tr>
      </table>
      </div>
    </div>
  );
};

export default Departments;
