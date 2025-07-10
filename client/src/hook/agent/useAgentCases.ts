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

        const response = await api.get(`/cases/agent/${agentId}`);
        const agentCases = response.data.cases;

        const active = agentCases.filter(
          (singleCase: ICase) => singleCase.status?.toLowerCase() === 'active'
        );

        const pending = agentCases.filter(
          (singleCase: ICase) => singleCase.status?.toLowerCase() === 'pending'
        );

        const resolved = agentCases.filter(
          (singleCase: ICase) => singleCase.status?.toLowerCase() === 'resolved'
        );

        setActiveCases(active);
        setPendingCases(pending);
        setClosedCases(resolved);

        setStats({
          pending: pending.length,
          resolved: resolved.length,
          customers: new Set(agentCases.map((c: ICase) => c.customerName)).size,
          satisfaction: Math.floor(Math.random() * 30) + 70,
        });

        return agentCases;
      } catch (error) {
        console.error('Error fetching cases:', error);
        setError('Failed to fetch cases');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
