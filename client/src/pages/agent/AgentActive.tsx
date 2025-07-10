import React from 'react';
import Cookie from 'js-cookie';
import { FiCheck, FiRefreshCw, FiAlertCircle, FiMapPin, FiUser } from 'react-icons/fi';
import { FaUserTie } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { useAgentCasesStore } from '../../store/agent/useAgentCasesStore';
import { useFetchAgentCases } from '../../hook/agent/useAgentCases';

const AgentActive: React.FC = () => {
  const userData = Cookie.get('userData');
  const user = userData ? JSON.parse(userData) : null;
  const agentId = user?.id;

  const { activeCases, loading, error } = useAgentCasesStore();

  console.log(activeCases);

  const { refetch } = useFetchAgentCases(agentId);
  const queryClient = useQueryClient();

  const resolvedCaseMutation = useMutation({
    mutationFn: (caseId: string) =>
      api.put(`/cases/status/${caseId}`, { status: 'resolved', agentId: agentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentCases'] });
      refetch();
    },
    onError: error => {
      console.error('Error accepting case:', error);
    },
  });

  const acceptCase = (caseId: string) => {
    resolvedCaseMutation.mutate(caseId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
          <div className="mt-6">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <FiRefreshCw className="mr-2" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold text-gray-900">Active Cases</h2>
          <p className="mt-1 text-sm text-gray-500">Review and manage cases awaiting your action</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {activeCases.length === 0 ? (
        <div className="text-center py-12">
          <FiCheck className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No active cases</h3>
          <p className="mt-1 text-sm text-gray-500">
            All cases have been processed. Check back later for new cases.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Issue</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Agent</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeCases.map(singleCase => (
                <TableRow key={singleCase._id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {singleCase.customerName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {singleCase.issue}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {singleCase.department}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{singleCase.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {!singleCase.assignedAgent ? (
                        <span className="text-sm text-gray-500">Not Assigned</span>
                      ) : (
                        <>
                          <FaUserTie className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {singleCase.assignedAgent?.fullname}
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">{formatDate(singleCase.createdAt)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => acceptCase(singleCase._id)}
                        disabled={resolvedCaseMutation.isPending}>
                        {resolvedCaseMutation.isPending &&
                        resolvedCaseMutation.variables === singleCase._id ? (
                          <FiRefreshCw className="mr-1 animate-spin" />
                        ) : (
                          <FiCheck className="mr-1" />
                        )}
                        Resolved
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Reusable table components
const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="hover:bg-gray-50">{children}</tr>
);

const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);

export default AgentActive;
