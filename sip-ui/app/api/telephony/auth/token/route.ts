import { NextResponse } from 'next/server';

// Voximplant configuration from environment variables
const VOXIMPLANT_CONFIG = {
  userName: process.env.VOXIMPLANT_WEB_SDK_USERNAME || 'testuser',
  password: process.env.VOXIMPLANT_WEB_SDK_PASSWORD || 'TestPassword123!',
  applicationName: process.env.VOXIMPLANT_APPLICATION_NAME || 'call.ne1432hz.n2.voximplant.com',
  accountName: process.env.VOXIMPLANT_ACCOUNT_NAME || 'ne1432hz',
};

export async function GET() {
  try {
    // Validate required environment variables
    if (!VOXIMPLANT_CONFIG.userName || !VOXIMPLANT_CONFIG.password) {
      console.error('Missing Voximplant credentials in environment variables');
      return NextResponse.json(
        { error: 'Voximplant credentials not configured' },
        { status: 500 }
      );
    }

    // Construct full username with application name
    // Handle case where applicationName might already include .voximplant.com
    let applicationName = VOXIMPLANT_CONFIG.applicationName;
    if (!applicationName.includes('.voximplant.com')) {
      applicationName = `${applicationName}.${VOXIMPLANT_CONFIG.accountName}.voximplant.com`;
    } else {
      // If it already includes .voximplant.com, use it as-is
      applicationName = VOXIMPLANT_CONFIG.applicationName;
    }
    
    const fullUserName = `${VOXIMPLANT_CONFIG.userName}@${applicationName}`;
    const fullApplicationName = applicationName;
    
    // Debug logging (remove in production)
    console.log('Voximplant auth config:', {
      userName: VOXIMPLANT_CONFIG.userName,
      applicationName: VOXIMPLANT_CONFIG.applicationName,
      accountName: VOXIMPLANT_CONFIG.accountName,
      fullUserName,
      fullApplicationName,
    });

    // In production, you would:
    // 1. Get user from session/auth
    // 2. Generate one-time token via Voximplant API
    // 3. Return token instead of password

    return NextResponse.json({
      userName: fullUserName,
      password: VOXIMPLANT_CONFIG.password,
      applicationName: fullApplicationName,
    });
  } catch (error) {
    console.error('Failed to generate auth token:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication token' },
      { status: 500 }
    );
  }
}

