import { NextResponse } from 'next/server';

// Voximplant configuration - in production, use environment variables
const VOXIMPLANT_CONFIG = {
  userName: 'testuser',
  password: 'TestPassword123!',
  applicationName: 'call.ne1432hz.n2.voximplant.com',
  accountName: 'ne1432hz',
};

export async function GET() {
  try {
    // In production, you would:
    // 1. Get user from session/auth
    // 2. Generate one-time token via Voximplant API
    // 3. Return token instead of password

    return NextResponse.json({
      userName: `${VOXIMPLANT_CONFIG.userName}@${VOXIMPLANT_CONFIG.applicationName}.${VOXIMPLANT_CONFIG.accountName}.voximplant.com`,
      password: VOXIMPLANT_CONFIG.password,
      applicationName: `${VOXIMPLANT_CONFIG.applicationName}.${VOXIMPLANT_CONFIG.accountName}.voximplant.com`,
    });
  } catch (error) {
    console.error('Failed to generate auth token:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication token' },
      { status: 500 }
    );
  }
}

