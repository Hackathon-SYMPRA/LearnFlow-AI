import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  Search,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Sparkles,
  ChevronDown,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  BookOpen,
  Volume2,
  VolumeX,
  Flame,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useIsMobile } from "@/hooks";
import { ROUTES, SUBJECTS, STORAGE_KEYS } from "@/constants";
import { Button } from "@/components/ui/Button";
import { NotificationCenter, NotificationBell } from "./NotificationCenter";
import { cn, getInitials } from "@/utils/format";
import { CompactLogo } from "@/components/ui/CompactLogo";
export const Header = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const {
    internetStatus,
    aiStatus,
    currentSubject,
    setCurrentSubject,
    openGlobalSearch,
  } = useApp();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewUnread, setHasNewUnread] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const notifTriggerRef = useRef(null);
  const profileRef = useRef(null);
  const subjectRef = useRef(null);

  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (stored) {
          const notifs = JSON.parse(stored);
          setUnreadCount(
            Array.isArray(notifs) ? notifs.filter((n) => !n.read).length : 0,
          );
        }
      } catch {
        // ignore
      }
    };
    updateCount();
    const interval = setInterval(updateCount, 1500);
    const handler = (e) => {
      if (e.key === STORAGE_KEYS.NOTIFICATIONS) updateCount();
    };
    window.addEventListener("storage", handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handler);
    };
  }, []);

  useEffect(() => {
    if (notifOpen) setHasNewUnread(false);
  }, [notifOpen]);

  useEffect(() => {
    if (unreadCount > 0 && !notifOpen) {
      setHasNewUnread(true);
      const t = setTimeout(() => setHasNewUnread(false), 6000);
      return () => clearTimeout(t);
    }
  }, [unreadCount, notifOpen]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openGlobalSearch();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openGlobalSearch]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (subjectRef.current && !subjectRef.current.contains(e.target))
        setSubjectOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 border-b border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-surface-glass/80"
      role="banner"
    >
      <div className="flex h-full items-center gap-4 px-4 sm:px-6">
        {isMobile && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="btn-ghost h-10 w-10"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-2 lg:hidden">
          <CompactLogo size="32px" showWordmark={true} />
        </div>

        <button
          type="button"
          onClick={openGlobalSearch}
          className={cn(
            "hidden md:flex flex-1 max-w-xl mx-auto items-center gap-3 rounded-full border border-slate-200/50 bg-white/50 px-4 py-2 text-left text-sm text-slate-500 transition-all hover:border-electric-300 hover:bg-white hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] dark:border-white/10 dark:bg-black/20 dark:text-slate-400 dark:hover:border-electric-500/50 dark:hover:bg-white/5",
          )}
          aria-label="Open search (⌘K)"
        >
          <Search
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          <span className="flex-1 truncate">
            Search documents, chats, notes...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-full border border-slate-300/50 bg-slate-100/50 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
            <span className="text-[9px]">⌘</span>K
          </kbd>
        </button>

        {isMobile && (
          <button
            type="button"
            onClick={openGlobalSearch}
            className="btn-ghost h-10 w-10"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        <div className="hidden lg:flex items-center" ref={subjectRef}>
          <button
            type="button"
            onClick={() => setSubjectOpen((o) => !o)}
            className="btn-outline h-10 gap-2"
            aria-haspopup="listbox"
            aria-expanded={subjectOpen}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm">{currentSubject ?? "All Subjects"}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                subjectOpen && "rotate-180",
              )}
            />
          </button>
          <AnimatePresence>
            {subjectOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-16 right-auto left-1/2 z-50 w-56 rounded-xl bg-white shadow-dropdown dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2"
              >
                <ul role="listbox" className="max-h-72 overflow-y-auto">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentSubject(null);
                        setSubjectOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        currentSubject === null
                          ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                      )}
                    >
                      All Subjects
                    </button>
                  </li>
                  {SUBJECTS.map((subject) => (
                    <li key={subject}>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentSubject(subject);
                          setSubjectOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          currentSubject === subject
                            ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"
                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                        )}
                      >
                        {subject}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          
          {/* Flame Streak Counter */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-flame-500/10 border border-flame-500/20 text-flame-600 dark:text-flame-400 font-semibold text-sm mr-2 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]">
            <Flame className="w-4 h-4 animate-flame-flicker" />
            <span>7 Day Streak</span>
          </div>
            <span
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                internetStatus.isOnline
                  ? "border-accent-200 bg-accent-50 text-accent-700 dark:border-accent-900 dark:bg-accent-950/40 dark:text-accent-400"
                  : "border-danger-200 bg-danger-50 text-danger-700 dark:border-danger-900 dark:bg-danger-950/40 dark:text-danger-400",
              )}
              title={internetStatus.isOnline ? "Online" : "Offline"}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                    internetStatus.isOnline ? "bg-accent-500" : "bg-danger-500",
                  )}
                  aria-hidden="true"
                />

                <span
                  className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    internetStatus.isOnline ? "bg-accent-600" : "bg-danger-600",
                  )}
                  aria-hidden="true"
                />
              </span>
              {internetStatus.isOnline ? (
                <Wifi className="h-3 w-3" aria-hidden="true" />
              ) : (
                <WifiOff className="h-3 w-3" aria-hidden="true" />
              )}
              <span className="hidden xl:inline">
                {internetStatus.isOnline ? "Online" : "Offline"}
              </span>
            </span>

            <span
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-secondary-200 bg-secondary-50 px-2.5 py-1 text-xs font-medium text-secondary-700 dark:border-secondary-900 dark:bg-secondary-950/40 dark:text-secondary-400"
              title={`AI Ready (${aiStatus.activeModels} models active)`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-secondary-500 opacity-75 animate-ping"
                  aria-hidden="true"
                />

                <span
                  className="relative inline-flex h-2 w-2 rounded-full bg-secondary-600"
                  aria-hidden="true"
                />
              </span>
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span className="hidden xl:inline">AI Ready</span>
            </span>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-ghost h-10 w-10 text-slate-500 hover:text-electric-500 dark:text-slate-400 dark:hover:text-electric-400 transition-colors"
            aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5 opacity-50" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost h-10 w-10"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <div className="relative" ref={notifTriggerRef}>
            <NotificationBell
              onClick={() => setNotifOpen((o) => !o)}
              unreadCount={unreadCount}
              hasNewUnread={hasNewUnread}
            />

            <NotificationCenter
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              triggerRef={notifTriggerRef}
            />
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 p-1 pr-2 transition-colors"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label="Open profile menu"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-semibold text-white">
                  {user ? getInitials(user.name) : "U"}
                </div>
              )}
              <ChevronDown
                className={cn(
                  "hidden sm:block h-4 w-4 text-slate-500 transition-transform",
                  profileOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-slate-200 bg-white shadow-dropdown dark:border-slate-800 dark:bg-slate-900 p-2"
                  role="menu"
                >
                  {user && (
                    <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  )}
                  <ul className="space-y-0.5">
                    <li>
                      <Link
                        to={ROUTES.profile}
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        role="menuitem"
                      >
                        <UserCircle className="h-4 w-4" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ROUTES.settings}
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        role="menuitem"
                      >
                        <SettingsIcon className="h-4 w-4" />
                        Settings
                      </Link>
                    </li>
                  </ul>
                  <div className="mt-1 border-t border-slate-200 dark:border-slate-800 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-950/30"
                      onClick={handleLogout}
                      leftIcon={<LogOut className="h-4 w-4" />}
                    >
                      Logout
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
