import React from 'react';
import { Task } from '../types/task';
import { Check, Trash2, Loader2, Clock, CheckCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  isUpdating,
  isDeleting,
}) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group bg-white border rounded-2xl p-4 sm:p-4.5 flex items-center justify-between gap-3.5 transition-all duration-200 shadow-sm ${
        task.completed
          ? 'border-slate-200/60 bg-slate-50/50'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
      } ${isDeleting ? 'opacity-30 pointer-events-none scale-[0.99]' : ''}`}
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Circular Completion Control */}
        <div className="flex items-center justify-center min-w-[28px] min-h-[28px] shrink-0 mt-0.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={task.completed}
            aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
            onClick={() => onToggle(task.id)}
            disabled={isUpdating || isDeleting}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004e9f] focus-visible:ring-offset-2 ${
              task.completed
                ? 'bg-[#34A853] border-2 border-[#34A853] text-white shadow-xs'
                : 'border-2 border-slate-300 hover:border-[#004e9f] bg-slate-50 hover:bg-white'
            } ${isUpdating ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
          >
            {isUpdating ? (
              <Loader2 className="w-3 h-3 animate-spin text-[#004e9f]" />
            ) : task.completed ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : null}
          </button>
        </div>

        {/* Task Title & Metadata */}
        <div className="min-w-0 flex-1 pt-0.5">
          <p
            className={`text-sm leading-snug break-words transition-colors duration-150 ${
              task.completed
                ? 'line-through text-slate-400 font-normal'
                : 'text-slate-900 font-medium'
            }`}
          >
            {task.title}
          </p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
            </div>

            <span className="text-slate-300">&bull;</span>

            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                task.completed
                  ? 'bg-emerald-50 text-[#34A853] border border-emerald-200/60'
                  : 'bg-blue-50 text-[#004e9f] border border-blue-200/60'
              }`}
            >
              {task.completed ? (
                <>
                  <CheckCircle className="w-2.5 h-2.5" />
                  <span>Done</span>
                </>
              ) : (
                <span>In Progress</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Action Button */}
      <div className="flex items-center justify-center shrink-0">
        <button
          type="button"
          aria-label="Delete task"
          onClick={() => onDelete(task.id)}
          disabled={isDeleting || isUpdating}
          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-90 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
          ) : (
            <Trash2 className="w-4 h-4 stroke-[1.75]" />
          )}
        </button>
      </div>
    </div>
  );
};
