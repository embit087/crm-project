// Call state management with localStorage persistence
export type CallStatus = 
  | 'idle'
  | 'connecting'
  | 'ringing'
  | 'incoming'
  | 'active'
  | 'ended'
  | 'failed';

export type CurrentCall = {
  id: string;
  phoneNumber: string;
  remoteNumber?: string;
  remoteDisplayName?: string;
  contactName?: string;
  contactId?: string;
  status: CallStatus;
  startTime?: Date;
  duration?: number;
  isRecording?: boolean;
  direction?: 'inbound' | 'outbound';
};

export type PendingCallRequest = {
  phoneNumber: string;
  contactId?: string;
  contactName?: string;
};

const STORAGE_KEY = 'voximplant-current-call';
const PENDING_CALL_KEY = 'voximplant-pending-call';

// Save call state to localStorage with 1 hour expiry
export const saveCallState = (call: CurrentCall | null) => {
  if (call === null) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(call));
  }
};

// Load call state from localStorage
export const loadCallState = (): CurrentCall | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    if (parsed && parsed.startTime) {
      const startTime = new Date(parsed.startTime);
      const now = new Date();
      const hoursSinceStart = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      // Expire calls older than 1 hour
      if (hoursSinceStart >= 1) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      return {
        ...parsed,
        startTime: new Date(parsed.startTime),
      };
    }
    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

// Save pending call request
export const savePendingCallRequest = (request: PendingCallRequest | null) => {
  if (request === null) {
    localStorage.removeItem(PENDING_CALL_KEY);
  } else {
    localStorage.setItem(PENDING_CALL_KEY, JSON.stringify(request));
  }
};

// Load pending call request
export const loadPendingCallRequest = (): PendingCallRequest | null => {
  try {
    const saved = localStorage.getItem(PENDING_CALL_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem(PENDING_CALL_KEY);
    return null;
  }
};

// Clear pending call request
export const clearPendingCallRequest = () => {
  localStorage.removeItem(PENDING_CALL_KEY);
};

