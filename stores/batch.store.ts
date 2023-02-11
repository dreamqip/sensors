import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type SensorReading = [number, 0 | 1 | 2, number, number, number];

export interface BatchesStore {
  count: number;
  batchArray: SensorReading[];
  increment: () => void;
  updateBatchArray: (batch: SensorReading[]) => void;
  reset: () => void;
}

export const useBatchesStore = create(subscribeWithSelector<BatchesStore>((set) => ({
    count: 0,
    batchArray: [],
    increment: () => set((state) => ({ count: state.count + 1 })),
    updateBatchArray: (batch: SensorReading[]) =>
      set(() => ({ batchArray: batch })),
    reset: () => set({ count: 0 }),
  })),
);