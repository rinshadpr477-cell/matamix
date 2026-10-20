import React from 'react';
import { Task } from '../types/task';
import { Check, Trash2, Loader2, Clock } from 'lucide-react';

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
      className={`group apple-card rounded-xl px-3.5 sm:px-4 py-3 flex items-center justify-between gap-3 transition-all duration-150 ${
        task.completed
          ? 'bg-zinc-900/40 border-white/[0.04]'
          : 'hover:bg-zinc-800/40 hover:border-white/[0.12]'
      } ${isDeleting ? 'opacity-25 pointer-events-none' : ''}`}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Apple-style Circular Completion Control with 44x44 touch padding */}
        <div className="flex items-center justify-center min-w-[28px] min-h-[28px] sm:min-w-[24px] sm:min-h-[24px] shrink-0 mt-0.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={task.completed}
            aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
            onClick={() => onToggle(task.id)}
            disabled={isUpdating || isDeleting}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
              task.completed
                ? 'bg-blue-600 border border-blue-500 text-white shadow-sm'
                : 'border border-zinc-600 hover:border-blue-400 bg-zinc-900/80 hover:bg-zinc-800'
            } ${isUpdating ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
          >
            {isUpdating ? (
              <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
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
                ? 'line-through text-zinc-500 decoration-zinc-600 font-normal'
                : 'text-zinc-100 font-medium'
            }`}
          >
            {task.title}
          </p>

          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-400 font-normal">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Delete Action Button with 44x44px touch target */}
      <div className="flex items-center justify-center shrink-0">
        <button
          type="button"
          aria-label="Delete task"
          onClick={() => onDelete(task.id)}
          disabled={isDeleting || isUpdating}
          className="min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 opacity-80 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin text-red-400" />
          ) : (
            <Trash2 className="w-4 h-4 stroke-[1.75]" />
          )}
        </button>
      </div>
    </div>
  );
};
