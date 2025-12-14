"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { CallFabIcon } from "@/components/icons";

interface CallFabProps {
  onClick?: () => void;
}

export function CallFab({ onClick }: CallFabProps) {
  const [position, setPosition] = useState({ x: 32, y: 32 });
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        hasMovedRef.current = true;
        const newX = window.innerWidth - e.clientX - 60;
        const newY = window.innerHeight - e.clientY - 28;
        setPosition({
          x: Math.max(16, Math.min(window.innerWidth - 180, newX)),
          y: Math.max(16, Math.min(window.innerHeight - 80, newY)),
        });
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    hasMovedRef.current = false;
    isDraggingRef.current = true;
  }, []);

  const handleClick = useCallback(() => {
    // Only trigger onClick if we didn't drag
    if (!hasMovedRef.current && onClick) {
      onClick();
    }
    hasMovedRef.current = false;
  }, [onClick]);

  return (
    <button
      className="call-fab"
      style={{
        right: position.x,
        bottom: position.y,
        cursor: "pointer",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <CallFabIcon />
      <span className="call-fab-label">Call</span>
    </button>
  );
}
