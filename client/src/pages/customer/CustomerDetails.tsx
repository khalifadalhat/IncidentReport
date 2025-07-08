import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCustomerStore } from '../../store/customer/useCustomerStore';
import { useFetchCustomerProfile } from '../../hook/customer/useCustomerProfile';

const CustomerDetails: React.FC = () => {
  const navigate = useNavigate();
  const { customer, setCustomer } = useCustomerStore();

  useFetchCustomerProfile();

  const handleContinue = () => {
    navigate('/customer/department');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-blue-600 text-4xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
            <p className="text-gray-600 mt-2">Please review and confirm your information</p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FiUser className="text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <input
                      className="w-full bg-transparent border-b border-blue-200 pb-1 focus:outline-none focus:border-blue-500 text-gray-800"
                      value={customer.fullname}
                      onChange={e => setCustomer({ fullname: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FiMail className="text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <input
                      className="w-full bg-transparent border-b border-blue-200 pb-1 focus:outline-none focus:border-blue-500 text-gray-800"
                      value={customer.email}
                      onChange={e => setCustomer({ email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FiPhone className="text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <input
                      className="w-full bg-transparent border-b border-blue-200 pb-1 focus:outline-none focus:border-blue-500 text-gray-800"
                      value={customer.phone}
                      onChange={e => setCustomer({ phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FiMapPin className="text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                    <input
                      className="w-full bg-transparent border-b border-blue-200 pb-1 focus:outline-none focus:border-blue-500 text-gray-800"
                      value={customer.location}
                      onChange={e => setCustomer({ location: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleContinue}
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-300">
                Continue
                <FiChevronRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerDetails;
