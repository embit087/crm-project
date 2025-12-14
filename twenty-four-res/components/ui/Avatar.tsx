"use client";

interface CreatedByAvatarProps {
  name: string;
  type: "user" | "system";
}

export function CreatedByAvatar({ name, type }: CreatedByAvatarProps) {
  const isSystem = type === "system";
  return (
    <div className={`avatar ${isSystem ? "avatar-system" : "avatar-jimmy"}`}>
      {name[0]}
    </div>
  );
}

interface CompanyIconProps {
  name: string;
  color?: string;
}

const companyColors: Record<string, { bg: string; text: string }> = {
  Airbnb: { bg: "#FF5A5F", text: "#fff" },
  Anthropic: { bg: "#D4A574", text: "#000" },
  Stripe: { bg: "#635BFF", text: "#fff" },
  Figma: { bg: "#A259FF", text: "#fff" },
  Notion: { bg: "#000000", text: "#fff" },
};

export function CompanyIcon({ name }: CompanyIconProps) {
  const colors = companyColors[name] || { bg: "#27272a", text: "#a1a1aa" };
  return (
    <div
      className="company-icon"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {name[0] || "?"}
    </div>
  );
}


