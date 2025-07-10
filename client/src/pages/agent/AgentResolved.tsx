import React from 'react';
import Cookie from 'js-cookie';
import { FiRefreshCw, FiAlertCircle, FiUser, FiArchive, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import { useResolvedCasesStore } from '../../store/agent/useResolveCases';
import { useResolvedCases } from '../../hook/agent/useResolveCases';
import { FaUserTie } from 'react-icons/fa';

const AgentResolved: React.FC = () => {
  const userData = Cookie.get('userData');
  const user = userData ? JSON.parse(userData) : null;
  const agentId = user?.id;

  const { resolvedCases, loading, error } = useResolvedCasesStore();
  const { refetch } = useResolvedCases(agentId);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Resolved Cases</h2>
            <p className="mt-1 text-sm text-green-100">
              {resolvedCases.length} cases successfully resolved
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors">
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {resolvedCases.length === 0 ? (
        <div className="text-center py-12">
          <FiArchive className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No resolved cases found</h3>
          <p className="mt-1 text-sm text-gray-500">All resolved cases will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Issue</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Resolved At</TableHeader>
                <TableHeader>Agent</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resolvedCases.map(singleCase => (
                <TableRow key={singleCase._id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {singleCase.customerName}
                        </div>
                        <div className="text-sm text-gray-500">{singleCase.location}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 max-w-xs">{singleCase.issue}</div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {singleCase.department}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {singleCase.resolvedAt ? formatDate(singleCase.resolvedAt) : 'N/A'}
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
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <FiEye className="mr-1.5 h-4 w-4" /> View
                    </button>
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

export default AgentResolved;
