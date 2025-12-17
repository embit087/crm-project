import { Env, Company, AuthContext, ApiResponse } from '../types';
import { generateId, parseJsonBody, now, parseQueryParams, timeAgo } from '../utils/helpers';
import { requireAuth } from '../middleware/auth';

// GET /api/companies
export async function handleListCompanies(request: Request, env: Env): Promise<Response> {
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
  
  let query = 'SELECT * FROM companies WHERE workspace_id = ?';
  const bindings: (string | number)[] = [auth.workspace_id];
  
  if (search) {
    query += ' AND (name LIKE ? OR domain LIKE ?)';
    const searchPattern = `%${search}%`;
    bindings.push(searchPattern, searchPattern);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  bindings.push(limit, offset);
  
  const result = await env.DB.prepare(query).bind(...bindings).all<Company>();
  
  // Format for frontend
  const companies = result.results.map(c => ({
    ...c,
    createdBy: { name: c.created_by, type: c.created_by === 'System' ? 'system' : 'user' },
    accountOwner: c.account_owner || '',
    creationDate: timeAgo(c.created_at),
    lastUpdate: timeAgo(c.updated_at),
    createdAt: timeAgo(c.created_at),
  }));
  
  return jsonResponse({ success: true, data: companies });
}

// POST /api/companies
export async function handleCreateCompany(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  const body = await parseJsonBody<Partial<Company>>(request);
  
  const companyId = generateId();
  const timestamp = now();
  
  await env.DB.prepare(`
    INSERT INTO companies (id, workspace_id, name, domain, account_owner, employees, linkedin, address, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    companyId,
    auth.workspace_id,
    body?.name || 'Untitled',
    body?.domain || '',
    body?.account_owner || '',
    body?.employees || null,
    body?.linkedin || '',
    body?.address || '',
    auth.user.name,
    timestamp,
    timestamp
  ).run();
  
  const company = await env.DB.prepare(
    'SELECT * FROM companies WHERE id = ?'
  ).bind(companyId).first<Company>();
  
  return jsonResponse({
    success: true,
    data: {
      ...company,
      createdBy: { name: company!.created_by, type: 'user' },
      accountOwner: company!.account_owner,
      creationDate: 'just now',
      lastUpdate: 'just now',
      createdAt: 'just now',
    },
  });
}

// GET /api/companies/:id
export async function handleGetCompany(request: Request, env: Env, companyId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const company = await env.DB.prepare(
    'SELECT * FROM companies WHERE id = ? AND workspace_id = ?'
  ).bind(companyId, auth.workspace_id).first<Company>();
  
  if (!company) {
    return jsonResponse({ success: false, error: 'Company not found' }, 404);
  }
  
  return jsonResponse({
    success: true,
    data: {
      ...company,
      createdBy: { name: company.created_by, type: company.created_by === 'System' ? 'system' : 'user' },
      accountOwner: company.account_owner,
      creationDate: timeAgo(company.created_at),
      lastUpdate: timeAgo(company.updated_at),
      createdAt: timeAgo(company.created_at),
    },
  });
}

// PATCH /api/companies/:id
export async function handleUpdateCompany(request: Request, env: Env, companyId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const body = await parseJsonBody<Partial<Company>>(request);
  
  if (!body) {
    return jsonResponse({ success: false, error: 'Invalid request body' }, 400);
  }
  
  const existing = await env.DB.prepare(
    'SELECT id FROM companies WHERE id = ? AND workspace_id = ?'
  ).bind(companyId, auth.workspace_id).first();
  
  if (!existing) {
    return jsonResponse({ success: false, error: 'Company not found' }, 404);
  }
  
  const updates: string[] = [];
  const values: (string | number | null)[] = [];
  
  const fields: (keyof Company)[] = ['name', 'domain', 'account_owner', 'employees', 'linkedin', 'address'];
  
  for (const field of fields) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(body[field] as string | number | null);
    }
  }
  
  if (updates.length === 0) {
    return jsonResponse({ success: false, error: 'No fields to update' }, 400);
  }
  
  updates.push('updated_at = ?');
  values.push(now());
  values.push(companyId);
  values.push(auth.workspace_id!);
  
  await env.DB.prepare(`
    UPDATE companies SET ${updates.join(', ')} WHERE id = ? AND workspace_id = ?
  `).bind(...values).run();
  
  const company = await env.DB.prepare(
    'SELECT * FROM companies WHERE id = ?'
  ).bind(companyId).first<Company>();
  
  return jsonResponse({
    success: true,
    data: {
      ...company,
      createdBy: { name: company!.created_by, type: company!.created_by === 'System' ? 'system' : 'user' },
      accountOwner: company!.account_owner,
      creationDate: timeAgo(company!.created_at),
      lastUpdate: 'just now',
      createdAt: timeAgo(company!.created_at),
    },
  });
}

// DELETE /api/companies/:id
export async function handleDeleteCompany(request: Request, env: Env, companyId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const result = await env.DB.prepare(
    'DELETE FROM companies WHERE id = ? AND workspace_id = ?'
  ).bind(companyId, auth.workspace_id).run();
  
  if (result.meta.changes === 0) {
    return jsonResponse({ success: false, error: 'Company not found' }, 404);
  }
  
  return jsonResponse({ success: true, message: 'Company deleted' });
}

// Helper function
function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

