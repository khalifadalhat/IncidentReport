import React from 'react';
import { motion } from 'framer-motion';
import { useCustomerStore } from '../../store/customer/useCustomerStore';
import { useCreateCustomerCase } from '../../hook/customer/useCustomerMutations';

const ProblemType: React.FC = () => {
  const { selectedDepartment, problemDescription, setProblemDescription } = useCustomerStore();

  const { mutate: createCase } = useCreateCustomerCase();

  const handleSubmit = () => {
    if (!problemDescription.trim()) return;
    createCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedDepartment} Support</h1>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please describe your issue in detail
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[200px]"
                value={problemDescription}
                onChange={e => setProblemDescription(e.target.value)}
                placeholder="Example: I tried to purchase airtime but received an error message..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Provide as much detail as possible to help us assist you better
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!problemDescription.trim()}
                className={`flex items-center justify-center py-3 px-6 rounded-lg font-medium text-white transition ${
                  !problemDescription.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md'
                }`}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProblemType;
