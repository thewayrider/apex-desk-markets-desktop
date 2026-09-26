import { useEffect, useRef } from "react";
import { Widget } from "../components/Widget";
import { MarketRow } from "../components/MarketRow";
import { MockDataService } from "../services/MockDataService";

interface MacroPresetProps {
  isEditMode: boolean;
}

const INITIAL_MARKET_DATA = [
  // Yields
  { id: "us30y", label: "US Treasury 30Y", price: 4.521, change: 0.04, isPositive: true, lastUpdated: 0 },
  { id: "jp30y", label: "Japan JGB 30Y", price: 1.849, change: -0.01, isPositive: false, lastUpdated: 0 },
  { id: "uk30y", label: "UK Gilt 30Y", price: 4.766, change: 0.01, isPositive: true, lastUpdated: 0 },
  { id: "ge30y", label: "German Bund 30Y", price: 2.645, change: -0.02, isPositive: false, lastUpdated: 0 },
  { id: "it30y", label: "Italian BTP 30Y", price: 4.965, change: 0.02, isPositive: true, lastUpdated: 0 },
  
  // Commods
  { id: "brent", label: "ICE Brent Crude", price: 97.26, change: 1.52, isPositive: true, lastUpdated: 0 },
  { id: "wti", label: "WTI Crude Oil", price: 94.50, change: 1.64, isPositive: true, lastUpdated: 0 },
  { id: "natgas", label: "Natural Gas", price: 2.804, change: 0.004, isPositive: true, lastUpdated: 0 },
  { id: "gold", label: "Comex Gold", price: 2354.50, change: -20.40, isPositive: false, lastUpdated: 0 },
  { id: "copper", label: "Copper", price: 4.125, change: 0.06, isPositive: true, lastUpdated: 0 },

  // Indices
  { id: "sp500", label: "S&P 500", price: 5248.83, change: 44.20, isPositive: true, lastUpdated: 0 },
  { id: "ndx", label: "NASDAQ Composite", price: 16399.50, change: 149.50, isPositive: true, lastUpdated: 0 },
  { id: "n225", label: "Nikkei 225", price: 39521.28, change: -188.70, isPositive: false, lastUpdated: 0 },
  { id: "ftse", label: "FTSE 100", price: 7942.80, change: 14.83, isPositive: true, lastUpdated: 0 },
  { id: "vix", label: "VIX Volatility", price: 14.64, change: -0.23, isPositive: false, lastUpdated: 0 },

  // FX
  { id: "usdjpy", label: "USD / JPY", price: 151.72, change: 0.14, isPositive: true, lastUpdated: 0 },
  { id: "eurusd", label: "EUR / USD", price: 1.0841, change: -0.0012, isPositive: false, lastUpdated: 0 },
  { id: "gbpusd", label: "GBP / USD", price: 1.2637, change: -0.0025, isPositive: false, lastUpdated: 0 },
  { id: "audusd", label: "AUD / USD", price: 0.6521, change: 0.0011, isPositive: true, lastUpdated: 0 },
  { id: "usdchf", label: "USD / CHF", price: 0.9012, change: 0.0040, isPositive: true, lastUpdated: 0 },
];

export function MacroPreset({ isEditMode }: MacroPresetProps) {
  const serviceRef = useRef<MockDataService | null>(null);

  useEffect(() => {
    // Start WebSocket simulator when dashboard mounts
    if (!serviceRef.current) {
      serviceRef.current = new MockDataService(INITIAL_MARKET_DATA);
      serviceRef.current.start();
    }
    
    return () => {
      // Clean up simulator on unmount
      if (serviceRef.current) {
        serviceRef.current.stop();
        serviceRef.current = null;
      }
    };
  }, []);

  const ListHeader = () => (
    <div className="flex items-center justify-between pb-1 border-b border-white/20 mb-1 px-1">
      <span className="text-[10px] font-semibold text-white/50 tracking-wider w-[42%]">INDEX / INSTRUMENT</span>
      <div className="flex items-center justify-end space-x-2 w-[58%] text-[10px] font-semibold text-white/50 tracking-wider">
        <span className="w-[35%] text-right">PRICE</span>
        <span className="w-[8px]"></span>
        <span className="w-[25%] text-right">CHG</span>
        <span className="w-[32%] text-right">CHG%</span>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full relative">
      
      {/* Widget 1: Yield Spreads */}
      <Widget 
        id="widget-yields"
        title="Sovereign Yields (30Y)" 
        isEditMode={isEditMode} 
        defaultPosition={{ x: 20, y: 20 }}
      >
        <ListHeader />
        <MarketRow id="us30y" />
        <MarketRow id="jp30y" />
        <MarketRow id="uk30y" />
        <MarketRow id="ge30y" />
        <MarketRow id="it30y" />
      </Widget>

      {/* Widget 2: Energy & Commodities */}
      <Widget 
        id="widget-energy"
        title="Energy / Commods" 
        isEditMode={isEditMode} 
        defaultPosition={{ x: 20, y: 200 }}
      >
        <ListHeader />
        <MarketRow id="brent" />
        <MarketRow id="wti" />
        <MarketRow id="natgas" />
        <MarketRow id="gold" />
        <MarketRow id="copper" />
      </Widget>

      {/* Widget 3: Key Indices */}
      <Widget 
        id="widget-indices"
        title="Global Indices" 
        isEditMode={isEditMode} 
        defaultPosition={{ x: 400, y: 20 }}
      >
        <ListHeader />
        <MarketRow id="sp500" />
        <MarketRow id="ndx" />
        <MarketRow id="n225" />
        <MarketRow id="ftse" />
        <MarketRow id="vix" />
      </Widget>

      {/* Widget 4: Currencies */}
      <Widget 
        id="widget-fx"
        title="FX Majors" 
        isEditMode={isEditMode} 
        defaultPosition={{ x: 400, y: 200 }}
      >
        <ListHeader />
        <MarketRow id="usdjpy" />
        <MarketRow id="eurusd" />
        <MarketRow id="gbpusd" />
        <MarketRow id="audusd" />
        <MarketRow id="usdchf" />
      </Widget>
      
    </div>
  );
}
