import React from 'react';
import { Search, User, AlertCircle, MapPin, CheckCircle, Clock, Eye, X } from 'lucide-react';
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertCircle className="w-3 h-3" />;
      case 'closed':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const handleAssignAgent = (caseId: string, agentId: string) => {
    assignAgentMutation.mutate({ caseId, agentId });
  };

  const handleChangeStatus = (caseId: string, status: string) => {
    updateStatusMutation.mutate({ caseId, status });
  };

  // const getAgentName = (agentId: string) => {
  //   const agent = agents.find(a => a._id === agentId);
  //   return agent ? `${agent.fullname} (${agent.department})` : 'Unknown Agent';
  // };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Cases</h1>
          <p className="text-gray-600">Assign agents and track case progress</p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              messageType === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {message}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases by customer, issue, department or agent..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Cases ({filteredCases.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Issue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Assigned Agent
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        {loading
                          ? 'Loading cases...'
                          : searchTerm
                          ? 'No matching cases found'
                          : 'No cases found'}
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map(caseItem => (
                      <tr key={caseItem._id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900 truncate max-w-[150px]">
                              {caseItem.customerName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900 truncate max-w-[200px]">
                              {caseItem.issue}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-900">{caseItem.department}</td>
                        <td className="py-4 px-4">
                          <select
                            value={caseItem.status}
                            onChange={e => handleChangeStatus(caseItem._id, e.target.value)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              caseItem.status
                            )} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900 truncate max-w-[120px]">
                              {caseItem.location}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={caseItem.agent || ''}
                            onChange={e => handleAssignAgent(caseItem._id, e.target.value)}
                            className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm">
                            <option value="">Unassigned</option>
                            {agents.map(agent => (
                              <option key={agent._id} value={agent._id}>
                                {agent.fullname} ({agent.department})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setSelectedCase(caseItem)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Case Details Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                    Case Details
                  </h3>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Customer Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedCase.customerName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedCase.customerEmail || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedCase.customerPhone || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Issue</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedCase.issue}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Department</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedCase.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Location</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedCase.location || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              selectedCase.status
                            )}`}>
                            {getStatusIcon(selectedCase.status)}
                            <span className="ml-1 capitalize">{selectedCase.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Description</h4>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700">
                        {selectedCase.description || 'No additional description provided'}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Agent Assignment</h4>
                    <select
                      value={selectedCase.agent || ''}
                      onChange={e => {
                        handleAssignAgent(selectedCase._id, e.target.value);
                        setSelectedCase({ ...selectedCase, agent: e.target.value });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCases;
