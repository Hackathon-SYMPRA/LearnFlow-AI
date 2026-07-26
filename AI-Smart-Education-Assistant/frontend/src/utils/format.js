export const formatDate = (date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return "Just now";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Just now";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.max(0, Math.round(diffMs / 1000));
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return diffMin + " min ago";
  if (diffHour < 24) {
    const plural = diffHour > 1 ? "s" : "";
    return diffHour + " hour" + plural + " ago";
  }
  if (diffDay < 7) {
    const plural = diffDay > 1 ? "s" : "";
    return diffDay + " day" + plural + " ago";
  }
  return formatDate(d);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return value + " " + sizes[i];
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return minutes + " min";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? hours + "h " + mins + "m" : hours + "h";
};

export const formatPercentage = (value, total) => {
  if (total === 0) return "0%";
  return Math.round((value / total) * 100) + "%";
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export const generateId = () => {
  return Date.now() + "-" + Math.random().toString(36).slice(2, 9);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function debounce(fn, delay) {
  let timeoutId = null;
  return function (...args) {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
