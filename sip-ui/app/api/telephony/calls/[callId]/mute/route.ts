import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;
  
  try {
    const body = await request.json();
    const { muted, userId } = body;

    console.log('Mute call:', { callId, muted, userId });

    return NextResponse.json({
      success: true,
      callId,
      muted,
    });
  } catch (error) {
    console.error('Failed to mute call:', error);
    return NextResponse.json(
      { error: 'Failed to mute call' },
      { status: 500 }
    );
  }
}

