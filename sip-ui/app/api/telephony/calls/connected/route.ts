import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { callId, startTime } = body;

    // In production, forward to your backend API
    // await fetch(`${BACKEND_API_URL}/api/telephony/calls/connected`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(body),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to handle call connected:', error);
    return NextResponse.json(
      { error: 'Failed to handle call connected' },
      { status: 500 }
    );
  }
}

