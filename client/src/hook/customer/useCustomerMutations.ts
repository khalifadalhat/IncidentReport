import { useMutation } from '@tanstack/react-query';
import api from '../../utils/api';
import { useCustomerStore } from '../../store/customer/useCustomerStore';
import { useNavigate } from 'react-router-dom';

export const useCreateCustomerCase = () => {
  const { customer, selectedDepartment, problemDescription, setCaseId } = useCustomerStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/cases', {
        customerName: customer.fullname,
        email: customer.email,
        phone: customer.phone,
        location: customer.location,
        customerId: customer._id,
        issue: problemDescription,
        department: selectedDepartment,
        status: 'pending',
      });
      return response.data;
    },
    onSuccess: data => {
      setCaseId(data._id);
      navigate('/customer/chat-with-agent');
    },
    onError: error => {
      console.error('Error creating case:', error);
    },
  });
};
