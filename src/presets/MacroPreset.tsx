import { useEffect, useRef, useMemo } from "react";
import { Widget } from "../components/Widget";
import { MarketRow } from "../components/MarketRow";
import { MarketDataService } from "../services/MarketDataService";
import { useConfigStore } from "../store/configStore";

interface MacroPresetProps {
  isEditMode: boolean;
}

export function MacroPreset({ isEditMode }: MacroPresetProps) {
  const serviceRef = useRef<MarketDataService | null>(null);
  
  // Subscribe to the configuration store
  const { widgets, removeWidget } = useConfigStore();

  // Extract and route tickers based on widget category
  const tickerRouting = useMemo(() => {
    const routeMap = { quotes: new Set<string>(), crypto: new Set<string>() };
    
    widgets.forEach(w => {
      const targetSet = w.category === 'Crypto' ? routeMap.crypto : routeMap.quotes;
      w.tickers.forEach(t => targetSet.add(t));
    });
    
    return {
      quotes: Array.from(routeMap.quotes),
      crypto: Array.from(routeMap.crypto)
    };
  }, [widgets]);

  useEffect(() => {
    // Start data service when dashboard mounts
    if (!serviceRef.current) {
      serviceRef.current = new MarketDataService(tickerRouting);
      serviceRef.current.start();
    } else {
      // Update routing if widgets changed
      serviceRef.current.setRouting(tickerRouting);
    }
    
    return () => {
      // Clean up service on unmount
      if (serviceRef.current) {
        // We only stop on full unmount, not on ticker updates
      }
    };
  }, [tickerRouting]);

  // Handle hard cleanup on unmount
  useEffect(() => {
    return () => {
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
          category={widgetConfig.category}
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
