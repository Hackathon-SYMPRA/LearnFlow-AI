import React from 'react';
import { cn } from '@/utils/format';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, style, ...props }) => {
  return (
    <div
      className={cn('skeleton rounded-md', className)}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
};

interface TextSkeletonProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  lastLineWidth = '75%',
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && `w-[${lastLineWidth}]`
          )}
          style={{ width: i === lines - 1 ? lastLineWidth : '100%' }}
        />
      ))}
    </div>
  );
};

interface CardSkeletonProps {
  hasHeader?: boolean;
  hasIcon?: boolean;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  hasHeader = true,
  hasIcon = true,
  className,
}) => {
  return (
    <div className={cn('card p-6', className)} aria-hidden="true">
      {hasHeader && (
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          {hasIcon && <Skeleton className="h-12 w-12 rounded-xl" />}
        </div>
      )}
      <TextSkeleton lines={4} lastLineWidth="60%" />
    </div>
  );
};

interface StatCardSkeletonProps {
  className?: string;
}

export const StatCardSkeleton: React.FC<StatCardSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('card p-6', className)} aria-hidden="true">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  );
};

interface DashboardSkeletonProps {}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden="true">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};
