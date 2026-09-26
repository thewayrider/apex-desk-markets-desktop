import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WidgetConfig {
  id: string;
  title: string;
  defaultPosition: { x: number; y: number };
  tickers: string[];
}

interface ConfigState {
  widgets: WidgetConfig[];
  addWidget: (widget: WidgetConfig) => void;
  removeWidget: (id: string) => void;
  updateWidgetTickers: (id: string, tickers: string[]) => void;
}

// Initial default configuration representing the "Macro Preset"
const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: "widget-yields",
    title: "Sovereign Yields (30Y)",
    defaultPosition: { x: 20, y: 20 },
    tickers: ["us30y", "jp30y", "uk30y", "ge30y", "it30y"]
  },
  {
    id: "widget-energy",
    title: "Energy / Commods",
    defaultPosition: { x: 20, y: 200 },
    tickers: ["brent", "wti", "natgas", "gold", "copper"]
  },
  {
    id: "widget-indices",
    title: "Global Indices",
    defaultPosition: { x: 400, y: 20 },
    tickers: ["sp500", "ndx", "n225", "ftse", "vix"]
  },
  {
    id: "widget-fx",
    title: "FX Majors",
    defaultPosition: { x: 400, y: 200 },
    tickers: ["usdjpy", "eurusd", "gbpusd", "audusd", "usdchf"]
  },
  {
    id: "widget-eu-tech",
    title: "Main European Tech Stocks",
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
      
      updateWidgetTickers: (id, tickers) => set((state) => ({
        widgets: state.widgets.map(w => 
          w.id === id ? { ...w, tickers } : w
        )
      })),
    }),
    {
      name: 'apex-desk-widget-config', // Persist config to localStorage
    }
  )
);
