"use client";

import { useState } from "react";
import { MenuIcon, ChevronDownIcon } from "@/components/icons";
import { FilterDropdown } from "@/components/overlays/FilterDropdown";

interface ToolbarProps {
  title: string;
  count: number;
  onFilterClick?: () => void;
}

export function Toolbar({ title, count }: ToolbarProps) {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border">
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-sidebar-hover transition-colors">
          <MenuIcon />
          <span className="font-medium text-text-primary">{title}</span>
          <span className="text-text-muted">· {count}</span>
          <ChevronDownIcon />
        </button>
      </div>
      <div className="flex items-center gap-1 relative">
        <button
          className="px-3 py-1 text-sm text-text-secondary hover:text-text-primary rounded hover:bg-sidebar-hover transition-colors"
          onClick={() => setShowFilter(!showFilter)}
        >
          Filter
        </button>
        <button className="px-3 py-1 text-sm text-text-secondary hover:text-text-primary rounded hover:bg-sidebar-hover transition-colors">
          Sort
        </button>
        <button className="px-3 py-1 text-sm text-text-secondary hover:text-text-primary rounded hover:bg-sidebar-hover transition-colors">
          Options
        </button>
        {showFilter && <FilterDropdown onClose={() => setShowFilter(false)} />}
      </div>
    </div>
  );
}

