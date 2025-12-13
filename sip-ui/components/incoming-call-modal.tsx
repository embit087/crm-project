'use client';

interface IncomingCallModalProps {
  phoneNumber: string;
  contactName?: string;
  onAnswer: () => void;
  onReject: () => void;
}

export function IncomingCallModal({
  phoneNumber,
  contactName,
  onAnswer,
  onReject,
}: IncomingCallModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-96 text-center shadow-2xl animate-scaleIn">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        {/* Caller Info */}
        <h2 className="text-2xl font-semibold mb-2">
          {contactName || 'Unknown Caller'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          {phoneNumber}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 animate-pulse">
          Incoming call...
        </p>

        {/* Action Buttons */}
        <div className="flex gap-6 justify-center">
          {/* Reject Button */}
          <button
            onClick={onReject}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Answer Button */}
          <button
            onClick={onAnswer}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

