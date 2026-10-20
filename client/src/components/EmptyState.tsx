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
      className="bg-white border border-slate-200/80 rounded-2xl py-12 px-6 text-center flex flex-col items-center justify-center shadow-sm"
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-3.5 text-slate-500 shadow-xs">
        {isSearchOrFilter ? (
          <SearchX className="w-6 h-6 text-slate-400" />
        ) : (
          <CheckCircle2 className="w-6 h-6 text-[#004e9f] stroke-[2]" />
        )}
      </div>

      <h3 className="text-sm font-semibold text-slate-900 mb-1">
        {isSearchOrFilter ? 'No matching tasks' : 'No tasks yet'}
      </h3>

      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
        {isSearchOrFilter
          ? 'Try adjusting your search query or switching filters.'
          : 'Your task list is clean and clear! Type a title above and press Return.'}
      </p>
    </div>
  );
};
