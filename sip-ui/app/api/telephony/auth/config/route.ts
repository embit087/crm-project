import { NextResponse } from 'next/server';

// Voximplant configuration from environment variables
const VOXIMPLANT_CONFIG = {
  accountId: process.env.VOXIMPLANT_ACCOUNT_ID || '9968941',
  sipRegistrationId: process.env.VOXIMPLANT_SIP_REGISTRATION_ID || '9713',
  sipProxy: process.env.VOXIMPLANT_SIP_PROXY || 'sip1.yohalabs.com:5003',
  applicationName: process.env.VOXIMPLANT_APPLICATION_NAME || 'call.ne1432hz.n2.voximplant.com',
  accountName: process.env.VOXIMPLANT_ACCOUNT_NAME || 'ne1432hz',
};

export async function GET() {
  try {
    // Handle case where applicationName might already include .voximplant.com
    let applicationName = VOXIMPLANT_CONFIG.applicationName;
    if (!applicationName.includes('.voximplant.com')) {
      applicationName = `${applicationName}.${VOXIMPLANT_CONFIG.accountName}.voximplant.com`;
    }
    
    return NextResponse.json({
      applicationName,
      accountName: VOXIMPLANT_CONFIG.accountName,
      enableVideo: false,
      enableRecording: true,
      progressTone: 'US',
      features: {
        hold: true,
        transfer: true,
        conference: false,
        dtmf: true,
      },
      sipRegistration: {
        id: VOXIMPLANT_CONFIG.sipRegistrationId,
        proxy: VOXIMPLANT_CONFIG.sipProxy,
        username: VOXIMPLANT_CONFIG.accountId,
      },
    });
  } catch (error) {
    console.error('Failed to get WebSDK config:', error);
    return NextResponse.json(
      { error: 'Failed to get WebSDK configuration' },
      { status: 500 }
    );
  }
}

