import { create } from 'zustand';
import { ICase } from '../../Types/Icase';

interface AgentCasesState {
  pendingCases: ICase[];
  closedCases: ICase[];
  stats: {
    pending: number;
    resolved: number;
    customers: number;
    satisfaction: number;
  };
  loading: boolean;
  error: string | null;
  setPendingCases: (cases: ICase[]) => void;
  setClosedCases: (cases: ICase[]) => void;
  setStats: (stats: {
    pending: number;
    resolved: number;
    customers: number;
    satisfaction: number;
  }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAgentCasesStore = create<AgentCasesState>(set => ({
  pendingCases: [],
  closedCases: [],
  stats: {
    pending: 0,
    resolved: 0,
    customers: 0,
    satisfaction: 0,
  },
  loading: false,
  error: null,
  setPendingCases: pendingCases => set({ pendingCases }),
  setClosedCases: closedCases => set({ closedCases }),
  setStats: stats => set({ stats }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));
