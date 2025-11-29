import api from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiUser,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiMessageSquare,
} from "react-icons/fi";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Case {
  _id: string;
  customerName: string;
  issue: string;
  department: string;
  status: "active" | "pending" | "resolved" | "closed";
  createdAt: string;
  updatedAt?: string;
  assignedAgent?: {
    _id: string;
    fullname: string;
    email: string;
    department: string;
  } | null;
  priority?: "low" | "medium" | "high" | "urgent";
  location?: string;
  customer?: string;
}

interface Agent {
  _id: string;
  fullname: string;
  email: string;
  department: string;
  status: string;
}

interface AssignAgentParams {
  caseId: string;
  agentId: string;
}

interface ApiResponse {
  success: boolean;
  users: Case[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
}

interface AgentsApiResponse {
  success: boolean;
  agents: Agent[];
}

const AdminCases = () => {
  const queryClient = useQueryClient();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  const { data: casesData, isLoading: casesLoading } = useQuery<ApiResponse>({
    queryKey: ["adminCases"],
    queryFn: (): Promise<ApiResponse> =>
      api.get("/cases").then((res) => res.data),
  });

  const { data: agentsData } = useQuery<AgentsApiResponse>({
    queryKey: ["agents"],
    queryFn: (): Promise<AgentsApiResponse> =>
      api.get("/users/agents").then((res) => res.data),
  });

  const assignMutation = useMutation({
    mutationFn: ({ caseId, agentId }: AssignAgentParams) =>
      api.patch(`/cases/assign`, { agentId, caseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCases"] });
    },
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <FiAlertCircle className="w-4 h-4" />;
      case "pending":
        return <FiClock className="w-4 h-4" />;
      case "resolved":
      case "closed":
        return <FiCheckCircle className="w-4 h-4" />;
      default:
        return <FiMessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityStyles = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const cases = casesData?.users || [];
  const agents = agentsData?.agents || [];

  const filteredCases =
    selectedDepartment === "all"
      ? cases
      : cases.filter((c) => c.department === selectedDepartment);

  const departments = ["all", ...new Set(cases.map((c) => c.department))];

  if (casesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                Case Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and assign support cases to your team
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border ">
              <FiMessageSquare className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {filteredCases.length} cases
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              <div className="flex flex-wrap gap-4">
                <Select
                  value={selectedDepartment}
                  onValueChange={(value) => setSelectedDepartment(value)}
                >
                  <SelectTrigger className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-0">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept === "all" ? "All Departments" : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid gap-6">
          {filteredCases.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <FiMessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                No cases found
              </p>
              <p className="text-gray-500">
                {selectedDepartment !== "all"
                  ? `No cases in ${selectedDepartment} department`
                  : "No cases have been created yet"}
              </p>
            </div>
          ) : (
            filteredCases.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-2xl border border-gray-200 transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Case Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {c.customerName}
                        </h3>
                        <div className="flex items-center gap-2">
                          {c.priority && (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityStyles(
                                c.priority
                              )}`}
                            >
                              {c.priority}
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
                              c.status
                            )}`}
                          >
                            {getStatusIcon(c.status)}
                            {c.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {c.issue}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-4 h-4" />
                          <span className="font-medium">{c.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          <span>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {c.assignedAgent && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Assigned to {c.assignedAgent.fullname}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Assignment Section */}
                    <div className="lg:w-64 flex flex-col gap-4">
                      {c.assignedAgent ? (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">
                            Assigned Agent
                          </p>
                          <p className="font-semibold text-gray-900">
                            {c.assignedAgent.fullname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {c.assignedAgent.email}
                          </p>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-2">
                            No agent assigned
                          </p>
                        </div>
                      )}

                      <Select
                        value={c.assignedAgent?._id || ""}
                        onValueChange={(agentId) => {
                          if (agentId) {
                            assignMutation.mutate({
                              caseId: c._id,
                              agentId,
                            });
                          }
                        }}
                        disabled={assignMutation.isPending}
                      >
                        <SelectTrigger className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-0 focus:outline-none disabled:opacity-50">
                          <SelectValue
                            placeholder={
                              c.assignedAgent ? "Change Agent" : "Assign Agent"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-300">
                          {c.assignedAgent &&
                            !agents.some(
                              (a) => a._id === c.assignedAgent?._id
                            ) && (
                              <SelectItem value={c.assignedAgent._id}>
                                {c.assignedAgent.fullname} -{" "}
                                {c.assignedAgent?.department || "-"}
                              </SelectItem>
                            )}

                          {agents.map((agent) => (
                            <SelectItem key={agent._id} value={agent._id}>
                              {agent.fullname} - {agent.department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {assignMutation.isPending && (
                        <div className="text-sm text-gray-500">
                          Assigning...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCases;
