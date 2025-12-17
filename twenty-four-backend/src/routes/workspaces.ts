import { Env, Workspace, AuthContext, ApiResponse } from '../types';
import { generateId, parseJsonBody, now } from '../utils/helpers';
import { requireAuth } from '../middleware/auth';

// POST /api/workspaces
export async function handleCreateWorkspace(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const body = await parseJsonBody<{ name: string; logo_url?: string }>(request);
  
  if (!body || !body.name) {
    return jsonResponse({ success: false, error: 'Workspace name is required' }, 400);
  }
  
  const workspaceId = generateId();
  const timestamp = now();
  
  // Create workspace
  await env.DB.prepare(`
    INSERT INTO workspaces (id, name, logo_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(workspaceId, body.name, body.logo_url || null, timestamp, timestamp).run();
  
  // Update user with workspace_id
  await env.DB.prepare(`
    UPDATE users SET workspace_id = ?, updated_at = ? WHERE id = ?
  `).bind(workspaceId, timestamp, auth.user.id).run();
  
  const workspace: Workspace = {
    id: workspaceId,
    name: body.name,
    logo_url: body.logo_url || null,
    created_at: timestamp,
    updated_at: timestamp,
  };
  
  return jsonResponse({ success: true, data: workspace });
}

// GET /api/workspaces/:id
export async function handleGetWorkspace(request: Request, env: Env, workspaceId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const workspace = await env.DB.prepare(
    'SELECT * FROM workspaces WHERE id = ?'
  ).bind(workspaceId).first<Workspace>();
  
  if (!workspace) {
    return jsonResponse({ success: false, error: 'Workspace not found' }, 404);
  }
  
  return jsonResponse({ success: true, data: workspace });
}

// PATCH /api/workspaces/:id
export async function handleUpdateWorkspace(request: Request, env: Env, workspaceId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  // Check if user belongs to this workspace
  if (auth.user.workspace_id !== workspaceId) {
    return jsonResponse({ success: false, error: 'Access denied' }, 403);
  }
  
  const body = await parseJsonBody<{ name?: string; logo_url?: string }>(request);
  
  if (!body) {
    return jsonResponse({ success: false, error: 'Invalid request body' }, 400);
  }
  
  const updates: string[] = [];
  const values: (string | null)[] = [];
  
  if (body.name !== undefined) {
    updates.push('name = ?');
    values.push(body.name);
  }
  if (body.logo_url !== undefined) {
    updates.push('logo_url = ?');
    values.push(body.logo_url);
  }
  
  if (updates.length === 0) {
    return jsonResponse({ success: false, error: 'No fields to update' }, 400);
  }
  
  updates.push('updated_at = ?');
  values.push(now());
  values.push(workspaceId);
  
  await env.DB.prepare(`
    UPDATE workspaces SET ${updates.join(', ')} WHERE id = ?
  `).bind(...values).run();
  
  const workspace = await env.DB.prepare(
    'SELECT * FROM workspaces WHERE id = ?'
  ).bind(workspaceId).first<Workspace>();
  
  return jsonResponse({ success: true, data: workspace });
}

// GET /api/workspaces/:id/members
export async function handleGetWorkspaceMembers(request: Request, env: Env, workspaceId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const members = await env.DB.prepare(`
    SELECT id, email, name, role, created_at FROM users WHERE workspace_id = ?
  `).bind(workspaceId).all();
  
  return jsonResponse({ success: true, data: members.results });
}

// Helper function
function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

