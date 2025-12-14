"use client";

import {
  NotesIcon,
  CheckIcon,
  ArrowUpRightIcon,
  CreatedByIcon,
  CalendarEventIcon,
  UserCircleIcon,
  FilePencilIcon,
  CalendarIcon,
  PlusIcon,
  ChevronDownIcon,
} from "@/components/icons";
import { CreatedByAvatar } from "@/components/ui/Avatar";
import { useColumnResize, useColumnReorder } from "@/hooks";
import type { Task, TaskStatus } from "@/types";

const taskColumns = [
  { key: "checkbox", label: "", icon: null },
  { key: "title", label: "Title", icon: <NotesIcon /> },
  { key: "status", label: "Status", icon: <CheckIcon /> },
  { key: "relations", label: "Relations", icon: <ArrowUpRightIcon /> },
  { key: "createdBy", label: "Created by", icon: <CreatedByIcon /> },
  { key: "dueDate", label: "Due Date", icon: <CalendarEventIcon /> },
  { key: "assignee", label: "Assignee", icon: <UserCircleIcon /> },
  { key: "body", label: "Body", icon: <FilePencilIcon /> },
  { key: "creationDate", label: "Creation date", icon: <CalendarIcon /> },
];

const statusColors: Record<TaskStatus, { bg: string; text: string; label: string }> = {
  todo: { bg: "rgba(83, 156, 193, 0.15)", text: "#89CFF0", label: "To do" },
  in_progress: { bg: "rgba(147, 112, 219, 0.15)", text: "#B8A9E8", label: "In progress" },
  done: { bg: "rgba(110, 208, 146, 0.15)", text: "#6ED092", label: "Done" },
};

interface TasksTableProps {
  tasks: Task[];
  selectedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onSelectTask: (task: Task) => void;
  onAddTask: () => void;
  groupByStatus?: boolean;
}

export function TasksTable({
  tasks,
  selectedRows,
  onToggleRow,
  onToggleAll,
  onSelectTask,
  onAddTask,
  groupByStatus = false,
}: TasksTableProps) {
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
  } = useColumnReorder(taskColumns, "tasks-column-order");

  const renderTaskRow = (task: Task, index: number) => (
    <tr
      key={task.id}
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
                checked={selectedRows.has(task.id)}
                onChange={() => onToggleRow(task.id)}
              />
            </td>
          );
        }
        if (col.key === "title") {
          return (
            <td key={col.key} style={{ width: `${columnWidths.title || 210}px` }}>
              <div
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onSelectTask(task)}
              >
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold bg-tag-bg text-text-muted mr-2 flex-shrink-0">
                  {task.title === "Untitled" ? "-" : task.title[0]}
                </div>
                <span className={task.title === "Untitled" ? "text-text-muted" : "text-text-primary"}>
                  {task.title}
                </span>
              </div>
            </td>
          );
        }
        if (col.key === "status") {
          return (
            <td key={col.key} style={{ width: `${columnWidths.status || 150}px` }}>
              <span
                className="status-tag"
                style={{
                  backgroundColor: statusColors[task.status].bg,
                  color: statusColors[task.status].text,
                }}
              >
                {statusColors[task.status].label}
              </span>
            </td>
          );
        }
        if (col.key === "relations") {
          return (
            <td key={col.key} style={{ width: `${columnWidths.relations || 150}px` }} className="text-text-muted">
              {task.relations.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {task.relations.slice(0, 2).map((rel, i) => (
                    <span key={i} className="text-text-secondary text-sm">{rel}</span>
                  ))}
                  {task.relations.length > 2 && (
                    <span className="text-text-muted text-sm">+{task.relations.length - 2}</span>
                  )}
                </div>
              ) : null}
            </td>
          );
        }
        if (col.key === "createdBy") {
          return (
            <td key={col.key} style={{ width: `${columnWidths.createdBy}px` }}>
              <div className="flex items-center gap-2">
                <CreatedByAvatar name={task.createdBy.name} type={task.createdBy.type} />
                <span className="text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis">{task.createdBy.name}</span>
              </div>
            </td>
          );
        }
        if (col.key === "dueDate") {
          return (
            <td key={col.key} style={{ width: `${columnWidths.dueDate || 150}px` }} className="text-text-secondary">
              {task.dueDate || ""}
            </td>
          );
        }
        if (col.key === "assignee") {
          return (
            <td key={col.key} style={{ width: `${columnWidths.assignee || 150}px` }}>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-semibold text-amber-900">
                    {task.assignee.name[0]}
                  </div>
                  <span className="text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis">{task.assignee.name}</span>
                </div>
              ) : null}
            </td>
          );
        }
        if (col.key === "body") {
          return (
            <td key={col.key} style={{ width: `${columnWidths.body || 150}px` }} className="text-text-muted">
              <span className="line-clamp-1">{task.body}</span>
            </td>
          );
        }
        if (col.key === "creationDate") {
          return (
            <td key={col.key} style={{ width: `${columnWidths.creationDate}px` }} className="text-text-secondary whitespace-nowrap">
              {task.creationDate}
            </td>
          );
        }
        return null;
      })}
    </tr>
  );

  const renderGroupedTasks = () => {
    const grouped = {
      todo: tasks.filter(t => t.status === "todo"),
      in_progress: tasks.filter(t => t.status === "in_progress"),
      done: tasks.filter(t => t.status === "done"),
    };

    return (
      <>
        {(["todo", "in_progress", "done"] as TaskStatus[]).map(status => (
          <tbody key={status}>
            <tr className="group-header-row">
              <td></td>
              <td colSpan={orderedColumns.length - 1}>
                <div className="flex items-center gap-2 py-2">
                  <button className="p-1 text-text-muted hover:text-text-primary">
                    <ChevronDownIcon />
                  </button>
                  <span
                    className="status-tag font-medium"
                    style={{
                      backgroundColor: statusColors[status].bg,
                      color: statusColors[status].text,
                    }}
                  >
                    {statusColors[status].label}
                  </span>
                  <span className="text-text-muted text-sm">
                    {grouped[status].length}
                  </span>
                </div>
              </td>
            </tr>
            {grouped[status].map((task, index) => renderTaskRow(task, index))}
            <tr className="opacity-60 hover:opacity-100 transition-opacity">
              <td></td>
              <td colSpan={orderedColumns.length - 1}>
                <button
                  className="flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors py-1"
                  onClick={onAddTask}
                >
                  <PlusIcon />
                  <span>Add new</span>
                </button>
              </td>
            </tr>
          </tbody>
        ))}
      </>
    );
  };

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
                        checked={selectedRows.size === tasks.length && tasks.length > 0}
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
        {groupByStatus ? (
          renderGroupedTasks()
        ) : (
          <tbody>
            {tasks.map((task, index) => renderTaskRow(task, index))}
            <tr className="opacity-60 hover:opacity-100 transition-opacity">
              <td></td>
              <td>
                <button
                  className="flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
                  onClick={onAddTask}
                >
                  <PlusIcon />
                  <span>Add New</span>
                </button>
              </td>
              <td colSpan={orderedColumns.length - 2}></td>
            </tr>
            <tr className="opacity-60">
              <td></td>
              <td>
                <button className="flex items-center gap-1 text-text-muted text-sm">
                  <span>Calculate</span>
                  <ChevronDownIcon />
                </button>
              </td>
              <td colSpan={orderedColumns.length - 2}></td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}


