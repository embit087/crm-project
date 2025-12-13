'use client';

import { formatDistanceToNow } from 'date-fns';
import type { CallInfo } from '@/types/voximplant';

interface CallInfoProps {
  call: CallInfo | null;
}

export function CallInfo({ call }: CallInfoProps) {
  if (!call) return null;

  const formatDuration = (startTime?: Date) => {
    if (!startTime) return '00:00';
    const now = new Date();
    const seconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center py-4">
      <div className="text-2xl font-semibold mb-1">
        {call.remoteDisplayName || call.contactName || call.phoneNumber}
      </div>
      {call.phoneNumber !== call.remoteDisplayName && (
        <div className="text-sm text-gray-500 mb-2">{call.phoneNumber}</div>
      )}
      {call.startTime && call.status === 'active' && (
        <div className="text-sm text-gray-500">
          {formatDuration(call.startTime)}
        </div>
      )}
      {call.direction === 'inbound' && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
          Incoming Call
        </div>
      )}
    </div>
  );
}

