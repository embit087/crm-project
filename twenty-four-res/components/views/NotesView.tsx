"use client";

import { Toolbar } from "@/components/layout/Toolbar";
import { NotesTable } from "@/components/tables/NotesTable";
import { NoteDetailView } from "@/components/sidebars/NoteDetailView";
import type { Note } from "@/types";

interface NotesViewProps {
  notes: Note[];
  selectedRows: Set<string>;
  selectedNote: Note | null;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onSelectNote: (note: Note | null) => void;
  onAddNote: () => void;
  onTitleChange: (noteId: string, title: string) => void;
  onContentChange: (noteId: string, content: string) => void;
}

export function NotesView({
  notes,
  selectedRows,
  selectedNote,
  onToggleRow,
  onToggleAll,
  onSelectNote,
  onAddNote,
  onTitleChange,
  onContentChange,
}: NotesViewProps) {
  // If a note is selected, show full-screen note editor
  if (selectedNote) {
    return (
      <NoteDetailView
        note={selectedNote}
        onTitleChange={onTitleChange}
        onContentChange={onContentChange}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Toolbar title="All Notes" count={notes.length} />
      <NotesTable
        notes={notes}
        selectedRows={selectedRows}
        onToggleRow={onToggleRow}
        onToggleAll={onToggleAll}
        onSelectNote={onSelectNote}
        onAddNote={onAddNote}
      />
    </div>
  );
}


