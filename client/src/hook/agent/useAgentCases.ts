import { useQuery } from '@tanstack/react-query';
import { useAgentCasesStore } from '../../store/agent/useAgentCasesStore';
import api from '../../utils/api';
import { Case } from '@/Types/Icase';

export const useFetchAgentCases = (agentId?: string, status?: string) => {
  const { setActiveCases, setPendingCases, setClosedCases, setStats, setLoading, setError } =
    useAgentCasesStore();

  return useQuery({
    queryKey: ['agentCases', agentId, status],
    queryFn: async () => {
      try {
        setLoading(true);
        setError(null);

        const url = status ? `/cases/my?status=${status}` : `/cases/my`;
        const response = await api.get(url);

        const agentCases = response.data.cases;

        if (status) {
          if (status === 'active') {
            setActiveCases(agentCases);
          } else if (status === 'pending') {
            setPendingCases(agentCases);
          } else if (status === 'resolved') {
            setClosedCases(agentCases);
          }
        } else {
          const active = agentCases.filter(
            (singleCase: Case) => singleCase.status?.toLowerCase() === 'active'
          );

          const pending = agentCases.filter(
            (singleCase: Case) => singleCase.status?.toLowerCase() === 'pending'
          );

          const resolved = agentCases.filter(
            (singleCase: Case) => singleCase.status?.toLowerCase() === 'resolved'
          );

          setActiveCases(active);
          setPendingCases(pending);
          setClosedCases(resolved);
        }

        setStats({
          pending: agentCases.filter((c: Case) => c.status === 'pending').length,
          resolved: agentCases.filter((c: Case) => c.status === 'resolved').length,
          customers: new Set(agentCases.map((c: Case) => c.customerName)).size,
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