import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UploadCloud,
  MessageSquare,
  BrainCircuit,
  Layers,
  CalendarCheck,
  History as HistoryIcon,
  BarChart3,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks";
import { cn } from "@/utils/format";

const navItems = [
  { route: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { route: "upload", label: "Upload Center", icon: UploadCloud },
  { route: "chat", label: "AI Chat", icon: MessageSquare },
  { route: "notes", label: "Notes Generator", icon: Sparkles },
  { route: "quiz", label: "Quiz Generator", icon: BrainCircuit },
  { route: "flashcards", label: "Flashcards", icon: Layers },
  { route: "planner", label: "Study Planner", icon: CalendarCheck },
  { route: "history", label: "Chat History", icon: HistoryIcon },
  { route: "analytics", label: "Analytics", icon: BarChart3 },
  { route: "profile", label: "Profile", icon: UserCircle },
  { route: "settings", label: "Settings", icon: SettingsIcon },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const { logout, user } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const collapsed = !isMobile && sidebarCollapsed;

  const sidebarContent = (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-300",
        collapsed ? "w-20" : "w-72",
      )}
      aria-label="Sidebar navigation"
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center w-full",
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-slate-900 dark:text-slate-100">
                EduMind AI
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                Smart Learning
              </p>
            </div>
          )}
        </div>
        {!isMobile && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="btn-ghost h-8 w-8 rounded-lg p-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-4"
        aria-label="Main navigation"
      >
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.route}>
                <NavLink
                  to={ROUTES[item.route]}
                  end={item.route === "dashboard"}
                  onClick={isMobile ? onClose : undefined}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                          isActive && "text-primary-600 dark:text-primary-400",
                        )}
                        aria-hidden="true"
                      />

                      {!collapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}
                      {isActive && !collapsed && (
                        <span
                          className="ml-auto h-2 w-2 rounded-full bg-primary-500"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        {!collapsed && user ? (
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-sm font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger-600 transition-all duration-200 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-950/30",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 left-0 z-50 w-72"
        >
          {sidebarContent}
        </motion.div>
      </>
    );
  }

  return <div className="h-screen shrink-0">{sidebarContent}</div>;
};
