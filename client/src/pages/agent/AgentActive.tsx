import React, { useState } from "react";
import Cookie from "js-cookie";
import {
  FiCheck,
  FiRefreshCw,
  FiAlertCircle,
  FiInfo,
  FiUser,
  FiMessageSquare,
  FiClock,
} from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api";
import { useAgentCasesStore } from "../../store/agent/useAgentCasesStore";
import { useFetchAgentCases } from "../../hook/agent/useAgentCases";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Case } from "../../Types/Icase";

interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
}

const AgentActive: React.FC = () => {
  const userData = Cookie.get("userData");
  const user: User | null = userData ? JSON.parse(userData) : null;
  const agentId = user?.id;

  const { activeCases, loading, error } = useAgentCasesStore();
  const { refetch } = useFetchAgentCases(agentId || "", "active");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const resolvedCaseMutation = useMutation({
    mutationFn: (caseId: string) => {
      if (!agentId) {
        console.error("Agent ID is not available for resolving case.");
        toast.error("Agent ID is missing. Please log in again.");
        return Promise.reject(new Error("Agent ID missing"));
      }
      return api.patch(`/cases/${caseId}/status`, {
        status: "resolved",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentCases"] });
      refetch();
      setOpenDialogId(null);
      toast.success("Case resolved successfully!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      console.error("Error resolving case:", errorMessage);
      toast.error(`Error: ${errorMessage}`);
    },
  });

  const handleResolveCase = (caseId: string) => {
    resolvedCaseMutation.mutate(caseId);
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

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your active cases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <FiAlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
          <p className="text-gray-600 mb-6">
            We couldn't load your active cases at this time.
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </button>
        </div>
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
                Active Cases
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and resolve cases assigned to you
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border shadow-sm">
                <FiMessageSquare className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {activeCases.length} active cases
                </span>
              </div>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        {activeCases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <FiCheck className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              All Clear!
            </h3>
            <p className="text-gray-600 text-lg mb-2">
              No active cases requiring your attention
            </p>
            <p className="text-gray-500">
              Take a moment to relax or check back later for new assignments
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {activeCases.map((singleCase: Case) => (
              <div
                key={singleCase._id}
                className="bg-white rounded-2xl border border-gray-200 transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Case Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold">
                            <FiUser className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {singleCase.customerName}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {singleCase.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {singleCase.priority && (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityStyles(
                                singleCase.priority
                              )}`}
                            >
                              {singleCase.priority}
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
                              singleCase.status
                            )}`}
                          >
                            {singleCase.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {singleCase.issue}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiMessageSquare className="w-4 h-4" />
                          <span className="font-medium">
                            {singleCase.department}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          <span>{formatDate(singleCase.createdAt)}</span>
                        </div>
                        {singleCase.assignedAgent && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Assigned to you</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end items-end">
                      <button
                        onClick={() =>
                          navigate(`/agent/active/${singleCase._id}`, {
                            state: { caseData: singleCase },
                          })
                        }
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm"
                      >
                        <FiInfo className="mr-2" />
                        View Details
                      </button>

                      {singleCase.status.toLowerCase() !== "resolved" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setOpenDialogId(singleCase._id)}
                            disabled={resolvedCaseMutation.isPending}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                          >
                            {resolvedCaseMutation.isPending ? (
                              <FiRefreshCw className="mr-2 animate-spin" />
                            ) : (
                              <FiCheck className="mr-2" />
                            )}
                            Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resolution Dialog */}
                {openDialogId === singleCase._id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-100 rounded-xl">
                            <FiCheck className="w-6 h-6 text-green-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            Confirm Resolution
                          </h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                          Are you sure you want to mark this case as resolved?
                          This action will close the case and notify the
                          customer.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                          <div className="flex items-start gap-3">
                            <FiInfo className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-blue-900 mb-1">
                                Case Details
                              </p>
                              <p className="text-sm text-blue-700">
                                <strong>Customer:</strong>{" "}
                                {singleCase.customerName}
                                <br />
                                <strong>Issue:</strong>{" "}
                                {singleCase.issue.substring(0, 100)}...
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setOpenDialogId(null)}
                            disabled={resolvedCaseMutation.isPending}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleResolveCase(singleCase._id)}
                            disabled={resolvedCaseMutation.isPending}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-green-500/25"
                          >
                            {resolvedCaseMutation.isPending ? (
                              <FiRefreshCw className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                              "Confirm Resolution"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentActive;
