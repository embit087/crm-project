import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;
  
  try {
    // In production, fetch from your backend or Voximplant
    console.log('Get recording for call:', callId);

    // Mock response - in production this would return actual recording URL
    return NextResponse.json({
      callId,
      recordingUrl: null, // Would be Voximplant recording URL
      duration: 0,
    });
  } catch (error) {
    console.error('Failed to get call recording:', error);
    return NextResponse.json(
      { error: 'Failed to get call recording' },
      { status: 500 }
    );
  }
}

// Start/Stop recording
export async function POST(
  request: Request,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;
  
  try {
    const body = await request.json();
    const { action } = body; // 'start' or 'stop'

    console.log('Recording action:', { callId, action });

    return NextResponse.json({
      success: true,
      callId,
      recording: action === 'start',
    });
  } catch (error) {
    console.error('Failed to control recording:', error);
    return NextResponse.json(
      { error: 'Failed to control recording' },
      { status: 500 }
    );
  }
}

