import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  FileText,
  AlertOctagon,
  TrendingUp,
  MessageSquare,
  LucideIcon,
} from "lucide-react";
import api from "@/utils/api";

const COLORS = {
  primary: "#2563eb",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  gray: "#94a3b8",
};

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

interface CaseData {
  name: string;
  value: number;
  color: string;
}

interface UserData {
  name: string;
  count: number;
}

interface DashboardStats {
  cases: {
    total: number;
    activeCases: number;
    pendingCases: number;
    resolvedCases: number;
    rejectedCases: number;
  };
  users: {
    customers: number;
    agents: number;
    admins: number;
  };
  today: {
    newCases: number;
    newMessages: number;
  };
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 duration-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className="text-emerald-600 font-medium flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
          <TrendingUp className="w-3 h-3 mr-1" /> {trend}
        </span>
        <span className="text-gray-400 ml-2">from yesterday</span>
      </div>
    )}
  </div>
);

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["adminDashboard"],
    queryFn: async (): Promise<DashboardStats> => {
      const { data } = await api.get("/api/admin/dashboard");
      return data.stats;
    },
  });

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const caseData: CaseData[] = [
    { name: "Active", value: stats.cases.activeCases, color: COLORS.primary },
    { name: "Pending", value: stats.cases.pendingCases, color: COLORS.warning },
    {
      name: "Resolved",
      value: stats.cases.resolvedCases,
      color: COLORS.success,
    },
    {
      name: "Rejected",
      value: stats.cases.rejectedCases,
      color: COLORS.danger,
    },
  ];

  const userData: UserData[] = [
    { name: "Customers", count: stats.users.customers },
    { name: "Agents", count: stats.users.agents },
    { name: "Admins", count: stats.users.admins },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Cases"
          value={stats.cases.total}
          icon={FileText}
          color="bg-blue-500"
          trend={`+${stats.today.newCases}`}
        />
        <StatCard
          title="Active Issues"
          value={stats.cases.activeCases}
          icon={AlertOctagon}
          color="bg-indigo-500"
        />
        <StatCard
          title="Total Customers"
          value={stats.users.customers}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="New Messages"
          value={stats.today.newMessages}
          icon={MessageSquare}
          color="bg-pink-500"
          trend="Today"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 col-span-2 lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Case Status</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={caseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {caseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            User Demographics
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData} barSize={60}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill={COLORS.primary}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Need to create a new agent?
            </h2>
            <p className="text-blue-100">
              Manage your team efficiently by adding new agents to departments.
            </p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
            Add Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
