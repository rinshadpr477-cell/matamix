import React from 'react';
import { Task } from '../types/task';

interface StatsBarProps {
  tasks: Task[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section aria-label="Task progress summary" className="mb-6">
      <div className="apple-card rounded-2xl p-4 sm:p-5">
        {/* Metric columns */}
        <div className="grid grid-cols-3 divide-x divide-white/[0.06] text-center">
          <div className="px-2">
            <span className="text-[11px] uppercase tracking-wider font-medium text-zinc-400 block mb-1">
              Total Tasks
            </span>
            <span className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              {total}
            </span>
          </div>

          <div className="px-2">
            <span className="text-[11px] uppercase tracking-wider font-medium text-zinc-400 block mb-1">
              In Progress
            </span>
            <span className="text-xl sm:text-2xl font-semibold tracking-tight text-amber-400/90">
              {pending}
            </span>
          </div>

          <div className="px-2">
            <span className="text-[11px] uppercase tracking-wider font-medium text-zinc-400 block mb-1">
              Completed
            </span>
            <span className="text-xl sm:text-2xl font-semibold tracking-tight text-blue-400">
              {completed}
            </span>
          </div>
        </div>

        {/* Minimalist Progress Track */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.05] flex items-center gap-3">
          <div
            className="flex-1 h-1.5 rounded-full bg-zinc-800/90 overflow-hidden"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tasks completion percentage"
          >
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-medium text-zinc-400 tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>
    </section>
  );
};
