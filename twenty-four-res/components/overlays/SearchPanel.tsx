"use client";

import { XIcon, SearchIcon } from "@/components/icons";
import { CompanyIcon, CreatedByAvatar } from "@/components/ui/Avatar";
import type { Person, Company, Note, ActiveNav } from "@/types";

interface SearchPanelProps {
  isOpen: boolean;
  searchQuery: string;
  searchResults: {
    people: Person[];
    companies: Company[];
    notes: Note[];
  };
  onClose: () => void;
  onSearchChange: (query: string) => void;
  onSelectPerson: (person: Person) => void;
  onSelectCompany: (company: Company) => void;
  onSelectNote: (note: Note) => void;
  onNavigate: (nav: ActiveNav) => void;
}

export function SearchPanel({
  isOpen,
  searchQuery,
  searchResults,
  onClose,
  onSearchChange,
  onSelectPerson,
  onSelectCompany,
  onSelectNote,
  onNavigate,
}: SearchPanelProps) {
  if (!isOpen) return null;

  const hasResults =
    searchResults.people.length > 0 ||
    searchResults.companies.length > 0 ||
    searchResults.notes.length > 0;

  return (
    <div className="search-panel">
      <div className="search-panel-header">
        <button className="search-close-btn" onClick={onClose}>
          <XIcon />
        </button>
        <SearchIcon />
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoFocus
        />
      </div>
      <div className="search-results">
        {!searchQuery.trim() ? (
          <div className="search-empty">
            <span className="text-text-muted">Type to search...</span>
          </div>
        ) : !hasResults ? (
          <div className="search-empty">
            <span className="text-text-muted">No results found</span>
          </div>
        ) : (
          <>
            {searchResults.people.length > 0 && (
              <>
                <div className="search-section-label">People</div>
                <div className="search-results-list">
                  {searchResults.people.map((person) => (
                    <button
                      key={person.id}
                      className="search-result-item"
                      onClick={() => {
                        onSelectPerson(person);
                        onNavigate("people");
                        onClose();
                      }}
                    >
                      <CreatedByAvatar name={person.name} type="user" />
                      <div>
                        <div className="search-result-name">{person.name}</div>
                        <div className="search-result-type">{person.email || "Person"}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
            {searchResults.companies.length > 0 && (
              <>
                <div className="search-section-label">Companies</div>
                <div className="search-results-list">
                  {searchResults.companies.map((company) => (
                    <button
                      key={company.id}
                      className="search-result-item"
                      onClick={() => {
                        onSelectCompany(company);
                        onNavigate("companies");
                        onClose();
                      }}
                    >
                      <CompanyIcon name={company.name} />
                      <div>
                        <div className="search-result-name">{company.name}</div>
                        <div className="search-result-type">{company.domain || "Company"}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
            {searchResults.notes.length > 0 && (
              <>
                <div className="search-section-label">Notes</div>
                <div className="search-results-list">
                  {searchResults.notes.map((note) => (
                    <button
                      key={note.id}
                      className="search-result-item"
                      onClick={() => {
                        onSelectNote(note);
                        onNavigate("notes");
                        onClose();
                      }}
                    >
                      <div className="search-result-icon search-result-icon-note">📝</div>
                      <div>
                        <div className="search-result-name">{note.title}</div>
                        <div className="search-result-type">Note</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}


