import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { ICase } from '../../Types/Icase';
import { useAdminCasesStore } from '../../store/admin/useAdminCasesStore';

export const useFetchAdminCases = (agentId?: string) => {
  const { setActiveCases, setPendingCases, setClosedCases, setStats, setLoading, setError } =
    useAdminCasesStore();

  return useQuery({
    queryKey: ['adminCases', agentId],
    queryFn: async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/cases');

        const active = response.data.cases.filter(
          (singleCase: ICase) => singleCase.status === 'active'
        );
        const pending = response.data.cases.filter(
          (singleCase: ICase) => singleCase.status === 'pending'
        );
        const closed = response.data.cases.filter(
          (singleCase: ICase) => singleCase.status === 'closed'
        );
        setActiveCases(active);
        setPendingCases(pending);
        setClosedCases(closed);
        setStats({
          active: active.length,
          pending: pending.length,
          resolved: closed.length,
          total: response.data.cases.length,
        });

        return response;
      } catch (error) {
        console.error('Error fetching cases:', error);
        setError('Failed to fetch cases');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!agentId,
  });
};
