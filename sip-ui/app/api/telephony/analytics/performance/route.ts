import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Mock quality metrics data
    const mockData = {
      averageMOS: 4.2, // Mean Opinion Score (1-5, higher is better)
      averageJitter: 15, // ms
      averagePacketLoss: 0.01, // percentage
      callsWithIssues: 5,
      totalCalls: 150,
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Failed to get performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get performance metrics' },
      { status: 500 }
    );
  }
}

