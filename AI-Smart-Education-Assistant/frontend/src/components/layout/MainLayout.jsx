import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { cn } from "@/utils/format";

export const MainLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-500 text-white text-xs font-semibold px-4 py-1.5 text-center flex items-center justify-center gap-2 shadow-sm">
          You are currently offline. Some features may be limited.
        </div>
      )}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1" id="main-content" role="main" tabIndex={-1}>
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn("animate-fade-in")}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
