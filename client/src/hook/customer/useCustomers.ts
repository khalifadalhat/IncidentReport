import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { useCustomerStore } from '../../store/agent/useCustomerStore';

export const useCustomers = () => {
  const { setCustomers, setLoading, setError } = useCustomerStore();
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      try {
        const response = await api.get('/customers');
        setCustomers(response.data.customers);
        return response.data.customers;
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to load customers. Please try again.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });
};
