import { useQuery } from '@tanstack/react-query';
import { useChatStore } from '../../store/chat/useChatStore';
import api from '../../utils/api';

export const useChatCases = () => {
  const { setCases, setLoading, setError } = useChatStore();

  return useQuery({
    queryKey: ['chatCases'],
    queryFn: async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/cases');
        setCases(response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching cases:', error);
        setError('Failed to load cases');
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });
};
