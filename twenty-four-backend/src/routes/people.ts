import { Env, Person, AuthContext, ApiResponse } from '../types';
import { generateId, parseJsonBody, now, parseQueryParams, timeAgo } from '../utils/helpers';
import { requireAuth } from '../middleware/auth';

// GET /api/people
export async function handleListPeople(request: Request, env: Env): Promise<Response> {
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
  
  let query = 'SELECT * FROM people WHERE workspace_id = ?';
  const bindings: (string | number)[] = [auth.workspace_id];
  
  if (search) {
    query += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)';
    const searchPattern = `%${search}%`;
    bindings.push(searchPattern, searchPattern, searchPattern);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  bindings.push(limit, offset);
  
  const result = await env.DB.prepare(query).bind(...bindings).all<Person>();
  
  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM people WHERE workspace_id = ?';
  const countBindings: (string | number)[] = [auth.workspace_id];
  
  if (search) {
    countQuery += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)';
    const searchPattern = `%${search}%`;
    countBindings.push(searchPattern, searchPattern, searchPattern);
  }
  
  const countResult = await env.DB.prepare(countQuery).bind(...countBindings).first<{ count: number }>();
  
  // Format for frontend
  const people = result.results.map(p => ({
    ...p,
    createdBy: { name: p.created_by, type: p.created_by === 'System' ? 'system' : 'user' },
    jobTitle: p.job_title,
    lastUpdate: timeAgo(p.updated_at),
    createdAt: timeAgo(p.created_at),
  }));
  
  return jsonResponse({
    success: true,
    data: people,
    total: countResult?.count || 0,
    page: Math.floor(offset / limit) + 1,
    limit,
  });
}

// POST /api/people
export async function handleCreatePerson(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  const body = await parseJsonBody<Partial<Person>>(request);
  
  const personId = generateId();
  const timestamp = now();
  
  await env.DB.prepare(`
    INSERT INTO people (id, workspace_id, name, email, company, phones, city, job_title, linkedin, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    personId,
    auth.workspace_id,
    body?.name || 'Untitled',
    body?.email || '',
    body?.company || '',
    body?.phones || '',
    body?.city || '',
    body?.job_title || '',
    body?.linkedin || '',
    auth.user.name,
    timestamp,
    timestamp
  ).run();
  
  const person = await env.DB.prepare(
    'SELECT * FROM people WHERE id = ?'
  ).bind(personId).first<Person>();
  
  return jsonResponse({
    success: true,
    data: {
      ...person,
      createdBy: { name: person!.created_by, type: 'user' },
      jobTitle: person!.job_title,
      lastUpdate: 'just now',
      createdAt: 'just now',
    },
  });
}

// GET /api/people/:id
export async function handleGetPerson(request: Request, env: Env, personId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const person = await env.DB.prepare(
    'SELECT * FROM people WHERE id = ? AND workspace_id = ?'
  ).bind(personId, auth.workspace_id).first<Person>();
  
  if (!person) {
    return jsonResponse({ success: false, error: 'Person not found' }, 404);
  }
  
  return jsonResponse({
    success: true,
    data: {
      ...person,
      createdBy: { name: person.created_by, type: person.created_by === 'System' ? 'system' : 'user' },
      jobTitle: person.job_title,
      lastUpdate: timeAgo(person.updated_at),
      createdAt: timeAgo(person.created_at),
    },
  });
}

// PATCH /api/people/:id
export async function handleUpdatePerson(request: Request, env: Env, personId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const body = await parseJsonBody<Partial<Person>>(request);
  
  if (!body) {
    return jsonResponse({ success: false, error: 'Invalid request body' }, 400);
  }
  
  // Check if person exists and belongs to workspace
  const existing = await env.DB.prepare(
    'SELECT id FROM people WHERE id = ? AND workspace_id = ?'
  ).bind(personId, auth.workspace_id).first();
  
  if (!existing) {
    return jsonResponse({ success: false, error: 'Person not found' }, 404);
  }
  
  const updates: string[] = [];
  const values: (string | number | null)[] = [];
  
  const fields: (keyof Person)[] = ['name', 'email', 'company', 'phones', 'city', 'job_title', 'linkedin'];
  
  for (const field of fields) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(body[field] as string);
    }
  }
  
  if (updates.length === 0) {
    return jsonResponse({ success: false, error: 'No fields to update' }, 400);
  }
  
  updates.push('updated_at = ?');
  values.push(now());
  values.push(personId);
  values.push(auth.workspace_id!);
  
  await env.DB.prepare(`
    UPDATE people SET ${updates.join(', ')} WHERE id = ? AND workspace_id = ?
  `).bind(...values).run();
  
  const person = await env.DB.prepare(
    'SELECT * FROM people WHERE id = ?'
  ).bind(personId).first<Person>();
  
  return jsonResponse({
    success: true,
    data: {
      ...person,
      createdBy: { name: person!.created_by, type: person!.created_by === 'System' ? 'system' : 'user' },
      jobTitle: person!.job_title,
      lastUpdate: 'just now',
      createdAt: timeAgo(person!.created_at),
    },
  });
}

// DELETE /api/people/:id
export async function handleDeletePerson(request: Request, env: Env, personId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const result = await env.DB.prepare(
    'DELETE FROM people WHERE id = ? AND workspace_id = ?'
  ).bind(personId, auth.workspace_id).run();
  
  if (result.meta.changes === 0) {
    return jsonResponse({ success: false, error: 'Person not found' }, 404);
  }
  
  return jsonResponse({ success: true, message: 'Person deleted' });
}

// DELETE /api/people (bulk delete)
export async function handleBulkDeletePeople(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const body = await parseJsonBody<{ ids: string[] }>(request);
  
  if (!body?.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
    return jsonResponse({ success: false, error: 'IDs array is required' }, 400);
  }
  
  const placeholders = body.ids.map(() => '?').join(', ');
  
  await env.DB.prepare(`
    DELETE FROM people WHERE id IN (${placeholders}) AND workspace_id = ?
  `).bind(...body.ids, auth.workspace_id).run();
  
  return jsonResponse({ success: true, message: `Deleted ${body.ids.length} people` });
}

// Helper function
function jsonResponse<T>(data: ApiResponse<T> & { total?: number; page?: number; limit?: number }, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

