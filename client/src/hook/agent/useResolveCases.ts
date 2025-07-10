import { useQuery } from '@tanstack/react-query';
import { useResolvedCasesStore } from '../../store/agent/useResolveCases';
import api from '../../utils/api';
import { ICase } from '../../Types/Icase';
import Cookie from 'js-cookie';

export const useResolvedCases = (agentId?: string) => {
  const { setResolvedCases, setLoading, setError } = useResolvedCasesStore();

  const userData = Cookie.get('userData');
  const agent = userData ? JSON.parse(userData) : null;
  const currentAgentId = agentId || agent?.id;

  return useQuery({
    queryKey: ['resolvedCases', currentAgentId],
    queryFn: async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/cases/agent/${currentAgentId}`);
        const agentCases = response.data.cases;

        const resolvedCases = agentCases.filter(
          (singleCase: ICase) => singleCase.status?.toLowerCase() === 'resolved'
        );

        setResolvedCases(resolvedCases);
        return resolvedCases;
      } catch (error) {
        console.error('Error fetching resolved cases:', error);
        setError('Failed to load resolved cases. Please try again.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!currentAgentId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
