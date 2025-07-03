import { Route, Routes } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  MessageSquare,
  Settings,
  TrendingUp,
  Activity,
  Clock,
} from 'lucide-react';


const AdminAgents = () => <div className="p-6">Agents Page</div>;
const AdminCustomers = () => <div className="p-6">Customers Page</div>;
const AdminCases = () => <div className="p-6">Cases Page</div>;
const AdminMessages = () => <div className="p-6">Messages Page</div>;
const AdminSettings = () => <div className="p-6">Settings Page</div>;

const AdminDashboard: React.FC = () => {
  const [pendingCases, setPendingCases] = useState<number>(12);
  const [closedCases, setClosedCases] = useState<number>(45);
  const [activeCases, setActiveCases] = useState<number>(23);

  // Mock data loading effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPendingCases(12);
        setClosedCases(45);
        setActiveCases(23);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };

    fetchData();
  }, []);

  const data = [
    { name: 'Active', value: activeCases },
    { name: 'Closed', value: closedCases },
    { name: 'Pending', value: pendingCases },
  ];

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Agents', href: '/admin/agents', icon: UserCheck },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Cases', href: '/admin/cases', icon: Briefcase },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Modern Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Admin Panel</h2>
              <p className="text-slate-400 text-sm">Management System</p>
            </div>
          </div>
        </div>

        <nav className="px-4 pb-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li key={index + 1}>
                  <a
                    href={item.href}
                    className="flex items-center px-4 py-3 text-slate-300 rounded-xl hover:bg-slate-700/50 hover:text-white transition-all duration-200 group">
                    <IconComponent className="w-5 h-5 mr-3 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/dashboard" element={<AdminDashboardContent data={data} />} />
          <Route path="/agents" element={<AdminAgents />} />
          <Route path="/customers" element={<AdminCustomers />} />
          <Route path="/cases" element={<AdminCases />} />
          <Route path="/messages" element={<AdminMessages />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminDashboardContent: React.FC<{
  data: { name: string; value: number }[];
}> = ({ data }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  const totalCases = data.reduce((sum, item) => sum + item.value, 0);

  // Area chart data showing trends over time
  const trendData = [
    { month: 'Jan', Active: 15, Closed: 25, Pending: 8 },
    { month: 'Feb', Active: 18, Closed: 32, Pending: 12 },
    { month: 'Mar', Active: 22, Closed: 28, Pending: 15 },
    { month: 'Apr', Active: 20, Closed: 35, Pending: 10 },
    { month: 'May', Active: 25, Closed: 40, Pending: 14 },
    { month: 'Jun', Active: 23, Closed: 45, Pending: 12 },
  ];

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    trend?: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your cases today.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Active Cases"
          value={data.find(item => item.name === 'Active')?.value || 0}
          icon={Activity}
          color="bg-blue-500"
          trend="+12% from last month"
        />
        <MetricCard
          title="Closed Cases"
          value={data.find(item => item.name === 'Closed')?.value || 0}
          icon={TrendingUp}
          color="bg-green-500"
          trend="+8% from last month"
        />
        <MetricCard
          title="Pending Cases"
          value={data.find(item => item.name === 'Pending')?.value || 0}
          icon={Clock}
          color="bg-yellow-500"
          trend="-5% from last month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Cases Trend Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
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
        </div>

        {/* Modern Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Cases Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value">
                {data.map((_, index) => (
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
          <div className="flex justify-center space-x-6 mt-4">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-gray-700 font-medium">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{totalCases}</p>
            <p className="text-gray-600 text-sm">Total Cases</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {Math.round(
                ((data.find(item => item.name === 'Closed')?.value || 0) / totalCases) * 100
              )}
              %
            </p>
            <p className="text-gray-600 text-sm">Resolution Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {Math.round(
                ((data.find(item => item.name === 'Pending')?.value || 0) / totalCases) * 100
              )}
              %
            </p>
            <p className="text-gray-600 text-sm">Pending Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">2.3</p>
            <p className="text-gray-600 text-sm">Avg. Days to Close</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
