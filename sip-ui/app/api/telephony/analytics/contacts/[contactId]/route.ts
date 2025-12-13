import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contactId: string }> }
) {
  const { contactId } = await params;
  
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Mock contact call history
    const mockData = [
      {
        id: '1',
        direction: 'outbound',
        status: 'completed',
        phoneNumber: '+1234567890',
        duration: 180,
        startTime: new Date(Date.now() - 86400000),
        recordingUrl: null,
      },
      {
        id: '2',
        direction: 'inbound',
        status: 'completed',
        phoneNumber: '+1234567890',
        duration: 240,
        startTime: new Date(Date.now() - 172800000),
        recordingUrl: null,
      },
    ];

    return NextResponse.json(mockData.slice(0, limit));
  } catch (error) {
    console.error('Failed to get contact call history:', error);
    return NextResponse.json(
      { error: 'Failed to get contact call history' },
      { status: 500 }
    );
  }
}

