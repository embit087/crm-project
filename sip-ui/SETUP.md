# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Voximplant credentials:**
   
   Edit `app/api/telephony/auth/token/route.ts` and update:
   ```typescript
   const VOXIMPLANT_CONFIG = {
     userName: 'your-username',
     password: 'your-password',
     applicationName: 'your-app.voximplant.com',
     accountName: 'your-account',
   };
   ```

3. **Add ringtone (optional):**
   
   Place a `ringtone.mp3` file in `public/sounds/` directory.
   If you don't have one, the app will work but won't play a ringtone for incoming calls.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### Environment Variables (Optional)

Create a `.env.local` file:

```env
BACKEND_API_URL=http://localhost:3000
```

### Voximplant Setup

1. Create a Voximplant account at https://voximplant.com
2. Create an application in the Voximplant Control Panel
3. Create a user with username and password
4. Configure SIP registration (if using SIP trunk)
5. Update the credentials in the API route

### Backend Integration

To connect to your backend API, update the API routes in `app/api/telephony/`:

1. Uncomment the fetch calls to your backend
2. Add authentication headers
3. Update the `BACKEND_API_URL` environment variable

Example:
```typescript
const response = await fetch(`${BACKEND_API_URL}/api/telephony/calls/initiate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(body),
});
```

## Features

- ✅ Browser-based calling via WebRTC
- ✅ Call controls (mute, hold, DTMF)
- ✅ Call history
- ✅ Real-time status indicators
- ✅ Dark mode support
- ✅ Responsive design

## Troubleshooting

### Microphone not working
- Check browser permissions for microphone access
- Ensure HTTPS in production (required for WebRTC)

### Authentication fails
- Verify Voximplant credentials are correct
- Check application name format
- Ensure user exists in Voximplant application

### Calls not connecting
- Check Voximplant Control Panel for errors
- Verify SIP registration is active (if using SIP)
- Check browser console for detailed errors

