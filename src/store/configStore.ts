import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AssetCategory = 'Stocks' | 'Funds' | 'Futures' | 'Forex' | 'Crypto' | 'Indices' | 'Bonds' | 'Economy' | 'Options';

export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  Stocks: 'border-blue-500/50 shadow-blue-500/20',
  Funds: 'border-indigo-500/50 shadow-indigo-500/20',
  Futures: 'border-orange-500/50 shadow-orange-500/20',
  Forex: 'border-green-500/50 shadow-green-500/20',
  Crypto: 'border-yellow-500/50 shadow-yellow-500/20',
  Indices: 'border-purple-500/50 shadow-purple-500/20',
  Bonds: 'border-slate-400/50 shadow-slate-400/20',
  Economy: 'border-teal-500/50 shadow-teal-500/20',
  Options: 'border-pink-500/50 shadow-pink-500/20'
};

export interface WidgetConfig {
  id: string;
  title: string;
  category: AssetCategory;
  defaultPosition: { x: number; y: number };
  tickers: string[];
}

interface ConfigState {
  widgets: WidgetConfig[];
  addWidget: (widget: WidgetConfig) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  updateWidgetTickers: (id: string, tickers: string[]) => void;
}

// Initial default configuration representing the "Macro Preset"
const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: "widget-yields",
    title: "Sovereign Yields (30Y)",
    category: "Bonds",
    defaultPosition: { x: 20, y: 20 },
    tickers: ["us30y", "jp30y", "uk30y", "ge30y", "it30y"]
  },
  {
    id: "widget-energy",
    title: "Energy / Commods",
    category: "Futures",
    defaultPosition: { x: 20, y: 200 },
    tickers: ["brent", "wti", "natgas", "gold", "copper"]
  },
  {
    id: "widget-indices",
    title: "Global Indices",
    category: "Indices",
    defaultPosition: { x: 400, y: 20 },
    tickers: ["sp500", "ndx", "n225", "ftse", "vix"]
  },
  {
    id: "widget-fx",
    title: "FX Majors",
    category: "Forex",
    defaultPosition: { x: 400, y: 200 },
    tickers: ["usdjpy", "eurusd", "gbpusd", "audusd", "usdchf"]
  },
  {
    id: "widget-eu-tech",
    title: "Main European Tech Stocks",
    category: "Stocks",
    defaultPosition: { x: 780, y: 20 },
    tickers: ["asml", "sap", "infy", "stm", "lseg"]
  }
];

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      widgets: DEFAULT_WIDGETS,
      
      addWidget: (widget) => set((state) => ({
        widgets: [...state.widgets, widget]
      })),
      
      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter(w => w.id !== id)
      })),
      
      updateWidget: (id, updates) => set((state) => ({
        widgets: state.widgets.map(w => 
          w.id === id ? { ...w, ...updates } : w
        )
      })),
      
      updateWidgetTickers: (id, tickers) => set((state) => ({
        widgets: state.widgets.map(w => 
          w.id === id ? { ...w, tickers } : w
        )
      })),
    }),
    {
      name: 'apex-desk-widget-config-v2', // Changed key to force reset to new defaults with categories
    }
  )
);
