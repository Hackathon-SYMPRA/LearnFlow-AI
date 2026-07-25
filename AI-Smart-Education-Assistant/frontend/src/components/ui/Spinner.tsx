import React from 'react';
import { cn } from '@/utils/format';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className, label }) => {
  return (
    <div role="status" className="flex items-center gap-3" aria-live="polite">
      <svg
        className={cn('animate-spin text-primary-600 dark:text-primary-400', sizeClasses[size], className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface FullScreenLoaderProps {
  label?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ label }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        {label && <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>}
      </div>
    </div>
  );
};

interface PageLoaderProps {
  label?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ label = 'Loading...' }) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
};
