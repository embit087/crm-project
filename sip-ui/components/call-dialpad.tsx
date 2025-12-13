'use client';

interface CallDialpadProps {
  onDigitPress: (digit: string) => void;
  disabled?: boolean;
}

const dialpadButtons = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
];

export function CallDialpad({ onDigitPress, disabled }: CallDialpadProps) {
  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {dialpadButtons.map((button) => (
        <button
          key={button.digit}
          onClick={() => onDigitPress(button.digit)}
          disabled={disabled}
          className="w-16 h-16 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xl font-medium">{button.digit}</span>
          {button.letters && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
              {button.letters}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

