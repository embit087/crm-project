// API Client for Twenty-Four Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://twenty-four-backend.developer-f79.workers.dev';

// Token storage
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
}

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return { success: false, error: 'Network error' };
  }
}

// ===== AUTH API =====
export const authApi = {
  async register(email: string, password: string, name: string) {
    const result = await apiRequest<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    if (result.success && result.data?.token) {
      setAuthToken(result.data.token);
    }
    return result;
  },
  
  async login(email: string, password: string) {
    const result = await apiRequest<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result.success && result.data?.token) {
      setAuthToken(result.data.token);
    }
    return result;
  },
  
  async logout() {
    const result = await apiRequest('/api/auth/logout', { method: 'POST' });
    setAuthToken(null);
    return result;
  },
  
  async getSession() {
    return apiRequest<{ user: User }>('/api/auth/session');
  },
};

// ===== WORKSPACE API =====
export const workspaceApi = {
  async create(name: string, logoUrl?: string) {
    return apiRequest<Workspace>('/api/workspaces', {
      method: 'POST',
      body: JSON.stringify({ name, logo_url: logoUrl }),
    });
  },
  
  async get(id: string) {
    return apiRequest<Workspace>(`/api/workspaces/${id}`);
  },
  
  async update(id: string, data: Partial<Workspace>) {
    return apiRequest<Workspace>(`/api/workspaces/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  async getMembers(id: string) {
    return apiRequest<User[]>(`/api/workspaces/${id}/members`);
  },
};

// ===== PEOPLE API =====
export const peopleApi = {
  async list(params?: { search?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    
    const queryStr = query.toString();
    return apiRequest<Person[]>(`/api/people${queryStr ? `?${queryStr}` : ''}`);
  },
  
  async create(data: Partial<Person>) {
    return apiRequest<Person>('/api/people', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async get(id: string) {
    return apiRequest<Person>(`/api/people/${id}`);
  },
  
  async update(id: string, data: Partial<Person>) {
    return apiRequest<Person>(`/api/people/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  async delete(id: string) {
    return apiRequest(`/api/people/${id}`, { method: 'DELETE' });
  },
  
  async bulkDelete(ids: string[]) {
    return apiRequest('/api/people/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  },
};

// ===== COMPANIES API =====
export const companiesApi = {
  async list(params?: { search?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    
    const queryStr = query.toString();
    return apiRequest<Company[]>(`/api/companies${queryStr ? `?${queryStr}` : ''}`);
  },
  
  async create(data: Partial<Company>) {
    return apiRequest<Company>('/api/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async get(id: string) {
    return apiRequest<Company>(`/api/companies/${id}`);
  },
  
  async update(id: string, data: Partial<Company>) {
    return apiRequest<Company>(`/api/companies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  async delete(id: string) {
    return apiRequest(`/api/companies/${id}`, { method: 'DELETE' });
  },
};

// ===== NOTES API =====
export const notesApi = {
  async list(params?: { search?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    
    const queryStr = query.toString();
    return apiRequest<Note[]>(`/api/notes${queryStr ? `?${queryStr}` : ''}`);
  },
  
  async create(data: Partial<Note> & { relations?: string[] }) {
    return apiRequest<Note>('/api/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async get(id: string) {
    return apiRequest<Note>(`/api/notes/${id}`);
  },
  
  async update(id: string, data: Partial<Note> & { relations?: string[] }) {
    return apiRequest<Note>(`/api/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  async delete(id: string) {
    return apiRequest(`/api/notes/${id}`, { method: 'DELETE' });
  },
};

// ===== TASKS API =====
export const tasksApi = {
  async list(params?: { status?: string; assignee?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.assignee) query.set('assignee', params.assignee);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    
    const queryStr = query.toString();
    return apiRequest<Task[]>(`/api/tasks${queryStr ? `?${queryStr}` : ''}`);
  },
  
  async create(data: Partial<Task> & { relations?: string[]; dueDate?: string | null; assignee?: { name: string } | null }) {
    return apiRequest<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async get(id: string) {
    return apiRequest<Task>(`/api/tasks/${id}`);
  },
  
  async update(id: string, data: Partial<Task> & { relations?: string[]; dueDate?: string | null; assignee?: { name: string } | null }) {
    return apiRequest<Task>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  async delete(id: string) {
    return apiRequest(`/api/tasks/${id}`, { method: 'DELETE' });
  },
};

// ===== CALLS API =====
export const callsApi = {
  async getHistory(params?: { contactId?: string; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.contactId) query.set('contact_id', params.contactId);
    if (params?.limit) query.set('limit', params.limit.toString());
    
    const queryStr = query.toString();
    return apiRequest<CallHistoryItem[]>(`/api/calls/history${queryStr ? `?${queryStr}` : ''}`);
  },
  
  async initiate(phoneNumber: string, contactId?: string, contactName?: string, enableRecording?: boolean) {
    return apiRequest<{ callId: string }>('/api/calls/initiate', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, contactId, contactName, enableRecording }),
    });
  },
  
  async connected(callId: string, startTime: string) {
    return apiRequest('/api/calls/connected', {
      method: 'POST',
      body: JSON.stringify({ callId, startTime }),
    });
  },
  
  async ended(callId: string, endTime: string, duration: number) {
    return apiRequest('/api/calls/ended', {
      method: 'POST',
      body: JSON.stringify({ callId, endTime, duration }),
    });
  },
  
  async get(id: string) {
    return apiRequest<Call>(`/api/calls/${id}`);
  },
  
  async end(id: string) {
    return apiRequest(`/api/calls/${id}/end`, { method: 'POST' });
  },
  
  async mute(id: string, muted: boolean) {
    return apiRequest(`/api/calls/${id}/mute`, {
      method: 'POST',
      body: JSON.stringify({ muted }),
    });
  },
  
  async hold(id: string, onHold: boolean) {
    return apiRequest(`/api/calls/${id}/hold`, {
      method: 'POST',
      body: JSON.stringify({ onHold }),
    });
  },
  
  async transfer(id: string, transferTo: string) {
    return apiRequest(`/api/calls/${id}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ transferTo }),
    });
  },
  
  async addNote(id: string, text: string, timestamp: string) {
    return apiRequest(`/api/calls/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text, timestamp }),
    });
  },
  
  async getRecording(id: string) {
    return apiRequest<{ recordingUrl: string | null }>(`/api/calls/${id}/recording`);
  },
  
  async controlRecording(id: string, action: 'start' | 'stop') {
    return apiRequest(`/api/calls/${id}/recording`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  },
};

// ===== ANALYTICS API =====
export const analyticsApi = {
  async getSummary() {
    return apiRequest<AnalyticsSummary>('/api/analytics/summary');
  },
  
  async getPerformance() {
    return apiRequest<AnalyticsPerformance>('/api/analytics/performance');
  },
  
  async getContactAnalytics(contactId: string) {
    return apiRequest<ContactAnalytics>(`/api/analytics/contacts/${contactId}`);
  },
};

// ===== TELEPHONY API =====
export const telephonyApi = {
  async getToken() {
    return apiRequest<{ userName: string; password?: string; token?: string }>('/api/telephony/auth/token');
  },
  
  async getConfig() {
    return apiRequest<{ accountId: string; applicationId: string }>('/api/telephony/auth/config');
  },
};

// ===== SEARCH API =====
export const searchApi = {
  async search(query: string, limit?: number) {
    const params = new URLSearchParams({ q: query });
    if (limit) params.set('limit', limit.toString());
    return apiRequest<{ people: Person[]; companies: Company[]; notes: Note[] }>(`/api/search?${params.toString()}`);
  },
};

// Type definitions
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  workspace_id: string | null;
}

interface Workspace {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Person {
  id: string;
  name: string;
  email: string;
  company: string;
  phones: string;
  city: string;
  jobTitle: string;
  linkedin: string;
  createdBy: { name: string; type: string };
  createdAt: string;
  lastUpdate: string;
}

interface Company {
  id: string;
  name: string;
  domain: string;
  accountOwner: string;
  employees: number | null;
  linkedin: string;
  address: string;
  createdBy: { name: string; type: string };
  creationDate: string;
  createdAt: string;
  lastUpdate: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  body: string;
  relations: string[];
  createdBy: { name: string; type: string };
  creationDate: string;
  createdAt: string;
  lastUpdate: string;
}

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string | null;
  assignee: { name: string } | null;
  body: string;
  relations: string[];
  createdBy: { name: string; type: string };
  creationDate: string;
  createdAt: string;
}

interface Call {
  id: string;
  phone_number: string;
  contact_id: string | null;
  contact_name: string | null;
  direction: 'inbound' | 'outbound';
  status: string;
  duration: number;
  recording_url: string | null;
  started_at: string | null;
  ended_at: string | null;
}

interface CallHistoryItem {
  id: string;
  contactName: string;
  contactCompany: string;
  phoneNumber: string;
  duration: string;
  date: string;
  direction: 'inbound' | 'outbound';
  transcript: { id: string; speaker: string; text: string; timestamp: string }[];
  notes: { id: string; text: string; timestamp: string }[];
  audioUrl: string | null;
}

interface AnalyticsSummary {
  dashboard_date: string;
  key_numbers: {
    total_leads: { value: number; change: number; change_direction: string };
    new_leads: { value: number; change: number; change_direction: string };
    exhaustions: { value: number; change: number; change_direction: string };
    dial_attempts: { value: number; change: number; change_direction: string };
    pickups: { value: number; change: number; change_direction: string };
    conversions: { value: number; change: number; change_direction: string };
  };
  outbound_health_indicators: {
    unique_dial_rate: { value: string; change: string; change_direction: string };
    contact_rate: { value: string; change: string; change_direction: string };
    number_health: { value: string; change: string; change_direction: string };
  };
}

interface AnalyticsPerformance {
  totalCalls: number;
  totalDuration: number;
  averageDuration: number;
  successRate: number;
  qualityMetrics: { mos: number; jitter: number; packetLoss: number };
}

interface ContactAnalytics {
  contactId: string;
  stats: { totalCalls: number; totalDuration: number; averageDuration: number; lastCall: string | null };
  recentCalls: Call[];
}

