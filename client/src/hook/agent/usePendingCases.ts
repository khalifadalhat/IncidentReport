import { useQuery } from '@tanstack/react-query';
import { usePendingCasesStore } from '../../store/agent/usePendingCasesSore';
import api from '../../utils/api';
import { ICase } from '../../Types/Icase';

export const usePendingCases = (agentId?: string) => {
  const { setPendingCases, setLoading, setError } = usePendingCasesStore();

  return useQuery({
    queryKey: ['pendingCases', agentId],
    queryFn: async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/cases');
        const caseWithAgent = await Promise.all(
          response.data.cases.map(async (singleCase: ICase) => {
            if (singleCase.assignedAgent && agentId) {
              const agentResponse = await api.get(`/agents/${singleCase.assignedAgent}`);
              return { ...singleCase, agent: agentResponse.data.agent.fullname };
            }
            return { ...singleCase, agent: 'Not Assigned' };
          })
        );
        const pendingCases = caseWithAgent.filter(
          (singleCase: ICase) => singleCase.status === 'pending'
        );
        setPendingCases(pendingCases);
        return pendingCases;
      } catch (error) {
        console.error('Error fetching pending cases:', error);
        setError('Failed to load pending cases. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    enabled: !!agentId,
  });
};
