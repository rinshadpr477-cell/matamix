import React from 'react';
import { Menu, RefreshCw, CheckCircle2 } from 'lucide-react';
import { AppPage } from './Sidebar';

interface TopHeaderProps {
  currentPage: AppPage;
  onOpenMobileMenu: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentPage,
  onOpenMobileMenu,
  onRefresh,
  isLoading,
}) => {
  const pageTitles: Record<AppPage, { title: string; breadcrumb: string }> = {
    dashboard: { title: 'Dashboard', breadcrumb: 'Workspace / Overview' },
    tasks: { title: 'Task Manager', breadcrumb: 'Workspace / Task Operations' },
    history: { title: 'History & Archive', breadcrumb: 'Workspace / Audit Logs' },
    system: { title: 'System Health & API', breadcrumb: 'Workspace / Infrastructure' },
    settings: { title: 'Settings', breadcrumb: 'Workspace / Preferences' },
  };

  const { title, breadcrumb } = pageTitles[currentPage] || {
    title: 'Workspace',
    breadcrumb: 'TaskFlow',
  };

  return (
    <header className="h-16 sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
            {breadcrumb}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Right: Actions & Live Indicator */}
      <div className="flex items-center gap-3">
        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-xs disabled:opacity-50 active:scale-95"
          title="Refresh task records from MongoDB"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-[#004e9f] ${
              isLoading ? 'animate-spin' : ''
            }`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Live System Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
          <span className="hidden sm:inline">API Online</span>
        </div>
      </div>
    </header>
  );
};
