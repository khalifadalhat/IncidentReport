
import { useCustomerStore } from '@/store/useCustomerStore';
import api from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useCreateCase = () => {
  const { selectedDepartment, problemDescription, setCaseId, reset } = useCustomerStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/cases', {
        issue: problemDescription,
        department: selectedDepartment,
        location: 'Online',
      });
      return res.data.case; 
    },
    onSuccess: (newCase) => {
      setCaseId(newCase._id); 
      queryClient.invalidateQueries({ queryKey: ['myCases'] });
      reset();
      navigate('/customer/chat');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Failed to create case');
    },
  });
};