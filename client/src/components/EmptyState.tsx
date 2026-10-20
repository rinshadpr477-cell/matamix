import React from 'react';
import { CheckCircle2, SearchX } from 'lucide-react';

interface EmptyStateProps {
  isSearchOrFilter: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isSearchOrFilter }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="apple-card rounded-2xl py-12 px-6 text-center flex flex-col items-center justify-center border border-white/[0.06]"
    >
      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center mb-3.5 text-zinc-400 shadow-sm">
        {isSearchOrFilter ? (
          <SearchX className="w-6 h-6 text-zinc-400" />
        ) : (
          <CheckCircle2 className="w-6 h-6 text-blue-400 stroke-[1.75]" />
        )}
      </div>

      <h3 className="text-sm font-semibold text-zinc-200 mb-1">
        {isSearchOrFilter ? 'No matching tasks' : 'No tasks yet'}
      </h3>

      <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
        {isSearchOrFilter
          ? 'Try adjusting your search query or switching filters.'
          : 'Your task list is clean and clear! Type a title above and press Return.'}
      </p>
    </div>
  );
};
