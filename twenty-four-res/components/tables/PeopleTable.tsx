"use client";

import { UsersIcon, MailIcon, BuildingIcon, PhoneIcon, PlusIcon, ChevronDownIcon } from "@/components/icons";
import { CreatedByAvatar, CompanyIcon } from "@/components/ui/Avatar";
import { useColumnResize, useColumnReorder } from "@/hooks";
import type { Person } from "@/types";

const peopleColumns = [
  { key: "checkbox", label: "", icon: null },
  { key: "name", label: "Name", icon: <UsersIcon /> },
  { key: "email", label: "Email", icon: <MailIcon /> },
  { key: "createdBy", label: "Created by", icon: <UsersIcon /> },
  { key: "company", label: "Company", icon: <BuildingIcon /> },
  { key: "phones", label: "Phones", icon: <PhoneIcon /> },
];

interface PeopleTableProps {
  people: Person[];
  selectedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onSelectPerson: (person: Person) => void;
}

export function PeopleTable({
  people,
  selectedRows,
  onToggleRow,
  onToggleAll,
  onSelectPerson,
}: PeopleTableProps) {
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
  } = useColumnReorder(peopleColumns, "people-column-order");

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
                        checked={selectedRows.size === people.length && people.length > 0}
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
        <tbody>
          {people.map((person, index) => (
            <tr
              key={person.id}
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
                        checked={selectedRows.has(person.id)}
                        onChange={() => onToggleRow(person.id)}
                      />
                    </td>
                  );
                }
                if (col.key === "name") {
                  return (
                    <td key={col.key} style={{ width: `${columnWidths.name}px` }}>
                      <div
                        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => onSelectPerson(person)}
                      >
                        <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold bg-tag-bg text-text-muted mr-2 flex-shrink-0">
                          {person.name === "Untitled" ? "-" : person.name[0]}
                        </div>
                        <span className={person.name === "Untitled" ? "text-text-muted" : "text-text-primary"}>
                          {person.name}
                        </span>
                      </div>
                    </td>
                  );
                }
                if (col.key === "email") {
                  return (
                    <td key={col.key} style={{ width: `${columnWidths.email}px` }} className="text-text-muted">
                      {person.email || "Email"}
                    </td>
                  );
                }
                if (col.key === "createdBy") {
                  return (
                    <td key={col.key} style={{ width: `${columnWidths.createdBy}px` }}>
                      <div className="flex items-center gap-2">
                        <CreatedByAvatar name={person.createdBy.name} type={person.createdBy.type} />
                        <span className="text-text-secondary">{person.createdBy.name}</span>
                      </div>
                    </td>
                  );
                }
                if (col.key === "company") {
                  return (
                    <td key={col.key} style={{ width: `${columnWidths.company}px` }}>
                      {person.company ? (
                        <div className="flex items-center">
                          <CompanyIcon name={person.company} />
                          <span className="text-text-secondary">{person.company}</span>
                        </div>
                      ) : (
                        <span className="text-text-muted">Company</span>
                      )}
                    </td>
                  );
                }
                if (col.key === "phones") {
                  return (
                    <td key={col.key} style={{ width: `${columnWidths.phones}px` }} className="text-text-secondary">
                      {person.phones || <span className="text-text-muted">Phones</span>}
                    </td>
                  );
                }
                return null;
              })}
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
            <td colSpan={4}></td>
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
            <td colSpan={4}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


