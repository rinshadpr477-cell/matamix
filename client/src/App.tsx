import React, { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBanner } from './components/ErrorMessage';
import { FilterStatus } from './types/task';

export const App: React.FC = () => {
  const {
    tasks,
    isLoading,
    isCreating,
    updatingIds,
    deletingIds,
    fetchError,
    actionError,
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    clearActionError,
  } = useTasks();

  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Task filtering and search memoization
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Completion status filter
      if (currentFilter === 'active' && task.completed) return false;
      if (currentFilter === 'completed' && !task.completed) return false;

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return task.title.toLowerCase().includes(query);
      }

      return true;
    });
  }, [tasks, currentFilter, searchQuery]);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  const isFiltered = currentFilter !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top subtle hairline glow */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

      <main className="w-full max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
        {/* Header with live remaining counter */}
        <Header remainingCount={counts.active} />

        {/* Action Error Notification */}
        {actionError && (
          <ErrorBanner
            message={actionError}
            onDismiss={clearActionError}
          />
        )}

        {/* Add Task Input Form */}
        <TaskForm onAddTask={addTask} isCreating={isCreating} />

        {/* Task Overview Stats */}
        <StatsBar tasks={tasks} />

        {/* Segmented Filter Toolbar */}
        <TaskFilters
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          counts={counts}
        />

        {/* Main Task List Area */}
        <div aria-live="polite" aria-busy={isLoading || isCreating}>
          {isLoading ? (
            <LoadingSpinner />
          ) : fetchError ? (
            <ErrorBanner
              message={fetchError}
              onRetry={fetchTasks}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              allTasksCount={tasks.length}
              onToggle={toggleTask}
              onDelete={deleteTask}
              updatingIds={updatingIds}
              deletingIds={deletingIds}
              isFiltered={isFiltered}
            />
          )}
        </div>
      </main>

      {/* Minimal Apple-style Footer */}
      <footer className="py-6 border-t border-white/[0.06] text-center text-[11px] text-zinc-400">
        <p>TaskFlow &bull; Apple-Inspired Workspace</p>
      </footer>
    </div>
  );
};

export default App;
