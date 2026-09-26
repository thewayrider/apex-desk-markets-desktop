import { useMarketStore, MarketData } from '../store/marketStore';

const MOCK_INTERVAL_MS = 500;

export class MockDataService {
  private timerId: number | null = null;
  private isRunning = false;

  constructor(initialData: MarketData[]) {
    // Initialize store
    useMarketStore.getState().initializeData(initialData);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    this.timerId = window.setInterval(() => {
      this.tick();
    }, MOCK_INTERVAL_MS);
  }

  stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isRunning = false;
  }

  private tick() {
    const storeData = useMarketStore.getState().data;
    const updates: MarketData[] = [];

    // Randomly update 20% of the active markets on each tick to simulate realistic flow
    const keys = Object.keys(storeData);
    keys.forEach(key => {
      if (Math.random() > 0.8) {
        const item = storeData[key];
        
        // Random fluctuation between -0.1% and +0.1%
        const fluctuationPercent = (Math.random() - 0.5) * 0.002; 
        const changeAmount = item.price * fluctuationPercent;
        
        const newPrice = Number((item.price + changeAmount).toFixed(4));
        const newChange = Number((item.change + changeAmount).toFixed(4));
        const isPositive = newChange >= 0;

        updates.push({
          ...item,
          price: newPrice,
          change: newChange,
          isPositive,
          lastUpdated: Date.now()
        });
      }
    });

    if (updates.length > 0) {
      useMarketStore.getState().updateMarketData(updates);
    }
  }
}
