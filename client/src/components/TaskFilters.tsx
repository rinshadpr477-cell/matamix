import React from 'react';
import { FilterStatus } from '../types/task';
import { Search, X } from 'lucide-react';

interface TaskFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}) => {
  const filterOptions: { id: FilterStatus; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'completed', label: 'Done', count: counts.completed },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4">
      {/* Apple-style Segmented Control */}
      <div
        role="tablist"
        aria-label="Filter tasks by completion status"
        className="flex items-center p-0.5 rounded-xl bg-zinc-900 border border-white/[0.08] shadow-inner"
      >
        {filterOptions.map(({ id, label, count }) => {
          const isActive = currentFilter === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(id)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 font-semibold'
                    : 'bg-zinc-800/80 text-zinc-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Refined Search Box */}
      <div className="relative min-w-[200px]">
        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-zinc-900/90 border border-white/[0.08] rounded-xl pl-8 pr-7 py-1.5 text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/40 transition-all"
          aria-label="Filter tasks by keyword"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-0.5 rounded-full hover:bg-white/[0.08] transition-colors"
            aria-label="Clear search input"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
