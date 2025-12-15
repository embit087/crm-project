"use client";

import { Toolbar } from "@/components/layout/Toolbar";
import { PeopleTable } from "@/components/tables/PeopleTable";
import { PersonSidebar } from "@/components/sidebars/PersonSidebar";
import type { Person } from "@/types";

interface PeopleViewProps {
  people: Person[];
  selectedRows: Set<string>;
  selectedPerson: Person | null;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onSelectPerson: (person: Person | null) => void;
  onFieldUpdate: (personId: string, field: keyof Person, value: string) => void;
  onPhoneClick?: (phoneNumber: string, person: Person) => void;
  onPhoneEdit?: (person: Person) => void;
  personFocusField?: keyof Person;
  onFocusFieldCleared?: () => void;
}

export function PeopleView({
  people,
  selectedRows,
  selectedPerson,
  onToggleRow,
  onToggleAll,
  onSelectPerson,
  onFieldUpdate,
  onPhoneClick,
  onPhoneEdit,
  personFocusField,
  onFocusFieldCleared,
}: PeopleViewProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Toolbar title="All People" count={people.length} />
      <div className="flex-1 flex overflow-hidden">
        <PeopleTable
          people={people}
          selectedRows={selectedRows}
          onToggleRow={onToggleRow}
          onToggleAll={onToggleAll}
          onSelectPerson={onSelectPerson}
          onPhoneClick={onPhoneClick}
          onPhoneEdit={onPhoneEdit}
        />
        {selectedPerson && (
          <PersonSidebar
            person={selectedPerson}
            onClose={() => {
              onSelectPerson(null);
              onFocusFieldCleared?.();
            }}
            onFieldUpdate={onFieldUpdate}
            focusField={personFocusField}
            onFocusComplete={onFocusFieldCleared}
          />
        )}
      </div>
    </div>
  );
}


