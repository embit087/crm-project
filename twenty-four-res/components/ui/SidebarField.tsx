"use client";

interface SidebarFieldProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

export function SidebarField({ icon, label, children }: SidebarFieldProps) {
  return (
    <div className="sidebar-field">
      <div className="sidebar-field-label">
        {icon}
        <span className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
      </div>
      <div className="sidebar-field-value">{children}</div>
    </div>
  );
}

interface PropertyRowProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

export function PropertyRow({ icon, label, children }: PropertyRowProps) {
  return (
    <div className="property-row">
      <div className="property-label">
        {icon}
        <span className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
      </div>
      <div className="property-value min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">{children}</div>
    </div>
  );
}


