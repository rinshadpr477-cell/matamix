import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Loading tasks"
      className="space-y-3 animate-pulse"
    >
      <span className="sr-only">Loading tasks...</span>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0" />
            <div className="space-y-2 flex-1 max-w-sm">
              <div
                className="h-3.5 bg-slate-200 rounded-md"
                style={{ width: i === 1 ? '65%' : i === 2 ? '80%' : '45%' }}
              />
              <div className="h-2.5 bg-slate-100 rounded-md w-24" />
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-slate-100 shrink-0" />
        </div>
      ))}
    </div>
  );
};
