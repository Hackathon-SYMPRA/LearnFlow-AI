import React from 'react';
import { motion } from 'framer-motion';
import { Check, Search, FileSearch, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/utils/format';

export const ThinkingDots: React.FC<{ className?: string }> = ({ className }) => {
  const dotVariants = {
    initial: { y: 0 },
    animate: (i: number) => ({
      y: [0, -6, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        delay: i * 0.15,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <span className={cn('inline-flex items-center gap-1 py-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          custom={i}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          className="inline-block h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400"
        />
      ))}
    </span>
  );
};

interface ProcessingStepperProps {
  step: 0 | 1 | 2 | 3;
  className?: string;
}

const STEPS = [
  {
    icon: Search,
    label: 'Searching your documents',
  },
  {
    icon: FileSearch,
    label: 'Finding relevant content',
  },
  {
    icon: Sparkles,
    label: 'Generating answer',
  },
  {
    icon: Wand2,
    label: 'Preparing final response',
  },
] as const;

export const ProcessingStepper: React.FC<ProcessingStepperProps> = ({ step, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {STEPS.map((s, idx) => {
        const isDone = idx < step;
        const isActive = idx === step;
        const Icon = s.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{
              opacity: isDone || isActive ? 1 : 0.4,
              x: 0,
            }}
            transition={{ delay: idx * 0.08 }}
            className="flex items-center gap-2"
          >
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300',
                isDone && 'bg-accent-100 text-accent-600 dark:bg-accent-950/60 dark:text-accent-400',
                isActive &&
                  'bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400',
                !isDone && !isActive && 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
              )}
            >
              {isDone ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Icon
                  className={cn(
                    'h-3.5 w-3.5',
                    isActive && 'animate-pulse'
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                'text-sm transition-colors duration-300',
                isDone && 'text-accent-700 dark:text-accent-300',
                isActive && 'text-primary-700 dark:text-primary-300 font-medium',
                !isDone && !isActive && 'text-slate-400 dark:text-slate-500'
              )}
            >
              {s.label}
              {isActive && <ThinkingDots className="ml-1" />}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

interface StreamProgressProps {
  progress: number;
  label?: string;
  className?: string;
}

export const StreamProgress: React.FC<StreamProgressProps> = ({
  progress,
  label,
  className,
}) => {
  const clamped = Math.max(0, Math.min(100, progress));
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500"
        />
      </div>
    </div>
  );
};
