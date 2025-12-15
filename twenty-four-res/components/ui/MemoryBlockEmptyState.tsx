"use client";

import { CirclePlusIcon, SparklesIcon } from "@/components/icons";

interface MemoryBlockEmptyStateProps {
  onCreateNew?: () => void;
  onAskAI?: () => void;
}

export function MemoryBlockEmptyState({
  onCreateNew,
  onAskAI,
}: MemoryBlockEmptyStateProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="rounded-lg p-8 border border-transparent bg-secondary/50 pointer-events-auto">
        <h2 className="text-lg mb-2 text-foreground">
          Start building your first memory block
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Make your first block. Turn notes, docs, or scraped content into markdown that powers reusable
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 h-10 font-normal bg-secondary/50 hover:bg-secondary/60 text-gray-300 hover:text-gray-200"
          >
            <CirclePlusIcon />
            <span>Create New Block</span>
          </button>
          <button
            onClick={onAskAI}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 py-2 h-10 px-4 bg-transparent font-normal border border-gray-400/50 text-gray-300 hover:text-gray-200 hover:bg-transparent"
          >
            <SparklesIcon />
            <span>Ask AI to Create</span>
          </button>
        </div>
      </div>
    </div>
  );
}
