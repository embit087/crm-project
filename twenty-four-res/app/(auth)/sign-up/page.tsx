"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth";

export default function SignUpPage() {
  return (
    <div className="auth-container">
      {/* Animated background elements */}
      <div className="auth-bg-pattern" />
      <div className="auth-glow auth-glow-1" />
      <div className="auth-glow auth-glow-2" />
      
      <div className="auth-card">
        {/* Logo and Header */}
        <header className="auth-header">
          <div className="auth-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 4v6" />
              <path d="M12 14h4" />
              <path d="M12 18h4" />
              <circle cx="7" cy="15" r="1" />
              <circle cx="7" cy="19" r="1" />
            </svg>
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start managing your workflow</p>
        </header>

        <AuthForm mode="signup" />

        <div className="auth-footer">
          <span className="auth-footer-text">Already have an account?</span>
          <Link href="/sign-in" className="auth-link">
            Sign in
          </Link>
        </div>

        {/* Decorative bottom line */}
        <div className="auth-decoration" />
      </div>

      {/* Brand tagline */}
      <p className="auth-tagline">
        CRM that works the way you think
      </p>
    </div>
  );
}

