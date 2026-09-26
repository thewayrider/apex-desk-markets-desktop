import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Position {
  x: number;
  y: number;
}

interface LayoutState {
  positions: Record<string, Position>;
  updatePosition: (id: string, position: Position) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      positions: {},
      updatePosition: (id, position) => set((state) => ({
        positions: {
          ...state.positions,
          [id]: position
        }
      })),
    }),
    {
      name: 'apex-desk-layout-storage', // Key in localStorage
    }
  )
);
