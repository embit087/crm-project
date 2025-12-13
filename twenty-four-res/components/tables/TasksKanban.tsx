"use client";

import { useState } from "react";
import {
  PlusIcon,
  CheckIcon,
  CalendarEventIcon,
  UserCircleIcon,
  CalendarIcon,
} from "@/components/icons";
import type { Task, TaskStatus } from "@/types";

const statusConfig: Record<TaskStatus, { bg: string; text: string; label: string }> = {
  todo: { bg: "rgba(83, 156, 193, 0.15)", text: "#89CFF0", label: "To do" },
  in_progress: { bg: "rgba(147, 112, 219, 0.15)", text: "#B8A9E8", label: "In progress" },
  done: { bg: "rgba(110, 208, 146, 0.15)", text: "#6ED092", label: "Done" },
};

interface TasksKanbanProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

interface KanbanCardProps {
  task: Task;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

function KanbanCard({ task, onSelect, onDragStart }: KanbanCardProps) {
  return (
    <div 
      className="kanban-card" 
      onClick={onSelect}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <div className="kanban-card-header">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-semibold bg-tag-bg text-text-muted flex-shrink-0">
            {task.title === "Untitled" ? "-" : task.title[0]}
          </div>
          <span className={`truncate ${task.title === "Untitled" ? "text-text-muted" : "text-text-primary"}`}>
            {task.title}
          </span>
        </div>
        <input
          type="checkbox"
          className="checkbox flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      <div className="kanban-card-fields">
        <div className="kanban-field">
          <div className="kanban-field-icon"><CheckIcon /></div>
          <span
            className="status-tag text-xs"
            style={{
              backgroundColor: statusConfig[task.status].bg,
              color: statusConfig[task.status].text,
            }}
          >
            {statusConfig[task.status].label}
          </span>
        </div>
        <div className="kanban-field">
          <div className="kanban-field-icon"><CalendarEventIcon /></div>
          <span className="text-text-muted text-sm">{task.dueDate || "Due Date"}</span>
        </div>
        <div className="kanban-field">
          <div className="kanban-field-icon"><UserCircleIcon /></div>
          {task.assignee ? (
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-amber-200 flex items-center justify-center text-[8px] font-semibold text-amber-900">
                {task.assignee.name[0]}
              </div>
              <span className="text-text-secondary text-sm truncate">{task.assignee.name}</span>
            </div>
          ) : (
            <span className="text-text-muted text-sm">Assignee</span>
          )}
        </div>
        <div className="kanban-field">
          <div className="kanban-field-icon"><CalendarIcon /></div>
          <span className="text-text-secondary text-sm">{task.creationDate}</span>
        </div>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onAddTask: () => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetStatus: TaskStatus) => void;
  isDraggingOver: boolean;
}

function KanbanColumn({ 
  status, 
  tasks, 
  onSelectTask, 
  onAddTask,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggingOver
}: KanbanColumnProps) {
  const config = statusConfig[status];
  
  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <span
          className="status-tag"
          style={{ backgroundColor: config.bg, color: config.text }}
        >
          {config.label}
        </span>
        <span className="text-text-muted text-sm">{tasks.length}</span>
      </div>
      
      <div 
        className={`kanban-column-content ${isDraggingOver ? "kanban-column-drag-over" : ""}`}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
      >
        {tasks.map((task) => (
          <KanbanCard 
            key={task.id} 
            task={task} 
            onSelect={() => onSelectTask(task)}
            onDragStart={onDragStart}
          />
        ))}
        
        <button className="kanban-add-button" onClick={onAddTask}>
          <PlusIcon />
          <span>New</span>
        </button>
      </div>
    </div>
  );
}

export function TasksKanban({ tasks, onSelectTask, onAddTask, onUpdateTaskStatus }: TasksKanbanProps) {
  const columns: TaskStatus[] = ["todo", "in_progress", "done"];
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggingOverStatus, setDraggingOverStatus] = useState<TaskStatus | null>(null);
  
  const groupedTasks = {
    todo: tasks.filter(t => t.status === "todo"),
    in_progress: tasks.filter(t => t.status === "in_progress"),
    done: tasks.filter(t => t.status === "done"),
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
    setTimeout(() => {
      if (e.dataTransfer) {
        e.dataTransfer.setDragImage(e.currentTarget as Element, 0, 0);
      }
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    e.stopPropagation();
    
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== targetStatus) {
        onUpdateTaskStatus(taskId, targetStatus);
      }
    }
    
    setDraggedTaskId(null);
    setDraggingOverStatus(null);
  };

  return (
    <div className="kanban-board">
      {columns.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={groupedTasks[status]}
          onSelectTask={onSelectTask}
          onAddTask={() => onAddTask(status)}
          onDragStart={handleDragStart}
          onDragOver={(e) => {
            handleDragOver(e);
            setDraggingOverStatus(status);
          }}
          onDrop={handleDrop}
          isDraggingOver={draggingOverStatus === status}
        />
      ))}
    </div>
  );
}

