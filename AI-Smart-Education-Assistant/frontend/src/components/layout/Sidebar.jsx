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
  Network,
  GraduationCap,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks";
import { cn } from "@/utils/format";
import { CompactLogo } from "@/components/ui/CompactLogo";
const navItems = [
  { route: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { route: "upload", label: "Upload Center", icon: UploadCloud },
  { route: "chat", label: "AI Chat", icon: MessageSquare },
  { route: "notes", label: "Notes Generator", icon: Sparkles },
  { route: "mindmap", label: "Mind Map", icon: Network },
  { route: "ai-teacher", label: "AI Teacher", icon: GraduationCap },
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
        "flex h-full flex-col border-r border-white/20 bg-white/60 dark:border-white/10 dark:bg-surface-glass backdrop-blur-2xl transition-all duration-300 shadow-xl",
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
          <CompactLogo size="44px" />
          {!collapsed && (
            <div className="min-w-0">
              <p 
                className="truncate text-[22px] font-bold tracking-wide bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #8B5CF6 0%, #22D3EE 25%, #EC4899 50%, #FBBF24 75%, #8B5CF6 100%)",
                  backgroundSize: "200% auto",
                  animation: "shimmer-text-v2 4s linear infinite"
                }}
              >
                LearnFlow<span className="text-electric-500 bg-none" style={{ WebkitTextFillColor: '#8B5CF6' }}>.ai</span>
              </p>
              <p className="truncate text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Premium Edition
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
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative overflow-hidden",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-electric-500/10 text-electric-600 dark:bg-electric-500/20 dark:text-electric-400 shadow-[inset_4px_0_0_rgba(139,92,246,1)]"
                        : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                          isActive && "text-electric-600 dark:text-electric-400 group-hover:animate-pulse-glow",
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

      <div className="border-t border-slate-200/50 dark:border-white/10 p-4">
        {!collapsed && user ? (
          <div className="mb-4 rounded-xl bg-white/50 dark:bg-surface/50 border border-slate-200/50 dark:border-white/5 p-3 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-electric-500 to-cyber-500 text-sm font-bold text-white shadow-md">
                  {(user.name || user.full_name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-surface" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {user.name || user.full_name || "User"}
                </p>
                <p className="truncate text-[10px] text-electric-500 font-semibold uppercase tracking-wider">
                  Level 12 Scholar
                </p>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
                <span>2,450 XP</span>
                <span>3,000 XP</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "81%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-electric-500 to-cyber-400 rounded-full"
                />
              </div>
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
