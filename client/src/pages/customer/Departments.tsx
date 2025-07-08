import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCreditCard,
  FiSmartphone,
  FiWifi,
  FiShoppingCart,
  FiShield,
  FiHelpCircle,
} from 'react-icons/fi';
import { useCustomerStore } from '../../store/customer/useCustomerStore';

const Departments: React.FC = () => {
  const navigate = useNavigate();
  const { customer, setSelectedDepartment } = useCustomerStore();

  const departments = [
    {
      name: 'Funding Wallet',
      icon: <FiCreditCard className="text-blue-600 text-2xl" />,
      description: 'Issues with account funding and wallet transactions',
    },
    {
      name: 'Buying Airtime',
      icon: <FiSmartphone className="text-blue-600 text-2xl" />,
      description: 'Problems purchasing airtime or mobile top-ups',
    },
    {
      name: 'Buying Internet Data',
      icon: <FiWifi className="text-blue-600 text-2xl" />,
      description: 'Troubles with data bundles and internet packages',
    },
    {
      name: 'E-commerce Section',
      icon: <FiShoppingCart className="text-blue-600 text-2xl" />,
      description: 'Questions about online purchases and orders',
    },
    {
      name: 'Fraud Related Problems',
      icon: <FiShield className="text-blue-600 text-2xl" />,
      description: 'Report suspicious activity or security concerns',
    },
    {
      name: 'General Services',
      icon: <FiHelpCircle className="text-blue-600 text-2xl" />,
      description: 'Other questions and support requests',
    },
  ];

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    navigate('/customer/problem-type');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800">Hello, {customer.fullname}!</h1>
            <p className="text-gray-600 mt-2">How can we assist you today?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleDepartmentSelect(dept.name)}>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">{dept.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{dept.name}</h3>
                    <p className="text-sm text-gray-500">{dept.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Departments;
