import React from 'react';
import { Task } from '../types/task';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  ListTodo,
  Sparkles,
} from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { AppPage } from './Sidebar';

interface DashboardViewProps {
  tasks: Task[];
  onAddTask: (title: string) => Promise<boolean>;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isCreating: boolean;
  updatingIds: Set<string>;
  deletingIds: Set<string>;
  onNavigate: (page: AppPage) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  isCreating,
  updatingIds,
  deletingIds,
  onNavigate,
}) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Recent 4 tasks
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#004e9f] text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Productivity Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome to TaskFlow
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Organize workflows, track milestones, and manage tasks with production-grade reliability connected directly to MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigate('tasks')}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <span>Open Task Manager</span>
            <ArrowRight className="w-4 h-4 text-[#004e9f]" />
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{total}</div>
          <p className="text-[11px] text-slate-400 mt-1">All managed items</p>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#004e9f] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#004e9f]">{active}</div>
          <p className="text-[11px] text-slate-400 mt-1">Pending completion</p>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#34A853] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#34A853]">{completed}</div>
          <p className="text-[11px] text-slate-400 mt-1">Successfully resolved</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{completionRate}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#004e9f] h-full rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Add & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Task Creation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Quick Task Creation
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a new actionable item to your workflow database.
            </p>
            <TaskForm onAddTask={onAddTask} isCreating={isCreating} />
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Workspace Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('tasks')}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#004e9f] hover:bg-blue-50/50 text-left transition-all group"
              >
                <div className="font-semibold text-slate-900 group-hover:text-[#004e9f]">
                  Task Board &rarr;
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Filter & manage</div>
              </button>
              <button
                onClick={() => onNavigate('history')}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#34A853] hover:bg-emerald-50/50 text-left transition-all group"
              >
                <div className="font-semibold text-slate-900 group-hover:text-[#34A853]">
                  Export Data &rarr;
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">CSV & JSON files</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Tasks */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Tasks</h3>
                <p className="text-xs text-slate-400">Latest additions to your board</p>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs font-bold text-[#004e9f] hover:underline"
              >
                View all ({tasks.length})
              </button>
            </div>

            {recentTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No tasks available. Create one using the form on the left.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    isUpdating={updatingIds.has(task.id)}
                    isDeleting={deletingIds.has(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
