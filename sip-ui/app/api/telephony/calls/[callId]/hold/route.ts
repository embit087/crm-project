import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;
  
  try {
    const body = await request.json();
    const { onHold, userId } = body;

    console.log('Hold call:', { callId, onHold, userId });

    return NextResponse.json({
      success: true,
      callId,
      onHold,
    });
  } catch (error) {
    console.error('Failed to hold call:', error);
    return NextResponse.json(
      { error: 'Failed to hold call' },
      { status: 500 }
    );
  }
}

