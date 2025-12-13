'use client';

import { useState } from 'react';

interface CallTransferModalProps {
  callId: string;
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (transferTo: string) => void;
}

export function CallTransferModal({
  callId,
  isOpen,
  onClose,
  onTransfer,
}: CallTransferModalProps) {
  const [transferTo, setTransferTo] = useState('');
  const [transferring, setTransferring] = useState(false);

  if (!isOpen) return null;

  const handleTransfer = async () => {
    if (!transferTo.trim()) return;

    setTransferring(true);
    try {
      const response = await fetch(`/api/telephony/calls/${callId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferTo }),
      });

      if (response.ok) {
        onTransfer(transferTo);
        onClose();
      }
    } catch (error) {
      console.error('Failed to transfer call:', error);
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-80 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Transfer Call</h3>
        
        <input
          type="tel"
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
          placeholder="Enter number to transfer to"
          className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!transferTo.trim() || transferring}
            className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium disabled:opacity-50"
          >
            {transferring ? 'Transferring...' : 'Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
}

