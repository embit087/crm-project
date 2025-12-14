"use client";

import { PlusIcon, TrashIcon, XIcon, StarIcon, StarFilledIcon } from "@/components/icons";
import type { ActiveNav, Note } from "@/types";

interface HeaderProps {
  activeNav: ActiveNav;
  selectedRows: Set<string>;
  selectedNote: Note | null;
  favoriteNotes: Set<string>;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onNewRecord: () => void;
  onToggleFavorite: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onCloseNote: () => void;
}

export function Header({
  activeNav,
  selectedRows,
  selectedNote,
  favoriteNotes,
  onClearSelection,
  onDeleteSelected,
  onNewRecord,
  onToggleFavorite,
  onDeleteNote,
  onCloseNote,
}: HeaderProps) {
  const hasSelection = selectedRows.size > 0;

  // Note detail header
  if (activeNav === "notes" && selectedNote) {
    const isFavorite = favoriteNotes.has(selectedNote.id);
    return (
      <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-table-bg">
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded hover:bg-sidebar-hover text-text-muted hover:text-text-primary transition-colors"
            onClick={onCloseNote}
          >
            <XIcon />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            className={`p-1.5 rounded hover:bg-sidebar-hover transition-colors ${isFavorite ? "text-yellow-400" : "text-text-muted hover:text-text-primary"}`}
            onClick={() => onToggleFavorite(selectedNote.id)}
          >
            {isFavorite ? <StarFilledIcon /> : <StarIcon />}
          </button>
          <button
            className="p-1.5 rounded hover:bg-sidebar-hover text-text-muted hover:text-red-400 transition-colors"
            onClick={() => onDeleteNote(selectedNote.id)}
          >
            <TrashIcon />
          </button>
        </div>
      </header>
    );
  }

  // Selection header
  if (hasSelection) {
    return (
      <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-accent-blue/10">
        <div className="flex items-center gap-3">
          <span className="text-text-primary font-medium">
            {selectedRows.size} selected
          </span>
          <button
            className="text-text-muted hover:text-text-primary text-sm"
            onClick={onClearSelection}
          >
            Clear
          </button>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
          onClick={onDeleteSelected}
        >
          <TrashIcon />
          Delete
        </button>
      </header>
    );
  }

  // Default header
  return (
    <header className="h-12 border-b border-border flex items-center justify-end px-4 bg-table-bg">
      <div className="flex items-center gap-2">
        <button className="btn-primary" onClick={onNewRecord}>
          <PlusIcon />
          <span>New record</span>
        </button>
      </div>
    </header>
  );
}


