import { Env, User, LoginRequest, RegisterRequest, ApiResponse } from '../types';
import { generateId, hashPassword, verifyPassword, generateToken, parseJsonBody, now, isValidEmail } from '../utils/helpers';
import { createSession, deleteSession, extractToken, getSession } from '../middleware/auth';

// POST /api/auth/register
export async function handleRegister(request: Request, env: Env): Promise<Response> {
  const body = await parseJsonBody<RegisterRequest>(request);
  
  if (!body || !body.email || !body.password || !body.name) {
    return jsonResponse({ success: false, error: 'Email, password, and name are required' }, 400);
  }
  
  if (!isValidEmail(body.email)) {
    return jsonResponse({ success: false, error: 'Invalid email format' }, 400);
  }
  
  if (body.password.length < 8) {
    return jsonResponse({ success: false, error: 'Password must be at least 8 characters' }, 400);
  }
  
  // Check if user already exists
  const existing = await env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(body.email.toLowerCase()).first();
  
  if (existing) {
    return jsonResponse({ success: false, error: 'Email already registered' }, 409);
  }
  
  // Create user
  const userId = generateId();
  const passwordHash = await hashPassword(body.password);
  const timestamp = now();
  
  await env.DB.prepare(`
    INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'admin', ?, ?)
  `).bind(userId, body.email.toLowerCase(), body.name, passwordHash, timestamp, timestamp).run();
  
  // Create session
  const token = generateToken();
  const user: User = {
    id: userId,
    email: body.email.toLowerCase(),
    name: body.name,
    password_hash: passwordHash,
    role: 'admin',
    workspace_id: null,
    created_at: timestamp,
    updated_at: timestamp,
  };
  
  await createSession(env, user, token);
  
  return jsonResponse({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        workspace_id: user.workspace_id,
      },
    },
  });
}

// POST /api/auth/login
export async function handleLogin(request: Request, env: Env): Promise<Response> {
  const body = await parseJsonBody<LoginRequest>(request);
  
  if (!body || !body.email || !body.password) {
    return jsonResponse({ success: false, error: 'Email and password are required' }, 400);
  }
  
  // Find user
  const user = await env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(body.email.toLowerCase()).first<User>();
  
  if (!user) {
    return jsonResponse({ success: false, error: 'Invalid email or password' }, 401);
  }
  
  // Verify password
  const isValid = await verifyPassword(body.password, user.password_hash);
  if (!isValid) {
    return jsonResponse({ success: false, error: 'Invalid email or password' }, 401);
  }
  
  // Create session
  const token = generateToken();
  await createSession(env, user, token);
  
  return jsonResponse({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        workspace_id: user.workspace_id,
      },
    },
  });
}

// POST /api/auth/logout
export async function handleLogout(request: Request, env: Env): Promise<Response> {
  const token = extractToken(request);
  
  if (token) {
    await deleteSession(env, token);
  }
  
  return jsonResponse({ success: true, message: 'Logged out successfully' });
}

// GET /api/auth/session
export async function handleGetSession(request: Request, env: Env): Promise<Response> {
  const token = extractToken(request);
  
  if (!token) {
    return jsonResponse({ success: false, error: 'No session' }, 401);
  }
  
  const authContext = await getSession(env, token);
  
  if (!authContext) {
    return jsonResponse({ success: false, error: 'Invalid or expired session' }, 401);
  }
  
  return jsonResponse({
    success: true,
    data: {
      user: {
        id: authContext.user.id,
        email: authContext.user.email,
        name: authContext.user.name,
        role: authContext.user.role,
        workspace_id: authContext.user.workspace_id,
      },
    },
  });
}

// Helper function
function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

