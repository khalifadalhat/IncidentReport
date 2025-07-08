import { useQuery } from '@tanstack/react-query';
import { useResolvedCasesStore } from '../../store/agent/useResolveCases';
import api from '../../utils/api';
import { ICase } from '../../Types/Icase';

export const useResolvedCases = (agentId?: string) => {
  const { setResolvedCases, setLoading, setError } = useResolvedCasesStore();

  return useQuery({
    queryKey: ['resolvedCases', agentId],
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
        const resolvedCases = caseWithAgent.filter(
          (singleCase: ICase) => singleCase.status === 'pending'
        );
        setResolvedCases(resolvedCases);
        return resolvedCases;
      } catch (error) {
        console.error('Error fetching pending cases:', error);
        setError('Failed to load pending cases. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });
};
