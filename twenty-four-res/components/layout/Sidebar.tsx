"use client";

import { useState, useEffect } from "react";
import {
  UsersIcon,
  BuildingIcon,
  TargetIcon,
  CheckSquareIcon,
  FileTextIcon,
  ZapIcon,
  SearchIcon,
  SettingsIcon,
  HelpCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ListIcon,
  KanbanIcon,
  UserCircleIcon,
} from "@/components/icons";
import type { ActiveNav, TasksView } from "@/types";

interface NavItem {
  id: ActiveNav;
  label: string;
  icon: React.ReactNode;
  expandable?: boolean;
  subItems?: { id: TasksView; label: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  { id: "people", label: "People", icon: <UsersIcon /> },
  { id: "companies", label: "Companies", icon: <BuildingIcon /> },
  { id: "opportunities", label: "Opportunities", icon: <TargetIcon /> },
  { 
    id: "tasks", 
    label: "Tasks", 
    icon: <CheckSquareIcon />,
    expandable: true,
    subItems: [
      { id: "all", label: "All Tasks", icon: <ListIcon /> },
      { id: "by_status", label: "By Status", icon: <KanbanIcon /> },
      { id: "assigned_to_me", label: "Assigned to Me", icon: <UserCircleIcon /> },
    ],
  },
  { id: "notes", label: "Notes", icon: <FileTextIcon /> },
  { id: "workflows", label: "Workflows", icon: <ZapIcon /> },
];

interface SidebarProps {
  activeNav: ActiveNav;
  activeTasksView?: TasksView;
  onNavChange: (nav: ActiveNav) => void;
  onTasksViewChange?: (view: TasksView) => void;
  onSearchClick: () => void;
}

export function Sidebar({ 
  activeNav, 
  activeTasksView = "all",
  onNavChange, 
  onTasksViewChange,
  onSearchClick 
}: SidebarProps) {
  // Initialize expanded state - expand Tasks if it's the active nav initially
  const [expandedItems, setExpandedItems] = useState<Set<ActiveNav>>(() => 
    new Set(activeNav === "tasks" ? ["tasks"] : [])
  );

  // Auto-collapse Tasks when navigating away from it
  useEffect(() => {
    if (activeNav !== "tasks" && expandedItems.has("tasks")) {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete("tasks");
        return newSet;
      });
    }
  }, [activeNav, expandedItems]);

  const toggleExpand = (itemId: ActiveNav) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: NavItem) => {
    if (item.expandable) {
      toggleExpand(item.id);
      if (activeNav !== item.id) {
        onNavChange(item.id);
      }
    } else {
      onNavChange(item.id);
    }
  };

  const handleSubItemClick = (itemId: ActiveNav, subItemId: TasksView, e: React.MouseEvent) => {
    e.stopPropagation();
    onNavChange(itemId);
    if (onTasksViewChange) {
      onTasksViewChange(subItemId);
    }
  };

  return (
    <aside className="w-[200px] bg-sidebar-bg border-r border-border flex flex-col">
      {/* Logo/Workspace */}
      <div className="p-3 border-b border-border">
        <button className="flex items-center gap-2 w-full text-left rounded-md hover:bg-sidebar-hover p-2 transition-colors">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
            O
          </div>
          <span className="text-text-primary font-medium text-sm">Workspace</span>
        </button>
      </div>

      {/* Search & Settings */}
      <div className="px-2 py-2 flex flex-col gap-0.5">
        <button
          className="nav-item"
          onClick={onSearchClick}
        >
          <SearchIcon />
          <span>Search</span>
          <span className="ml-auto text-text-muted text-xs">/</span>
        </button>
        <button className="nav-item">
          <SettingsIcon />
          <span>Settings</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          const isActive = activeNav === item.id;
          
          return (
            <div key={item.id}>
              <button
                className={`nav-item w-full ${isActive ? "active" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.expandable && (
                  <span className="ml-auto">
                    {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </span>
                )}
              </button>
              
              {item.expandable && item.subItems && isExpanded && (
                <div className="nav-sub-items">
                  {item.subItems.map((subItem) => {
                    const isSubActive = isActive && activeTasksView === subItem.id;
                    return (
                      <button
                        key={subItem.id}
                        className={`nav-sub-item ${isSubActive ? "active" : ""}`}
                        onClick={(e) => handleSubItemClick(item.id, subItem.id, e)}
                      >
                        {subItem.icon}
                        <span>{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Support */}
      <div className="px-2 py-3 border-t border-border">
        <button className="nav-item w-full">
          <HelpCircleIcon />
          <span>Support</span>
        </button>
      </div>
    </aside>
  );
}

