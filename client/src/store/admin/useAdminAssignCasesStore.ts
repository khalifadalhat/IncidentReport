import { create } from 'zustand';
import { IAdmin, IAgent } from '../../Types/Icase';

interface AdminAssignCasesState {
  cases: IAdmin[];
  agents: IAgent[];
  loading: boolean;
  error: string | null;
  message: string;
  messageType: 'success' | 'error' | '';
  searchTerm: string;
  selectedCase: IAdmin | null;
  setCases: (cases: IAdmin[]) => void;
  setAgents: (agents: IAgent[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMessage: (message: string, type: 'success' | 'error') => void;
  setSearchTerm: (term: string) => void;
  setSelectedCase: (caseItem: IAdmin | null) => void;
  updateCase: (caseId: string, updates: Partial<IAdmin>) => void;
}

export const useAdminAssignCasesStore = create<AdminAssignCasesState>(set => ({
  cases: [],
  agents: [],
  loading: false,
  error: null,
  message: '',
  messageType: '',
  searchTerm: '',
  selectedCase: null,
  setCases: cases => set({ cases }),
  setAgents: agents => set({ agents }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setMessage: (message, messageType) => {
    set({ message, messageType });
    if (messageType) {
      setTimeout(() => set({ message: '', messageType: '' }), 5000);
    }
  },
  setSearchTerm: searchTerm => set({ searchTerm }),
  setSelectedCase: selectedCase => set({ selectedCase }),
  updateCase: (caseId, updates) =>
    set(state => ({
      cases: state.cases.map(c => (c._id === caseId ? { ...c, ...updates } : c)),
      selectedCase:
        state.selectedCase?._id === caseId
          ? { ...state.selectedCase, ...updates }
          : state.selectedCase,
    })),
}));
