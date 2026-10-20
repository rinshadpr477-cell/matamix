import React from 'react';
import { Check } from 'lucide-react';

interface HeaderProps {
  remainingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ remainingCount }) => {
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
        {/* App Branding & Icon */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#0a84ff] to-[#0071e3] p-0.5 shadow-[0_1px_3px_rgba(0,113,227,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-white stroke-[2.75]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                TaskFlow
              </h1>
              {remainingCount !== undefined && remainingCount > 0 && (
                <span className="text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {remainingCount} to do
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-normal">
              {currentDate}
            </p>
          </div>
        </div>

        {/* Minimalist Live Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-medium text-zinc-400 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Cloud Sync</span>
          </div>
        </div>
      </div>
    </header>
  );
};
