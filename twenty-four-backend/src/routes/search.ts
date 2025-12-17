import { Env, AuthContext, ApiResponse, Person, Company, Note } from '../types';
import { parseQueryParams, timeAgo } from '../utils/helpers';
import { requireAuth } from '../middleware/auth';

// GET /api/search
export async function handleSearch(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  const params = parseQueryParams(request.url);
  const query = params.q || params.query || '';
  const limit = Math.min(parseInt(params.limit) || 10, 50);
  
  if (!query.trim()) {
    return jsonResponse({
      success: true,
      data: { people: [], companies: [], notes: [] },
    });
  }
  
  const searchPattern = `%${query}%`;
  
  // Search people
  const peopleResult = await env.DB.prepare(`
    SELECT * FROM people 
    WHERE workspace_id = ? 
    AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR phones LIKE ?)
    ORDER BY name LIMIT ?
  `).bind(auth.workspace_id, searchPattern, searchPattern, searchPattern, searchPattern, limit).all<Person>();
  
  // Search companies
  const companiesResult = await env.DB.prepare(`
    SELECT * FROM companies 
    WHERE workspace_id = ? 
    AND (name LIKE ? OR domain LIKE ?)
    ORDER BY name LIMIT ?
  `).bind(auth.workspace_id, searchPattern, searchPattern, limit).all<Company>();
  
  // Search notes
  const notesResult = await env.DB.prepare(`
    SELECT * FROM notes 
    WHERE workspace_id = ? 
    AND (title LIKE ? OR content LIKE ?)
    ORDER BY updated_at DESC LIMIT ?
  `).bind(auth.workspace_id, searchPattern, searchPattern, limit).all<Note>();
  
  // Format results
  const people = peopleResult.results.map(p => ({
    ...p,
    createdBy: { name: p.created_by, type: p.created_by === 'System' ? 'system' : 'user' },
    jobTitle: p.job_title,
    lastUpdate: timeAgo(p.updated_at),
    createdAt: timeAgo(p.created_at),
  }));
  
  const companies = companiesResult.results.map(c => ({
    ...c,
    createdBy: { name: c.created_by, type: c.created_by === 'System' ? 'system' : 'user' },
    accountOwner: c.account_owner,
    creationDate: timeAgo(c.created_at),
    lastUpdate: timeAgo(c.updated_at),
    createdAt: timeAgo(c.created_at),
  }));
  
  const notes = notesResult.results.map(n => ({
    ...n,
    relations: JSON.parse(n.relations || '[]'),
    createdBy: { name: n.created_by, type: n.created_by === 'System' ? 'system' : 'user' },
    creationDate: timeAgo(n.created_at),
    lastUpdate: timeAgo(n.updated_at),
    createdAt: `Added ${timeAgo(n.created_at)}`.replace(' ago', ''),
  }));
  
  return jsonResponse({
    success: true,
    data: { people, companies, notes },
  });
}

// Helper function
function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

