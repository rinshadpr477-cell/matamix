import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  History,
  Activity,
  Settings,
  X,
  Database,
  Layers,
} from 'lucide-react';

export type AppPage = 'dashboard' | 'tasks' | 'history' | 'system' | 'settings';

interface SidebarProps {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
  isOpen: boolean;
  onClose: () => void;
  taskCounts: {
    total: number;
    active: number;
    completed: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  isOpen,
  onClose,
  taskCounts,
}) => {
  const navItems: {
    id: AppPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare, badge: taskCounts.active },
    { id: 'history', label: 'History & Export', icon: History, badge: taskCounts.completed },
    { id: 'system', label: 'System Health', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Fixed Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between z-50 transition-transform duration-200 ease-in-out border-r border-slate-800/80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        aria-label="Main Navigation Sidebar"
      >
        {/* Top: Branding and Close on Mobile */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#004e9f] flex items-center justify-center text-white shadow-md shadow-blue-950">
                <Layers className="w-5 h-5 stroke-[2.25]" />
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight leading-tight block">
                  TaskFlow
                </span>
                <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
                  Enterprise Suite
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
              aria-label="Close navigation sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Navigation Links">
            <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Main Menu
            </div>
            {navItems.map(({ id, label, icon: Icon, badge }) => {
              const isActive = currentPage === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    onPageChange(id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#004e9f] text-white shadow-sm shadow-[#004e9f]/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span>{label}</span>
                  </div>

                  {badge !== undefined && badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Connection Status & Version */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Database className="w-3 h-3 text-[#34A853]" />
                <span className="truncate">MongoDB Active</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                Port 5000 &bull; REST API
              </span>
            </div>
          </div>
          <div className="mt-3 px-3 flex justify-between items-center text-[11px] text-slate-400">
            <span>TaskFlow v1.2</span>
            <span>Production Build</span>
          </div>
        </div>
      </aside>
    </>
  );
};
