'use client';

interface CallStatusProps {
  isConnected: boolean;
  isAuthenticated: boolean;
  callStatus: 'idle' | 'connecting' | 'ringing' | 'incoming' | 'active' | 'ended' | 'failed';
  error?: string | null;
}

export function CallStatus({
  isConnected,
  isAuthenticated,
  callStatus,
  error,
}: CallStatusProps) {
  const getStatusColor = () => {
    if (error) return 'bg-red-500';
    if (isAuthenticated) return 'bg-green-500';
    if (isConnected) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (isAuthenticated) return 'Ready';
    if (isConnected) return 'Connecting...';
    return 'Disconnected';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}
      />
      <span className="text-gray-600 dark:text-gray-400">
        {getStatusText()}
      </span>
      {error && (
        <span className="text-red-500 text-xs ml-2">{error}</span>
      )}
    </div>
  );
}

