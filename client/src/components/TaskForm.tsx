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
      <div className="ui-card p-2 sm:p-2.5 flex items-center gap-2 border border-slate-200/90 shadow-sm focus-within:ring-2 focus-within:ring-[#004e9f]/20 focus-within:border-[#004e9f] transition-all">
        <div className="pl-2.5 text-slate-400 select-none">
          <Plus className="w-5 h-5 text-[#004e9f]" />
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
          className="w-full bg-transparent px-2 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none disabled:opacity-50"
          aria-label="New task title"
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={isCreating || !title.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#004e9f] hover:bg-[#003d7c] active:bg-[#002c59] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004e9f]"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <span>Add Task</span>
              <span className="hidden sm:inline-flex opacity-80 ml-0.5 text-[10px] bg-white/20 px-1 py-0.5 rounded">
                <CornerDownLeft className="w-2.5 h-2.5" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Supporting validation message and character count */}
      <div className="flex justify-between items-center px-2 mt-1.5 text-xs text-slate-500 min-h-[1.25rem]">
        {error ? (
          <span role="alert" className="text-red-600 font-semibold">
            {error}
          </span>
        ) : (
          <span className="text-slate-400">
            Press Return or click Add Task to create
          </span>
        )}
        <span
          className={`ml-auto tabular-nums font-medium ${
            isNearLimit ? 'text-amber-600' : 'text-slate-400'
          }`}
          aria-live="polite"
        >
          {title.length}/200
        </span>
      </div>
    </form>
  );
};
