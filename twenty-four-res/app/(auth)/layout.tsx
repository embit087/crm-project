import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Workspace CRM",
  description: "Sign in or create an account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
}

