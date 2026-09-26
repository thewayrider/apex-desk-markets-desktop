import { ReactNode, useRef } from "react";
import Draggable from "react-draggable";
import { useLayoutStore } from "../store/layoutStore";

interface WidgetProps {
  id: string;
  title: string;
  children: ReactNode;
  isEditMode?: boolean;
  onRemove?: () => void;
  defaultPosition?: { x: number, y: number };
}

export function Widget({ id, title, children, isEditMode, onRemove, defaultPosition = { x: 0, y: 0 } }: WidgetProps) {
  const { positions, updatePosition } = useLayoutStore();
  const nodeRef = useRef(null); // required for Draggable in strict mode

  const position = positions[id] || defaultPosition;

  const handleDragStop = (_e: any, data: { x: number, y: number }) => {
    updatePosition(id, { x: data.x, y: data.y });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      position={position}
      onStop={handleDragStop}
      bounds="parent" // Keeps it inside the screen bounds
    >
      <div ref={nodeRef} className="widget-glass flex flex-col absolute w-[340px] shadow-2xl border-white/10" style={{ zIndex: 10 }}>
        {/* Header - The Drag Handle */}
        <div className="drag-handle cursor-move flex items-center justify-between px-2 py-1 bg-black/60 border-b border-white/10">
          <h3 className="text-[13px] font-bold text-white/90 tracking-wide font-sans">{title}</h3>
          
          {isEditMode && onRemove && (
            <button 
              onClick={(e) => {
                e.stopPropagation(); // prevent drag trigger
                onRemove();
              }}
              className="text-white/40 hover:text-rose-400 transition-colors p-1 -mr-1 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-1.5 flex-grow bg-black/40">
          {children}
        </div>
      </div>
    </Draggable>
  );
}
