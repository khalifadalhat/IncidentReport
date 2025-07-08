import { create } from 'zustand';
import { ICase } from '../../Types/Icase';

interface PendingCasesState {
  pendingCases: ICase[];
  loading: boolean;
  error: string | null;
  setPendingCases: (cases: ICase[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePendingCasesStore = create<PendingCasesState>(set => ({
  pendingCases: [],
  loading: false,
  error: null,
  setPendingCases: pendingCases => set({ pendingCases }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));
