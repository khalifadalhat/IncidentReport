import React, { useState } from 'react';
import Cookie from 'js-cookie';
import { FiCheck, FiRefreshCw, FiAlertCircle, FiMoreHorizontal, FiInfo } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { useAgentCasesStore } from '../../store/agent/useAgentCasesStore';
import { useFetchAgentCases } from '../../hook/agent/useAgentCases';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Case {
  _id: string;
  customerName: string;
  issue: string;
  department: string;
  location: string;
  assignedAgent?: {
    fullname: string;
  };
  createdAt: string;
  status: string;
}

const AgentActive: React.FC = () => {
  const userData = Cookie.get('userData');
  const user = userData ? JSON.parse(userData) : null;
  const agentId = user?.id;

  const { activeCases, loading, error } = useAgentCasesStore();

  const { refetch } = useFetchAgentCases(agentId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const resolvedCaseMutation = useMutation({
    mutationFn: (caseId: string) => {
      if (!agentId) {
        console.error('Agent ID is not available for resolving case.');
        toast.error('Agent ID is missing. Please log in again.');
        return Promise.reject(new Error('Agent ID missing'));
      }
      return api.put(`/cases/status/${caseId}`, { status: 'resolved', agentId: agentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentCases'] });
      refetch();
      setOpenDialogId(null);
      toast.success('Case resolved successfully!');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || 'An unknown error occurred.';
      console.error('Error resolving case:', errorMessage);
      toast.error(`Error: ${errorMessage}`);
    },
  });

  const handleResolveCase = (caseId: string) => {
    resolvedCaseMutation.mutate(caseId);
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
    <div className="rounded-lg overflow-hidden">
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold text-gray-900">Active Cases</h2>
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

      {activeCases.length === 0 ? (
        <div className="text-center py-12">
          <FiCheck className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No active cases</h3>
          <p className="mt-1 text-sm text-gray-500">
            All cases have been processed. Check back later for new cases.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#E4E7EC] rounded-lg">
          <Table className="w-full">
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b border-gray-100">
                <TableHead className="text-left px-6 py-3 text-sm font-medium text-[#64748B]">
                  Customer
                </TableHead>
                <TableHead className="text-left px-6 py-3 text-sm font-medium text-[#64748B]">
                  Issue
                </TableHead>
                <TableHead className="text-left px-6 py-3 text-sm font-medium text-[#64748B]">
                  Department
                </TableHead>
                <TableHead className="text-left px-6 py-3 text-sm font-medium text-[#64748B] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeCases.map((singleCase: Case) => (
                <TableRow
                  key={singleCase._id}
                  className="text-gray-700 border-b border-gray-100 last:border-b-0">
                  <TableCell className="px-6 py-4 text-sm font-normal">
                    {singleCase.customerName}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-normal">
                    {singleCase.issue}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-normal">
                    {singleCase.department}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
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
                            navigate(`/agent/active/${singleCase._id}`, {
                              state: { caseData: singleCase },
                            })
                          }
                          className="cursor-pointer">
                          <FiInfo className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        {singleCase.status.toLowerCase() !== 'resolved' && (
                          <Dialog
                            open={openDialogId === singleCase._id}
                            onOpenChange={isOpen =>
                              setOpenDialogId(isOpen ? singleCase._id : null)
                            }>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={e => e.preventDefault()}
                                className="text-green-600 focus:text-green-700 cursor-pointer"
                                disabled={
                                  resolvedCaseMutation.isPending &&
                                  resolvedCaseMutation.variables === singleCase._id
                                }>
                                {resolvedCaseMutation.isPending &&
                                resolvedCaseMutation.variables === singleCase._id ? (
                                  <FiRefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <FiCheck className="mr-2 h-4 w-4" />
                                )}
                                Resolve Case
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Confirm Case Resolution</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to mark this case as resolved? This action
                                  cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setOpenDialogId(null)}
                                  disabled={resolvedCaseMutation.isPending}>
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  onClick={() => handleResolveCase(singleCase._id)}
                                  disabled={resolvedCaseMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700">
                                  {resolvedCaseMutation.isPending &&
                                  resolvedCaseMutation.variables === singleCase._id ? (
                                    <FiRefreshCw className="mr-1 animate-spin" />
                                  ) : (
                                    <FiCheck className="mr-1" />
                                  )}
                                  Confirm Resolve
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AgentActive;
