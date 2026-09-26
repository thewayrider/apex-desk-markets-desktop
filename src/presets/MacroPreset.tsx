import { useEffect, useRef } from "react";
import { Widget } from "../components/Widget";
import { MarketRow } from "../components/MarketRow";
import { MockDataService } from "../services/MockDataService";
import { useConfigStore } from "../store/configStore";

interface MacroPresetProps {
  isEditMode: boolean;
}

// We expand the mock data to include the new European Tech Stocks
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
  
  // European Tech Stocks (New)
  { id: "asml", label: "ASML Holding", price: 872.40, change: 12.50, isPositive: true, lastUpdated: 0 },
  { id: "sap", label: "SAP SE", price: 174.20, change: -1.20, isPositive: false, lastUpdated: 0 },
  { id: "infy", label: "Infineon Tech", price: 34.80, change: 0.45, isPositive: true, lastUpdated: 0 },
  { id: "stm", label: "STMicroelectronics", price: 39.55, change: -0.15, isPositive: false, lastUpdated: 0 },
  { id: "lseg", label: "LSEG PLC", price: 9240.00, change: 45.00, isPositive: true, lastUpdated: 0 }
];

export function MacroPreset({ isEditMode }: MacroPresetProps) {
  const serviceRef = useRef<MockDataService | null>(null);
  
  // Subscribe to the configuration store
  const { widgets, removeWidget } = useConfigStore();

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
      {widgets.map((widgetConfig) => (
        <Widget 
          key={widgetConfig.id}
          id={widgetConfig.id}
          title={widgetConfig.title} 
          isEditMode={isEditMode} 
          defaultPosition={widgetConfig.defaultPosition}
          onRemove={() => removeWidget(widgetConfig.id)}
        >
          <ListHeader />
          {widgetConfig.tickers.map(tickerId => (
             <MarketRow key={tickerId} id={tickerId} />
          ))}
        </Widget>
      ))}
    </div>
  );
}
