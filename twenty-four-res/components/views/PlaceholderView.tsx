"use client";

interface PlaceholderViewProps {
  title: string;
}

export function PlaceholderView({ title }: PlaceholderViewProps) {
  return (
    <div className="flex-1 flex items-center justify-center text-text-muted">
      <div className="text-center">
        <div className="text-4xl mb-4">🚧</div>
        <div className="text-lg capitalize">{title}</div>
        <div className="text-sm mt-1">Coming soon</div>
      </div>
    </div>
  );
}


