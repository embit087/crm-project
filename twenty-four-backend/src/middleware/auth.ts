import { Env, User, AuthContext } from '../types';

const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days in seconds

// Extract token from Authorization header
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Get session from KV store
export async function getSession(env: Env, token: string): Promise<AuthContext | null> {
  try {
    const sessionData = await env.SESSIONS.get(token, 'json');
    if (!sessionData) return null;
    
    const session = sessionData as { user_id: string; expires_at: string };
    
    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      await env.SESSIONS.delete(token);
      return null;
    }
    
    // Get user from database
    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(session.user_id).first<User>();
    
    if (!user) return null;
    
    return {
      user,
      workspace_id: user.workspace_id,
    };
  } catch {
    return null;
  }
}

// Create session and store in KV
export async function createSession(env: Env, user: User, token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_TTL * 1000).toISOString();
  
  await env.SESSIONS.put(
    token,
    JSON.stringify({
      user_id: user.id,
      expires_at: expiresAt,
    }),
    { expirationTtl: SESSION_TTL }
  );
}

// Delete session
export async function deleteSession(env: Env, token: string): Promise<void> {
  await env.SESSIONS.delete(token);
}

// Middleware to require authentication
export async function requireAuth(
  request: Request,
  env: Env
): Promise<AuthContext | Response> {
  const token = extractToken(request);
  
  if (!token) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Authentication required',
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const authContext = await getSession(env, token);
  
  if (!authContext) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid or expired session',
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return authContext;
}

// Optional auth - doesn't fail if no token
export async function optionalAuth(
  request: Request,
  env: Env
): Promise<AuthContext | null> {
  const token = extractToken(request);
  if (!token) return null;
  return getSession(env, token);
}

