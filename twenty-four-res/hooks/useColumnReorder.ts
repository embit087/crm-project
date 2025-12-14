"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface ColumnConfig {
  key: string;
  label: string;
  icon: React.ReactNode | null;
}

export function useColumnReorder<T extends ColumnConfig>(
  initialColumns: T[],
  storageKey?: string
) {
  // Always start with initialColumns to avoid hydration mismatch
  const [columns, setColumns] = useState<T[]>(initialColumns);

  // Load saved order from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const savedOrder = JSON.parse(saved);
          // Validate that saved order contains all column keys
          const initialKeys = initialColumns.map((col) => col.key);
          if (
            Array.isArray(savedOrder) &&
            savedOrder.length === initialKeys.length &&
            initialKeys.every((key) => savedOrder.includes(key))
          ) {
            // Reorder columns based on saved order
            const reorderedColumns = savedOrder
              .map((key) => initialColumns.find((col) => col.key === key))
              .filter((col): col is T => col !== undefined);
            setColumns(reorderedColumns);
          }
        } catch (e) {
          // Invalid saved data, use default order
        }
      }
    }
  }, [initialColumns, storageKey]);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const dragStartIndex = useRef<number>(-1);

  // Save order to localStorage when it changes
  const saveOrder = useCallback(
    (newColumns: T[]) => {
      if (storageKey && typeof window !== "undefined") {
        const order = newColumns.map((col) => col.key);
        localStorage.setItem(storageKey, JSON.stringify(order));
      }
    },
    [storageKey]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, columnKey: string) => {
      setDraggedColumn(columnKey);
      dragStartIndex.current = columns.findIndex((col) => col.key === columnKey);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", columnKey);
      // Add visual feedback
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = "0.5";
      }
    },
    [columns]
  );

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedColumn(null);
    setDragOverColumn(null);
    dragStartIndex.current = -1;
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, columnKey: string) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "move";

      if (draggedColumn && draggedColumn !== columnKey) {
        setDragOverColumn(columnKey);
      }
    },
    [draggedColumn]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetColumnKey: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedColumn || draggedColumn === targetColumnKey) {
        setDraggedColumn(null);
        setDragOverColumn(null);
        return;
      }

      const sourceIndex = dragStartIndex.current;
      const targetIndex = columns.findIndex((col) => col.key === targetColumnKey);

      if (sourceIndex === -1 || targetIndex === -1) {
        setDraggedColumn(null);
        setDragOverColumn(null);
        return;
      }

      // Reorder columns
      const newColumns = [...columns];
      const [removed] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(targetIndex, 0, removed);

      setColumns(newColumns);
      saveOrder(newColumns);
      setDraggedColumn(null);
      setDragOverColumn(null);
    },
    [draggedColumn, columns, saveOrder]
  );

  return {
    columns,
    draggedColumn,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
