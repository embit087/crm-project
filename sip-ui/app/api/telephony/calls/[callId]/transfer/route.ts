import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;
  
  try {
    const body = await request.json();
    const { transferTo, userId } = body;

    if (!transferTo) {
      return NextResponse.json(
        { error: 'Transfer destination is required' },
        { status: 400 }
      );
    }

    console.log('Transfer call:', { callId, transferTo, userId });

    return NextResponse.json({
      success: true,
      callId,
      transferredTo: transferTo,
    });
  } catch (error) {
    console.error('Failed to transfer call:', error);
    return NextResponse.json(
      { error: 'Failed to transfer call' },
      { status: 500 }
    );
  }
}

