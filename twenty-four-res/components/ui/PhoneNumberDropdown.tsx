"use client";

import { useEffect, useRef } from "react";
import { EditIcon, PhoneIcon } from "@/components/icons";
import type { Person } from "@/types";

interface PhoneNumberDropdownProps {
  phoneNumber: string;
  person: Person;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: (person: Person) => void;
  onCall: (phoneNumber: string, person: Person) => void;
}

export function PhoneNumberDropdown({
  phoneNumber,
  person,
  position,
  onClose,
  onEdit,
  onCall,
}: PhoneNumberDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="phone-number-dropdown"
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <button
        className="phone-dropdown-item"
        onClick={() => {
          onEdit(person);
          onClose();
        }}
      >
        <EditIcon />
        <span>Edit</span>
      </button>
      <button
        className="phone-dropdown-item"
        onClick={() => {
          onCall(phoneNumber, person);
          onClose();
        }}
      >
        <PhoneIcon />
        <span>Call</span>
      </button>
    </div>
  );
}
