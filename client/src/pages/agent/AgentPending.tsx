/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiCheck,
  FiX,
  FiEye,
  FiClock,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";
import { toast } from "sonner";
import { useState } from "react";

interface Case {
  _id: string;
  customerName: string;
  issue: string;
  department: string;
  location?: string;
  createdAt: string;
  updatedAt?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  status: string;
}

const AgentPending = () => {
  const queryClient = useQueryClient();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const { data: cases = [], isLoading } = useQuery<Case[]>({
    queryKey: ["pendingCases"],
    queryFn: (): Promise<Case[]> =>
      api.get("/cases/my?status=pending").then((res) => res.data.cases),
  });

  const acceptMutation = useMutation({
    mutationFn: (caseId: string) => api.patch(`/cases/${caseId}/accept`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingCases"] });
      toast.success("Case accepted successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to accept case";
      toast.error(errorMessage);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (caseId: string) =>
      api.patch(`/cases/${caseId}/status`, { status: "rejected" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingCases"] });
      toast.success("Case rejected");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to reject case";
      toast.error(errorMessage);
    },
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAccept = (caseId: string) => {
    acceptMutation.mutate(caseId);
  };

  const handleReject = (caseId: string) => {
    if (
      toast(
        "Are you sure you want to reject this case? This action cannot be undone."
      )
    ) {
      rejectMutation.mutate(caseId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pending cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                Pending Cases
              </h1>
              <p className="text-gray-600 text-lg">
                Review and accept new case assignments
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border shadow-sm">
              <FiClock className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                {cases.length} pending {cases.length === 1 ? "case" : "cases"}
              </span>
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        {cases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <FiCheck className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600 text-lg mb-2">
              No pending cases requiring your attention
            </p>
            <p className="text-gray-500">
              New cases assigned to you will appear here automatically
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {cases.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-2xl border border-gray-200 transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Case Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-semibold">
                            <FiUser className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {c.customerName}
                            </h3>
                            {c.location && (
                              <p className="text-gray-500 text-sm">
                                {c.location}
                              </p>
                            )}
                          </div>
                        </div>
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <FiClock className="w-3 h-3 mr-1" />
                            pending
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{c.issue}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiMessageSquare className="w-4 h-4" />
                          <span className="font-medium">{c.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          <span>{formatDate(c.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end items-end">
                      <button
                        onClick={() => handleAccept(c._id)}
                        disabled={acceptMutation.isPending}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm min-w-[120px] justify-center"
                      >
                        {acceptMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <FiCheck className="mr-2" />
                            Accept
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleReject(c._id)}
                        disabled={rejectMutation.isPending}
                        className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm min-w-[120px] justify-center"
                      >
                        {rejectMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <FiX className="mr-2" />
                            Reject
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedCase(c)}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm min-w-[120px] justify-center"
                      >
                        <FiEye className="mr-2" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Case Details Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Case Details
                  </h3>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Name
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <FiUser className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {selectedCase.customerName}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <FiMessageSquare className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {selectedCase.department}
                        </span>
                      </div>
                    </div>

                    {selectedCase.location && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-900">
                            {selectedCase.location}
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Created Date
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <FiClock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {formatDate(selectedCase.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Description
                    </label>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-900 leading-relaxed">
                        {selectedCase.issue}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        handleAccept(selectedCase._id);
                        setSelectedCase(null);
                      }}
                      disabled={acceptMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-lg shadow-green-500/25"
                    >
                      {acceptMutation.isPending
                        ? "Accepting..."
                        : "Accept Case"}
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedCase._id);
                        setSelectedCase(null);
                      }}
                      disabled={rejectMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-lg shadow-red-500/25"
                    >
                      {rejectMutation.isPending
                        ? "Rejecting..."
                        : "Reject Case"}
                    </button>
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

export default AgentPending;
