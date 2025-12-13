'use client';

interface FloatingCallButtonProps {
  isActive?: boolean;
  onClick: () => void;
}

export function FloatingCallButton({ isActive, onClick }: FloatingCallButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50 ${
        isActive
          ? 'bg-gradient-to-br from-red-500 to-red-700'
          : 'bg-gradient-to-br from-green-500 to-green-700'
      }`}
    >
      <svg
        className="w-8 h-8 text-white"
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
  );
}

