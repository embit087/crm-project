import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const contactId = searchParams.get('contactId');
    const direction = searchParams.get('direction');

    // In production, forward to your backend API
    // const response = await fetch(
    //   `${BACKEND_API_URL}/api/telephony/calls/history?${searchParams.toString()}`,
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //     },
    //   }
    // );

    // Mock data for now
    const mockHistory = [
      {
        id: '1',
        phoneNumber: '+886906698135',
        direction: 'outbound',
        status: 'completed',
        startTime: new Date(Date.now() - 3600000),
        duration: 120,
        contactName: 'John Doe',
      },
      {
        id: '2',
        phoneNumber: '+886912345678',
        direction: 'inbound',
        status: 'completed',
        startTime: new Date(Date.now() - 7200000),
        duration: 300,
        contactName: 'Jane Smith',
      },
    ];

    return NextResponse.json({
      data: mockHistory,
      total: mockHistory.length,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Failed to fetch call history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch call history' },
      { status: 500 }
    );
  }
}

