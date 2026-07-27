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
import { PageLoader } from "@/components/ui/Spinner";
import {
  Search,
  Trash2,
  ChevronRight,
  MessageSquare,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/Button";
import { cn, formatRelativeTime, truncateText } from "@/utils/format";

import { chatService } from "@/services";
import { toast } from "sonner";

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await chatService.listSessions();
      setSessions(res.data || []);
    } catch (error) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await chatService.deleteSession(id);
      setSessions(sessions.filter(s => s.id !== id && s._id !== id));
      toast.success("Chat deleted");
    } catch (err) {
      toast.error("Failed to delete chat");
    }
  };

  const getPreview = (session) => {
    if (session.messages && session.messages.length > 0) {
      const lastMsg = session.messages[session.messages.length - 1];
      return lastMsg.content || "";
    }
    return "No messages yet";
  };

  const filtered = sessions.filter((s) => {
    if (filter === "general" && s.chat_type === "Teacher") return false;
    if (filter === "teacher" && s.chat_type !== "Teacher") return false;

    if (search) {
      const query = search.toLowerCase();
      const preview = getPreview(s).toLowerCase();
      const title = (s.title || "").toLowerCase();
      if (!title.includes(query) && !preview.includes(query)) {
        return false;
      }
    }
    return true;
  });

  if (loading) return <PageLoader />;

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
                {[
                  { id: "all", label: "All" },
                  { id: "general", label: "AI Chat" },
                  { id: "teacher", label: "AI Teacher" }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                      filter === f.id
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                    )}
                  >
                    {f.label}
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
                <li key={session.id || session._id}>
                  <button
                    type="button"
                    onClick={() => {
                      const id = session.id || session._id;
                      if (session.chat_type === "Teacher") {
                        navigate(`/ai-teacher/${id}`);
                      } else {
                        navigate(`/chat/${id}`);
                      }
                    }}
                    className="w-full flex items-center gap-4 py-4 text-left first:pt-0 last:pb-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors"
                  >
                    <div className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl dark:bg-opacity-40",
                      session.chat_type === "Teacher" 
                        ? "bg-secondary-50 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-400"
                        : "bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
                    )}>
                      {session.chat_type === "Teacher" ? <GraduationCap className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {session.title}
                        </p>
                        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="h-3 w-3" />
                          {formatRelativeTime(session.updated_at || session.created_at)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-slate-600 dark:text-slate-400">
                        {truncateText(getPreview(session), 120)}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="chip bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                          {session.chat_type === "Teacher" ? "AI Teacher" : "General"}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {session.messages ? session.messages.length : 0} messages
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${session.title}`}
                        onClick={(e) => handleDelete(e, session.id || session._id)}
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
