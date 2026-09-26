import { create } from 'zustand';

export interface MarketData {
  id: string;
  label: string;
  price: number;
  change: number;
  isPositive: boolean;
  lastUpdated: number; // Used to trigger CSS animations
}

interface MarketState {
  data: Record<string, MarketData>;
  updateMarketData: (updates: MarketData[]) => void;
  initializeData: (initialData: MarketData[]) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  data: {},
  
  initializeData: (initialData) => set((state) => {
    const newData = { ...state.data };
    initialData.forEach(item => {
      newData[item.id] = item;
    });
    return { data: newData };
  }),

  updateMarketData: (updates) => set((state) => {
    const newData = { ...state.data };
    updates.forEach(update => {
      newData[update.id] = { ...newData[update.id], ...update };
    });
    return { data: newData };
  })
}));
