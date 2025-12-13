"use client";

import { useState } from "react";
import { BuildingIcon, GlobeIcon, UsersIcon, CalendarIcon, HashIcon, PlusIcon, ChevronDownIcon } from "@/components/icons";
import { CreatedByAvatar, CompanyIcon } from "@/components/ui/Avatar";
import { useColumnResize } from "@/hooks";
import type { Company } from "@/types";

const companyColumns = [
  { key: "checkbox", label: "", icon: null },
  { key: "name", label: "Name", icon: <BuildingIcon /> },
  { key: "domain", label: "Domain", icon: <GlobeIcon /> },
  { key: "createdBy", label: "Created by", icon: <UsersIcon /> },
  { key: "accountOwner", label: "Account Owner", icon: <UsersIcon /> },
  { key: "creationDate", label: "Creation date", icon: <CalendarIcon /> },
  { key: "employees", label: "Employees", icon: <HashIcon /> },
];

interface CompaniesTableProps {
  companies: Company[];
  selectedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onSelectCompany: (company: Company) => void;
  onDomainChange: (companyId: string, domain: string) => void;
}

export function CompaniesTable({
  companies,
  selectedRows,
  onToggleRow,
  onToggleAll,
  onSelectCompany,
  onDomainChange,
}: CompaniesTableProps) {
  const { columnWidths, handleColumnResizeStart } = useColumnResize();
  const [editingDomain, setEditingDomain] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-auto table-container">
      <table className="crm-table">
        <thead>
          <tr>
            {companyColumns.map((col) => (
              <th key={col.key} style={{ width: columnWidths[col.key] }}>
                <div className="flex items-center gap-1.5">
                  {col.icon}
                  {col.label && <span>{col.label}</span>}
                  {col.key === "checkbox" && (
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedRows.size === companies.length && companies.length > 0}
                      onChange={onToggleAll}
                    />
                  )}
                </div>
                {col.key !== "checkbox" && (
                  <div
                    className="resize-handle"
                    onMouseDown={(e) => handleColumnResizeStart(e, col.key)}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {companies.map((company, index) => (
            <tr
              key={company.id}
              className={`animate-fade-in animate-delay-${Math.min(index + 1, 5)}`}
              style={{ opacity: 0 }}
            >
              <td style={{ width: columnWidths.checkbox }}>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedRows.has(company.id)}
                  onChange={() => onToggleRow(company.id)}
                />
              </td>
              <td style={{ width: columnWidths.name }}>
                <div
                  className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onSelectCompany(company)}
                >
                  <CompanyIcon name={company.name} />
                  <span className={company.name === "Untitled" ? "text-text-muted" : "text-text-primary"}>
                    {company.name}
                  </span>
                </div>
              </td>
              <td style={{ width: columnWidths.domain }}>
                {editingDomain === company.id ? (
                  <input
                    type="text"
                    className="editable-input"
                    value={company.domain}
                    onChange={(e) => onDomainChange(company.id, e.target.value)}
                    onBlur={() => setEditingDomain(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingDomain(null)}
                    autoFocus
                  />
                ) : company.domain ? (
                  <span
                    className="domain-tag clickable"
                    onClick={() => setEditingDomain(company.id)}
                  >
                    {company.domain}
                  </span>
                ) : (
                  <span
                    className="text-text-muted cursor-pointer hover:text-text-secondary"
                    onClick={() => setEditingDomain(company.id)}
                  >
                    Domain
                  </span>
                )}
              </td>
              <td style={{ width: columnWidths.createdBy }}>
                <div className="flex items-center gap-2">
                  <CreatedByAvatar name={company.createdBy.name} type={company.createdBy.type} />
                  <span className="text-text-secondary">{company.createdBy.name}</span>
                </div>
              </td>
              <td style={{ width: columnWidths.accountOwner }} className="text-text-muted">
                {typeof company.accountOwner === "string"
                  ? company.accountOwner || "Account Owner"
                  : company.accountOwner.name}
              </td>
              <td style={{ width: columnWidths.creationDate }} className="text-text-secondary">
                {company.creationDate}
              </td>
              <td style={{ width: columnWidths.employees }} className="text-text-secondary">
                {company.employees || ""}
              </td>
            </tr>
          ))}
          {/* Add new row */}
          <tr className="opacity-60 hover:opacity-100 transition-opacity">
            <td></td>
            <td>
              <button className="flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors">
                <PlusIcon />
                <span>Add New</span>
              </button>
            </td>
            <td colSpan={5}></td>
          </tr>
          {/* Calculate row */}
          <tr className="opacity-60">
            <td></td>
            <td>
              <button className="flex items-center gap-1 text-text-muted text-sm">
                <span>Calculate</span>
                <ChevronDownIcon />
              </button>
            </td>
            <td colSpan={5}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

