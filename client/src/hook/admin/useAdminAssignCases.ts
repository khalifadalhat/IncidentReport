import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../utils/api';
import { useAdminAssignCasesStore } from '../../store/admin/useAdminAssignCasesStore';

export const useFetchAdminCases = () => {
  const { setCases, setLoading, setError } = useAdminAssignCasesStore();

  return useQuery({
    queryKey: ['adminAssignCases'],
    queryFn: async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/cases');
        setCases(response.data.cases);
        return response.data.cases;
      } catch (error) {
        console.error('Error fetching cases:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch cases');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchAgents = () => {
  const { setAgents, setError } = useAdminAssignCasesStore();

  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      try {
        const response = await api.get('/agents');
        setAgents(response.data.agents);
        return response.data.agents;
      } catch (error) {
        console.error('Error fetching agents:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch agents');
        throw error;
      }
    },
  });
};

export const useAssignAgent = () => {
  const { updateCase, setMessage } = useAdminAssignCasesStore();

  return useMutation({
    mutationFn: async ({ caseId, agentId }: { caseId: string; agentId: string }) => {
      if (!agentId) {
        throw new Error('Please select an agent');
      }
      await api.put('/cases/assign', { caseId, agentId });
      return { caseId, agentId };
    },
    onSuccess: ({ caseId, agentId }) => {
      updateCase(caseId, { agent: agentId });
      setMessage('Agent assigned successfully', 'success');
    },
    onError: (error: Error) => {
      setMessage(error.message || 'Failed to assign agent', 'error');
    },
  });
};

export const useUpdateCaseStatus = () => {
  const { updateCase, setMessage } = useAdminAssignCasesStore();

  return useMutation({
    mutationFn: async ({ caseId, status }: { caseId: string; status: string }) => {
      await api.put(`/cases/status/${caseId}`, { status });
      return { caseId, status };
    },
    onSuccess: ({ caseId, status }) => {
      updateCase(caseId, { status });
      setMessage('Status updated successfully', 'success');
    },
    onError: (error: Error) => {
      setMessage('Failed to update status', 'error');
      console.error('Error updating status:', error);
    },
  });
};
