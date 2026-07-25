import React from "react";
import { cn } from "@/utils/format";

export const Card = ({
  hoverable = false,
  padded = true,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "card",
        hoverable && "card-hover cursor-pointer",
        padded && "p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-slate-900 dark:text-slate-100",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ className, children, ...props }) => {
  return (
    <p
      className={cn(
        "mt-1 text-sm text-slate-500 dark:text-slate-400",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className, children, ...props }) => {
  return (
    <div className={cn("mt-6 flex items-center", className)} {...props}>
      {children}
    </div>
  );
};

const colorBgMap = {
  primary:
    "bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400",
  secondary:
    "bg-secondary-50 text-secondary-600 dark:bg-secondary-950/50 dark:text-secondary-400",
  accent:
    "bg-accent-50 text-accent-600 dark:bg-accent-950/50 dark:text-accent-400",
  warning:
    "bg-warning-50 text-warning-600 dark:bg-warning-950/50 dark:text-warning-400",
  danger:
    "bg-danger-50 text-danger-600 dark:bg-danger-950/50 dark:text-danger-400",
};

export const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  color = "primary",
}) => {
  return (
    <Card hoverable className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </p>
          {(description || trend) && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center font-medium",
                    trend.isPositive
                      ? "text-accent-600 dark:text-accent-400"
                      : "text-danger-600 dark:text-danger-400",
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
              )}
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              colorBgMap[color],
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
