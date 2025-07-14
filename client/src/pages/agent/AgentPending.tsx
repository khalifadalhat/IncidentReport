import React, { useState } from 'react';
import Cookie from 'js-cookie';
import {
  FiCheck,
  FiX,
  FiRefreshCw,
  FiAlertCircle,
  FiUser,
  FiMoreHorizontal,
  FiInfo,
} from 'react-icons/fi';
import { usePendingCasesStore } from '../../store/agent/usePendingCasesSore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { usePendingCases } from '../../hook/agent/usePendingCases';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AgentPending: React.FC = () => {
  const { pendingCases, loading, error } = usePendingCasesStore();
  const { refetch } = usePendingCases();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userData = Cookie.get('userData');
  const user = userData ? JSON.parse(userData) : null;
  const agentId = user?.id;

  const [openAcceptDialogId, setOpenAcceptDialogId] = useState<string | null>(null);
  const [openRejectDialogId, setOpenRejectDialogId] = useState<string | null>(null);

  const acceptCaseMutation = useMutation({
    mutationFn: (caseId: string) =>
      api.put(`/cases/accept/${caseId}`, { status: 'accepted', agentId: agentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCases'] });
      refetch();
      setOpenAcceptDialogId(null);
      toast.success('Case accepted successfully!');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to accept case';
      toast.error(errorMessage);
      console.error('Error accepting case:', error);
    },
  });

  const rejectCaseMutation = useMutation({
    mutationFn: (caseId: string) => api.put(`/cases/reject/${caseId}`, { status: 'rejected' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCases'] });
      refetch();
      setOpenRejectDialogId(null);
      toast.success('Case rejected successfully!');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to reject case';
      toast.error(errorMessage);
      console.error('Error rejecting case:', error);
    },
  });

  const acceptCase = (caseId: string) => {
    acceptCaseMutation.mutate(caseId);
  };

  const rejectCase = (caseId: string) => {
    rejectCaseMutation.mutate(caseId);
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
            <Button
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <FiRefreshCw className="mr-2" /> Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold text-gray-900">Pending Cases</h2>
          <p className="mt-1 text-sm text-gray-500">Review and manage cases awaiting your action</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <FiRefreshCw className="mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {pendingCases.length === 0 ? (
        <div className="text-center py-12">
          <FiCheck className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No pending cases</h3>
          <p className="mt-1 text-sm text-gray-500">
            All cases have been processed. Check back later for new cases.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingCases.map(singleCase => (
                <tr key={singleCase._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {singleCase.issue}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex text-xs font-medium rounded-full px-2.5 py-1 border">
                      {singleCase.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(singleCase.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <FiMoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/agent/pending/${singleCase._id}`, {
                              state: { caseData: singleCase },
                            })
                          }
                          className="cursor-pointer">
                          <FiInfo className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        {singleCase.status?.toLowerCase().trim() === 'pending' && (
                          <>
                            <Dialog
                              open={openAcceptDialogId === singleCase._id}
                              onOpenChange={isOpen =>
                                setOpenAcceptDialogId(isOpen ? singleCase._id : null)
                              }>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={e => e.preventDefault()}
                                  className="text-green-600 focus:text-green-700 cursor-pointer"
                                  disabled={acceptCaseMutation.isPending}>
                                  <FiCheck className="mr-2 h-4 w-4" />
                                  Accept Case
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Confirm Case Acceptance</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to accept this case? You will be
                                    responsible for resolving it.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setOpenAcceptDialogId(null)}
                                    disabled={acceptCaseMutation.isPending}>
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => acceptCase(singleCase._id)}
                                    disabled={acceptCaseMutation.isPending}
                                    className="bg-green-600 hover:bg-green-700">
                                    {acceptCaseMutation.isPending ? (
                                      <FiRefreshCw className="mr-1 animate-spin" />
                                    ) : (
                                      <FiCheck className="mr-1" />
                                    )}
                                    Confirm Accept
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog
                              open={openRejectDialogId === singleCase._id}
                              onOpenChange={isOpen =>
                                setOpenRejectDialogId(isOpen ? singleCase._id : null)
                              }>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={e => e.preventDefault()}
                                  className="text-red-600 focus:text-red-700 cursor-pointer"
                                  disabled={rejectCaseMutation.isPending}>
                                  <FiX className="mr-2 h-4 w-4" />
                                  Reject Case
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Confirm Case Rejection</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to reject this case? This action cannot be
                                    undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setOpenRejectDialogId(null)}
                                    disabled={rejectCaseMutation.isPending}>
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => rejectCase(singleCase._id)}
                                    disabled={rejectCaseMutation.isPending}
                                    className="bg-red-600 hover:bg-red-700">
                                    {rejectCaseMutation.isPending ? (
                                      <FiRefreshCw className="mr-1 animate-spin" />
                                    ) : (
                                      <FiX className="mr-1" />
                                    )}
                                    Confirm Reject
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentPending;
