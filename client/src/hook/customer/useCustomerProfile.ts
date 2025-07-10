import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { useCustomerStore } from '../../store/customer/useCustomerStore';

export const useFetchCustomerProfile = () => {
  const { setCustomer } = useCustomerStore();

  return useQuery({
    queryKey: ['customerProfile'],
    queryFn: async () => {
      try {
        const savedCustomer = localStorage.getItem('customer');
        if (savedCustomer) {
          const parsedCustomer = JSON.parse(savedCustomer);
          setCustomer(parsedCustomer.customer);
          return parsedCustomer;
        }

        const response = await api.get('/customers/profile');
        const customerData = response.data.customer;
        setCustomer(customerData);
        localStorage.setItem('customer', JSON.stringify(customerData));
        return customerData;
      } catch (error) {
        console.error('Error fetching customer data:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 30,
  });
};
