import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, LogIn, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { APP_NAME } from "@/constants";

export const SessionExpiredPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-40"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-warning-300/30 dark:bg-warning-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary-300/30 dark:bg-primary-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-8 flex items-center gap-3 justify-center"
        >
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label={`${APP_NAME} home`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {APP_NAME}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart Education Assistant
              </p>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <Card className="p-0 overflow-hidden">
            <div className="relative bg-gradient-to-br from-warning-500 via-amber-500 to-orange-500 px-8 pt-10 pb-10 text-white text-center">
              <div className="absolute inset-0 opacity-20" aria-hidden="true">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
              </div>
              <motion.div
                initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.15,
                  type: "spring",
                  stiffness: 150,
                }}
                className="relative flex items-center justify-center mx-auto mb-5"
              >
                <div
                  className="absolute h-20 w-20 rounded-full bg-white/20 animate-ping"
                  aria-hidden="true"
                />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm border border-white/30 shadow-xl">
                  <Clock className="h-8 w-8" aria-hidden="true" />
                </div>
              </motion.div>

              <div className="relative flex items-center justify-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
                  Security notice
                </span>
              </div>
              <h1 className="relative text-2xl sm:text-3xl font-bold mb-2">
                Your session has expired
              </h1>
            </div>

            <div className="px-6 sm:px-8 py-6 sm:py-8 text-center">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.25 }}
                className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8"
              >
                For your safety, we automatically sign you out after a period of
                inactivity or when your credentials need to be refreshed. Any
                unsaved changes may have been lost. Please sign in again to
                continue where you left off.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.3 }}
                className="space-y-3"
              >
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate("/login")}
                  leftIcon={<LogIn className="h-4 w-4" aria-hidden="true" />}
                >
                  Log in again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => navigate("/")}
                  leftIcon={<Home className="h-4 w-4" aria-hidden="true" />}
                >
                  Continue as guest
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.4 }}
                className="mt-6 text-xs text-slate-500 dark:text-slate-400"
              >
                If you keep seeing this message, please clear your browser
                cookies and try again.
              </motion.p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SessionExpiredPage;
