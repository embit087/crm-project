"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SearchPanel } from "@/components/overlays/SearchPanel";
import { CallFab } from "@/components/ui/CallFab";
import { PeopleView } from "@/components/views/PeopleView";
import { CompaniesView } from "@/components/views/CompaniesView";
import { NotesView } from "@/components/views/NotesView";
import { TasksView } from "@/components/views/TasksView";
import { PlaceholderView } from "@/components/views/PlaceholderView";
import { useKeyboardShortcuts } from "@/hooks";
import { initialCompanies, initialPeople, initialNotes, initialTasks } from "@/data/seed";
import type { Company, Person, Note, Task, ActiveNav, TasksView as TasksViewType } from "@/types";

export default function Home() {
  // Navigation state
  const [activeNav, setActiveNav] = useState<ActiveNav>("people");
  const [activeTasksView, setActiveTasksView] = useState<TasksViewType>("all");
  
  // Data state
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [favoriteNotes, setFavoriteNotes] = useState<Set<string>>(new Set());
  
  // UI state
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Row selection handlers
  const toggleRow = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const toggleAllPeople = useCallback(() => {
    setSelectedRows((prev) =>
      prev.size === people.length ? new Set() : new Set(people.map((p) => p.id))
    );
  }, [people]);

  const toggleAllCompanies = useCallback(() => {
    setSelectedRows((prev) =>
      prev.size === companies.length ? new Set() : new Set(companies.map((c) => c.id))
    );
  }, [companies]);

  const toggleAllNotes = useCallback(() => {
    setSelectedRows((prev) =>
      prev.size === notes.length ? new Set() : new Set(notes.map((n) => n.id))
    );
  }, [notes]);

  // Data update handlers
  const updatePersonField = useCallback((personId: string, field: keyof Person, value: string) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, [field]: value, lastUpdate: "just now" } : p))
    );
    setSelectedPerson((prev) =>
      prev?.id === personId ? { ...prev, [field]: value, lastUpdate: "just now" } : prev
    );
  }, []);

  const handleDomainChange = useCallback((companyId: string, newDomain: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, domain: newDomain } : c))
    );
  }, []);

  // Note handlers
  const addNewNote = useCallback(() => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "Untitled",
      content: "",
      body: "",
      createdBy: { name: "Jimmy Wu", type: "user" },
      createdAt: "Added now",
      creationDate: "just now",
      lastUpdate: "just now",
      relations: [],
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote);
  }, []);

  const updateNoteTitle = useCallback((noteId: string, title: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, title, lastUpdate: "just now" } : n))
    );
    setSelectedNote((prev) => (prev?.id === noteId ? { ...prev, title, lastUpdate: "just now" } : prev));
  }, []);

  const updateNoteContent = useCallback((noteId: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, content, lastUpdate: "just now" } : n))
    );
    setSelectedNote((prev) => (prev?.id === noteId ? { ...prev, content, lastUpdate: "just now" } : prev));
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    setSelectedNote((prev) => (prev?.id === noteId ? null : prev));
    setFavoriteNotes((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.delete(noteId);
      return newFavorites;
    });
  }, []);

  const toggleNoteFavorite = useCallback((noteId: string) => {
    setFavoriteNotes((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(noteId)) {
        newFavorites.delete(noteId);
      } else {
        newFavorites.add(noteId);
      }
      return newFavorites;
    });
  }, []);

  // Delete selected rows
  const deleteSelectedRows = useCallback(() => {
    if (selectedRows.size === 0) return;

    if (activeNav === "people") {
      setPeople((prev) => prev.filter((p) => !selectedRows.has(p.id)));
      if (selectedPerson && selectedRows.has(selectedPerson.id)) {
        setSelectedPerson(null);
      }
    } else if (activeNav === "companies") {
      setCompanies((prev) => prev.filter((c) => !selectedRows.has(c.id)));
      if (selectedCompany && selectedRows.has(selectedCompany.id)) {
        setSelectedCompany(null);
      }
    } else if (activeNav === "notes") {
      setNotes((prev) => prev.filter((n) => !selectedRows.has(n.id)));
      if (selectedNote && selectedRows.has(selectedNote.id)) {
        setSelectedNote(null);
      }
    }
    setSelectedRows(new Set());
  }, [activeNav, selectedRows, selectedPerson, selectedCompany, selectedNote]);

  // Navigation handler
  const handleNavChange = useCallback((nav: ActiveNav) => {
    setActiveNav(nav);
    setSelectedNote(null);
    setSelectedPerson(null);
    setSelectedCompany(null);
    setSelectedRows(new Set());
  }, []);

  // Tasks view handler
  const handleTasksViewChange = useCallback((view: TasksViewType) => {
    setActiveTasksView(view);
  }, []);

  // New record handler
  const handleNewRecord = useCallback(() => {
    if (activeNav === "notes") {
      addNewNote();
    }
  }, [activeNav, addNewNote]);

  // Search results computation
  const searchResults = searchQuery.trim()
    ? {
        people: people.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.company.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        companies: companies.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.domain.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        notes: notes.filter(
          (n) =>
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.content.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }
    : { people: [], companies: [], notes: [] };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => setShowSearchPanel(true),
    onEscape: () => {
      setShowSearchPanel(false);
      setSearchQuery("");
    },
    onNewRecord: handleNewRecord,
    isSearchOpen: showSearchPanel,
  });

  // Render the appropriate view based on active navigation
  const renderView = () => {
    switch (activeNav) {
      case "people":
        return (
          <PeopleView
            people={people}
            selectedRows={selectedRows}
            selectedPerson={selectedPerson}
            onToggleRow={toggleRow}
            onToggleAll={toggleAllPeople}
            onSelectPerson={setSelectedPerson}
            onFieldUpdate={updatePersonField}
          />
        );
      case "companies":
        return (
          <CompaniesView
            companies={companies}
            people={people}
            selectedRows={selectedRows}
            selectedCompany={selectedCompany}
            onToggleRow={toggleRow}
            onToggleAll={toggleAllCompanies}
            onSelectCompany={setSelectedCompany}
            onDomainChange={handleDomainChange}
            onSelectPerson={(person) => {
              setSelectedCompany(null);
              setActiveNav("people");
              setSelectedPerson(person);
            }}
          />
        );
      case "notes":
        return (
          <NotesView
            notes={notes}
            selectedRows={selectedRows}
            selectedNote={selectedNote}
            onToggleRow={toggleRow}
            onToggleAll={toggleAllNotes}
            onSelectNote={setSelectedNote}
            onAddNote={addNewNote}
            onTitleChange={updateNoteTitle}
            onContentChange={updateNoteContent}
          />
        );
      case "tasks":
        return (
          <TasksView
            tasks={tasks}
            onUpdateTasks={setTasks}
            currentUser="Jimmy Wu"
            activeView={activeTasksView}
            onViewChange={handleTasksViewChange}
          />
        );
      case "opportunities":
      case "workflows":
        return <PlaceholderView title={activeNav} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-main-bg">
      <Sidebar
        activeNav={activeNav}
        activeTasksView={activeTasksView}
        onNavChange={handleNavChange}
        onTasksViewChange={handleTasksViewChange}
        onSearchClick={() => setShowSearchPanel(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeNav={activeNav}
          selectedRows={selectedRows}
          selectedNote={selectedNote}
          favoriteNotes={favoriteNotes}
          onClearSelection={() => setSelectedRows(new Set())}
          onDeleteSelected={deleteSelectedRows}
          onNewRecord={handleNewRecord}
          onToggleFavorite={toggleNoteFavorite}
          onDeleteNote={deleteNote}
          onCloseNote={() => setSelectedNote(null)}
        />

        {renderView()}
      </main>

      <SearchPanel
        isOpen={showSearchPanel}
        searchQuery={searchQuery}
        searchResults={searchResults}
        onClose={() => setShowSearchPanel(false)}
        onSearchChange={setSearchQuery}
        onSelectPerson={setSelectedPerson}
        onSelectCompany={setSelectedCompany}
        onSelectNote={setSelectedNote}
        onNavigate={handleNavChange}
      />

      <CallFab />
    </div>
  );
}
