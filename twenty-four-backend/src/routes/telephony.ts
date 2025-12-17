import { Env, ApiResponse } from '../types';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { parseJsonBody } from '../utils/helpers';

// GET /api/telephony/auth/token
export async function handleTelephonyToken(request: Request, env: Env): Promise<Response> {
  // Try to get auth context, but don't require it for token endpoint
  const auth = await optionalAuth(request, env);
  
  // In production, generate JWT tokens for Voximplant
  // For now, return mock credentials or use env vars
  const credentials = {
    userName: env.VOXIMPLANT_USER_NAME || 'user@app.account.voximplant.com',
    password: env.VOXIMPLANT_USER_PASSWORD || '',
    accountId: env.VOXIMPLANT_ACCOUNT_ID || '',
    applicationId: env.VOXIMPLANT_APPLICATION_ID || '',
  };
  
  // If password is set, return password-based auth
  if (credentials.password) {
    return jsonResponse({
      success: true,
      data: {
        userName: credentials.userName,
        password: credentials.password,
      },
    });
  }
  
  // Otherwise return a mock token for development
  return jsonResponse({
    success: true,
    data: {
      userName: credentials.userName,
      token: 'mock-voximplant-token-for-development',
    },
  });
}

// GET /api/telephony/auth/config
export async function handleTelephonyConfig(request: Request, env: Env): Promise<Response> {
  return jsonResponse({
    success: true,
    data: {
      accountId: env.VOXIMPLANT_ACCOUNT_ID || '',
      applicationId: env.VOXIMPLANT_APPLICATION_ID || '',
      applicationName: 'crm-calling',
    },
  });
}

// POST /api/telephony/webhooks/call-events
export async function handleCallWebhook(request: Request, env: Env): Promise<Response> {
  // Webhook doesn't require user auth - verify using signature instead
  // In production, validate webhook signature
  
  const body = await parseJsonBody<{
    event: string;
    call_id: string;
    status?: string;
    duration?: number;
    recording_url?: string;
    timestamp?: string;
  }>(request);
  
  if (!body) {
    return jsonResponse({ success: false, error: 'Invalid webhook payload' }, 400);
  }
  
  console.log('Webhook received:', body.event, body.call_id);
  
  switch (body.event) {
    case 'call.started':
      await env.DB.prepare(`
        UPDATE calls SET status = 'ringing', started_at = ? WHERE id = ?
      `).bind(body.timestamp || new Date().toISOString(), body.call_id).run();
      break;
      
    case 'call.connected':
      await env.DB.prepare(`
        UPDATE calls SET status = 'connected' WHERE id = ?
      `).bind(body.call_id).run();
      break;
      
    case 'call.ended':
      await env.DB.prepare(`
        UPDATE calls SET status = 'completed', duration = ?, ended_at = ?, recording_url = ? WHERE id = ?
      `).bind(
        body.duration || 0,
        body.timestamp || new Date().toISOString(),
        body.recording_url || null,
        body.call_id
      ).run();
      break;
      
    case 'call.failed':
      await env.DB.prepare(`
        UPDATE calls SET status = 'failed' WHERE id = ?
      `).bind(body.call_id).run();
      break;
      
    case 'recording.ready':
      if (body.recording_url) {
        await env.DB.prepare(`
          UPDATE calls SET recording_url = ? WHERE id = ?
        `).bind(body.recording_url, body.call_id).run();
      }
      break;
  }
  
  return jsonResponse({ success: true, message: 'Webhook processed' });
}

// Helper function
function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

