import {
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiMessageSquare,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

import api from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import { TrendingUp } from "lucide-react";

const MetricCard = ({
  title,
  value,
  icon,
  color,
  trend,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
  loading?: boolean;
}) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200  duration-300">
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

      <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
    </div>
  </div>
);

const AgentDashboard = () => {
  const { user } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ["agentStats"],
    queryFn: async () => {
      const [pending, active, resolved] = await Promise.all([
        api.get("/api/cases/my?status=pending"),
        api.get("/api/cases/my?status=active"),
        api.get("/api/cases/my?status=resolved"),
      ]);
      return {
        pending: pending.data.cases.length,
        active: active.data.cases.length,
        resolved: resolved.data.cases.length,
        total:
          pending.data.cases.length +
          active.data.cases.length +
          resolved.data.cases.length,
      };
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.fullname}!
        </h1>
        <p className="text-gray-600 mt-2">Here's your support overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard
          title="Pending Cases"
          value={stats?.pending || 0}
          icon={<FiClock className="text-orange-500" />}
        />
        <MetricCard
          title="Active Cases"
          value={stats?.active || 0}
          icon={<FiMessageSquare className="text-blue-500" />}
        />
        <MetricCard
          title="Resolved Today"
          value={stats?.resolved || 0}
          icon={<FiCheckCircle className="text-green-500" />}
        />
        <MetricCard
          title="Total Handled"
          value={stats?.total || 0}
          icon={<FiUsers className="text-purple-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition">
              View Pending Cases
            </button>
            <button className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition">
              Open Active Chat
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl border border-gray-200 p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Avg Response Time</span>
              <span className="font-bold">2.4 min</span>
            </div>
            <div className="flex justify-between">
              <span>Resolution Rate</span>
              <span className="font-bold">94%</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Rating</span>
              <span className="font-bold">4.8/5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
