import { Env, Task, AuthContext, ApiResponse } from '../types';
import { generateId, parseJsonBody, now, parseQueryParams, timeAgo } from '../utils/helpers';
import { requireAuth } from '../middleware/auth';

// GET /api/tasks
export async function handleListTasks(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  const params = parseQueryParams(request.url);
  const limit = Math.min(parseInt(params.limit) || 50, 100);
  const offset = parseInt(params.offset) || 0;
  const status = params.status;
  const assignee = params.assignee;
  
  let query = 'SELECT * FROM tasks WHERE workspace_id = ?';
  const bindings: (string | number)[] = [auth.workspace_id];
  
  if (status) {
    query += ' AND status = ?';
    bindings.push(status);
  }
  
  if (assignee) {
    query += ' AND assignee = ?';
    bindings.push(assignee);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  bindings.push(limit, offset);
  
  const result = await env.DB.prepare(query).bind(...bindings).all<Task>();
  
  // Format for frontend
  const tasks = result.results.map(t => ({
    ...t,
    relations: JSON.parse(t.relations || '[]'),
    dueDate: t.due_date,
    assignee: t.assignee ? { name: t.assignee } : null,
    createdBy: { name: t.created_by, type: t.created_by === 'System' ? 'system' : 'user' },
    creationDate: timeAgo(t.created_at),
    createdAt: timeAgo(t.created_at),
  }));
  
  return jsonResponse({ success: true, data: tasks });
}

// POST /api/tasks
export async function handleCreateTask(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  const body = await parseJsonBody<Partial<Task> & { 
    relations?: string[];
    dueDate?: string;
    assignee?: { name: string } | string | null;
  }>(request);
  
  const taskId = generateId();
  const timestamp = now();
  const relations = JSON.stringify(body?.relations || []);
  const assignee = typeof body?.assignee === 'object' ? body?.assignee?.name : body?.assignee;
  
  await env.DB.prepare(`
    INSERT INTO tasks (id, workspace_id, title, status, due_date, assignee, body, relations, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    taskId,
    auth.workspace_id,
    body?.title || 'Untitled',
    body?.status || 'todo',
    body?.dueDate || body?.due_date || null,
    assignee || null,
    body?.body || '',
    relations,
    auth.user.name,
    timestamp,
    timestamp
  ).run();
  
  const task = await env.DB.prepare(
    'SELECT * FROM tasks WHERE id = ?'
  ).bind(taskId).first<Task>();
  
  return jsonResponse({
    success: true,
    data: {
      ...task,
      relations: JSON.parse(task!.relations || '[]'),
      dueDate: task!.due_date,
      assignee: task!.assignee ? { name: task!.assignee } : null,
      createdBy: { name: task!.created_by, type: 'user' },
      creationDate: 'just now',
      createdAt: 'just now',
    },
  });
}

// GET /api/tasks/:id
export async function handleGetTask(request: Request, env: Env, taskId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const task = await env.DB.prepare(
    'SELECT * FROM tasks WHERE id = ? AND workspace_id = ?'
  ).bind(taskId, auth.workspace_id).first<Task>();
  
  if (!task) {
    return jsonResponse({ success: false, error: 'Task not found' }, 404);
  }
  
  return jsonResponse({
    success: true,
    data: {
      ...task,
      relations: JSON.parse(task.relations || '[]'),
      dueDate: task.due_date,
      assignee: task.assignee ? { name: task.assignee } : null,
      createdBy: { name: task.created_by, type: task.created_by === 'System' ? 'system' : 'user' },
      creationDate: timeAgo(task.created_at),
      createdAt: timeAgo(task.created_at),
    },
  });
}

// PATCH /api/tasks/:id
export async function handleUpdateTask(request: Request, env: Env, taskId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const body = await parseJsonBody<Partial<Task> & { 
    relations?: string[];
    dueDate?: string | null;
    assignee?: { name: string } | string | null;
  }>(request);
  
  if (!body) {
    return jsonResponse({ success: false, error: 'Invalid request body' }, 400);
  }
  
  const existing = await env.DB.prepare(
    'SELECT id FROM tasks WHERE id = ? AND workspace_id = ?'
  ).bind(taskId, auth.workspace_id).first();
  
  if (!existing) {
    return jsonResponse({ success: false, error: 'Task not found' }, 404);
  }
  
  const updates: string[] = [];
  const values: (string | null)[] = [];
  
  if (body.title !== undefined) {
    updates.push('title = ?');
    values.push(body.title);
  }
  if (body.status !== undefined) {
    updates.push('status = ?');
    values.push(body.status);
  }
  if (body.dueDate !== undefined || body.due_date !== undefined) {
    updates.push('due_date = ?');
    values.push(body.dueDate || body.due_date || null);
  }
  if (body.assignee !== undefined) {
    updates.push('assignee = ?');
    const assignee = typeof body.assignee === 'object' ? body.assignee?.name : body.assignee;
    values.push(assignee || null);
  }
  if (body.body !== undefined) {
    updates.push('body = ?');
    values.push(body.body);
  }
  if (body.relations !== undefined) {
    updates.push('relations = ?');
    values.push(JSON.stringify(body.relations));
  }
  
  if (updates.length === 0) {
    return jsonResponse({ success: false, error: 'No fields to update' }, 400);
  }
  
  updates.push('updated_at = ?');
  values.push(now());
  values.push(taskId);
  values.push(auth.workspace_id!);
  
  await env.DB.prepare(`
    UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND workspace_id = ?
  `).bind(...values).run();
  
  const task = await env.DB.prepare(
    'SELECT * FROM tasks WHERE id = ?'
  ).bind(taskId).first<Task>();
  
  return jsonResponse({
    success: true,
    data: {
      ...task,
      relations: JSON.parse(task!.relations || '[]'),
      dueDate: task!.due_date,
      assignee: task!.assignee ? { name: task!.assignee } : null,
      createdBy: { name: task!.created_by, type: task!.created_by === 'System' ? 'system' : 'user' },
      creationDate: timeAgo(task!.created_at),
      createdAt: timeAgo(task!.created_at),
    },
  });
}

// DELETE /api/tasks/:id
export async function handleDeleteTask(request: Request, env: Env, taskId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const result = await env.DB.prepare(
    'DELETE FROM tasks WHERE id = ? AND workspace_id = ?'
  ).bind(taskId, auth.workspace_id).run();
  
  if (result.meta.changes === 0) {
    return jsonResponse({ success: false, error: 'Task not found' }, 404);
  }
  
  return jsonResponse({ success: true, message: 'Task deleted' });
}

// Helper function
function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

