"use client";

import { useState } from "react";

interface InviteTeamModalProps {
  isOpen: boolean;
  onComplete: (emails: string[]) => void;
  onSkip: () => void;
}

export function InviteTeamModal({ isOpen, onComplete, onSkip }: InviteTeamModalProps) {
  const [emails, setEmails] = useState(["", "", ""]);
  const [copied, setCopied] = useState(false);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleCopyLink = async () => {
    const inviteLink = `${window.location.origin}/invite?token=demo-invite-token`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validEmails = emails.filter((email) => email.trim() !== "");
    onComplete(validEmails);
  };

  if (!isOpen) return null;

  return (
    <div className="workspace-modal-overlay">
      <div className="workspace-modal invite-modal">
        <header className="workspace-modal-header">
          <h1 className="workspace-modal-title">Invite your team</h1>
          <p className="workspace-modal-subtitle">
            Get the most out of your workspace by inviting your team.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="workspace-modal-form">
          {/* Email Input Fields */}
          <div className="invite-email-fields">
            {emails.map((email, index) => (
              <input
                key={index}
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                className="workspace-name-input invite-email-input"
                placeholder={
                  index === 0
                    ? "tim@apple.com"
                    : index === 1
                    ? "phil@apple.com"
                    : "jony@apple.com"
                }
              />
            ))}
          </div>

          {/* Divider */}
          <div className="invite-divider">
            <span className="invite-divider-line" />
            <span className="invite-divider-text">or</span>
            <span className="invite-divider-line" />
          </div>

          {/* Copy Invitation Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="invite-copy-link"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? "Copied!" : "Copy invitation link"}
          </button>

          {/* Submit Button */}
          <button type="submit" className="workspace-continue-btn invite-finish-btn">
            Finish
          </button>

          {/* Skip Link */}
          <button
            type="button"
            onClick={onSkip}
            className="invite-skip-link"
          >
            Skip
          </button>
        </form>
      </div>
    </div>
  );
}

