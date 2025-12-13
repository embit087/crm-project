import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const groupBy = searchParams.get('groupBy') || 'day';

    // In production, fetch from your backend
    // Mock analytics data
    const mockData = {
      totalCalls: 150,
      totalDuration: 45000, // seconds
      averageDuration: 300, // seconds (5 minutes)
      successRate: 0.85,
      data: [
        { date: '2024-12-10', calls: 25, duration: 7500 },
        { date: '2024-12-11', calls: 30, duration: 9000 },
        { date: '2024-12-12', calls: 28, duration: 8400 },
        { date: '2024-12-13', calls: 35, duration: 10500 },
      ],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Failed to get call analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get call analytics' },
      { status: 500 }
    );
  }
}

