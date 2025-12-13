'use client';

import { useVoximplant } from '@/hooks/useVoximplant';
import { CallDialer } from '@/components/call-dialer';
import { CallDialpad } from '@/components/call-dialpad';
import { CallControls } from '@/components/call-controls';
import { CallStatus } from '@/components/call-status';
import { CallHistory } from '@/components/call-history';
import { CallTimer } from '@/components/call-timer';
import { CallAnalytics } from '@/components/call-analytics';
import { CallNotes } from '@/components/call-notes';
import { CallTransferModal } from '@/components/call-transfer-modal';
import { IncomingCallModal } from '@/components/incoming-call-modal';
import { FloatingCallButton } from '@/components/floating-call-button';
import { useState, useCallback } from 'react';

export default function Home() {
  const {
    isConnected,
    isAuthenticated,
    callStatus,
    isMuted,
    isOnHold,
    isRecording,
    currentCall,
    error,
    initiateCall,
    endCall,
    answerCall,
    rejectCall,
    toggleMute,
    toggleHold,
    toggleRecording,
    sendDTMF,
    transferCall,
  } = useVoximplant();

  const [isExpanded, setIsExpanded] = useState(true);
  const [showDialpad, setShowDialpad] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCall = useCallback((number: string) => {
    initiateCall(number);
    setPhoneNumber('');
  }, [initiateCall]);

  const handleDialpadInput = useCallback((digit: string) => {
    if (callStatus === 'active') {
      sendDTMF(digit);
    } else {
      setPhoneNumber((prev) => prev + digit);
    }
  }, [callStatus, sendDTMF]);

  const handleTransfer = useCallback((transferTo: string) => {
    transferCall(transferTo);
    setShowTransferModal(false);
  }, [transferCall]);

  const isCallActive = callStatus === 'active' || callStatus === 'connecting' || callStatus === 'ringing';
  const isIncoming = callStatus === 'incoming';

  // Show incoming call modal
  if (isIncoming && currentCall) {
    return (
      <IncomingCallModal
        phoneNumber={currentCall.phoneNumber}
        contactName={currentCall.contactName}
        onAnswer={answerCall}
        onReject={rejectCall}
      />
    );
  }

  // Collapsed state - show floating button only
  if (!isExpanded) {
    return (
      <FloatingCallButton
        isActive={isCallActive}
        onClick={() => setIsExpanded(true)}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Phone</h1>
            <div className="flex items-center gap-3">
              <CallStatus
                isConnected={isConnected}
                isAuthenticated={isAuthenticated}
                callStatus={callStatus}
                error={error}
              />
              {!isCallActive && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Active Call View */}
          {isCallActive && currentCall ? (
            <div className="space-y-6">
              {/* Call Info */}
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-1">
                  {currentCall.contactName || currentCall.phoneNumber}
                </h2>
                {currentCall.contactName && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    {currentCall.phoneNumber}
                  </p>
                )}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  {callStatus === 'active' && currentCall.startTime && (
                    <CallTimer startTime={currentCall.startTime} />
                  )}
                  {callStatus === 'connecting' && <span className="animate-pulse">Connecting...</span>}
                  {callStatus === 'ringing' && <span className="animate-pulse">Ringing...</span>}
                  {isOnHold && <span className="text-yellow-600">• On Hold</span>}
                  {isMuted && <span className="text-red-600">• Muted</span>}
                  {isRecording && <span className="text-red-600">• Recording</span>}
                </div>
              </div>

              {/* Call Controls */}
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                    isMuted
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button
                  onClick={toggleHold}
                  className={`p-4 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                    isOnHold
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs">{isOnHold ? 'Resume' : 'Hold'}</span>
                </button>

                <button
                  onClick={() => setShowDialpad(!showDialpad)}
                  className={`p-4 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                    showDialpad
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-xs">Keypad</span>
                </button>

                <button
                  onClick={() => setShowTransferModal(true)}
                  className="p-4 rounded-xl flex flex-col items-center gap-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-xs">Transfer</span>
                </button>
              </div>

              {/* DTMF Dialpad */}
              {showDialpad && (
                <div className="flex justify-center">
                  <CallDialpad onDigitPress={handleDialpadInput} />
                </div>
              )}

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                End Call
              </button>

              {/* Call Notes (for active calls) */}
              {callStatus === 'active' && currentCall.id && (
                <CallNotes callId={currentCall.id} />
              )}
            </div>
          ) : (
            /* Idle State - Dialer */
            <div className="space-y-6">
              <CallDialer
                onCall={handleCall}
                disabled={!isAuthenticated}
              />

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => { setShowHistory(true); setShowAnalytics(false); }}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    showHistory
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  History
                </button>
                <button
                  onClick={() => { setShowAnalytics(true); setShowHistory(false); }}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    showAnalytics
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => { setShowHistory(false); setShowAnalytics(false); }}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    !showHistory && !showAnalytics
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dialer
                </button>
              </div>

              {/* Tab Content */}
              <div className="max-h-64 overflow-y-auto">
                {showHistory && <CallHistory />}
                {showAnalytics && <CallAnalytics />}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isAuthenticated && (
          <div className="px-6 pb-6 text-center text-sm text-gray-500">
            {isConnected ? 'Authenticating...' : 'Connecting to calling service...'}
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {currentCall && (
        <CallTransferModal
          callId={currentCall.id}
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onTransfer={handleTransfer}
        />
      )}
    </div>
  );
}
