import { useState, MouseEvent } from "react";
import { MacroPreset } from "./presets/MacroPreset";
import { WidgetCreator } from "./components/WidgetCreator";
import "./App.css";

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [creatorPosition, setCreatorPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault(); // Prevent standard Windows context menu
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCreateNew = () => {
    if (contextMenu) {
      setCreatorPosition(contextMenu);
      setContextMenu(null);
    }
  };

  return (
    <main 
      className="w-screen h-screen relative select-none"
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)} // Click anywhere to close context menu
    >
      {/* Background layer for Edit Mode */}
      {isEditMode && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0 pointer-events-none transition-all duration-300" />
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full h-full p-4 flex flex-col">
        {/* Top Navigation / Controls */}
        <div className="flex justify-end mb-4 pointer-events-auto">
          <button
            onClick={() => {
              setIsEditMode(!isEditMode);
              setContextMenu(null);
              setCreatorPosition(null);
            }}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm
              ${isEditMode 
                ? 'bg-rose-500/80 text-white hover:bg-rose-500 border border-rose-400' 
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'}
            `}
          >
            {isEditMode ? 'Done Editing' : 'Customize'}
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="flex-grow">
          <MacroPreset isEditMode={isEditMode} />
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="absolute z-50 bg-black/80 backdrop-blur-md border border-white/10 rounded overflow-hidden shadow-2xl flex flex-col w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button 
            className="px-4 py-2 text-left text-sm text-white/90 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/5"
            onClick={handleCreateNew}
          >
            + Create New Widget
          </button>
        </div>
      )}

      {/* Widget Creator Modal */}
      {creatorPosition && (
        <WidgetCreator 
          position={creatorPosition} 
          onClose={() => setCreatorPosition(null)} 
        />
      )}
      
    </main>
  );
}

export default App;
