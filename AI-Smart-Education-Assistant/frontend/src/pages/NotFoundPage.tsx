import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[80vh] flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full card p-8 text-center">
        <p className="text-7xl sm:text-8xl font-black bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          We couldn't find the page you're looking for:
        </p>
        <code className="mt-4 inline-block rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 max-w-full truncate">
          {location.pathname}
        </code>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="h-4 w-4" />}>
              Go Home
            </Button>
          </Link>
          <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
