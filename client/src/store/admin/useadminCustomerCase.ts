import { create } from 'zustand';
import { ICustomer } from '../../Types/Icase';

interface AdminCustomersState {
  customers: ICustomer[];
  loading: boolean;
  error: string | null;
  message: string;
  messageType: 'success' | 'error' | '';
  searchTerm: string;
  editingCustomer: ICustomer | null;
  setCustomers: (customers: ICustomer[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMessage: (message: string, type: 'success' | 'error') => void;
  setSearchTerm: (term: string) => void;
  setEditingCustomer: (customer: ICustomer | null) => void;
  removeCustomer: (id: string) => void;
  updateCustomer: (customer: ICustomer) => void;
}

export const useAdminCustomersStore = create<AdminCustomersState>(set => ({
  customers: [],
  loading: false,
  error: null,
  message: '',
  messageType: '',
  searchTerm: '',
  editingCustomer: null,
  setCustomers: customers => set({ customers }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setMessage: (message, messageType) => {
    set({ message, messageType });
    if (messageType) {
      setTimeout(() => set({ message: '', messageType: '' }), 5000);
    }
  },
  setSearchTerm: searchTerm => set({ searchTerm }),
  setEditingCustomer: editingCustomer => set({ editingCustomer }),
  removeCustomer: id =>
    set(state => ({
      customers: state.customers.filter(c => c._id !== id),
    })),
  updateCustomer: customer =>
    set(state => ({
      customers: state.customers.map(c => (c._id === customer._id ? customer : c)),
    })),
}));
