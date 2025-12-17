// Environment bindings
export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
  VOXIMPLANT_ACCOUNT_ID?: string;
  VOXIMPLANT_API_KEY?: string;
  VOXIMPLANT_APPLICATION_ID?: string;
  VOXIMPLANT_USER_NAME?: string;
  VOXIMPLANT_USER_PASSWORD?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'admin' | 'member';
  workspace_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
}

// Workspace types
export interface Workspace {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

// CRM Entity types
export interface Person {
  id: string;
  workspace_id: string;
  name: string;
  email: string;
  company: string;
  phones: string;
  city: string;
  job_title: string;
  linkedin: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  workspace_id: string;
  name: string;
  domain: string;
  account_owner: string;
  employees: number | null;
  linkedin: string;
  address: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  workspace_id: string;
  title: string;
  content: string;
  body: string;
  relations: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  workspace_id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string | null;
  assignee: string | null;
  body: string;
  relations: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Call types
export interface Call {
  id: string;
  workspace_id: string;
  phone_number: string;
  contact_id: string | null;
  contact_name: string | null;
  direction: 'inbound' | 'outbound';
  status: 'initiated' | 'ringing' | 'connected' | 'completed' | 'missed' | 'failed';
  duration: number;
  recording_url: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export interface CallNote {
  id: string;
  call_id: string;
  text: string;
  timestamp: string;
  created_at: string;
}

export interface CallTranscript {
  id: string;
  call_id: string;
  speaker: 'agent' | 'contact';
  text: string;
  timestamp: string;
  created_at: string;
}

// API Request/Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

// Auth types
export interface AuthContext {
  user: User;
  workspace_id: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Analytics types
export interface CallAnalytics {
  total_calls: number;
  total_duration: number;
  average_duration: number;
  success_rate: number;
  inbound_calls: number;
  outbound_calls: number;
  missed_calls: number;
}

export interface KeyNumber {
  value: number;
  change: number;
  change_direction: 'up' | 'down' | 'neutral';
}

export interface AnalyticsSummary {
  dashboard_date: string;
  key_numbers: {
    total_leads: KeyNumber;
    new_leads: KeyNumber;
    exhaustions: KeyNumber;
    dial_attempts: KeyNumber;
    pickups: KeyNumber;
    conversions: KeyNumber;
  };
  outbound_health_indicators: {
    unique_dial_rate: { value: string; change: string; change_direction: 'up' | 'down' | 'neutral' };
    contact_rate: { value: string; change: string; change_direction: 'up' | 'down' | 'neutral' };
    number_health: { value: string; change: string; change_direction: 'up' | 'down' | 'neutral' };
  };
}

