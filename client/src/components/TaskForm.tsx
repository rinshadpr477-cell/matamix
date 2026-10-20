import React, { useState } from 'react';
import { Plus, Loader2, CornerDownLeft } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (title: string) => Promise<boolean>;
  isCreating: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, isCreating }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError('Please enter a task title');
      return;
    }

    if (trimmed.length > 200) {
      setError('Task title cannot exceed 200 characters');
      return;
    }

    setError(null);
    const success = await onAddTask(trimmed);
    if (success) {
      setTitle('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) setError(null);
  };

  const isNearLimit = title.length > 180;

  return (
    <form onSubmit={handleSubmit} className="mb-6" aria-label="Create new task">
      <div className="relative">
        <div className="apple-input-bar rounded-xl p-1.5 sm:p-2 flex items-center gap-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500/70">
          <div className="pl-2.5 text-zinc-400 select-none">
            <Plus className="w-4 h-4 stroke-[2.25]" />
          </div>

          <label htmlFor="new-task-input" className="sr-only">
            Add a new task
          </label>
          <input
            id="new-task-input"
            type="text"
            value={title}
            onChange={handleChange}
            placeholder="Add a new task (e.g. Design API architecture)..."
            disabled={isCreating}
            maxLength={200}
            className="w-full bg-transparent px-2 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none disabled:opacity-50"
            aria-label="New task title"
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={isCreating || !title.trim()}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <span>Add Task</span>
                <span className="hidden sm:inline-flex opacity-70 ml-0.5 text-[10px] bg-blue-700/60 px-1 py-0.5 rounded">
                  <CornerDownLeft className="w-2.5 h-2.5" />
                </span>
              </>
            )}
          </button>
        </div>

        {/* Supporting validation message and character count */}
        <div className="flex justify-between items-center px-1.5 mt-1.5 text-xs text-zinc-400 min-h-[1.25rem]">
          {error ? (
            <span role="alert" className="text-rose-400 font-medium">
              {error}
            </span>
          ) : (
            <span className="hidden sm:inline text-zinc-400">
              Press Return or click Add Task to create
            </span>
          )}
          <span
            className={`ml-auto tabular-nums ${
              isNearLimit ? 'text-amber-400 font-medium' : 'text-zinc-400'
            }`}
            aria-live="polite"
          >
            {title.length}/200
          </span>
        </div>
      </div>
    </form>
  );
};
