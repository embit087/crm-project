import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;
  
  try {
    const body = await request.json();
    const { userId } = body;

    // In production, forward to backend
    console.log('Ending call:', { callId, userId });

    return NextResponse.json({
      success: true,
      callId,
      status: 'completed',
      endTime: new Date(),
    });
  } catch (error) {
    console.error('Failed to end call:', error);
    return NextResponse.json(
      { error: 'Failed to end call' },
      { status: 500 }
    );
  }
}

