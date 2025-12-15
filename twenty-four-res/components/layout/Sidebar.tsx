"use client";

import { useState, useEffect } from "react";
import {
  UsersIcon,
  BuildingIcon,
  CheckSquareIcon,
  FileTextIcon,
  SearchIcon,
  SettingsIcon,
  HelpCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ListIcon,
  KanbanIcon,
  UserCircleIcon,
  CRMIcon,
} from "@/components/icons";
import { Tooltip } from "@/components/ui/Tooltip";
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // Initialize expanded state - expand Tasks if it's the active nav initially
  const [expandedItems, setExpandedItems] = useState<Set<ActiveNav>>(() => 
    new Set(activeNav === "tasks" ? ["tasks"] : [])
  );

  // Handle click outside to collapse sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const sidebar = document.querySelector('aside[data-sidebar]');
      
      if (!isCollapsed && sidebar && !sidebar.contains(target)) {
        setIsCollapsed(true);
      }
    };

    if (!isCollapsed) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isCollapsed]);

  const toggleExpand = (itemId: ActiveNav) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: NavItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Auto-collapse Tasks when navigating away from it
    if (activeNav === "tasks" && item.id !== "tasks" && expandedItems.has("tasks")) {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete("tasks");
        return newSet;
      });
    }
    
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

  const handleSidebarClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  return (
    <aside 
      data-sidebar
      className={`
        ${isCollapsed ? 'w-[52px]' : 'w-[200px]'} 
        bg-sidebar-bg border-r border-border flex flex-col 
        transition-all duration-300 ease-out
        ${isCollapsed ? 'sidebar-collapsed' : ''}
      `}
      onClick={handleSidebarClick}
    >
      {/* Collapsed overlay highlight */}
      {isCollapsed && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/0 hover:from-orange-500/5 hover:to-transparent transition-all duration-300 pointer-events-none rounded-r-lg" />
      )}
      
      {/* Logo/Workspace */}
      <div 
        className={`
          ${isCollapsed ? 'py-4 px-0' : 'p-3'} 
          border-b border-border/50 flex items-center justify-center
          ${isCollapsed ? 'group' : ''}
        `}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2 w-full text-left rounded-md p-2">
            <CRMIcon />
            <span className="text-text-primary font-medium text-sm">Workspace</span>
          </div>
        )}
        {isCollapsed && (
          <Tooltip content="Workspace" position="right" className="inline-flex">
            <div className="flex items-center justify-center">
              <CRMIcon />
            </div>
          </Tooltip>
        )}
      </div>

      {/* Search & Settings */}
      <div className={`${isCollapsed ? 'px-2 py-3' : 'px-2 py-2'} flex flex-col ${isCollapsed ? 'gap-1 items-center' : 'gap-0.5'}`}>
        <Tooltip content="Search" position="right" className={isCollapsed ? 'inline-flex' : 'w-full'}>
          <button
            className={`
              nav-item 
              ${isCollapsed ? 'collapsed-nav-item justify-center w-9 h-9 p-0' : ''}
            `}
            onClick={(e) => {
              if (!isCollapsed) {
                e.stopPropagation();
                onSearchClick();
              }
            }}
          >
            <SearchIcon />
            {!isCollapsed && (
              <>
                <span>Search</span>
                <span className="ml-auto text-text-muted text-xs">/</span>
              </>
            )}
          </button>
        </Tooltip>
        <Tooltip content="Settings" position="right" className={isCollapsed ? 'inline-flex' : 'w-full'}>
          <button 
            className={`
              nav-item 
              ${isCollapsed ? 'collapsed-nav-item justify-center w-9 h-9 p-0' : ''}
            `}
            onClick={(e) => {
              if (!isCollapsed) {
                e.stopPropagation();
              }
            }}
          >
            <SettingsIcon />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </Tooltip>
      </div>

      {/* Collapsed divider */}
      {isCollapsed && (
        <div className="mx-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      )}

      {/* Main Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2 py-3' : 'px-2 py-2'} overflow-y-auto flex flex-col ${isCollapsed ? 'gap-1 items-center' : 'gap-0'}`}>
        {navItems.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          const isActive = activeNav === item.id;
          
          return (
            <div key={item.id} className={isCollapsed ? 'w-full flex justify-center' : 'w-full'}>
              <Tooltip content={item.label} position="right" className={isCollapsed ? 'inline-flex' : 'w-full'}>
                <button
                  className={`
                    nav-item 
                    ${isActive ? "active" : ""} 
                    ${isCollapsed ? 'collapsed-nav-item justify-center w-9 h-9 p-0 relative' : 'w-full'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCollapsed) {
                      // Expand sidebar and select the icon
                      setIsCollapsed(false);
                      // For expandable items, also expand them
                      if (item.expandable) {
                        setExpandedItems(prev => new Set(prev).add(item.id));
                      }
                      onNavChange(item.id);
                      return;
                    }
                    handleItemClick(item, e);
                  }}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <>
                      <span>{item.label}</span>
                      {item.expandable && (
                        <span className="ml-auto">
                          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </span>
                      )}
                    </>
                  )}
                  {/* Active indicator for collapsed state */}
                  {isCollapsed && isActive && (
                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-orange-500 rounded-full" />
                  )}
                </button>
              </Tooltip>
              
              {!isCollapsed && item.expandable && item.subItems && isExpanded && (
                <div className="nav-sub-items">
                  {item.subItems.map((subItem) => {
                    const isSubActive = isActive && activeTasksView === subItem.id;
                    return (
                      <Tooltip key={subItem.id} content={subItem.label} position="right" className="w-full">
                        <button
                          className={`nav-sub-item ${isSubActive ? "active" : ""}`}
                          onClick={(e) => handleSubItemClick(item.id, subItem.id, e)}
                        >
                          {subItem.icon}
                          <span>{subItem.label}</span>
                        </button>
                      </Tooltip>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapsed divider */}
      {isCollapsed && (
        <div className="mx-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      )}

      {/* Support */}
      <div className={`${isCollapsed ? 'px-2 py-3' : 'px-2 py-3'} ${!isCollapsed ? 'border-t border-border/50' : ''} flex ${isCollapsed ? 'justify-center' : ''}`}>
        <Tooltip content="Support" position="right" className={isCollapsed ? 'inline-flex' : 'w-full'}>
          <button 
            className={`
              nav-item 
              ${isCollapsed ? 'collapsed-nav-item justify-center w-9 h-9 p-0' : 'w-full'}
            `}
            onClick={(e) => {
              if (!isCollapsed) {
                e.stopPropagation();
              }
            }}
          >
            <HelpCircleIcon />
            {!isCollapsed && <span>Support</span>}
          </button>
        </Tooltip>
      </div>

      {/* Expand indicator for collapsed state */}
      {isCollapsed && (
        <div className="px-2 pb-3 flex justify-center">
          <div className="w-6 h-1 rounded-full bg-border/60 group-hover:bg-orange-500/40 transition-colors duration-200" />
        </div>
      )}
    </aside>
  );
}

