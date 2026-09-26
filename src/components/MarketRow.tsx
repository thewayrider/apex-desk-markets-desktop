import { useEffect, useState } from 'react';
import { useMarketStore } from '../store/marketStore';

interface MarketRowProps {
  id: string;
}

export function MarketRow({ id }: MarketRowProps) {
  const data = useMarketStore(state => state.data[id]);
  const [flashClass, setFlashClass] = useState('');

  useEffect(() => {
    if (!data) return;
    
    // Trigger flash animation based on positive or negative tick
    const flash = data.isPositive ? 'flash-positive' : 'flash-negative';
    setFlashClass(flash);
    
    // Remove class after animation completes (300ms)
    const timer = setTimeout(() => {
      setFlashClass('');
    }, 300);
    
    return () => clearTimeout(timer);
  }, [data?.lastUpdated, data?.isPositive]);

  if (!data) return null; // Wait for initial data

  // Calculate change percent safely
  const prevPrice = data.price - data.change;
  const changePercent = prevPrice !== 0 ? (data.change / prevPrice) * 100 : 0;
  
  // Create an indicator icon (arrow up or down)
  const isUp = data.isPositive;
  const arrow = isUp ? '↑' : '↓';

  return (
    <div className={`flex items-center justify-between py-[1px] px-1 transition-colors ${flashClass}`}>
      <span className="text-[12px] font-medium text-white/95 w-[42%] truncate">{data.label}</span>
      
      <div className="flex items-center justify-end space-x-2 w-[58%] text-[12px] font-mono tracking-tight">
        <span className="text-white/80 tabular-nums w-[35%] text-right">{data.price.toFixed(2)}</span>
        
        <span className={`w-[8px] text-center font-bold ${isUp ? 'text-positive' : 'text-negative'}`}>
           {arrow}
        </span>

        <span className={`tabular-nums w-[25%] text-right font-medium ${isUp ? 'text-positive' : 'text-negative'}`}>
          {isUp ? '+' : ''}{data.change.toFixed(2)}
        </span>
        
        <span className={`tabular-nums w-[32%] text-right font-medium ${isUp ? 'text-positive' : 'text-negative'}`}>
          ({isUp ? '+' : ''}{changePercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
