"use client";

import { Toolbar } from "@/components/layout/Toolbar";
import { CompaniesTable } from "@/components/tables/CompaniesTable";
import { CompanySidebar } from "@/components/sidebars/CompanySidebar";
import type { Company, Person } from "@/types";

interface CompaniesViewProps {
  companies: Company[];
  people: Person[];
  selectedRows: Set<string>;
  selectedCompany: Company | null;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onSelectCompany: (company: Company | null) => void;
  onDomainChange: (companyId: string, domain: string) => void;
  onSelectPerson: (person: Person) => void;
}

export function CompaniesView({
  companies,
  people,
  selectedRows,
  selectedCompany,
  onToggleRow,
  onToggleAll,
  onSelectCompany,
  onDomainChange,
  onSelectPerson,
}: CompaniesViewProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Toolbar title="All Companies" count={companies.length} />
      <div className="flex-1 flex overflow-hidden">
        <CompaniesTable
          companies={companies}
          selectedRows={selectedRows}
          onToggleRow={onToggleRow}
          onToggleAll={onToggleAll}
          onSelectCompany={onSelectCompany}
          onDomainChange={onDomainChange}
        />
        {selectedCompany && (
          <CompanySidebar
            company={selectedCompany}
            people={people}
            onClose={() => onSelectCompany(null)}
            onSelectPerson={onSelectPerson}
          />
        )}
      </div>
    </div>
  );
}


