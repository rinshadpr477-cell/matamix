import React, { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { Sidebar, AppPage } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { StatsBar } from './components/StatsBar';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBanner } from './components/ErrorMessage';
import { HistoryView } from './components/HistoryView';
import { SystemHealthView } from './components/SystemHealthView';
import { SettingsView } from './components/SettingsView';
import { DashboardView } from './components/DashboardView';
import { FilterStatus } from './types/task';
import { CheckSquare } from 'lucide-react';

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

  const [currentPage, setCurrentPage] = useState<AppPage>('tasks');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      total: tasks.length,
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  const isFiltered = currentFilter !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-slate-900 flex">
      {/* 1. Fixed Dark Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        taskCounts={{
          total: counts.total,
          active: counts.active,
          completed: counts.completed,
        }}
      />

      {/* 2. Main Layout Area (offset for desktop sidebar) */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <TopHeader
          currentPage={currentPage}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onRefresh={fetchTasks}
          isLoading={isLoading}
        />

        {/* 3. Main Content Canvas */}
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          {/* Action Error Notification */}
          {actionError && (
            <ErrorBanner
              message={actionError}
              onDismiss={clearActionError}
            />
          )}

          {/* Fetch Connection Error Banner */}
          {fetchError && (
            <ErrorBanner
              message={fetchError}
              onRetry={fetchTasks}
            />
          )}

          {/* Route-Based View Switcher */}
          {currentPage === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              onAddTask={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
              isCreating={isCreating}
              updatingIds={updatingIds}
              deletingIds={deletingIds}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'tasks' && (
            <div className="space-y-6">
              {/* Task Manager Page Header */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#004e9f] uppercase tracking-wider mb-1">
                    <CheckSquare className="w-4 h-4" />
                    <span>Active Workflow</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Task Management Board
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    Create, prioritize, complete, and organize daily operational tasks with atomic database sync.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
                  <span>{counts.active} pending tasks</span>
                </div>
              </div>

              {/* Add Task Input Form Card */}
              <TaskForm onAddTask={addTask} isCreating={isCreating} />

              {/* Task Overview Stats Cards */}
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
                ) : !fetchError ? (
                  <TaskList
                    tasks={filteredTasks}
                    allTasksCount={tasks.length}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    updatingIds={updatingIds}
                    deletingIds={deletingIds}
                    isFiltered={isFiltered}
                  />
                ) : null}
              </div>
            </div>
          )}

          {currentPage === 'history' && (
            <HistoryView
              tasks={tasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          )}

          {currentPage === 'system' && <SystemHealthView />}

          {currentPage === 'settings' && (
            <SettingsView
              tasks={tasks}
              onDelete={deleteTask}
            />
          )}
        </main>

        {/* Professional Footer */}
        <footer className="py-4 px-6 border-t border-slate-200/80 bg-white/60 text-center text-xs text-slate-400">
          <p>TaskFlow &bull; Enterprise UI Design System &bull; Production Ready</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
