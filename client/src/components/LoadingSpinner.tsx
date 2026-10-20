import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Loading tasks"
      className="space-y-2.5 animate-pulse"
    >
      <span className="sr-only">Loading tasks...</span>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="apple-card rounded-xl px-4 py-3.5 flex items-center justify-between gap-3 border border-white/[0.04]"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 rounded-full bg-zinc-800/80 shrink-0" />
            <div className="space-y-1.5 flex-1 max-w-sm">
              <div
                className="h-3.5 bg-zinc-800/80 rounded"
                style={{ width: i === 1 ? '65%' : i === 2 ? '80%' : '45%' }}
              />
              <div className="h-2.5 bg-zinc-800/40 rounded w-20" />
            </div>
          </div>
          <div className="w-6 h-6 rounded bg-zinc-800/40 shrink-0" />
        </div>
      ))}
    </div>
  );
};
