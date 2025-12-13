"use client";

import { useState } from "react";
import { FileTextIcon, ClockIcon, UsersIcon, HomeIcon, FileIcon } from "@/components/icons";
import { PropertyRow } from "@/components/ui/SidebarField";
import { TabButton } from "@/components/ui/TabButton";
import { CreatedByAvatar } from "@/components/ui/Avatar";
import type { Note, NoteTab } from "@/types";

interface NoteDetailViewProps {
  note: Note;
  onTitleChange: (noteId: string, title: string) => void;
  onContentChange: (noteId: string, content: string) => void;
}

export function NoteDetailView({ note, onTitleChange, onContentChange }: NoteDetailViewProps) {
  const [activeTab, setActiveTab] = useState<NoteTab>("note");

  const tabs = [
    { id: "note" as const, label: "Note", icon: <FileTextIcon /> },
    { id: "timeline" as const, label: "Timeline", icon: <ClockIcon /> },
    { id: "files" as const, label: "Files", icon: <FileIcon /> },
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left panel - Properties */}
      <div className="w-[400px] border-r border-border p-4 overflow-y-auto bg-sidebar-bg/30">
        <div className="text-center mb-6">
          <div className="avatar-large mx-auto mb-3">📝</div>
          <input
            type="text"
            value={note.title}
            onChange={(e) => onTitleChange(note.id, e.target.value)}
            className="text-xl font-semibold text-text-primary bg-transparent border-none text-center outline-none w-full min-w-0 whitespace-nowrap overflow-hidden text-ellipsis"
          />
          <span className="text-sm text-text-muted mt-1 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">{note.createdAt}</span>
        </div>

        <div className="space-y-1">
          <PropertyRow icon={<UsersIcon />} label="Created by">
            <div className="flex items-center gap-2">
              <CreatedByAvatar name={note.createdBy.name} type={note.createdBy.type} />
              <span>{note.createdBy.name}</span>
            </div>
          </PropertyRow>
          <PropertyRow icon={<ClockIcon />} label="Created">
            {note.creationDate}
          </PropertyRow>
          <PropertyRow icon={<ClockIcon />} label="Updated">
            {note.lastUpdate}
          </PropertyRow>
        </div>
      </div>

      {/* Right panel - Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border px-2 bg-table-bg">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "note" && (
            <textarea
              className="note-editor"
              value={note.content}
              onChange={(e) => onContentChange(note.id, e.target.value)}
              placeholder="Start writing..."
            />
          )}
          {activeTab === "timeline" && (
            <div className="text-center text-text-muted py-8">
              No timeline events yet
            </div>
          )}
          {activeTab === "files" && (
            <div className="text-center text-text-muted py-8">
              No files attached
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

