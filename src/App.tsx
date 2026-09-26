import { useState } from "react";
import { MacroPreset } from "./presets/MacroPreset";
import "./App.css";

function App() {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <main className="w-screen h-screen relative select-none">
      
      {/* Background layer for Edit Mode */}
      {isEditMode && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0 pointer-events-none transition-all duration-300" />
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full h-full p-4 flex flex-col">
        
        {/* Top Navigation / Controls */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
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
      
    </main>
  );
}

export default App;
