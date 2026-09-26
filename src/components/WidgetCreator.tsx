import { useState, useEffect } from 'react';
import { useConfigStore, AssetCategory } from '../store/configStore';

interface WidgetCreatorProps {
  onClose: () => void;
  position: { x: number; y: number };
  editWidgetId?: string;
}

export function WidgetCreator({ onClose, position, editWidgetId }: WidgetCreatorProps) {
  const { widgets, addWidget, updateWidget } = useConfigStore();
  
  // Find widget if editing
  const existingWidget = editWidgetId ? widgets.find(w => w.id === editWidgetId) : undefined;

  const [title, setTitle] = useState(existingWidget?.title || '');
  const [category, setCategory] = useState<AssetCategory>(existingWidget?.category || 'Stocks');
  const [tickersInput, setTickersInput] = useState(existingWidget?.tickers.join(', ') || '');
  
  const categories: AssetCategory[] = ['Stocks', 'Funds', 'Futures', 'Forex', 'Crypto', 'Indices', 'Bonds', 'Economy', 'Options'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !tickersInput.trim()) return;

    const tickers = tickersInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    
    if (existingWidget) {
      // Update existing
      updateWidget(existingWidget.id, {
        title: title.trim(),
        category,
        tickers
      });
    } else {
      // Create new
      addWidget({
        id: `widget-${Date.now()}`,
        title: title.trim(),
        category,
        defaultPosition: position, // Spawn it where the user right-clicked
        tickers
      });
    }

    onClose();
  };

  const isEditing = !!existingWidget;

  return (
    <div className="absolute z-50 widget-glass shadow-2xl border border-white/20 p-4 w-[360px]" style={{ left: position.x, top: position.y }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-white tracking-wide">
          {isEditing ? 'Edit Widget' : 'Create New Widget'}
        </h2>
        <button onClick={onClose} className="text-white/50 hover:text-white">&times;</button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-[11px] text-white/70 mb-1">WIDGET TITLE</label>
          <input 
            type="text"
            className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
            placeholder="e.g. My Favorite Crypto"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-[11px] text-white/70 mb-1">CATEGORY</label>
          <select 
            className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30"
            value={category}
            onChange={e => setCategory(e.target.value as AssetCategory)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Tickers */}
        <div className="flex flex-col">
          <label className="text-[11px] text-white/70 mb-1">TICKERS (Comma separated)</label>
          <textarea 
            className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-white/30 resize-none h-[60px]"
            placeholder="btc, eth, sol"
            value={tickersInput}
            onChange={e => setTickersInput(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className={`mt-2 py-1.5 rounded font-medium text-sm transition-colors
            ${title && tickersInput ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
          disabled={!title || !tickersInput}
        >
          {isEditing ? 'Save Changes' : 'Create Widget'}
        </button>
      </form>
    </div>
  );
}
