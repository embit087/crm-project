"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
      } else {
        await signIn.email({
          email: formData.email,
          password: formData.password,
        });
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {mode === "signup" && (
        <div className="auth-field">
          <label htmlFor="name" className="auth-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="auth-input"
            placeholder="Enter your full name"
            required
            autoComplete="name"
          />
        </div>
      )}

      <div className="auth-field">
        <label htmlFor="email" className="auth-label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="auth-input"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password" className="auth-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="auth-input"
          placeholder={mode === "signup" ? "Create a password (min 8 chars)" : "Enter your password"}
          required
          minLength={8}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>

      {mode === "signup" && (
        <div className="auth-field">
          <label htmlFor="confirmPassword" className="auth-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="auth-input"
            placeholder="Confirm your password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
      )}

      {error && (
        <div className="auth-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button type="submit" className="auth-submit" disabled={isLoading}>
        {isLoading ? (
          <span className="auth-spinner" />
        ) : mode === "signin" ? (
          "Sign In"
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}

