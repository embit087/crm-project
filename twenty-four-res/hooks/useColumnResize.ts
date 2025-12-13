"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ColumnWidth } from "@/types";

const defaultWidths: ColumnWidth = {
  checkbox: 40,
  name: 200,
  email: 180,
  createdBy: 120,
  company: 150,
  phones: 130,
  domain: 150,
  accountOwner: 130,
  creationDate: 140,
  employees: 100,
  title: 210,
  status: 150,
  relations: 150,
  dueDate: 150,
  assignee: 150,
  body: 150,
};

export function useColumnResize() {
  const [columnWidths, setColumnWidths] = useState<ColumnWidth>(defaultWidths);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const handleColumnResizeStart = useCallback(
    (e: React.MouseEvent, columnKey: string) => {
      e.preventDefault();
      setResizingColumn(columnKey);
      startX.current = e.clientX;
      startWidth.current = columnWidths[columnKey] || defaultWidths[columnKey] || 100;
    },
    [columnWidths]
  );

  const handleColumnResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizingColumn) return;
      const diff = e.clientX - startX.current;
      const newWidth = Math.max(60, startWidth.current + diff);
      setColumnWidths((prev) => ({ ...prev, [resizingColumn]: newWidth }));
    },
    [resizingColumn]
  );

  const handleColumnResizeEnd = useCallback(() => {
    setResizingColumn(null);
  }, []);

  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener("mousemove", handleColumnResizeMove);
      document.addEventListener("mouseup", handleColumnResizeEnd);
      return () => {
        document.removeEventListener("mousemove", handleColumnResizeMove);
        document.removeEventListener("mouseup", handleColumnResizeEnd);
      };
    }
  }, [resizingColumn, handleColumnResizeMove, handleColumnResizeEnd]);

  return {
    columnWidths,
    resizingColumn,
    handleColumnResizeStart,
  };
}

