export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return diffMin + ' min ago';
  if (diffHour < 24) {
    const plural = diffHour > 1 ? 's' : '';
    return diffHour + ' hour' + plural + ' ago';
  }
  if (diffDay < 7) {
    const plural = diffDay > 1 ? 's' : '';
    return diffDay + ' day' + plural + ' ago';
  }
  return formatDate(d);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return value + ' ' + sizes[i];
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return minutes + ' min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? hours + 'h ' + mins + 'm' : hours + 'h';
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return Math.round((value / total) * 100) + '%';
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const generateId = (): string => {
  return Date.now() + '-' + Math.random().toString(36).slice(2, 9);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

type AnyVoidFn = (...args: never[]) => void;

export function debounce<T extends AnyVoidFn>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (this: never, ...args: Parameters<T>) {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
