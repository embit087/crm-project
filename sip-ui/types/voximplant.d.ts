// Voximplant Web SDK type definitions
declare global {
  interface Window {
    VoxImplant: any;
  }
}

export interface VoximplantConfig {
  userName: string;
  token?: string;
  password?: string;
  applicationName: string;
}

export type CallStatus = 'idle' | 'connecting' | 'ringing' | 'incoming' | 'active' | 'ended' | 'failed';

export interface CallInfo {
  id: string;
  phoneNumber: string;
  remoteNumber: string;
  remoteDisplayName?: string;
  direction: 'inbound' | 'outbound';
  startTime?: Date;
  duration: number;
  status: CallStatus;
  contactId?: string;
  contactName?: string;
}

export interface CallHistoryItem {
  id: string;
  phoneNumber: string;
  direction: 'inbound' | 'outbound';
  status: CallStatus;
  startTime: Date;
  duration: number;
  recordingUrl?: string;
  contactName?: string;
}

