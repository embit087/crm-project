import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;
  
  try {
    const body = await request.json();
    const { notes, userId } = body;

    console.log('Add call notes:', { callId, notes, userId });

    return NextResponse.json({
      success: true,
      callId,
      notes,
    });
  } catch (error) {
    console.error('Failed to add call notes:', error);
    return NextResponse.json(
      { error: 'Failed to add call notes' },
      { status: 500 }
    );
  }
}

