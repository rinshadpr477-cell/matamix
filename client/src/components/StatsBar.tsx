import React from 'react';
import { Task } from '../types/task';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Metric 1: Total */}
        <div className="ui-card p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004e9f]">
              <ListTodo className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Tasks
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {total}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: In Progress */}
        <div className="ui-card p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                In Progress
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {pending}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Completed */}
        <div className="ui-card p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-[#34A853]">
              <CheckCircle2 className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Completed
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#34A853] tracking-tight">
                {completed}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Track Card */}
      <div className="ui-card p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <span>Overall Completion</span>
          <span className="text-[#004e9f]">{completed} of {total} tasks completed</span>
        </div>
        <div
          className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Tasks completion percentage"
        >
          <div
            className="h-full bg-[#004e9f] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </section>
  );
};
