import { NextResponse } from 'next/server';

// Get call details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;
  
  try {
    // In production, fetch from your backend
    // const response = await fetch(`${BACKEND_API_URL}/api/telephony/calls/${callId}`);
    
    // Mock response
    return NextResponse.json({
      id: callId,
      phoneNumber: '+1234567890',
      direction: 'outbound',
      status: 'completed',
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() - 3500000),
      duration: 100,
      recordingUrl: null,
      contactName: 'Test Contact',
    });
  } catch (error) {
    console.error('Failed to get call details:', error);
    return NextResponse.json(
      { error: 'Failed to get call details' },
      { status: 500 }
    );
  }
}

