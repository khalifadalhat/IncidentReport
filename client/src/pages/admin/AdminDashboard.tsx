import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Activity, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { useFetchAdminCases } from '../../hook/admin/useAdminCases';
import { useAdminCasesStore } from '../../store/admin/useAdminCasesStore';
import { useOutletContext } from 'react-router-dom';

interface Case {
  createdAt: string;
  closedAt: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

const MetricCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend?: string;
  loading?: boolean;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Loading ...
          </div>
        ) : (
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        )}
        {trend && !loading && (
          <p className="text-sm text-green-600 font-medium mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </div>
);

const AdminDashboardContent: React.FC = () => {
  const context = useOutletContext<{ agentId: string }>();
  const agentId = context?.agentId;

  const { activeCases, pendingCases, closedCases, stats, loading, error } = useAdminCasesStore();

  const { refetch } = useFetchAdminCases(agentId);

  // Prepare data for charts
  const caseDistributionData = [
    { name: 'Active', value: activeCases.length },
    { name: 'Closed', value: closedCases.length },
    { name: 'Pending', value: pendingCases.length },
  ];

  const totalCases = stats.total || 1;

  // Calculate percentages for summary stats
  const resolutionRate = Math.round((stats.resolved / totalCases) * 100);
  const pendingRate = Math.round((stats.pending / totalCases) * 100);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header with refresh button */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">
            {loading
              ? 'Loading data...'
              : "Welcome back! Here's what's happening with your cases today."}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-gray-900 rounded-lg shadow border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading data</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Active Cases"
          value={stats.active}
          icon={Activity}
          color="bg-blue-500"
          trend="+12% from last month"
          loading={loading}
        />
        <MetricCard
          title="Closed Cases"
          value={stats.resolved}
          icon={TrendingUp}
          color="bg-green-500"
          trend="+8% from last month"
          loading={loading}
        />
        <MetricCard
          title="Pending Cases"
          value={stats.pending}
          icon={Clock}
          color="bg-yellow-500"
          trend="-5% from last month"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Chart  */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Cases Trend Over Time</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Loading ...
            </div>
          ) : error ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Could not load trend data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={[
                  {
                    month: 'Current',
                    Active: stats.active,
                    Closed: stats.resolved,
                    Pending: stats.pending,
                  },
                  {
                    month: 'Prev',
                    Active: Math.round(stats.active * 0.88),
                    Closed: Math.round(stats.resolved * 0.92),
                    Pending: Math.round(stats.pending * 1.05),
                  },
                ]}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Active"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorActive)"
                />
                <Area
                  type="monotone"
                  dataKey="Closed"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClosed)"
                />
                <Area
                  type="monotone"
                  dataKey="Pending"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPending)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Cases Distribution</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Loading ...
            </div>
          ) : error ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Could not load distribution data
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={caseDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {caseDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Custom Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {caseDistributionData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Summary Statistics</h3>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Loading ...
          </div>
        ) : error ? (
          <div className="text-center text-gray-500 py-8">Could not load summary statistics</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-gray-600 text-sm">Total Cases</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{resolutionRate}%</p>
              <p className="text-gray-600 text-sm">Resolution Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{pendingRate}%</p>
              <p className="text-gray-600 text-sm">Pending Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {closedCases.length > 0 ? calculateAverageDaysToClose(closedCases) : 'N/A'}
              </p>
              <p className="text-gray-600 text-sm">Avg. Days to Close</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function calculateAverageDaysToClose(cases: Case[]): string {
  if (!cases.length) return '0';

  const totalDays = cases.reduce((sum, singleCase) => {
    if (!singleCase.createdAt || !singleCase.closedAt) return sum;
    const created = new Date(singleCase.createdAt);
    const closed = new Date(singleCase.closedAt);
    const diffTime = Math.abs(closed.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);

  return (totalDays / cases.length).toFixed(1);
}

export default AdminDashboardContent;
