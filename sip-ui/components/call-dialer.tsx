'use client';

import { useState, useCallback } from 'react';

interface CallDialerProps {
  onCall: (phoneNumber: string) => void;
  disabled?: boolean;
}

export function CallDialer({ onCall, disabled }: CallDialerProps) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleNumberClick = useCallback((digit: string) => {
    if (disabled) return;
    setPhoneNumber((prev) => prev + digit);
  }, [disabled]);

  const handleBackspace = useCallback(() => {
    if (disabled) return;
    setPhoneNumber((prev) => prev.slice(0, -1));
  }, [disabled]);

  const handleCall = useCallback(() => {
    if (disabled || !phoneNumber.trim()) return;
    onCall(phoneNumber);
    setPhoneNumber('');
  }, [phoneNumber, onCall, disabled]);

  const handleClear = useCallback(() => {
    if (disabled) return;
    setPhoneNumber('');
  }, [disabled]);

  const digits = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Phone Number Display */}
      <div className="text-center">
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
          className="w-full text-2xl font-mono text-center bg-transparent border-none outline-none focus:outline-none"
          disabled={disabled}
        />
        <div className="text-sm text-gray-500 mt-1">
          {phoneNumber.length > 0 ? phoneNumber.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3') : 'Enter number to call'}
        </div>
      </div>

      {/* Dial Pad */}
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {digits.flat().map((digit) => (
          <button
            key={digit}
            onClick={() => handleNumberClick(digit)}
            disabled={disabled}
            className="aspect-square rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {digit}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center mt-4">
        <button
          onClick={handleClear}
          disabled={disabled || !phoneNumber}
          className="px-6 py-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleBackspace}
          disabled={disabled || !phoneNumber}
          className="px-6 py-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ⌫
        </button>
        <button
          onClick={handleCall}
          disabled={disabled || !phoneNumber.trim()}
          className="px-8 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call
        </button>
      </div>
    </div>
  );
}

