"use client";

import { useState } from "react";
import { XIcon, GlobeIcon, UsersIcon, MapPinIcon, LinkedinIcon, ClockIcon, HashIcon, HomeIcon, CheckSquareIcon, FileTextIcon, FileIcon } from "@/components/icons";
import { SidebarField } from "@/components/ui/SidebarField";
import { TabButton } from "@/components/ui/TabButton";
import { CompanyIcon, CreatedByAvatar } from "@/components/ui/Avatar";
import { useSidebarResize } from "@/hooks";
import type { Company, Person, CompanyTab } from "@/types";

interface CompanySidebarProps {
  company: Company;
  people: Person[];
  onClose: () => void;
  onSelectPerson: (person: Person) => void;
}

export function CompanySidebar({ company, people, onClose, onSelectPerson }: CompanySidebarProps) {
  const [activeTab, setActiveTab] = useState<CompanyTab>("home");
  const { sidebarWidth, handleResizeStart } = useSidebarResize(400);

  const companyPeople = people.filter((p) => p.company === company.name);

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
          <CompanyIcon name={company.name} />
          <span className="font-medium text-text-primary min-w-0 whitespace-nowrap overflow-hidden text-ellipsis mt-2">{company.name}</span>
          <span className="text-text-muted text-sm min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">Created {company.createdAt}</span>
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
            <SidebarField icon={<GlobeIcon />} label="Domain">
              <span className="text-text-secondary">{company.domain || "—"}</span>
            </SidebarField>
            <SidebarField icon={<UsersIcon />} label="Account Owner">
              <span className="text-text-muted">
                {typeof company.accountOwner === "string"
                  ? company.accountOwner || "—"
                  : company.accountOwner.name}
              </span>
            </SidebarField>
            <SidebarField icon={<HashIcon />} label="Employees">
              <span className="text-text-secondary">{company.employees || "—"}</span>
            </SidebarField>
            <SidebarField icon={<MapPinIcon />} label="Address">
              <span className="text-text-secondary">{company.address || "—"}</span>
            </SidebarField>
            <SidebarField icon={<LinkedinIcon />} label="LinkedIn">
              <span className="text-text-muted">{company.linkedin || "—"}</span>
            </SidebarField>
            <SidebarField icon={<ClockIcon />} label="Last Update">
              <span className="text-text-muted">{company.lastUpdate}</span>
            </SidebarField>

            {/* People at this company */}
            {companyPeople.length > 0 && (
              <div className="mt-6">
                <div className="text-text-muted text-sm mb-2">People ({companyPeople.length})</div>
                <div className="space-y-2">
                  {companyPeople.map((person) => (
                    <button
                      key={person.id}
                      className="flex items-center gap-2 w-full p-2 rounded hover:bg-sidebar-hover transition-colors text-left"
                      onClick={() => onSelectPerson(person)}
                    >
                      <CreatedByAvatar name={person.name} type="user" />
                      <div>
                        <div className="text-text-primary text-sm">{person.name}</div>
                        <div className="text-text-muted text-xs">{person.jobTitle || person.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
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


