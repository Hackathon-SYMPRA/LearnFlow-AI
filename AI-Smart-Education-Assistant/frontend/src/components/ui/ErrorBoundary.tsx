import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleHome = (): void => {
    window.location.href = '/';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex min-h-[100dvh] items-center justify-center p-6 bg-slate-50 dark:bg-slate-950"
        >
          <div className="w-full max-w-md card p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50 dark:bg-danger-950/30">
              <AlertTriangle className="h-8 w-8 text-danger-600 dark:text-danger-400" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              The application encountered an unexpected error. You can try again or go back to the dashboard.
            </p>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400">
                  Technical details
                </summary>
                <pre className="mt-2 overflow-auto rounded-lg bg-slate-100 dark:bg-slate-800 p-3 text-xs text-slate-700 dark:text-slate-300 max-h-40">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button variant="primary" onClick={this.handleReset} leftIcon={<RefreshCw />}>
                Try Again
              </Button>
              <Button variant="outline" onClick={this.handleReload}>
                Reload Page
              </Button>
              <Button variant="ghost" onClick={this.handleHome} leftIcon={<Home />}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface PageErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export const PageError: React.FC<PageErrorProps> = ({
  title = 'Failed to load',
  message = 'Something went wrong while loading this page. Please try again.',
  onRetry,
  onBack,
}) => {
  return (
    <div
      role="alert"
      className="flex min-h-[400px] items-center justify-center p-6"
    >
      <div className="w-full max-w-md card p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50 dark:bg-danger-950/30">
          <AlertTriangle className="h-8 w-8 text-danger-600 dark:text-danger-400" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{message}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRetry && (
            <Button variant="primary" onClick={onRetry} leftIcon={<RefreshCw />}>
              Retry
            </Button>
          )}
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Go Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface NetworkErrorProps {
  onRetry?: () => void;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({ onRetry }) => (
  <PageError
    title="No internet connection"
    message="It looks like you're offline. Check your internet connection and try again."
    onRetry={onRetry}
  />
);
