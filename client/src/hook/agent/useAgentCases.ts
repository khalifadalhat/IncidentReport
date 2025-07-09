import { useQuery } from '@tanstack/react-query';
import { useAgentCasesStore } from '../../store/agent/useAgentCasesStore';
import api from '../../utils/api';
import { ICase } from '../../Types/Icase';

export const useFetchAgentCases = (agentId?: string) => {
  const { setActiveCases, setPendingCases, setClosedCases, setStats, setLoading, setError } =
    useAgentCasesStore();

  return useQuery({
    queryKey: ['agentCases', agentId],
    queryFn: async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/cases');
        const casesWithAgents = await Promise.all(
          response.data.cases.map(async (singleCase: ICase) => {
            if (singleCase.assignedAgent && agentId) {
              const agentResponse = await api.get(`/cases/agent/${agentId}`);
              return { ...singleCase, agent: agentResponse.data.agent.fullname };
            }
            return { ...singleCase, agent: 'Not Assigned' };
          })
        );
        const active = casesWithAgents.filter(
          (singleCase: ICase) =>
            singleCase.status?.toLowerCase() === 'active' &&
            singleCase.assignedAgent?._id === agentId
        );

        const pending = casesWithAgents.filter(
          (singleCase: ICase) =>
            singleCase.status?.toLowerCase() === 'pending' &&
            singleCase.assignedAgent?._id === agentId
        );

        const closed = casesWithAgents.filter(
          (singleCase: ICase) =>
            singleCase.status?.toLowerCase() === 'closed' &&
            singleCase.assignedAgent?._id === agentId
        );

        setActiveCases(active);
        setPendingCases(pending);
        setClosedCases(closed);
        setStats({
          pending: pending.length,
          resolved: closed.length,
          customers: new Set(casesWithAgents.map(c => c.customerName)).size,
          satisfaction: Math.floor(Math.random() * 30) + 70,
        });
        return casesWithAgents;
      } catch (error) {
        console.error('Error fetching cases:', error);
        setError('Failed to fetch cases');
      } finally {
        setLoading(false);
      }
    },
    enabled: !!agentId,
  });
};
