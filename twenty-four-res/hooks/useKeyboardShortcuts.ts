"use client";

import { useEffect } from "react";

interface UseKeyboardShortcutsOptions {
  onSearch: () => void;
  onEscape: () => void;
  onNewRecord: () => void;
  isSearchOpen: boolean;
}

export function useKeyboardShortcuts({
  onSearch,
  onEscape,
  onNewRecord,
  isSearchOpen,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key
      if (e.key === "Escape") {
        onEscape();
        return;
      }

      // Don't trigger shortcuts if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      // "/" key for search
      if (e.key === "/" && !isSearchOpen) {
        e.preventDefault();
        onSearch();
        return;
      }

      // Cmd/Ctrl + K for new record
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onNewRecord();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSearch, onEscape, onNewRecord, isSearchOpen]);
}

