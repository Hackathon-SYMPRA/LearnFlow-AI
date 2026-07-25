import React from 'react';
import { cn } from '@/utils/format';

interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'warning' | 'danger';
  className?: string;
}

const trackHeight: Record<NonNullable<ProgressProps['size']>, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const barColor: Record<NonNullable<ProgressProps['color']>, string> = {
  primary: 'bg-primary-600',
  secondary: 'bg-secondary-600',
  accent: 'bg-accent-600',
  warning: 'bg-warning-500',
  danger: 'bg-danger-600',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'primary',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">{value}/{max}</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          'w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800',
          trackHeight[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            barColor[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface UploadProgressProps {
  progress: number;
  fileName: string;
  size?: string;
  className?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  fileName,
  size,
  className,
}) => {
  const isComplete = progress >= 100;
  return (
    <div className={cn('card p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {fileName}
          </p>
          {size && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{size}</p>}
        </div>
        <span
          className={cn(
            'ml-4 rounded-full px-2.5 py-1 text-xs font-medium',
            isComplete
              ? 'bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-400'
              : 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400'
          )}
        >
          {isComplete ? 'Complete' : `${progress}%`}
        </span>
      </div>
      <Progress value={progress} color={isComplete ? 'accent' : 'primary'} size="sm" />
    </div>
  );
};
