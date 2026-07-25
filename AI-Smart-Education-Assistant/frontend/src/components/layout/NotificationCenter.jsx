import React, { useState, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  FileText,
  AlertTriangle,
  ClipboardList,
  Layers,
  CalendarCheck,
  Sparkles,
  WifiOff,
  ShieldCheck,
  X,
  Check,
  Trash2,
  RotateCw,
  ExternalLink,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { STORAGE_KEYS, ROUTES } from "@/constants";
import { cn, formatRelativeTime, generateId } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { useIsMobile } from "@/hooks";
import { toast } from "@/components/ui/Toast";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "upload", label: "Uploads" },
  { key: "ai", label: "AI" },
  { key: "quiz", label: "Quiz" },
  { key: "flashcards", label: "Flashcards" },
  { key: "planner", label: "Planner" },
  { key: "auth", label: "Auth" },
  { key: "system", label: "System" },
];

const ICON_BY_SUBTYPE = {
  "upload.completed": FileText,
  "upload.failed": AlertTriangle,
  "quiz.generated": ClipboardList,
  "flashcards.ready": Layers,
  "planner.generated": CalendarCheck,
  "ai.ready": Sparkles,
  "network.error": WifiOff,
  "login.success": ShieldCheck,
  "logout.success": ShieldCheck,
};

const COLOR_BY_TYPE = {
  success:
    "bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400",
  error:
    "bg-danger-50 text-danger-600 dark:bg-danger-950/40 dark:text-danger-400",
  info: "bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400",
  warning:
    "bg-warning-50 text-warning-600 dark:bg-warning-950/40 dark:text-warning-400",
};

const SEED_NOTIFICATIONS = [
  {
    id: generateId(),
    type: "success",
    title: "PDF uploaded successfully",
    message: "Quantum_Mechanics_Ch4.pdf has been processed and indexed.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    subtype: "upload.completed",
    category: "upload",
    actionUrl: ROUTES.upload,
  },
  {
    id: generateId(),
    type: "error",
    title: "File corrupted",
    message:
      "Corrupted_File.docx could not be processed. The file appears damaged.",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    subtype: "upload.failed",
    category: "upload",
  },
  {
    id: generateId(),
    type: "info",
    title: "Quiz generated",
    message: "10 MCQs ready from Calculus II Integration techniques.",
    read: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    subtype: "quiz.generated",
    category: "quiz",
    actionUrl: ROUTES.quiz,
  },
  {
    id: generateId(),
    type: "info",
    title: "Flashcards ready",
    message:
      "32 cards from Physics: Waves & Oscillations are ready for review.",
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    subtype: "flashcards.ready",
    category: "flashcards",
    actionUrl: ROUTES.flashcards,
  },
  {
    id: generateId(),
    type: "info",
    title: "Your study plan is ready",
    message: "A 7-day study plan for midterm preparation has been generated.",
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    subtype: "planner.generated",
    category: "planner",
    actionUrl: ROUTES.planner,
  },
  {
    id: generateId(),
    type: "success",
    title: "AI answered your question",
    message:
      "Your question about Schrödinger equation has a new detailed response.",
    read: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    subtype: "ai.ready",
    category: "ai",
    actionUrl: ROUTES.chat,
  },
  {
    id: generateId(),
    type: "warning",
    title: "Connection lost",
    message:
      "Working offline. Your data is preserved locally until reconnected.",
    read: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    subtype: "network.error",
    category: "system",
  },
  {
    id: generateId(),
    type: "info",
    title: "New login detected",
    message: "Chrome on Windows · Pune, India · Just now",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    subtype: "login.success",
    category: "auth",
  },
];

const SIMULATED_NEW = [
  {
    type: "success",
    title: "AI Response Ready",
    message: "Your follow-up question on organic reactions has been answered.",
    subtype: "ai.ready",
    category: "ai",
    actionUrl: ROUTES.chat,
  },
  {
    type: "info",
    title: "Quiz Generated",
    message: "New 12-question practice quiz on Linear Algebra ready.",
    subtype: "quiz.generated",
    category: "quiz",
    actionUrl: ROUTES.quiz,
  },
  {
    type: "success",
    title: "Upload completed",
    message: "Biology_Cell_Structure.pdf was processed successfully.",
    subtype: "upload.completed",
    category: "upload",
    actionUrl: ROUTES.upload,
  },
];

export const NotificationCenter = ({ open, onClose, triggerRef }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const panelRef = useRef(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return SEED_NOTIFICATIONS;
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [hasNewUnread, setHasNewUnread] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(notifications),
      );
    } catch {
      // ignore
    }
  }, [notifications]);

  useEffect(() => {
    if (!open && deleteConfirmId) {
      setDeleteConfirmId(null);
    }
  }, [open, deleteConfirmId]);

  useEffect(() => {
    if (open) {
      setHasNewUnread(false);
      return;
    }
    const interval = setInterval(() => {
      const pick =
        SIMULATED_NEW[Math.floor(Math.random() * SIMULATED_NEW.length)];
      const newNotif = {
        ...pick,
        id: generateId(),
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setHasNewUnread(true);
    }, 90000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef?.current &&
        !triggerRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, triggerRef]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (category !== "all" && n.category !== category) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notifications, category, search]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const deleteNotif = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setDeleteConfirmId(null);
    toast.success("Notification deleted");
  };

  const handleAction = (n) => {
    if (!n.read) toggleRead(n.id);
    if (n.actionUrl) {
      navigate(n.actionUrl);
      onClose();
    }
  };

  const renderCTA = (n) => {
    switch (n.subtype) {
      case "upload.completed":
        return (
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleAction(n)}
            rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
          >
            View in Library
          </Button>
        );
      case "upload.failed":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Retrying upload...")}
          >
            Retry
          </Button>
        );
      case "quiz.generated":
        return (
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleAction(n)}
            rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
          >
            Start Quiz
          </Button>
        );
      case "flashcards.ready":
        return (
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleAction(n)}
            rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
          >
            Start Review
          </Button>
        );
      case "planner.generated":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction(n)}
            rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
          >
            View
          </Button>
        );
      case "ai.ready":
        return (
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleAction(n)}
            rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
          >
            Open
          </Button>
        );
      case "network.error":
        return (
          <Button size="sm" variant="ghost" onClick={() => toggleRead(n.id)}>
            Dismiss
          </Button>
        );
      case "login.success":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Details
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => toast.info("Other sessions logged out")}
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      default:
        return n.actionUrl ? (
          <Button size="sm" variant="outline" onClick={() => handleAction(n)}>
            View
          </Button>
        ) : null;
    }
  };

  const panelContent = (
    <div
      ref={panelRef}
      className={cn(
        "flex flex-col overflow-hidden",
        isMobile
          ? "h-[85vh] w-full rounded-t-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          : "w-[420px] max-h-[520px] rounded-xl border border-slate-200 bg-white shadow-dropdown dark:border-slate-800 dark:bg-slate-900",
      )}
      role="dialog"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="rounded-md px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/40"
            >
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Clear all notifications? This cannot be undone."))
                  clearAll();
              }}
              className="rounded-md px-2 py-1 text-xs font-medium text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-950/40"
            >
              Clear all
            </button>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost h-8 w-8 ml-1"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute inset-y-0 left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter notifications..."
            className="input-base pl-9 h-9 text-xs"
            aria-label="Search notifications"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategory(cat.key)}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                category === cat.key
                  ? "bg-primary-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 dark:bg-primary-950/40 dark:text-primary-400">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              All caught up! <span aria-hidden="true">🎉</span>
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {notifications.length === 0
                ? "No notifications yet"
                : "No notifications match this filter"}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              leftIcon={<RotateCw className="h-3.5 w-3.5" />}
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
            >
              Refresh
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((n) => {
              const Icon = ICON_BY_SUBTYPE[n.subtype || ""] || Bell;
              const isConfirmingDelete = deleteConfirmId === n.id;
              return (
                <li
                  key={n.id}
                  className={cn(
                    "relative p-3 sm:p-4 transition-colors",
                    !n.read &&
                      "border-l-[3px] border-l-primary-500 bg-primary-50/30 dark:bg-primary-950/20",
                  )}
                >
                  {isConfirmingDelete ? (
                    <div className="flex flex-col gap-2 rounded-lg border border-danger-200 bg-danger-50/50 p-3 dark:border-danger-800 dark:bg-danger-950/30">
                      <p className="text-xs font-medium text-danger-700 dark:text-danger-300">
                        Delete this notification?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteNotif(n.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          COLOR_BY_TYPE[n.type],
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm",
                              !n.read
                                ? "font-semibold text-slate-900 dark:text-slate-100"
                                : "font-medium text-slate-800 dark:text-slate-200",
                            )}
                          >
                            {n.title}
                          </p>
                          <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            {formatRelativeTime(n.createdAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                          {n.message}
                        </p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {renderCTA(n)}
                          <div className="ml-auto flex items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => toggleRead(n.id)}
                              className="btn-ghost h-7 w-7"
                              aria-label={
                                n.read ? "Mark as unread" : "Mark as read"
                              }
                              title={n.read ? "Mark as unread" : "Mark as read"}
                            >
                              {n.read ? (
                                <Bell className="h-3.5 w-3.5" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(n.id)}
                              className="btn-ghost h-7 w-7 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/40"
                              aria-label="Delete notification"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50"
            >
              <div className="mx-auto w-full max-w-lg">
                <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
                {panelContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute right-0 top-12 z-50"
        >
          {panelContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const NotificationBell = ({ onClick, unreadCount, hasNewUnread }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-ghost relative h-10 w-10"
      aria-label="Notifications"
      aria-haspopup="dialog"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute right-1.5 top-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-danger-500 px-1 py-0.5 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
      {hasNewUnread && unreadCount > 0 && (
        <span className="pointer-events-none absolute right-1.5 top-1.5 inline-flex min-w-[18px] items-center justify-center">
          <span className="absolute inline-flex h-full min-w-[18px] items-center justify-center rounded-full bg-danger-400 opacity-75 animate-ping px-1 py-0.5" />
        </span>
      )}
    </button>
  );
};
