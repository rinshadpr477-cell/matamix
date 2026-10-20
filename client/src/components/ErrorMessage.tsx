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
      className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 mb-6 flex items-start gap-3.5 shadow-sm"
    >
      <div className="p-1 rounded-xl bg-rose-100 text-rose-600 shrink-0 mt-0.5">
        <AlertCircle className="w-4 h-4 stroke-[2]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-rose-900 break-words leading-relaxed">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-300 transition-all shadow-xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-500 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-100/50 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
