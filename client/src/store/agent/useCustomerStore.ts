import { create } from 'zustand';
import { ICustomer } from '../../Types/Icase';

interface CustomerState {
  customers: ICustomer[];
  loading: boolean;
  error: string | null;
  setCustomers: (customers: ICustomer[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCustomerStore = create<CustomerState>(set => ({
  customers: [],
  loading: false,
  error: null,
  setCustomers: customers => set({ customers }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));
