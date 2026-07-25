import React from "react";
import { toast as sonnerToast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const iconMap = {
  success: (
    <CheckCircle2
      className="h-5 w-5 text-accent-600 dark:text-accent-400"
      aria-hidden="true"
    />
  ),
  error: (
    <XCircle
      className="h-5 w-5 text-danger-600 dark:text-danger-400"
      aria-hidden="true"
    />
  ),
  warning: (
    <AlertTriangle
      className="h-5 w-5 text-warning-600 dark:text-warning-400"
      aria-hidden="true"
    />
  ),
  info: (
    <Info
      className="h-5 w-5 text-primary-600 dark:text-primary-400"
      aria-hidden="true"
    />
  ),
};

const classMap = {
  success: "border-l-4 border-l-accent-500",
  error: "border-l-4 border-l-danger-500",
  warning: "border-l-4 border-l-warning-500",
  info: "border-l-4 border-l-primary-500",
};

export const toast = {
  success: (message, options) =>
    sonnerToast.custom(
      (id) => (
        <div
          className={`flex w-full items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-dropdown dark:bg-slate-900 ${classMap.success}`}
          role="alert"
        >
          {iconMap.success}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {message}
            </p>
            {options?.description && (
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                {options.description}
              </p>
            )}
            {options?.action && (
              <button
                onClick={() => {
                  options.action?.onClick();
                  sonnerToast.dismiss(id);
                }}
                className="mt-2 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
              >
                {options.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      { duration: options?.duration ?? 4000 },
    ),

  error: (message, options) =>
    sonnerToast.custom(
      (id) => (
        <div
          className={`flex w-full items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-dropdown dark:bg-slate-900 ${classMap.error}`}
          role="alert"
        >
          {iconMap.error}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {message}
            </p>
            {options?.description && (
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                {options.description}
              </p>
            )}
            {options?.action && (
              <button
                onClick={() => {
                  options.action?.onClick();
                  sonnerToast.dismiss(id);
                }}
                className="mt-2 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
              >
                {options.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      { duration: options?.duration ?? 4000 },
    ),

  warning: (message, options) =>
    sonnerToast.custom(
      (id) => (
        <div
          className={`flex w-full items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-dropdown dark:bg-slate-900 ${classMap.warning}`}
          role="alert"
        >
          {iconMap.warning}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {message}
            </p>
            {options?.description && (
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                {options.description}
              </p>
            )}
            {options?.action && (
              <button
                onClick={() => {
                  options.action?.onClick();
                  sonnerToast.dismiss(id);
                }}
                className="mt-2 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
              >
                {options.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      { duration: options?.duration ?? 4000 },
    ),

  info: (message, options) =>
    sonnerToast.custom(
      (id) => (
        <div
          className={`flex w-full items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-dropdown dark:bg-slate-900 ${classMap.info}`}
          role="status"
        >
          {iconMap.info}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {message}
            </p>
            {options?.description && (
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                {options.description}
              </p>
            )}
            {options?.action && (
              <button
                onClick={() => {
                  options.action?.onClick();
                  sonnerToast.dismiss(id);
                }}
                className="mt-2 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
              >
                {options.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      { duration: options?.duration ?? 4000 },
    ),
};
