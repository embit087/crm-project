import { Env, AuthContext, ApiResponse, AnalyticsSummary } from '../types';
import { parseQueryParams } from '../utils/helpers';
import { requireAuth } from '../middleware/auth';

// GET /api/analytics/summary
export async function handleAnalyticsSummary(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  // Get call statistics
  const stats = await env.DB.prepare(`
    SELECT 
      COUNT(*) as total_calls,
      SUM(duration) as total_duration,
      AVG(duration) as avg_duration,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_calls,
      SUM(CASE WHEN direction = 'inbound' THEN 1 ELSE 0 END) as inbound_calls,
      SUM(CASE WHEN direction = 'outbound' THEN 1 ELSE 0 END) as outbound_calls,
      SUM(CASE WHEN status = 'missed' THEN 1 ELSE 0 END) as missed_calls
    FROM calls 
    WHERE workspace_id = ?
  `).bind(auth.workspace_id).first<{
    total_calls: number;
    total_duration: number;
    avg_duration: number;
    completed_calls: number;
    inbound_calls: number;
    outbound_calls: number;
    missed_calls: number;
  }>();
  
  // Get people count
  const peopleCount = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM people WHERE workspace_id = ?'
  ).bind(auth.workspace_id).first<{ count: number }>();
  
  // Calculate success rate
  const successRate = stats?.total_calls && stats.total_calls > 0
    ? Math.round((stats.completed_calls / stats.total_calls) * 100)
    : 0;
  
  const summary: AnalyticsSummary = {
    dashboard_date: new Date().toISOString().split('T')[0],
    key_numbers: {
      total_leads: {
        value: peopleCount?.count || 0,
        change: 0,
        change_direction: 'neutral',
      },
      new_leads: {
        value: 0, // Would need date filtering
        change: 0,
        change_direction: 'neutral',
      },
      exhaustions: {
        value: 0,
        change: 0,
        change_direction: 'neutral',
      },
      dial_attempts: {
        value: stats?.outbound_calls || 0,
        change: 0,
        change_direction: 'neutral',
      },
      pickups: {
        value: stats?.completed_calls || 0,
        change: 0,
        change_direction: 'neutral',
      },
      conversions: {
        value: 0,
        change: 0,
        change_direction: 'neutral',
      },
    },
    outbound_health_indicators: {
      unique_dial_rate: {
        value: '0%',
        change: '0%',
        change_direction: 'neutral',
      },
      contact_rate: {
        value: `${successRate}%`,
        change: '0%',
        change_direction: 'neutral',
      },
      number_health: {
        value: '100%',
        change: '0%',
        change_direction: 'neutral',
      },
    },
  };
  
  return jsonResponse({ success: true, data: summary });
}

// GET /api/analytics/performance
export async function handleAnalyticsPerformance(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  const stats = await env.DB.prepare(`
    SELECT 
      COUNT(*) as total_calls,
      SUM(duration) as total_duration,
      AVG(duration) as avg_duration,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_calls
    FROM calls 
    WHERE workspace_id = ?
  `).bind(auth.workspace_id).first<{
    total_calls: number;
    total_duration: number;
    avg_duration: number;
    completed_calls: number;
  }>();
  
  const successRate = stats?.total_calls && stats.total_calls > 0
    ? (stats.completed_calls / stats.total_calls) * 100
    : 0;
  
  return jsonResponse({
    success: true,
    data: {
      totalCalls: stats?.total_calls || 0,
      totalDuration: stats?.total_duration || 0,
      averageDuration: Math.round(stats?.avg_duration || 0),
      successRate: Math.round(successRate * 100) / 100,
      // Mock quality metrics - would come from actual Voximplant data
      qualityMetrics: {
        mos: 4.2,
        jitter: 15,
        packetLoss: 0.1,
      },
    },
  });
}

// GET /api/analytics/contacts/:contactId
export async function handleContactAnalytics(request: Request, env: Env, contactId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  // Get contact's call history
  const calls = await env.DB.prepare(`
    SELECT * FROM calls 
    WHERE workspace_id = ? AND contact_id = ?
    ORDER BY created_at DESC
    LIMIT 20
  `).bind(auth.workspace_id, contactId).all();
  
  // Get aggregated stats for this contact
  const stats = await env.DB.prepare(`
    SELECT 
      COUNT(*) as total_calls,
      SUM(duration) as total_duration,
      AVG(duration) as avg_duration,
      MAX(created_at) as last_call
    FROM calls 
    WHERE workspace_id = ? AND contact_id = ?
  `).bind(auth.workspace_id, contactId).first<{
    total_calls: number;
    total_duration: number;
    avg_duration: number;
    last_call: string;
  }>();
  
  return jsonResponse({
    success: true,
    data: {
      contactId,
      stats: {
        totalCalls: stats?.total_calls || 0,
        totalDuration: stats?.total_duration || 0,
        averageDuration: Math.round(stats?.avg_duration || 0),
        lastCall: stats?.last_call || null,
      },
      recentCalls: calls.results,
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

