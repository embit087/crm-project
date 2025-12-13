# SIP Telephony UI - Voximplant Integration

A modern, browser-based telephony interface built with Next.js and Voximplant Web SDK.

## Features

- ✅ **WebRTC Calling** - Make and receive calls directly from your browser
- ✅ **Call Controls** - Mute, hold, DTMF, answer, reject, end calls
- ✅ **Call History** - View past calls with duration and recording links
- ✅ **Real-time Status** - Connection and authentication status indicators
- ✅ **Modern UI** - Clean, responsive interface with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- Voximplant account with:
  - Application created
  - SIP Registration configured
  - User credentials set up

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (optional):
```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

3. Update Voximplant credentials in `app/api/telephony/auth/token/route.ts`:
```typescript
const VOXIMPLANT_CONFIG = {
  userName: 'your-username',
  password: 'your-password',
  applicationName: 'your-app.voximplant.com',
  accountName: 'your-account',
};
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

The application includes the following API routes:

- `GET /api/telephony/auth/token` - Get authentication token for Voximplant
- `POST /api/telephony/calls/initiate` - Initiate a new call
- `POST /api/telephony/calls/connected` - Handle call connected event
- `POST /api/telephony/calls/ended` - Handle call ended event
- `GET /api/telephony/calls/history` - Get call history
- `POST /api/telephony/webhooks/call-events` - Handle webhook events from Voximplant

## Architecture

### Components

- **CallDialer** - Phone number input and dial pad
- **CallControls** - Call control buttons (mute, hold, end, etc.)
- **CallStatus** - Connection status indicator
- **CallHistory** - List of past calls
- **CallInfo** - Current call information display

### Hooks

- **useVoximplant** - Main hook for managing Voximplant SDK and call state

### Services

- **voximplant-service** - Singleton service for loading and managing Voximplant SDK

## Integration with Backend

To integrate with your backend API, update the API routes to forward requests:

```typescript
// Example: app/api/telephony/calls/initiate/route.ts
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

const response = await fetch(`${BACKEND_API_URL}/api/telephony/calls/initiate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(body),
});
```

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari (may have limitations)

## Troubleshooting

### "Calling service not ready"
- Check that Voximplant SDK loaded successfully
- Verify authentication credentials are correct
- Check browser console for errors

### "Failed to connect"
- Verify Voximplant application name is correct
- Check network connectivity
- Ensure microphone permissions are granted

### No audio
- Check browser microphone permissions
- Verify audio devices are not muted
- Check browser console for media errors

## License

MIT
