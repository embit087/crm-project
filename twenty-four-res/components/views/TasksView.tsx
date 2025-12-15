"use client";

import { useState, useMemo } from "react";
import {
  ListIcon,
  KanbanIcon,
  UserCircleIcon,
  ChevronDownIcon,
  FilterIcon,
  XIcon,
} from "@/components/icons";
import { TasksTable, TasksKanban } from "@/components/tables";
import { TaskDetailView } from "@/components/sidebars/TaskDetailView";
import type { Task, TaskStatus, TasksView as TasksViewType } from "@/types";

interface ViewTab {
  id: TasksViewType;
  label: string;
  icon: React.ReactNode;
}

const viewTabs: ViewTab[] = [
  { id: "all", label: "All Tasks", icon: <ListIcon /> },
  { id: "by_status", label: "By Status", icon: <KanbanIcon /> },
  { id: "assigned_to_me", label: "Assigned to Me", icon: <UserCircleIcon /> },
];

interface TasksViewProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  currentUser: string;
  activeView?: TasksViewType;
  onViewChange?: (view: TasksViewType) => void;
  selectedTask?: Task | null;
  onSelectTask?: (task: Task | null) => void;
  onFieldUpdate?: (taskId: string, field: keyof Task, value: any) => void;
}

export function TasksView({ 
  tasks, 
  onUpdateTasks, 
  currentUser,
  activeView: externalActiveView,
  onViewChange,
  selectedTask: externalSelectedTask,
  onSelectTask: externalOnSelectTask,
  onFieldUpdate: externalOnFieldUpdate,
}: TasksViewProps) {
  const [internalActiveView, setInternalActiveView] = useState<TasksViewType>("all");
  const activeView = externalActiveView ?? internalActiveView;
  
  const setActiveView = (view: TasksViewType) => {
    if (onViewChange) {
      onViewChange(view);
    } else {
      setInternalActiveView(view);
    }
  };
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [internalSelectedTask, setInternalSelectedTask] = useState<Task | null>(null);
  
  const selectedTask = externalSelectedTask ?? internalSelectedTask;
  const handleSelectTask = externalOnSelectTask ?? setInternalSelectedTask;

  const filteredTasks = useMemo(() => {
    if (activeView === "assigned_to_me") {
      return tasks.filter(t => t.assignee?.name === currentUser);
    }
    return tasks;
  }, [tasks, activeView, currentUser]);

  const handleToggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleToggleAll = () => {
    if (selectedRows.size === filteredTasks.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredTasks.map(t => t.id)));
    }
  };

  const handleAddTask = (status?: TaskStatus) => {
    const newTask: Task = {
      id: `${Date.now()}`,
      title: "Untitled",
      status: status || "todo",
      relations: [],
      createdBy: { name: currentUser, type: "user" },
      dueDate: null,
      assignee: activeView === "assigned_to_me" ? { name: currentUser } : null,
      body: "",
      creationDate: "less than a minute ago",
      createdAt: new Date().toISOString(),
    };
    onUpdateTasks([newTask, ...tasks]);
  };

  const handleSelectTaskInternal = (task: Task) => {
    handleSelectTask(task);
  };
  
  const handleFieldUpdate = (taskId: string, field: keyof Task, value: any) => {
    if (externalOnFieldUpdate) {
      externalOnFieldUpdate(taskId, field, value);
    } else {
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, [field]: value } : t
      );
      onUpdateTasks(updatedTasks);
      // Update selected task if it's the one being edited
      if (selectedTask?.id === taskId) {
        handleSelectTask({ ...selectedTask, [field]: value });
      }
    }
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    onUpdateTasks(updatedTasks);
  };

  const activeTab = viewTabs.find(t => t.id === activeView)!;
  const taskCount = filteredTasks.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="tasks-toolbar">
        <div className="tasks-view-selector">
          <button className="tasks-view-button">
            {activeTab.icon}
            <span className="tasks-view-label">{activeTab.label}</span>
            <span className="tasks-view-count">
              · {taskCount}
              <ChevronDownIcon />
            </span>
          </button>
          <div className="tasks-view-dropdown">
            {viewTabs.map((tab) => (
              <button
                key={tab.id}
                className={`tasks-view-dropdown-item ${activeView === tab.id ? "active" : ""}`}
                onClick={() => setActiveView(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="tasks-actions">
          <button className="tasks-action-button">Filter</button>
          <button className="tasks-action-button">Sort</button>
          <button className="tasks-action-button">Options</button>
        </div>
      </div>

      {activeView === "assigned_to_me" && (
        <div className="tasks-filter-bar">
          <div className="tasks-filter-chip">
            <UserCircleIcon />
            <span className="text-text-muted">Assignee</span>
            <span className="text-text-primary">:  Me</span>
            <button className="tasks-filter-remove">
              <XIcon />
            </button>
          </div>
          <button className="tasks-add-filter">
            <FilterIcon />
            Add filter
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {activeView === "by_status" ? (
            <TasksKanban
              tasks={filteredTasks}
              onSelectTask={handleSelectTaskInternal}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          ) : (
            <TasksTable
              tasks={filteredTasks}
              selectedRows={selectedRows}
              onToggleRow={handleToggleRow}
              onToggleAll={handleToggleAll}
              onSelectTask={handleSelectTaskInternal}
              onAddTask={() => handleAddTask()}
              groupByStatus={activeView === "assigned_to_me"}
            />
          )}
        </div>
        {selectedTask && (
          <TaskDetailView
            task={selectedTask}
            onClose={() => handleSelectTask(null)}
            onFieldUpdate={handleFieldUpdate}
          />
        )}
      </div>
    </div>
  );
}

