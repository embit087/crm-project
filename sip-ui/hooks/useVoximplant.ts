'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { voximplantService } from '@/lib/voximplant-service';
import {
  saveCallState,
  loadCallState,
  savePendingCallRequest,
  loadPendingCallRequest,
  clearPendingCallRequest,
  type CurrentCall,
  type CallStatus,
  type PendingCallRequest,
} from '@/lib/call-state';

export const useVoximplant = () => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [currentCall, setCurrentCall] = useState<CurrentCall | null>(null);
  const [pendingCallRequest, setPendingCallRequest] = useState<PendingCallRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<any>(null);
  const callRef = useRef<any>(null);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    const savedCall = loadCallState();
    if (savedCall) {
      setCurrentCall(savedCall);
      setCallStatus(savedCall.status);
    }

    const pendingRequest = loadPendingCallRequest();
    if (pendingRequest) {
      setPendingCallRequest(pendingRequest);
    }
  }, []);

  // Persist call state changes
  useEffect(() => {
    saveCallState(currentCall);
  }, [currentCall]);

  // Load Voximplant SDK
  useEffect(() => {
    const loadSDK = async () => {
      try {
        await voximplantService.loadSDK();
        setIsSDKLoaded(true);
      } catch (err) {
        setError('Failed to load calling service');
        console.error('Failed to load Voximplant SDK:', err);
      }
    };

    loadSDK();
  }, []);

  // Initialize Voximplant client
  useEffect(() => {
    if (!isSDKLoaded || !window.VoxImplant) return;

    const initializeClient = async () => {
      try {
        const client = voximplantService.getClient();
        clientRef.current = client;

        // Set up event handlers BEFORE calling init()
        client.on(window.VoxImplant.Events.SDKReady, handleSDKReady);
        client.on(window.VoxImplant.Events.ConnectionEstablished, handleConnectionEstablished);
        client.on(window.VoxImplant.Events.ConnectionFailed, handleConnectionFailed);
        client.on(window.VoxImplant.Events.ConnectionClosed, handleConnectionClosed);
        client.on(window.VoxImplant.Events.AuthResult, handleAuthResult);
        client.on(window.VoxImplant.Events.IncomingCall, handleIncomingCall);

        // Initialize SDK
        await client.init({
          micRequired: true,
          videoSupport: false,
          progressTone: true,
          progressToneCountry: 'US',
        });
      } catch (error) {
        console.error('Failed to initialize Voximplant client:', error);
        setError('Failed to initialize calling service');
      }
    };

    initializeClient();

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [isSDKLoaded]);

  // Handle pending call requests
  useEffect(() => {
    if (pendingCallRequest && isAuthenticated && !currentCall) {
      const { phoneNumber, contactId, contactName } = pendingCallRequest;
      initiateCall(phoneNumber, contactId, contactName);
      setPendingCallRequest(null);
      clearPendingCallRequest();
    }
  }, [pendingCallRequest, isAuthenticated, currentCall]);

  // SDK event handlers
  const handleSDKReady = useCallback(async () => {
    if (!clientRef.current) return;

    try {
      await clientRef.current.connect();
    } catch (error) {
      console.error('Failed to connect to Voximplant:', error);
      setError('Failed to connect to calling service');
    }
  }, []);

  const handleConnectionEstablished = useCallback(async () => {
    setIsConnected(true);

    try {
      const response = await fetch('/api/telephony/auth/token');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.password) {
        await clientRef.current.login(data.userName, data.password);
      } else if (data.token) {
        await clientRef.current.loginWithToken(data.userName, data.token);
      } else {
        throw new Error('No authentication credentials provided');
      }
    } catch (error) {
      console.error('Failed to authenticate with Voximplant:', error);
      setError('Failed to authenticate calling service');
    }
  }, []);

  const handleConnectionFailed = useCallback((e: any) => {
    console.error('Connection to Voximplant failed:', e);
    setIsConnected(false);
    setError('Connection to calling service failed');
  }, []);

  const handleConnectionClosed = useCallback(() => {
    setIsConnected(false);
    setIsAuthenticated(false);
  }, []);

  const handleAuthResult = useCallback((e: any) => {
    if (e.result === true) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setIsAuthenticated(false);
      let errorMessage = 'Authentication failed';
      if (e.code === 401) {
        errorMessage = 'Invalid username or password';
      } else if (e.code === 404) {
        errorMessage = 'User not found';
      } else if (e.code === 402) {
        errorMessage = 'Account is frozen or inactive';
      }
      setError(errorMessage);
    }
  }, []);

  const handleIncomingCall = useCallback((e: any) => {
    const call = e.call;
    callRef.current = call;

    setupCallEventHandlers(call);

    setCallStatus('incoming');
    const newCall: CurrentCall = {
      id: call.id(),
      phoneNumber: e.headers['X-Remote-Number'] || e.callerid || 'Unknown',
      remoteNumber: e.headers['X-Remote-Number'] || e.callerid || 'Unknown',
      remoteDisplayName: e.displayName || e.headers['X-Remote-Name'],
      direction: 'inbound',
      status: 'incoming',
      startTime: undefined,
      duration: 0,
    };
    setCurrentCall(newCall);

    playRingtone();
  }, []);

  // Call event handlers
  const setupCallEventHandlers = useCallback((call: any) => {
    call.on(window.VoxImplant.CallEvents.Connected, handleCallConnected);
    call.on(window.VoxImplant.CallEvents.Disconnected, handleCallDisconnected);
    call.on(window.VoxImplant.CallEvents.Failed, handleCallFailed);
    call.on(window.VoxImplant.CallEvents.ProgressToneStart, handleProgressToneStart);
    call.on(window.VoxImplant.CallEvents.ProgressToneStop, handleProgressToneStop);
    call.on(window.VoxImplant.CallEvents.MediaElementCreated, handleMediaElementCreated);
  }, []);

  const handleCallConnected = useCallback(() => {
    setCallStatus('active');
    stopRingtone();

    const startTime = new Date();
    setCurrentCall((prev) => prev ? {
      ...prev,
      status: 'active',
      startTime,
    } : null);

    // Send webhook to backend
    fetch('/api/telephony/calls/connected', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callId: callRef.current?.id(),
        startTime,
      }),
    });
  }, []);

  const handleCallDisconnected = useCallback(() => {
    const endTime = new Date();
    const duration = currentCall?.startTime
      ? Math.floor((endTime.getTime() - new Date(currentCall.startTime).getTime()) / 1000)
      : 0;

    // Send webhook to backend
    fetch('/api/telephony/calls/ended', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callId: callRef.current?.id(),
        endTime,
        duration,
      }),
    });

    // Clean up
    setCallStatus('idle');
    setCurrentCall(null);
    callRef.current = null;
    setIsMuted(false);
    setIsOnHold(false);
    stopRingtone();
  }, [currentCall]);

  const handleCallFailed = useCallback((e: any) => {
    console.error('Call failed:', e);
    let message = 'Call failed';
    switch (e.code) {
      case 486:
        message = 'Line busy';
        break;
      case 487:
        message = 'Call cancelled';
        break;
      case 603:
        message = 'Call declined';
        break;
      case 404:
        message = 'Number not found';
        break;
      default:
        message = `Call failed (${e.reason || e.code})`;
    }
    setError(message);

    // Clean up
    setCallStatus('idle');
    setCurrentCall(null);
    callRef.current = null;
    stopRingtone();
  }, []);

  const handleProgressToneStart = useCallback(() => {
    setCallStatus('ringing');
  }, []);

  const handleProgressToneStop = useCallback(() => {
    // Progress tone stopped
  }, []);

  const handleMediaElementCreated = useCallback((e: any) => {
    if (e.element && e.element.id === 'remote-audio') {
      e.element.volume = 1.0;
      e.element.play();
    }
  }, []);

  // Public methods
  const initiateCall = useCallback(async (
    phoneNumber: string,
    contactId?: string,
    contactName?: string
  ) => {
    if (!isAuthenticated || !clientRef.current) {
      // Save as pending call request
      const request = { phoneNumber, contactId, contactName };
      setPendingCallRequest(request);
      savePendingCallRequest(request);
      setError('Calling service not ready - call will start when connected');
      return;
    }

    try {
      const cleanNumber = phoneNumber.replace(/\D/g, '');

      const call = await clientRef.current.call(
        cleanNumber,
        false, // no video
        null,
        {
          'X-Twenty-Contact-Id': contactId || '',
          'X-Twenty-Contact-Name': contactName || '',
        }
      );

      callRef.current = call;
      setupCallEventHandlers(call);

      setCallStatus('connecting');
      const newCall: CurrentCall = {
        id: call.id(),
        phoneNumber: cleanNumber,
        remoteNumber: cleanNumber,
        remoteDisplayName: contactName,
        contactName: contactName,
        contactId,
        direction: 'outbound',
        status: 'connecting',
        startTime: undefined,
        duration: 0,
        isRecording,
      };
      setCurrentCall(newCall);

      // Log to backend
      await fetch('/api/telephony/calls/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: cleanNumber,
          contactId,
          contactName,
          enableRecording: isRecording,
        }),
      });

      setError(null);
    } catch (error) {
      console.error('Failed to initiate call:', error);
      setError('Failed to start call');
    }
  }, [isAuthenticated, isRecording, setupCallEventHandlers]);

  const endCall = useCallback(() => {
    if (callRef.current) {
      callRef.current.hangup();
    }
  }, []);

  const answerCall = useCallback(() => {
    if (callRef.current && callStatus === 'incoming') {
      callRef.current.answer();
      stopRingtone();
    }
  }, [callStatus]);

  const rejectCall = useCallback(() => {
    if (callRef.current && callStatus === 'incoming') {
      callRef.current.decline();
      stopRingtone();
      setCallStatus('idle');
      setCurrentCall(null);
      callRef.current = null;
    }
  }, [callStatus]);

  const toggleMute = useCallback(() => {
    if (callRef.current) {
      if (isMuted) {
        callRef.current.unmuteMicrophone();
      } else {
        callRef.current.muteMicrophone();
      }
      setIsMuted(!isMuted);
      
      // Sync with backend
      if (currentCall) {
        fetch(`/api/telephony/calls/${currentCall.id}/mute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ muted: !isMuted }),
        });
      }
    }
  }, [isMuted, currentCall]);

  const toggleHold = useCallback(() => {
    if (callRef.current) {
      if (isOnHold) {
        callRef.current.setActive(true);
      } else {
        callRef.current.setActive(false);
      }
      setIsOnHold(!isOnHold);
      
      // Sync with backend
      if (currentCall) {
        fetch(`/api/telephony/calls/${currentCall.id}/hold`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onHold: !isOnHold }),
        });
      }
    }
  }, [isOnHold, currentCall]);

  const toggleRecording = useCallback(async () => {
    if (currentCall) {
      const newRecordingState = !isRecording;
      setIsRecording(newRecordingState);
      
      await fetch(`/api/telephony/calls/${currentCall.id}/recording`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: newRecordingState ? 'start' : 'stop' }),
      });
    }
  }, [isRecording, currentCall]);

  const sendDTMF = useCallback((digit: string) => {
    if (callRef.current && callStatus === 'active') {
      callRef.current.sendTone(digit);
    }
  }, [callStatus]);

  const transferCall = useCallback(async (transferTo: string) => {
    if (currentCall) {
      await fetch(`/api/telephony/calls/${currentCall.id}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferTo }),
      });
    }
  }, [currentCall]);

  // Request a call from anywhere in the app
  const requestCall = useCallback((phoneNumber: string, contactId?: string, contactName?: string) => {
    if (isAuthenticated && !currentCall) {
      initiateCall(phoneNumber, contactId, contactName);
    } else {
      const request = { phoneNumber, contactId, contactName };
      setPendingCallRequest(request);
      savePendingCallRequest(request);
    }
  }, [isAuthenticated, currentCall, initiateCall]);

  // Ringtone management
  const playRingtone = useCallback(() => {
    if (!ringtoneRef.current) {
      ringtoneRef.current = new Audio('/sounds/ringtone.mp3');
      ringtoneRef.current.loop = true;
    }
    ringtoneRef.current.play().catch(() => {
      // Ignore audio play errors
    });
  }, []);

  const stopRingtone = useCallback(() => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  }, []);

  return {
    isSDKLoaded,
    isConnected,
    isAuthenticated,
    callStatus,
    isMuted,
    isOnHold,
    isRecording,
    currentCall,
    pendingCallRequest,
    error,
    initiateCall,
    endCall,
    answerCall,
    rejectCall,
    toggleMute,
    toggleHold,
    toggleRecording,
    sendDTMF,
    transferCall,
    requestCall,
  };
};
