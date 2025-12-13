'use client';

interface CallControlsProps {
  callStatus: 'idle' | 'connecting' | 'ringing' | 'incoming' | 'active' | 'ended' | 'failed';
  isMuted: boolean;
  isOnHold: boolean;
  onMute: () => void;
  onHold: () => void;
  onEnd: () => void;
  onAnswer?: () => void;
  onReject?: () => void;
  onDTMF?: (digit: string) => void;
}

export function CallControls({
  callStatus,
  isMuted,
  isOnHold,
  onMute,
  onHold,
  onEnd,
  onAnswer,
  onReject,
  onDTMF,
}: CallControlsProps) {
  const isActive = callStatus === 'active';
  const isIncoming = callStatus === 'incoming';
  const isConnecting = callStatus === 'connecting' || callStatus === 'ringing';

  return (
    <div className="flex flex-col gap-4">
      {/* Call Status */}
      <div className="text-center">
        {isIncoming && (
          <div className="text-lg font-semibold mb-2">Incoming Call</div>
        )}
        {isConnecting && (
          <div className="text-lg font-semibold mb-2">Connecting...</div>
        )}
        {isActive && (
          <div className="text-lg font-semibold mb-2 text-green-500">
            Call Active
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 justify-center items-center">
        {/* Mute Button */}
        {isActive && (
          <button
            onClick={onMute}
            className={`p-4 rounded-full transition-colors ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMuted ? (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              )}
            </svg>
          </button>
        )}

        {/* Hold Button */}
        {isActive && (
          <button
            onClick={onHold}
            className={`p-4 rounded-full transition-colors ${
              isOnHold
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title={isOnHold ? 'Resume' : 'Hold'}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}

        {/* Answer Button (for incoming calls) */}
        {isIncoming && onAnswer && (
          <button
            onClick={onAnswer}
            className="p-4 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
            title="Answer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
        )}

        {/* Reject Button (for incoming calls) */}
        {isIncoming && onReject && (
          <button
            onClick={onReject}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            title="Reject"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* End Call Button */}
        {(isActive || isConnecting || isIncoming) && (
          <button
            onClick={onEnd}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            title="End Call"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M16 16l2 2m0 0l2 2m-2-2l-2 2m2-2l2-2M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* DTMF Pad (for active calls) */}
      {isActive && onDTMF && (
        <div className="mt-4 grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(
            (digit) => (
              <button
                key={digit}
                onClick={() => onDTMF(digit)}
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all font-semibold"
              >
                {digit}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

