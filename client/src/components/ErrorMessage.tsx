import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <div
      role="alert"
      className="apple-card border-red-500/30 bg-red-950/20 rounded-xl p-3.5 sm:p-4 mb-6 flex items-start gap-3 shadow-sm"
    >
      <div className="p-1 rounded-lg bg-red-500/10 text-red-400 shrink-0 mt-0.5">
        <AlertCircle className="w-4 h-4 stroke-[2]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-red-200 break-words leading-relaxed">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-medium border border-red-500/30 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-red-400/80 hover:text-red-200 p-1 rounded-md transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
