import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { cn } from '@/utils/format';

export const MainLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />

        <main
          className="flex-1"
          id="main-content"
          role="main"
          tabIndex={-1}
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={cn('animate-fade-in')}
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
