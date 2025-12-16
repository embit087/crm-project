// CRM Entity Types

export interface Company {
  id: string;
  name: string;
  domain: string;
  createdBy: { name: string; type: "user" | "system" };
  accountOwner: { name: string; type: "user" | "system" } | string;
  creationDate: string;
  createdAt: string;
  lastUpdate: string;
  employees: number | null;
  linkedin: string;
  address: string;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  company: string;
  phones: string;
  createdBy: { name: string; type: "user" | "system" };
  city: string;
  jobTitle: string;
  linkedin: string;
  lastUpdate: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  body: string;
  createdBy: { name: string; type: "user" | "system" };
  createdAt: string;
  creationDate: string;
  lastUpdate: string;
  relations: string[];
}

export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  relations: string[];
  createdBy: { name: string; type: "user" | "system" };
  dueDate: string | null;
  assignee: { name: string; avatar?: string } | null;
  body: string;
  creationDate: string;
  createdAt: string;
}

export interface ColumnWidth {
  [key: string]: number;
}

export interface TableColumn {
  key: string;
  label: string;
  icon: React.ReactNode | null;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface FilterField {
  key: string;
  label: string;
  icon: React.ReactNode;
}

export type PersonTab = "home" | "tasks" | "notes" | "files";
export type CompanyTab = "home" | "tasks" | "notes" | "files";
export type NoteTab = "note" | "timeline" | "files";
export type TasksView = "all" | "by_status" | "assigned_to_me";
export type ActiveNav = "people" | "companies" | "tasks" | "notes" | "analytics";


