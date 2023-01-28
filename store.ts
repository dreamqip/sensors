import { create } from 'zustand';

export interface ButchesStore {
  butchesCount: number;
  butchesTupleArray: [number, number, number, number][][];
  increment: () => void;
  reset: () => void;
}

// export const butchTupleArray: [Butch, Butch, Butch, Butch, Butch] | [] = [];

export const useButchesStore = create<ButchesStore>((set) => ({
  butchesCount: 0,
  butchesTupleArray: [],
  increment: () => set((state) => ({ butchesCount: state.butchesCount + 1 })),
  reset: () => set({ butchesCount: 0 }),
}));