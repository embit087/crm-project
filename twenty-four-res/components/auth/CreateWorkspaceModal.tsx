"use client";

import { useState, useRef } from "react";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onComplete: (workspaceName: string, logo?: File) => void;
}

export function CreateWorkspaceModal({ isOpen, onComplete }: CreateWorkspaceModalProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be under 10MB");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim()) {
      onComplete(workspaceName.trim(), logoFile || undefined);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="workspace-modal-overlay">
      <div className="workspace-modal">
        <header className="workspace-modal-header">
          <h1 className="workspace-modal-title">Create your workspace</h1>
          <p className="workspace-modal-subtitle">
            A shared environment where you will be able to manage your customer relations with your team.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="workspace-modal-form">
          {/* Logo Upload Section */}
          <div className="workspace-field">
            <label className="workspace-field-label">Workspace logo</label>
            <div className="workspace-logo-section">
              <div className="workspace-logo-row">
                <div className="workspace-logo-preview">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Workspace logo" />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
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
                    onClick={handleRemoveLogo}
                    disabled={!logoPreview}
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

          {/* Workspace Name Section */}
          <div className="workspace-field">
            <label className="workspace-field-label">Workspace name</label>
            <p className="workspace-field-hint">The name of your organization</p>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="workspace-name-input"
              placeholder="Apple"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="workspace-continue-btn"
            disabled={!workspaceName.trim()}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

