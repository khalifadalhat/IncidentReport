import React from 'react';
import {
  FiSearch,
  FiUser,
  FiAlertCircle,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiEdit2,
} from 'react-icons/fi';
import { useAdminAssignCasesStore } from '../../store/admin/useAdminAssignCasesStore';
import {
  useAssignAgent,
  useFetchAdminCases,
  useFetchAgents,
  useUpdateCaseStatus,
} from '../../hook/admin/useAdminAssignCases';

const AdminCases: React.FC = () => {
  const {
    cases,
    agents,
    loading,
    // error,
    message,
    messageType,
    searchTerm,
    selectedCase,
    setSearchTerm,
    setSelectedCase,
  } = useAdminAssignCasesStore();

  // Fetch data
  useFetchAdminCases();
  useFetchAgents();

  // Mutations
  const assignAgentMutation = useAssignAgent();
  const updateStatusMutation = useUpdateCaseStatus();

  const filteredCases = cases.filter(
    caseItem =>
      caseItem.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (caseItem.agent &&
        agents
          .find(a => a._id === caseItem.agent)
          ?.fullname.toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <FiAlertCircle className="mr-1" />;
      case 'closed':
        return <FiCheckCircle className="mr-1" />;
      case 'pending':
        return <FiClock className="mr-1" />;
      default:
        return <FiAlertCircle className="mr-1" />;
    }
  };

  const handleAssignAgent = (caseId: string, agentId: string) => {
    assignAgentMutation.mutate({ caseId, agentId });
  };

  const handleChangeStatus = (caseId: string, status: string) => {
    updateStatusMutation.mutate({ caseId, status });
  };

  return (
    <div className="bg-white min-h-screen">
      <h2 className="text-4xl px-20 py-10 font-semibold mb-4 text-black">Manage Cases</h2>

      {/* Message Display */}
      {message && (
        <div
          className={`mx-20 mb-4 p-4 rounded ${
            messageType === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
          {message}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="px-20 mb-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search cases by customer, issue, department or agent..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>
      </div>

      <hr className="mx-20 h-px my-8 bg-gray-300 border-0" />

      {/* Cases Table */}
      <div className="px-20">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full table-auto text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Issue</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Assigned Agent</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {loading
                      ? 'Loading cases...'
                      : searchTerm
                      ? 'No matching cases found'
                      : 'No cases found'}
                  </td>
                </tr>
              ) : (
                filteredCases.map(caseItem => (
                  <tr className="bg-white border-b hover:bg-gray-50" key={caseItem._id}>
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-400" />
                        {caseItem.customerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 max-w-xs truncate">
                      <div className="flex items-center">
                        <FiAlertCircle className="mr-2 text-gray-400" />
                        {caseItem.issue}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 max-w-xs truncate">
                      {caseItem.department}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={caseItem.status}
                        onChange={e => handleChangeStatus(caseItem._id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-3 py-1 ${getStatusColor(
                          caseItem.status
                        )} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-900 max-w-xs truncate">
                      <div className="flex items-center">
                        <FiMapPin className="mr-2 text-gray-400" />
                        {caseItem.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={caseItem.agent || ''}
                        onChange={e => handleAssignAgent(caseItem._id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Unassigned</option>
                        {agents.map(agent => (
                          <option key={agent._id} value={agent._id}>
                            {agent.fullname} ({agent.department})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedCase(caseItem)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                        title="View Details">
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiAlertCircle className="text-blue-600" />
                Case Details
              </h3>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Customer Information</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {selectedCase.customerName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    {selectedCase.customerEmail || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{' '}
                    {selectedCase.customerPhone || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Case Details</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Issue:</span> {selectedCase.issue}
                  </p>
                  <p>
                    <span className="font-medium">Department:</span> {selectedCase.department}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {selectedCase.location || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedCase.status
                      )}`}>
                      {getStatusIcon(selectedCase.status)}
                      {selectedCase.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
                <p className="bg-gray-50 p-4 rounded-lg">
                  {selectedCase.description || 'No additional description provided'}
                </p>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Assigned Agent</h4>
                <select
                  value={selectedCase.agent || ''}
                  onChange={e => {
                    handleAssignAgent(selectedCase._id, e.target.value);
                    setSelectedCase({ ...selectedCase, agent: e.target.value });
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Unassigned</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>
                      {agent.fullname} ({agent.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCases;
