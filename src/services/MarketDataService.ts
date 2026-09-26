import { useMarketStore } from '../store/marketStore';

const POLL_INTERVAL_MS = 15000; // 15 seconds for Free Tier REST polling

export type TickerRoutingMap = {
  quotes: string[];
  crypto: string[];
};

export class MarketDataService {
  private timerId: number | null = null;
  private isRunning = false;
  private proxyUrlQuotes = 'http://localhost:3000/api/quotes';
  private proxyUrlCrypto = 'http://localhost:3000/api/crypto';
  private routingMap: TickerRoutingMap = { quotes: [], crypto: [] };

  constructor(initialRouting: TickerRoutingMap) {
    this.routingMap = initialRouting;
  }

  setRouting(routing: TickerRoutingMap) {
    this.routingMap = routing;
    // Fetch immediately when routing changes
    if (this.isRunning) {
      this.fetchData();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    // Fetch immediately on start
    this.fetchData();

    // Then poll
    this.timerId = window.setInterval(() => {
      this.fetchData();
    }, POLL_INTERVAL_MS);
  }

  stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isRunning = false;
  }

  private async fetchData() {
    const fetchPromises = [];

    // Fetch traditional quotes (CNBC)
    if (this.routingMap.quotes.length > 0) {
      const symbolsParam = this.routingMap.quotes.join(',');
      fetchPromises.push(
        fetch(`${this.proxyUrlQuotes}?symbols=${encodeURIComponent(symbolsParam)}`)
          .then(res => res.json())
          .catch(err => {
            console.error("Error fetching standard quotes:", err);
            return null;
          })
      );
    }

    // Fetch crypto quotes (Binance)
    if (this.routingMap.crypto.length > 0) {
      const symbolsParam = this.routingMap.crypto.join(',');
      fetchPromises.push(
        fetch(`${this.proxyUrlCrypto}?symbols=${encodeURIComponent(symbolsParam)}`)
          .then(res => res.json())
          .catch(err => {
            console.error("Error fetching crypto quotes:", err);
            return null;
          })
      );
    }

    if (fetchPromises.length === 0) return;

    try {
      const results = await Promise.all(fetchPromises);
      const combinedData: any[] = [];
      
      results.forEach(result => {
        if (result && result.status === 'success' && result.data) {
          combinedData.push(...result.data);
        }
      });

      if (combinedData.length > 0) {
        useMarketStore.getState().updateMarketData(combinedData);
      }
    } catch (error) {
      console.error("Error aggregating market data from proxy:", error);
    }
  }
}
