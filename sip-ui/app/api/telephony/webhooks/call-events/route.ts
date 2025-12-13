import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, call } = body;

    // In production, forward to your backend API
    // await fetch(`${BACKEND_API_URL}/api/telephony/webhooks/call-events`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Voximplant-Signature': request.headers.get('x-voximplant-signature') || '',
    //   },
    //   body: JSON.stringify(body),
    // });

    console.log('Webhook event received:', event, call);

    return NextResponse.json({ success: true, event, callId: call?.callId });
  } catch (error) {
    console.error('Failed to handle webhook:', error);
    return NextResponse.json(
      { error: 'Failed to handle webhook' },
      { status: 500 }
    );
  }
}

