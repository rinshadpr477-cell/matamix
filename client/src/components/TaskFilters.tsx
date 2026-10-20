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
    { id: 'all', label: 'All Tasks', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
      {/* Segmented Filter Pills */}
      <div
        role="tablist"
        aria-label="Filter tasks by completion status"
        className="flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200"
      >
        {filterOptions.map(({ id, label, count }) => {
          const isActive = currentFilter === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(id)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004e9f] ${
                isActive
                  ? 'bg-white text-[#004e9f] shadow-xs border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-blue-50 text-[#004e9f]'
                    : 'bg-slate-200/80 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input Field */}
      <div className="relative min-w-[220px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by keyword..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004e9f] focus:ring-1 focus:ring-[#004e9f] shadow-xs transition-all"
          aria-label="Filter tasks by keyword"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
