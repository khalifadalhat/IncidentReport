import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { FiSearch, FiMessageSquare } from 'react-icons/fi';
import { ICase } from '../../Types/Icase';

const AdminMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState<ICase | null>(null);

  const {
    data: cases,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminChatCases'],
    queryFn: async () => {
      const response = await api.get('/cases');
      return response.data.cases;
    },
  });

  const filteredCases = cases?.filter(
    (c: ICase) =>
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Case List */}
      <div className="lg:w-1/3 bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Active Chats</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search cases..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-600">Error loading chats: {error.message}</div>
          ) : filteredCases?.length === 0 ? (
            <div className="p-4 text-gray-500">No active chats found</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredCases?.map((c: ICase) => (
                <li
                  key={c._id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedCase?._id === c._id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCase(c)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.customerName}</p>
                      <p className="text-sm text-gray-500 truncate">{c.issue}</p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          c.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : c.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className="lg:w-2/3 bg-white rounded-xl shadow overflow-hidden">
        {selectedCase ? (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500">
              <h2 className="text-lg font-semibold text-white">
                Chat with {selectedCase.customerName}
              </h2>
              <p className="text-sm text-blue-100">
                Case: {selectedCase.issue.substring(0, 50)}...
              </p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {/* Messages would go here */}
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FiMessageSquare className="mx-auto h-12 w-12" />
                  <p className="mt-2">Select a chat to view messages</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
                <button
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled>
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FiMessageSquare className="mx-auto h-12 w-12" />
              <p className="mt-2">Select a chat to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
