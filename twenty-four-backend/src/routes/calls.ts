import { Env, Call, CallNote, CallTranscript, AuthContext, ApiResponse } from '../types';
import { generateId, parseJsonBody, now, parseQueryParams, formatDuration, timeAgo } from '../utils/helpers';
import { requireAuth } from '../middleware/auth';

// GET /api/calls/history
export async function handleCallHistory(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  const params = parseQueryParams(request.url);
  const limit = Math.min(parseInt(params.limit) || 50, 100);
  const offset = parseInt(params.offset) || 0;
  const contactId = params.contact_id;
  
  let query = 'SELECT * FROM calls WHERE workspace_id = ?';
  const bindings: (string | number)[] = [auth.workspace_id];
  
  if (contactId) {
    query += ' AND contact_id = ?';
    bindings.push(contactId);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  bindings.push(limit, offset);
  
  const result = await env.DB.prepare(query).bind(...bindings).all<Call>();
  
  // Format for frontend with notes and transcripts
  const callsWithDetails = await Promise.all(result.results.map(async (call) => {
    const notes = await env.DB.prepare(
      'SELECT * FROM call_notes WHERE call_id = ? ORDER BY created_at'
    ).bind(call.id).all<CallNote>();
    
    const transcripts = await env.DB.prepare(
      'SELECT * FROM call_transcripts WHERE call_id = ? ORDER BY created_at'
    ).bind(call.id).all<CallTranscript>();
    
    return {
      id: call.id,
      contactName: call.contact_name || 'Unknown',
      contactCompany: '', // Could join with people table
      phoneNumber: call.phone_number,
      duration: formatDuration(call.duration),
      date: formatCallDate(call.created_at),
      direction: call.direction,
      status: call.status,
      transcript: transcripts.results.map(t => ({
        id: t.id,
        speaker: t.speaker,
        text: t.text,
        timestamp: t.timestamp,
      })),
      notes: notes.results.map(n => ({
        id: n.id,
        text: n.text,
        timestamp: n.timestamp,
      })),
      audioUrl: call.recording_url,
    };
  }));
  
  return jsonResponse({ success: true, data: callsWithDetails });
}

// POST /api/calls/initiate
export async function handleInitiateCall(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  if (!auth.workspace_id) {
    return jsonResponse({ success: false, error: 'No workspace selected' }, 400);
  }
  
  const body = await parseJsonBody<{
    phoneNumber: string;
    contactId?: string;
    contactName?: string;
    enableRecording?: boolean;
  }>(request);
  
  if (!body?.phoneNumber) {
    return jsonResponse({ success: false, error: 'Phone number is required' }, 400);
  }
  
  const callId = generateId();
  const timestamp = now();
  
  await env.DB.prepare(`
    INSERT INTO calls (id, workspace_id, phone_number, contact_id, contact_name, direction, status, duration, started_at, created_at)
    VALUES (?, ?, ?, ?, ?, 'outbound', 'initiated', 0, ?, ?)
  `).bind(
    callId,
    auth.workspace_id,
    body.phoneNumber,
    body.contactId || null,
    body.contactName || null,
    timestamp,
    timestamp
  ).run();
  
  return jsonResponse({
    success: true,
    data: {
      callId,
      phoneNumber: body.phoneNumber,
      contactId: body.contactId,
      contactName: body.contactName,
      enableRecording: body.enableRecording,
    },
  });
}

// POST /api/calls/connected
export async function handleCallConnected(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const body = await parseJsonBody<{ callId: string; startTime: string }>(request);
  
  if (!body?.callId) {
    return jsonResponse({ success: false, error: 'Call ID is required' }, 400);
  }
  
  await env.DB.prepare(`
    UPDATE calls SET status = 'connected', started_at = ? WHERE id = ?
  `).bind(body.startTime || now(), body.callId).run();
  
  return jsonResponse({ success: true, message: 'Call connected' });
}

// POST /api/calls/ended
export async function handleCallEnded(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const body = await parseJsonBody<{ callId: string; endTime: string; duration: number }>(request);
  
  if (!body?.callId) {
    return jsonResponse({ success: false, error: 'Call ID is required' }, 400);
  }
  
  await env.DB.prepare(`
    UPDATE calls SET status = 'completed', ended_at = ?, duration = ? WHERE id = ?
  `).bind(body.endTime || now(), body.duration || 0, body.callId).run();
  
  return jsonResponse({ success: true, message: 'Call ended' });
}

// GET /api/calls/:id
export async function handleGetCall(request: Request, env: Env, callId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const call = await env.DB.prepare(
    'SELECT * FROM calls WHERE id = ? AND workspace_id = ?'
  ).bind(callId, auth.workspace_id).first<Call>();
  
  if (!call) {
    return jsonResponse({ success: false, error: 'Call not found' }, 404);
  }
  
  const notes = await env.DB.prepare(
    'SELECT * FROM call_notes WHERE call_id = ? ORDER BY created_at'
  ).bind(callId).all<CallNote>();
  
  const transcripts = await env.DB.prepare(
    'SELECT * FROM call_transcripts WHERE call_id = ? ORDER BY created_at'
  ).bind(callId).all<CallTranscript>();
  
  return jsonResponse({
    success: true,
    data: {
      ...call,
      notes: notes.results,
      transcript: transcripts.results,
      durationFormatted: formatDuration(call.duration),
    },
  });
}

// POST /api/calls/:id/end
export async function handleEndCall(request: Request, env: Env, callId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const call = await env.DB.prepare(
    'SELECT * FROM calls WHERE id = ? AND workspace_id = ?'
  ).bind(callId, auth.workspace_id).first<Call>();
  
  if (!call) {
    return jsonResponse({ success: false, error: 'Call not found' }, 404);
  }
  
  const endTime = now();
  const startTime = call.started_at ? new Date(call.started_at).getTime() : Date.now();
  const duration = Math.floor((Date.now() - startTime) / 1000);
  
  await env.DB.prepare(`
    UPDATE calls SET status = 'completed', ended_at = ?, duration = ? WHERE id = ?
  `).bind(endTime, duration, callId).run();
  
  return jsonResponse({ success: true, message: 'Call ended', data: { duration } });
}

// POST /api/calls/:id/mute
export async function handleMuteCall(request: Request, env: Env, callId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const body = await parseJsonBody<{ muted: boolean }>(request);
  
  // In a real implementation, this would control the actual call
  // For now, we just acknowledge the request
  return jsonResponse({
    success: true,
    message: body?.muted ? 'Call muted' : 'Call unmuted',
    data: { muted: body?.muted },
  });
}

// POST /api/calls/:id/hold
export async function handleHoldCall(request: Request, env: Env, callId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const body = await parseJsonBody<{ onHold: boolean }>(request);
  
  return jsonResponse({
    success: true,
    message: body?.onHold ? 'Call on hold' : 'Call resumed',
    data: { onHold: body?.onHold },
  });
}

// POST /api/calls/:id/transfer
export async function handleTransferCall(request: Request, env: Env, callId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const body = await parseJsonBody<{ transferTo: string }>(request);
  
  if (!body?.transferTo) {
    return jsonResponse({ success: false, error: 'Transfer destination is required' }, 400);
  }
  
  return jsonResponse({
    success: true,
    message: `Call transferred to ${body.transferTo}`,
    data: { transferTo: body.transferTo },
  });
}

// POST /api/calls/:id/notes
export async function handleAddCallNote(request: Request, env: Env, callId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  // Verify call belongs to workspace
  const call = await env.DB.prepare(
    'SELECT id FROM calls WHERE id = ? AND workspace_id = ?'
  ).bind(callId, auth.workspace_id).first();
  
  if (!call) {
    return jsonResponse({ success: false, error: 'Call not found' }, 404);
  }
  
  const body = await parseJsonBody<{ text: string; timestamp: string }>(request);
  
  if (!body?.text) {
    return jsonResponse({ success: false, error: 'Note text is required' }, 400);
  }
  
  const noteId = generateId();
  
  await env.DB.prepare(`
    INSERT INTO call_notes (id, call_id, text, timestamp, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(noteId, callId, body.text, body.timestamp || '00:00', now()).run();
  
  return jsonResponse({
    success: true,
    data: { id: noteId, text: body.text, timestamp: body.timestamp },
  });
}

// GET /api/calls/:id/recording
export async function handleGetRecording(request: Request, env: Env, callId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const auth = authResult as AuthContext;
  
  const call = await env.DB.prepare(
    'SELECT recording_url FROM calls WHERE id = ? AND workspace_id = ?'
  ).bind(callId, auth.workspace_id).first<{ recording_url: string | null }>();
  
  if (!call) {
    return jsonResponse({ success: false, error: 'Call not found' }, 404);
  }
  
  return jsonResponse({
    success: true,
    data: { recordingUrl: call.recording_url },
  });
}

// POST /api/calls/:id/recording
export async function handleRecordingControl(request: Request, env: Env, callId: string): Promise<Response> {
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return authResult;
  
  const body = await parseJsonBody<{ action: 'start' | 'stop' }>(request);
  
  return jsonResponse({
    success: true,
    message: body?.action === 'start' ? 'Recording started' : 'Recording stopped',
    data: { recording: body?.action === 'start' },
  });
}

// Helper functions
function formatCallDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  if (diffDays === 0) return `Today, ${timeStr}`;
  if (diffDays === 1) return `Yesterday, ${timeStr}`;
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`;
}

function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

