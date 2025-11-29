import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CustomerStore {
  selectedDepartment: string | null;
  problemDescription: string;
  currentCaseId: string | null;

  setDepartment: (dept: string) => void;
  setProblem: (desc: string) => void;
  setCaseId: (id: string | null) => void;
  reset: () => void;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      selectedDepartment: null,
      problemDescription: "",
      currentCaseId: null,

      setDepartment: (dept) => set({ selectedDepartment: dept }),
      setProblem: (desc) => set({ problemDescription: desc }),
      setCaseId: (id) => set({ currentCaseId: id }),
      reset: () =>
        set({
          selectedDepartment: null,
          problemDescription: "",
          currentCaseId: null,
        }),
    }),
    { name: "customer-flow" }
  )
);
