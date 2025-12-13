'use client';

import { useEffect, useState } from 'react';

interface CallTimerProps {
  startTime?: Date;
}

export function CallTimer({ startTime }: CallTimerProps) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    // Calculate initial duration
    const calculateDuration = () => {
      const now = new Date();
      return Math.floor((now.getTime() - startTime.getTime()) / 1000);
    };

    setDuration(calculateDuration());

    const interval = setInterval(() => {
      setDuration(calculateDuration());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
      {formatDuration(duration)}
    </span>
  );
}

