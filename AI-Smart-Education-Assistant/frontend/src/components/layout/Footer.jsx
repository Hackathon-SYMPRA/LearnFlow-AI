import React from "react";
import { Heart } from "lucide-react";
import { APP_NAME } from "@/constants";
import { cn } from "@/utils/format";

export const Footer = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Built with AI to make learning smarter and more accessible.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <nav aria-label="Footer navigation">
              <ul className="flex items-center gap-4">
                <li>
                  <a
                    href="#privacy"
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#help"
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  >
                    Help
                  </a>
                </li>
              </ul>
            </nav>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              Made with{" "}
              <Heart
                className="h-3 w-3 text-danger-500 fill-danger-500"
                aria-hidden="true"
              />{" "}
              for learners
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
