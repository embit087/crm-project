"use client";

interface TabButtonProps {
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export function TabButton({ label, icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      className={`tab-button ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

