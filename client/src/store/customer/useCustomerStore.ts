import { create } from 'zustand';

interface CustomerState {
  customer: {
    fullname: string;
    email: string;
    phone: string;
    location: string;
    _id: string;
  };
  selectedDepartment: string | null;
  problemDescription: string;
  caseId: string | null;
  setCustomer: (customer: Partial<CustomerState['customer']>) => void;
  setSelectedDepartment: (department: string) => void;
  setProblemDescription: (description: string) => void;
  setCaseId: (id: string) => void;
  reset: () => void;
}

export const useCustomerStore = create<CustomerState>(set => ({
  customer: {
    _id: '',
    fullname: '',
    email: '',
    phone: '',
    location: '',
  },
  selectedDepartment: null,
  problemDescription: '',
  caseId: null,
  setCustomer: customer =>
    set(state => ({
      customer: { ...state.customer, ...customer },
    })),
  setSelectedDepartment: department => set({ selectedDepartment: department }),
  setProblemDescription: description => set({ problemDescription: description }),
  setCaseId: id => set({ caseId: id }),
  reset: () =>
    set({
      customer: { fullname: '', email: '', phone: '', location: '', _id: '' },
      selectedDepartment: null,
      problemDescription: '',
      caseId: null,
    }),
}));
