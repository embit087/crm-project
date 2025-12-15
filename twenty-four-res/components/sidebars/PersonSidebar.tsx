"use client";

import { useState, useEffect, useRef } from "react";
import { XIcon, MailIcon, PhoneIcon, MapPinIcon, BriefcaseIcon, LinkedinIcon, ClockIcon, BuildingIcon, HomeIcon, CheckSquareIcon, FileTextIcon, FileIcon } from "@/components/icons";
import { SidebarField } from "@/components/ui/SidebarField";
import { TabButton } from "@/components/ui/TabButton";
import { useSidebarResize } from "@/hooks";
import type { Person, PersonTab } from "@/types";

interface PersonSidebarProps {
  person: Person;
  onClose: () => void;
  onFieldUpdate: (personId: string, field: keyof Person, value: string) => void;
  focusField?: keyof Person;
  onFocusComplete?: () => void;
}

export function PersonSidebar({ person, onClose, onFieldUpdate, focusField, onFocusComplete }: PersonSidebarProps) {
  const [activeTab, setActiveTab] = useState<PersonTab>("home");
  const { sidebarWidth, handleResizeStart } = useSidebarResize(400);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Focus phone field when focusField is "phones"
  useEffect(() => {
    if (focusField === "phones" && phoneInputRef.current && activeTab === "home") {
      // Small delay to ensure the sidebar is fully rendered
      const timeoutId = setTimeout(() => {
        const input = phoneInputRef.current;
        if (input) {
          input.focus();
          // Set cursor to end of input instead of selecting all text
          const length = input.value.length;
          input.setSelectionRange(length, length);
          // Clear the focus field after focusing
          onFocusComplete?.();
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [focusField, activeTab, onFocusComplete]);

  const tabs = [
    { id: "home" as const, label: "Home", icon: <HomeIcon /> },
    { id: "tasks" as const, label: "Tasks", icon: <CheckSquareIcon /> },
    { id: "notes" as const, label: "Notes", icon: <FileTextIcon /> },
    { id: "files" as const, label: "Files", icon: <FileIcon /> },
  ];

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
            {person.name === "Untitled" ? "-" : person.name[0]}
          </div>
          <span className="font-medium text-text-primary min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">{person.name}</span>
          <span className="text-text-muted text-sm min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">Created {person.createdAt}</span>
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
            <SidebarField icon={<MailIcon />} label="Email">
              <input
                type="text"
                className="sidebar-field-input"
                value={person.email}
                onChange={(e) => onFieldUpdate(person.id, "email", e.target.value)}
                placeholder="Email"
              />
            </SidebarField>
            <SidebarField icon={<PhoneIcon />} label="Phones">
              <input
                ref={phoneInputRef}
                type="text"
                className="sidebar-field-input"
                value={person.phones}
                onChange={(e) => onFieldUpdate(person.id, "phones", e.target.value)}
                placeholder="Phones"
              />
            </SidebarField>
            <SidebarField icon={<BuildingIcon />} label="Company">
              <input
                type="text"
                className="sidebar-field-input"
                value={person.company}
                onChange={(e) => onFieldUpdate(person.id, "company", e.target.value)}
                placeholder="Company"
              />
            </SidebarField>
            <SidebarField icon={<BriefcaseIcon />} label="Job Title">
              <input
                type="text"
                className="sidebar-field-input"
                value={person.jobTitle}
                onChange={(e) => onFieldUpdate(person.id, "jobTitle", e.target.value)}
                placeholder="Job Title"
              />
            </SidebarField>
            <SidebarField icon={<MapPinIcon />} label="City">
              <input
                type="text"
                className="sidebar-field-input"
                value={person.city}
                onChange={(e) => onFieldUpdate(person.id, "city", e.target.value)}
                placeholder="City"
              />
            </SidebarField>
            <SidebarField icon={<LinkedinIcon />} label="LinkedIn">
              <input
                type="text"
                className="sidebar-field-input"
                value={person.linkedin}
                onChange={(e) => onFieldUpdate(person.id, "linkedin", e.target.value)}
                placeholder="LinkedIn"
              />
            </SidebarField>
            <SidebarField icon={<ClockIcon />} label="Last Update">
              <span className="text-text-muted">{person.lastUpdate}</span>
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


