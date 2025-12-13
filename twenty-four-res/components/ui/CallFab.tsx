"use client";

import { CallFabIcon } from "@/components/icons";
import { useDraggable } from "@/hooks";

export function CallFab() {
  const { position, isDragging, handleMouseDown } = useDraggable({ x: 32, y: 32 });

  return (
    <button
      className={`call-fab ${isDragging ? "dragging" : ""}`}
      style={{
        right: position.x,
        bottom: position.y,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <CallFabIcon />
      <span className="call-fab-label">Call</span>
    </button>
  );
}

