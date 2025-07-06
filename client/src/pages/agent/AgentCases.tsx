import React, { useEffect, useState } from "react";
import { ICase } from "../interface/Icase";
import api from "../../utils/api";
import {
  FiMail,
  FiPlus,
  FiEye,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import StatCard from "../../components/NewStat";

interface AgentCasesProps {
  agentId: string;
}

const AgentCases: React.FC<AgentCasesProps> = ({ agentId }) => {
  const [pendingCases, setPendingCases] = useState<ICase[]>([]);
  const [closedCases, setClosedCases] = useState<ICase[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    resolved: 0,
    customers: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cases");
      const casesWithAgents = await Promise.all(
        response.data.cases.map(async (singleCase: ICase) => {
          if (singleCase.assignedAgent) {
            const agentResponse = await api.get(`/cases/agent/${agentId}`);
            return { ...singleCase, agent: agentResponse.data.agent.fullname };
          }
          return { ...singleCase, agent: "Not Assigned" };
        })
      );

      const pending = casesWithAgents.filter(
        (singleCase: ICase) => singleCase.status === "pending"
      );
      const closed = casesWithAgents.filter(
        (singleCase: ICase) => singleCase.status === "closed"
      );

      setPendingCases(pending);
      setClosedCases(closed);
      setStats({
        pending: pending.length,
        resolved: closed.length,
        customers: new Set(casesWithAgents.map((c) => c.customerName)).size,
        satisfaction: Math.floor(Math.random() * 30) + 70, // Mock data
      });
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <button
            onClick={fetchCases}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
            <FiPlus className="mr-2" /> New Case
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Cases"
          value={stats.pending}
          icon={<FiClock className="text-blue-500" />}
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Resolved Cases"
          value={stats.resolved}
          icon={<FiCheckCircle className="text-green-500" />}
          trend="up"
          trendValue="8%"
        />
        <StatCard
          title="Active Customers"
          value={stats.customers}
          icon={<FiUsers className="text-purple-500" />}
          trend="down"
          trendValue="3%"
        />
        <StatCard
          title="Satisfaction Rate"
          value={`${stats.satisfaction}%`}
          icon={<FiMail className="text-yellow-500" />}
          trend="up"
          trendValue="5%"
        />
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Messages</h2>
        </div>
        <div className="p-4 bg-yellow-50">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-full">
              <FiMail className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">
                Follow-up on the customer with bad network!
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                From: Khalifa Dalhat • {formatDate(new Date().toISOString())}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatem nihil alias voluptatibus sint eos sed soluta facere!
              </p>
              <div className="mt-3 flex space-x-2">
                <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                  Reply
                </button>
                <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  View Case
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Cases */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Pending Cases</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Issue</TableHeader>
                <TableHeader>Agent</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingCases.slice(0, 5).map((singleCase) => (
                <TableRow key={singleCase._id}>
                  <TableCell>{singleCase.customerName}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {singleCase.issue}
                  </TableCell>
                  <TableCell>{singleCase.agent}</TableCell>
                  <TableCell>{formatDate(singleCase.createdAt)}</TableCell>
                  <TableCell>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Pending
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className="text-blue-600 hover:text-blue-900">
                      <FiEye className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolved Cases */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Recently Resolved
          </h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Issue</TableHeader>
                <TableHeader>Agent</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {closedCases.slice(0, 5).map((singleCase) => (
                <TableRow key={singleCase._id}>
                  <TableCell>{singleCase.customerName}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {singleCase.issue}
                  </TableCell>
                  <TableCell>{singleCase.agent}</TableCell>
                  <TableCell>{formatDate(singleCase.createdAt)}</TableCell>
                  <TableCell>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Resolved
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className="text-blue-600 hover:text-blue-900">
                      <FiEye className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable table components
const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="hover:bg-gray-50">{children}</tr>
);

const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <td
    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`}
  >
    {children}
  </td>
);

export default AgentCases;
