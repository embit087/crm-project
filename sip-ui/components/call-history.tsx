'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { CallHistoryItem } from '@/types/voximplant';

export function CallHistory() {
  const [history, setHistory] = useState<CallHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/telephony/calls/history');
        const data = await response.json();
        setHistory(data.data || []);
      } catch (error) {
        console.error('Failed to fetch call history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading call history...</div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No call history</div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-4">Call History</h3>
      {history.map((call) => (
        <div
          key={call.id}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${
                  call.direction === 'inbound'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                {call.direction === 'inbound' ? '↓' : '↑'}
              </span>
              <span className="font-medium">
                {call.contactName || call.phoneNumber}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {format(new Date(call.startTime), 'MMM d, yyyy h:mm a')} •{' '}
              {formatDuration(call.duration)}
            </div>
          </div>
          {call.recordingUrl && (
            <button
              onClick={() => window.open(call.recordingUrl, '_blank')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Play recording"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

