import { NextResponse } from 'next/server';

// Voximplant configuration
const VOXIMPLANT_CONFIG = {
  accountId: process.env.VOXIMPLANT_ACCOUNT_ID || '9968941',
  sipRegistrationId: process.env.VOXIMPLANT_SIP_REGISTRATION_ID || '9713',
  sipProxy: process.env.VOXIMPLANT_SIP_PROXY || 'sip1.yohalabs.com:5003',
  applicationName: process.env.VOXIMPLANT_APPLICATION_NAME || 'call.ne1432hz.n2.voximplant.com',
  accountName: 'ne1432hz',
};

export async function GET() {
  try {
    return NextResponse.json({
      applicationName: `${VOXIMPLANT_CONFIG.applicationName}.${VOXIMPLANT_CONFIG.accountName}.voximplant.com`,
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

