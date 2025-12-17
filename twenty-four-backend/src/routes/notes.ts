import { Env, Note, AuthContext, ApiResponse } from '../types';
import { generateId, parseJsonBody, now, parseQueryParams, timeAgo } from '../utils/helpers';
import { requireAuth } from '../middleware/auth';

// GET /api/notes
export async function handleListNotes(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  const params = parseQueryParams(request.url);
  const limit = Math.min(parseInt(params.limit) || 50, 100);
  const offset = parseInt(params.offset) || 0;
  const search = params.search || '';
  
  let query = 'SELECT * FROM notes WHERE workspace_id = ?';
  const bindings: (string | number)[] = [auth.workspace_id];
  
  if (search) {
    query += ' AND (title LIKE ? OR content LIKE ?)';
    const searchPattern = `%${search}%`;
    bindings.push(searchPattern, searchPattern);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  bindings.push(limit, offset);
  
  const result = await env.DB.prepare(query).bind(...bindings).all<Note>();
  
  // Format for frontend
  const notes = result.results.map(n => ({
    ...n,
    relations: JSON.parse(n.relations || '[]'),
    createdBy: { name: n.created_by, type: n.created_by === 'System' ? 'system' : 'user' },
    creationDate: timeAgo(n.created_at),
    lastUpdate: timeAgo(n.updated_at),
    createdAt: `Added ${timeAgo(n.created_at)}`.replace(' ago', ''),
  }));
  
  return jsonResponse({ success: true, data: notes });
}

// POST /api/notes
export async function handleCreateNote(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  const body = await parseJsonBody<Partial<Note> & { relations?: string[] }>(request);
  
  const noteId = generateId();
  const timestamp = now();
  const relations = JSON.stringify(body?.relations || []);
  
  await env.DB.prepare(`
    INSERT INTO notes (id, workspace_id, title, content, body, relations, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    noteId,
    auth.workspace_id,
    body?.title || 'Untitled',
    body?.content || '',
    body?.body || '',
    relations,
    auth.user.name,
    timestamp,
    timestamp
  ).run();
  
  const note = await env.DB.prepare(
    'SELECT * FROM notes WHERE id = ?'
  ).bind(noteId).first<Note>();
  
  return jsonResponse({
    success: true,
    data: {
      ...note,
      relations: JSON.parse(note!.relations || '[]'),
      createdBy: { name: note!.created_by, type: 'user' },
      creationDate: 'just now',
      lastUpdate: 'just now',
      createdAt: 'Added now',
    },
  });
}

// GET /api/notes/:id
export async function handleGetNote(request: Request, env: Env, noteId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const note = await env.DB.prepare(
    'SELECT * FROM notes WHERE id = ? AND workspace_id = ?'
  ).bind(noteId, auth.workspace_id).first<Note>();
  
  if (!note) {
    return jsonResponse({ success: false, error: 'Note not found' }, 404);
  }
  
  return jsonResponse({
    success: true,
    data: {
      ...note,
      relations: JSON.parse(note.relations || '[]'),
      createdBy: { name: note.created_by, type: note.created_by === 'System' ? 'system' : 'user' },
      creationDate: timeAgo(note.created_at),
      lastUpdate: timeAgo(note.updated_at),
      createdAt: `Added ${timeAgo(note.created_at)}`.replace(' ago', ''),
    },
  });
}

// PATCH /api/notes/:id
export async function handleUpdateNote(request: Request, env: Env, noteId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const body = await parseJsonBody<Partial<Note> & { relations?: string[] }>(request);
  
  if (!body) {
    return jsonResponse({ success: false, error: 'Invalid request body' }, 400);
  }
  
  const existing = await env.DB.prepare(
    'SELECT id FROM notes WHERE id = ? AND workspace_id = ?'
  ).bind(noteId, auth.workspace_id).first();
  
  if (!existing) {
    return jsonResponse({ success: false, error: 'Note not found' }, 404);
  }
  
  const updates: string[] = [];
  const values: (string | null)[] = [];
  
  if (body.title !== undefined) {
    updates.push('title = ?');
    values.push(body.title);
  }
  if (body.content !== undefined) {
    updates.push('content = ?');
    values.push(body.content);
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
  values.push(noteId);
  values.push(auth.workspace_id!);
  
  await env.DB.prepare(`
    UPDATE notes SET ${updates.join(', ')} WHERE id = ? AND workspace_id = ?
  `).bind(...values).run();
  
  const note = await env.DB.prepare(
    'SELECT * FROM notes WHERE id = ?'
  ).bind(noteId).first<Note>();
  
  return jsonResponse({
    success: true,
    data: {
      ...note,
      relations: JSON.parse(note!.relations || '[]'),
      createdBy: { name: note!.created_by, type: note!.created_by === 'System' ? 'system' : 'user' },
      creationDate: timeAgo(note!.created_at),
      lastUpdate: 'just now',
      createdAt: `Added ${timeAgo(note!.created_at)}`.replace(' ago', ''),
    },
  });
}

// DELETE /api/notes/:id
export async function handleDeleteNote(request: Request, env: Env, noteId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const result = await env.DB.prepare(
    'DELETE FROM notes WHERE id = ? AND workspace_id = ?'
  ).bind(noteId, auth.workspace_id).run();
  
  if (result.meta.changes === 0) {
    return jsonResponse({ success: false, error: 'Note not found' }, 404);
  }
  
  return jsonResponse({ success: true, message: 'Note deleted' });
}

// Helper function
function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

