/**
 * Twenty-Four CRM Backend
 * Cloudflare Worker API
 */

import { Env } from './types';
import { handleOptions, withCors } from './middleware/cors';
import { initializeDatabase } from './db/schema';

// Auth routes
import { handleRegister, handleLogin, handleLogout, handleGetSession } from './routes/auth';

// Workspace routes
import { handleCreateWorkspace, handleGetWorkspace, handleUpdateWorkspace, handleGetWorkspaceMembers } from './routes/workspaces';

// CRM routes
import { handleListPeople, handleCreatePerson, handleGetPerson, handleUpdatePerson, handleDeletePerson, handleBulkDeletePeople } from './routes/people';
import { handleListCompanies, handleCreateCompany, handleGetCompany, handleUpdateCompany, handleDeleteCompany } from './routes/companies';
import { handleListNotes, handleCreateNote, handleGetNote, handleUpdateNote, handleDeleteNote } from './routes/notes';
import { handleListTasks, handleCreateTask, handleGetTask, handleUpdateTask, handleDeleteTask } from './routes/tasks';

// Call routes
import { 
  handleCallHistory, handleInitiateCall, handleCallConnected, handleCallEnded,
  handleGetCall, handleEndCall, handleMuteCall, handleHoldCall, handleTransferCall,
  handleAddCallNote, handleGetRecording, handleRecordingControl 
} from './routes/calls';

// Analytics routes
import { handleAnalyticsSummary, handleAnalyticsPerformance, handleContactAnalytics } from './routes/analytics';

// Telephony routes
import { handleTelephonyToken, handleTelephonyConfig, handleCallWebhook } from './routes/telephony';

// Search routes
import { handleSearch } from './routes/search';

// Route matching helper
function matchRoute(method: string, path: string, pattern: string, expectedMethod: string): string[] | null {
  if (method !== expectedMethod) return null;
  
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  
  if (patternParts.length !== pathParts.length) return null;
  
  const params: string[] = [];
  
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params.push(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  
  return params;
}

// Main request handler
async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return handleOptions(env);
  }
  
  // Health check
  if (path === '/' || path === '/health') {
    return jsonResponse({ success: true, message: 'Twenty-Four CRM API', version: '1.0.0' });
  }
  
  // Initialize database on first request (creates tables if needed)
  if (path === '/api/init') {
    try {
      await initializeDatabase(env.DB);
      return jsonResponse({ success: true, message: 'Database initialized' });
    } catch (error) {
      return jsonResponse({ success: false, error: String(error) }, 500);
    }
  }
  
  let response: Response;
  let params: string[] | null;
  
  try {
    // ===== AUTH ROUTES =====
    if ((params = matchRoute(method, path, '/api/auth/register', 'POST'))) {
      response = await handleRegister(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/auth/login', 'POST'))) {
      response = await handleLogin(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/auth/logout', 'POST'))) {
      response = await handleLogout(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/auth/session', 'GET'))) {
      response = await handleGetSession(request, env);
    }
    
    // ===== WORKSPACE ROUTES =====
    else if ((params = matchRoute(method, path, '/api/workspaces', 'POST'))) {
      response = await handleCreateWorkspace(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/workspaces/:id', 'GET'))) {
      response = await handleGetWorkspace(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/workspaces/:id', 'PATCH'))) {
      response = await handleUpdateWorkspace(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/workspaces/:id/members', 'GET'))) {
      response = await handleGetWorkspaceMembers(request, env, params[0]);
    }
    
    // ===== PEOPLE ROUTES =====
    else if ((params = matchRoute(method, path, '/api/people', 'GET'))) {
      response = await handleListPeople(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/people', 'POST'))) {
      response = await handleCreatePerson(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/people/bulk-delete', 'POST'))) {
      response = await handleBulkDeletePeople(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/people/:id', 'GET'))) {
      response = await handleGetPerson(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/people/:id', 'PATCH'))) {
      response = await handleUpdatePerson(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/people/:id', 'DELETE'))) {
      response = await handleDeletePerson(request, env, params[0]);
    }
    
    // ===== COMPANIES ROUTES =====
    else if ((params = matchRoute(method, path, '/api/companies', 'GET'))) {
      response = await handleListCompanies(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/companies', 'POST'))) {
      response = await handleCreateCompany(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/companies/:id', 'GET'))) {
      response = await handleGetCompany(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/companies/:id', 'PATCH'))) {
      response = await handleUpdateCompany(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/companies/:id', 'DELETE'))) {
      response = await handleDeleteCompany(request, env, params[0]);
    }
    
    // ===== NOTES ROUTES =====
    else if ((params = matchRoute(method, path, '/api/notes', 'GET'))) {
      response = await handleListNotes(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/notes', 'POST'))) {
      response = await handleCreateNote(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/notes/:id', 'GET'))) {
      response = await handleGetNote(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/notes/:id', 'PATCH'))) {
      response = await handleUpdateNote(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/notes/:id', 'DELETE'))) {
      response = await handleDeleteNote(request, env, params[0]);
    }
    
    // ===== TASKS ROUTES =====
    else if ((params = matchRoute(method, path, '/api/tasks', 'GET'))) {
      response = await handleListTasks(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/tasks', 'POST'))) {
      response = await handleCreateTask(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/tasks/:id', 'GET'))) {
      response = await handleGetTask(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/tasks/:id', 'PATCH'))) {
      response = await handleUpdateTask(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/tasks/:id', 'DELETE'))) {
      response = await handleDeleteTask(request, env, params[0]);
    }
    
    // ===== CALLS ROUTES =====
    else if ((params = matchRoute(method, path, '/api/calls/history', 'GET'))) {
      response = await handleCallHistory(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/calls/initiate', 'POST'))) {
      response = await handleInitiateCall(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/calls/connected', 'POST'))) {
      response = await handleCallConnected(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/calls/ended', 'POST'))) {
      response = await handleCallEnded(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/calls/:id', 'GET'))) {
      response = await handleGetCall(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/calls/:id/end', 'POST'))) {
      response = await handleEndCall(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/calls/:id/mute', 'POST'))) {
      response = await handleMuteCall(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/calls/:id/hold', 'POST'))) {
      response = await handleHoldCall(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/calls/:id/transfer', 'POST'))) {
      response = await handleTransferCall(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/calls/:id/notes', 'POST'))) {
      response = await handleAddCallNote(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/calls/:id/recording', 'GET'))) {
      response = await handleGetRecording(request, env, params[0]);
    }
    else if ((params = matchRoute(method, path, '/api/calls/:id/recording', 'POST'))) {
      response = await handleRecordingControl(request, env, params[0]);
    }
    
    // ===== TELEPHONY ROUTES =====
    else if ((params = matchRoute(method, path, '/api/telephony/auth/token', 'GET'))) {
      response = await handleTelephonyToken(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/telephony/auth/config', 'GET'))) {
      response = await handleTelephonyConfig(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/telephony/webhooks/call-events', 'POST'))) {
      response = await handleCallWebhook(request, env);
    }
    
    // ===== ANALYTICS ROUTES =====
    else if ((params = matchRoute(method, path, '/api/analytics/summary', 'GET'))) {
      response = await handleAnalyticsSummary(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/analytics/performance', 'GET'))) {
      response = await handleAnalyticsPerformance(request, env);
    }
    else if ((params = matchRoute(method, path, '/api/analytics/contacts/:contactId', 'GET'))) {
      response = await handleContactAnalytics(request, env, params[0]);
    }
    
    // ===== SEARCH ROUTE =====
    else if ((params = matchRoute(method, path, '/api/search', 'GET'))) {
      response = await handleSearch(request, env);
    }
    
    // ===== 404 NOT FOUND =====
    else {
      response = jsonResponse({ success: false, error: `Route not found: ${method} ${path}` }, 404);
    }
  } catch (error) {
    console.error('Request error:', error);
    response = jsonResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, 500);
  }
  
  // Add CORS headers to all responses
  return withCors(response, env);
}

// JSON response helper
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Export the worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, env);
  },
} satisfies ExportedHandler<Env>;
