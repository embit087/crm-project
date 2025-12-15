"use client";

import { FileTextIcon, UsersIcon, CalendarIcon, PlusIcon, ChevronDownIcon, NotesIcon } from "@/components/icons";
import { CreatedByAvatar } from "@/components/ui/Avatar";
import { useColumnResize, useColumnReorder } from "@/hooks";
import type { Note } from "@/types";

const notesColumns = [
  { key: "checkbox", label: "", icon: null },
  { key: "title", label: "Title", icon: <FileTextIcon /> },
  { key: "createdBy", label: "Created by", icon: <UsersIcon /> },
  { key: "creationDate", label: "Creation date", icon: <CalendarIcon /> },
];

interface NotesTableProps {
  notes: Note[];
  selectedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onSelectNote: (note: Note) => void;
  onAddNote: () => void;
}

export function NotesTable({
  notes,
  selectedRows,
  onToggleRow,
  onToggleAll,
  onSelectNote,
  onAddNote,
}: NotesTableProps) {
  const { columnWidths, handleColumnResizeStart } = useColumnResize();
  const {
    columns: orderedColumns,
    draggedColumn,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useColumnReorder(notesColumns, "notes-column-order");

  return (
    <div className="flex-1 overflow-auto table-container">
      <table className="crm-table">
        <thead>
          <tr>
            {orderedColumns.map((col, index) => {
              const isDragging = draggedColumn === col.key;
              const isDragOver = dragOverColumn === col.key;
              const isDragOverRight = dragOverColumn && orderedColumns.findIndex((c) => c.key === dragOverColumn) === index - 1;
              
              return (
                <th
                  key={col.key}
                  style={{ width: `${columnWidths[col.key]}px` }}
                  draggable={col.key !== "checkbox"}
                  onDragStart={(e) => col.key !== "checkbox" && handleDragStart(e, col.key)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => col.key !== "checkbox" && handleDragOver(e, col.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => col.key !== "checkbox" && handleDrop(e, col.key)}
                  className={
                    col.key !== "checkbox"
                      ? `column-header-draggable ${isDragging ? "dragging" : ""} ${isDragOver ? "drag-over" : ""} ${isDragOverRight ? "drag-over-right" : ""}`
                      : ""
                  }
                >
                  <div className="flex items-center gap-1.5">
                    {col.icon}
                    {col.label && <span>{col.label}</span>}
                    {col.key === "checkbox" && (
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedRows.size === notes.length && notes.length > 0}
                        onChange={onToggleAll}
                      />
                    )}
                  </div>
                  {col.key !== "checkbox" && (
                    <div
                      className="resize-handle"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleColumnResizeStart(e, col.key);
                      }}
                    />
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {notes.map((note, index) => (
            <tr
              key={note.id}
              className={`animate-fade-in animate-delay-${Math.min(index + 1, 5)}`}
              style={{ opacity: 0 }}
            >
              {orderedColumns.map((col) => {
                if (col.key === "checkbox") {
                  return (
                    <td key={col.key} style={{ width: `${columnWidths.checkbox}px` }}>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedRows.has(note.id)}
                        onChange={() => onToggleRow(note.id)}
                      />
                    </td>
                  );
                }
                if (col.key === "title") {
                  return (
                    <td key={col.key} style={{ width: `${columnWidths.title}px` }}>
                      <div
                        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => onSelectNote(note)}
                      >
                        <div className="avatar-large mr-3">
                          <NotesIcon />
                        </div>
                        <span className={note.title === "Untitled" ? "text-text-muted" : "text-text-primary"}>
                          {note.title}
                        </span>
                      </div>
                    </td>
                  );
                }
                if (col.key === "createdBy") {
                  return (
                    <td key={col.key} style={{ width: `${columnWidths.createdBy}px` }}>
                      <div className="flex items-center gap-2">
                        <CreatedByAvatar name={note.createdBy.name} type={note.createdBy.type} />
                        <span className="text-text-secondary">{note.createdBy.name}</span>
                      </div>
                    </td>
                  );
                }
                if (col.key === "creationDate") {
                  return (
                    <td key={col.key} style={{ width: `${columnWidths.creationDate}px` }} className="text-text-secondary">
                      {note.creationDate}
                    </td>
                  );
                }
                return null;
              })}
            </tr>
          ))}
          {/* Add new row */}
          <tr className="opacity-60 hover:opacity-100 transition-opacity">
            <td></td>
            <td>
              <button
                className="flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
                onClick={onAddNote}
              >
                <PlusIcon />
                <span>Add New</span>
              </button>
            </td>
            <td colSpan={2}></td>
          </tr>
          {/* Calculate row */}
          <tr className="opacity-60">
            <td></td>
            <td>
              <button className="flex items-center gap-1 text-text-muted text-sm">
                <span>Calculate</span>
                <ChevronDownIcon />
              </button>
            </td>
            <td colSpan={2}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


