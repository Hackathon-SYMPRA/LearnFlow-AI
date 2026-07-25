import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { NoChatHistory } from "@/components/ui/EmptyState";
import {
  Search,
  Trash2,
  ChevronRight,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/Button";
import { cn, formatRelativeTime, truncateText } from "@/utils/format";

const mockSessions = [
  {
    id: "1",
    title: "Integration techniques explained",
    preview: "The substitution method is useful when...",
    subject: "Mathematics",
    messagesCount: 18,
    time: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "2",
    title: "Understanding SN1 vs SN2 reactions",
    preview: "SN1 reactions follow a two-step mechanism...",
    subject: "Chemistry",
    messagesCount: 24,
    time: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "3",
    title: "Newton laws of motion review",
    preview: "For every action there is an equal and...",
    subject: "Physics",
    messagesCount: 12,
    time: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    title: "Calculus limits and continuity",
    preview: "A limit is the value that a function approaches...",
    subject: "Mathematics",
    messagesCount: 30,
    time: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "5",
    title: "Photosynthesis process",
    preview: "Photosynthesis converts light energy into chemical...",
    subject: "Biology",
    messagesCount: 8,
    time: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = mockSessions.filter((s) => {
    if (
      search &&
      !s.title.toLowerCase().includes(search.toLowerCase()) &&
      !s.preview.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Chat History
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Browse and resume your past conversations with the AI tutor
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Past Conversations</CardTitle>
              <CardDescription>
                {filtered.length} session{filtered.length !== 1 && "s"} saved
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-base pl-9"
                  aria-label="Search chat history"
                />
              </div>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
                {["all", "week", "month"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                      filter === f
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                    )}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <NoChatHistory onStartChat={() => navigate(ROUTES.chat)} />
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.map((session) => (
                <li key={session.id}>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.chat)}
                    className="w-full flex items-center gap-4 py-4 text-left first:pt-0 last:pb-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {session.title}
                        </p>
                        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="h-3 w-3" />
                          {formatRelativeTime(session.time)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-slate-600 dark:text-slate-400">
                        {truncateText(session.preview, 120)}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="chip bg-secondary-50 text-secondary-700 dark:bg-secondary-950/40 dark:text-secondary-400">
                          {session.subject}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {session.messagesCount} messages
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${session.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-danger-500" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
