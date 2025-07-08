import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../utils/api';
import { useAdminCustomersStore } from '../../store/admin/useadminCustomerCase';
import { ICustomer } from '../../Types/Icase';

export const useFetchCustomers = () => {
  const { setCustomers, setLoading, setError } = useAdminCustomersStore();

  return useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/customers');
        setCustomers(response.data.customers);
        return response.data.customers;
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch customers');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDeleteCustomer = () => {
  const { removeCustomer, setMessage } = useAdminCustomersStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/customers/${id}`);
      return id;
    },
    onSuccess: id => {
      removeCustomer(id);
      setMessage('Customer deleted successfully', 'success');
    },
    onError: (error: Error) => {
      setMessage('Failed to delete customer', 'error');
      console.error('Error deleting customer:', error);
    },
  });
};

export const useUpdateCustomer = () => {
  const { updateCustomer, setMessage, setEditingCustomer } = useAdminCustomersStore();

  return useMutation({
    mutationFn: async (customer: ICustomer) => {
      const response = await api.put(`/customers/${customer._id}`, customer);
      return response.data.customer;
    },
    onSuccess: updatedCustomer => {
      updateCustomer(updatedCustomer);
      setEditingCustomer(null);
      setMessage('Customer updated successfully', 'success');
    },
    onError: (error: Error) => {
      setMessage('Failed to update customer', 'error');
      console.error('Error updating customer:', error);
    },
  });
};
