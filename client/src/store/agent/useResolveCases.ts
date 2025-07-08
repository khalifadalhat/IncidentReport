import { create } from 'zustand';
import { ICase } from '../../Types/Icase';

interface ResolvedCasesState {
  resolvedCases: ICase[];
  loading: boolean;
  error: string | null;
  setResolvedCases: (cases: ICase[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useResolvedCasesStore = create<ResolvedCasesState>(set => ({
  resolvedCases: [],
  loading: false,
  error: null,
  setResolvedCases: resolvedCases => set({ resolvedCases }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));
