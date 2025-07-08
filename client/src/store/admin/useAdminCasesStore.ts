import { create } from 'zustand';
import { ICase } from '../../Types/Icase';

interface AdminCasesState {
  activeCases: ICase[];
  pendingCases: ICase[];
  closedCases: ICase[];
  stats: {
    active: number;
    pending: number;
    resolved: number;
    total: number;
  };
  loading: boolean;
  error: string | null;
  setActiveCases: (cases: ICase[]) => void;
  setPendingCases: (cases: ICase[]) => void;
  setClosedCases: (cases: ICase[]) => void;
  setStats: (stats: { active: number; pending: number; resolved: number; total: number }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAdminCasesStore = create<AdminCasesState>(set => ({
  activeCases: [],
  pendingCases: [],
  closedCases: [],
  stats: {
    active: 0,
    pending: 0,
    resolved: 0,
    total: 0,
  },
  loading: false,
  error: null,
  setActiveCases: activeCases => set({ activeCases }),
  setPendingCases: pendingCases => set({ pendingCases }),
  setClosedCases: closedCases => set({ closedCases }),
  setStats: stats => set({ stats }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));
