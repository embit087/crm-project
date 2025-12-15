"use client";

import { useState } from "react";
import { XIcon, HomeIcon, CheckSquareIcon, FileTextIcon, FileIcon, NotesIcon, CheckIcon, CalendarEventIcon, UserCircleIcon, FilePencilIcon, CreatedByIcon, ClockIcon } from "@/components/icons";
import { SidebarField } from "@/components/ui/SidebarField";
import { TabButton } from "@/components/ui/TabButton";
import { CreatedByAvatar } from "@/components/ui/Avatar";
import { useSidebarResize } from "@/hooks";
import type { Task, PersonTab, TaskStatus } from "@/types";

const statusColors: Record<TaskStatus, { bg: string; text: string; label: string }> = {
  todo: { bg: "rgba(83, 156, 193, 0.15)", text: "#89CFF0", label: "To do" },
  in_progress: { bg: "rgba(147, 112, 219, 0.15)", text: "#B8A9E8", label: "In progress" },
  done: { bg: "rgba(110, 208, 146, 0.15)", text: "#6ED092", label: "Done" },
};

interface TaskDetailViewProps {
  task: Task;
  onClose: () => void;
  onFieldUpdate: (taskId: string, field: keyof Task, value: any) => void;
}

export function TaskDetailView({ task, onClose, onFieldUpdate }: TaskDetailViewProps) {
  const [activeTab, setActiveTab] = useState<PersonTab>("home");
  const { sidebarWidth, handleResizeStart } = useSidebarResize(400);

  const tabs = [
    { id: "home" as const, label: "Home", icon: <HomeIcon /> },
    { id: "tasks" as const, label: "Tasks", icon: <CheckSquareIcon /> },
    { id: "notes" as const, label: "Notes", icon: <FileTextIcon /> },
    { id: "files" as const, label: "Files", icon: <FileIcon /> },
  ];

  const statusConfig = statusColors[task.status];

  return (
    <div
      className="border-l border-border bg-sidebar-bg flex flex-col animate-slide-in-right relative"
      style={{ width: sidebarWidth }}
    >
      <div className="sidebar-resize-handle" onMouseDown={handleResizeStart} />
      
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <button
            className="p-1 rounded hover:bg-sidebar-hover text-text-muted"
            onClick={onClose}
          >
            <XIcon />
          </button>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-lg bg-tag-bg flex items-center justify-center text-xl font-semibold text-text-muted mb-2">
            {task.title === "Untitled" ? "-" : task.title[0]}
          </div>
          <input
            type="text"
            value={task.title}
            onChange={(e) => onFieldUpdate(task.id, "title", e.target.value)}
            className="font-medium text-text-primary bg-transparent border-none text-center outline-none w-full min-w-0 whitespace-nowrap overflow-hidden text-ellipsis"
          />
          <span className="text-text-muted text-sm min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">Created {task.creationDate}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-2">
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "home" && (
          <div className="space-y-1">
            <SidebarField icon={<NotesIcon />} label="Title">
              <input
                type="text"
                className="sidebar-field-input"
                value={task.title}
                onChange={(e) => onFieldUpdate(task.id, "title", e.target.value)}
                placeholder="Task title"
              />
            </SidebarField>
            <SidebarField icon={<CheckIcon />} label="Status">
              <select
                className="sidebar-field-input"
                value={task.status}
                onChange={(e) => onFieldUpdate(task.id, "status", e.target.value as TaskStatus)}
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </SidebarField>
            <SidebarField icon={<CalendarEventIcon />} label="Due Date">
              <input
                type="text"
                className="sidebar-field-input"
                value={task.dueDate || ""}
                onChange={(e) => onFieldUpdate(task.id, "dueDate", e.target.value || null)}
                placeholder="Due date"
              />
            </SidebarField>
            <SidebarField icon={<UserCircleIcon />} label="Assignee">
              <input
                type="text"
                className="sidebar-field-input"
                value={task.assignee?.name || ""}
                onChange={(e) => onFieldUpdate(task.id, "assignee", e.target.value ? { name: e.target.value } : null)}
                placeholder="Assignee"
              />
            </SidebarField>
            <div className="sidebar-field">
              <div className="sidebar-field-label">
                <FilePencilIcon />
                <span className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">Body</span>
              </div>
              <textarea
                className="sidebar-field-input"
                value={task.body}
                onChange={(e) => onFieldUpdate(task.id, "body", e.target.value)}
                placeholder="Task description"
                rows={4}
                style={{ resize: "vertical", minHeight: "80px", width: "100%" }}
              />
            </div>
            <SidebarField icon={<CreatedByIcon />} label="Created by">
              <div className="flex items-center gap-2">
                <CreatedByAvatar name={task.createdBy.name} type={task.createdBy.type} />
                <span>{task.createdBy.name}</span>
              </div>
            </SidebarField>
            <SidebarField icon={<ClockIcon />} label="Created">
              {task.creationDate}
            </SidebarField>
          </div>
        )}
        {activeTab !== "home" && (
          <div className="text-center text-text-muted py-8">
            No {activeTab} yet
          </div>
        )}
      </div>
    </div>
  );
}
