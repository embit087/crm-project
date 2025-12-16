"use client";

import { useState, useRef, useMemo } from "react";

interface CreateProfileModalProps {
  isOpen: boolean;
  onComplete: (firstName: string, lastName: string, avatar?: File) => void;
}

// Generate a consistent color based on the initial
function getAvatarColor(initial: string): string {
  const colors = [
    "#ec4899", // pink
    "#8b5cf6", // purple
    "#3b82f6", // blue
    "#06b6d4", // cyan
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#6366f1", // indigo
  ];
  const index = initial.toLowerCase().charCodeAt(0) % colors.length;
  return colors[index];
}

export function CreateProfileModal({ isOpen, onComplete }: CreateProfileModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initial = useMemo(() => {
    return firstName.trim() ? firstName.trim()[0].toLowerCase() : "";
  }, [firstName]);

  const avatarColor = useMemo(() => {
    return initial ? getAvatarColor(initial) : "#ec4899";
  }, [initial]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be under 10MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      onComplete(firstName.trim(), lastName.trim(), avatarFile || undefined);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="workspace-modal-overlay">
      <div className="workspace-modal">
        <header className="workspace-modal-header">
          <h1 className="workspace-modal-title">Create profile</h1>
          <p className="workspace-modal-subtitle">
            How you&apos;ll be identified on the app.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="workspace-modal-form">
          {/* Avatar Upload Section */}
          <div className="workspace-field">
            <label className="workspace-field-label">Picture</label>
            <div className="workspace-logo-section">
              <div className="workspace-logo-row">
                <div 
                  className="profile-avatar-preview"
                  style={{ backgroundColor: avatarPreview ? "transparent" : avatarColor }}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile avatar" />
                  ) : (
                    <span className="profile-avatar-initial">{initial || "?"}</span>
                  )}
                </div>
                <div className="workspace-logo-actions">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png,image/jpeg,image/gif"
                    className="workspace-file-input"
                  />
                  <button
                    type="button"
                    className="workspace-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload
                  </button>
                  <button
                    type="button"
                    className="workspace-remove-btn"
                    onClick={handleRemoveAvatar}
                    disabled={!avatarPreview}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
              <p className="workspace-logo-hint">
                We support your square PNGs, JPEGs and GIFs under 10MB
              </p>
            </div>
          </div>

          {/* Name Section */}
          <div className="workspace-field">
            <label className="workspace-field-label">Name</label>
            <p className="workspace-field-hint">Your name as it will be displayed on the app</p>
            <div className="profile-name-row">
              <div className="profile-name-field">
                <label className="profile-name-label">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="workspace-name-input"
                  placeholder="John"
                  required
                />
              </div>
              <div className="profile-name-field">
                <label className="profile-name-label">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="workspace-name-input"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="workspace-continue-btn"
            disabled={!firstName.trim() || !lastName.trim()}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

