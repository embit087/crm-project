"use client";

import { XIcon, MailIcon, CalendarIcon, UsersIcon, BuildingIcon } from "@/components/icons";

interface FilterDropdownProps {
  onClose: () => void;
}

const filterFields = [
  { key: "email", label: "Email", icon: <MailIcon /> },
  { key: "createdAt", label: "Created at", icon: <CalendarIcon /> },
  { key: "createdBy", label: "Created by", icon: <UsersIcon /> },
  { key: "company", label: "Company", icon: <BuildingIcon /> },
];

export function FilterDropdown({ onClose }: FilterDropdownProps) {
  return (
    <div className="filter-dropdown">
      <div className="filter-dropdown-header">
        <button className="filter-close-btn" onClick={onClose}>
          <XIcon />
        </button>
        <span className="filter-title">Filter</span>
      </div>
      <div className="filter-search">
        <input
          type="text"
          className="filter-search-input"
          placeholder="Search fields..."
        />
      </div>
      <div className="filter-section-label">Fields</div>
      <div className="filter-fields-list">
        {filterFields.map((field) => (
          <button key={field.key} className="filter-field-item">
            {field.icon}
            <span>{field.label}</span>
          </button>
        ))}
      </div>
      <div className="filter-footer">
        <button className="filter-field-item">
          <span className="text-accent-blue">+ Add filter</span>
        </button>
      </div>
    </div>
  );
}

