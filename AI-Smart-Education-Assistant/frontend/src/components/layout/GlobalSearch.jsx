import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  FileText,
  MessageSquare,
  Layers,
  ClipboardList,
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Brain,
  Globe,
  History,
  Newspaper,
  LineChart,
  Theater,
  Sparkles,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { STORAGE_KEYS, ROUTES, SUBJECT_ICONS, SUBJECTS } from "@/constants";
import { cn, debounce, truncateText } from "@/utils/format";

const ICON_MAP = {
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Brain,
  Globe,
  History,
  Newspaper,
  LineChart,
  Theater,
};

const SEARCH_TABS = [
  { key: "all", label: "All" },
  { key: "document", label: "Documents" },
  { key: "subject", label: "Subjects" },
  { key: "chat", label: "Chat History" },
  { key: "flashcard", label: "Flashcards" },
  { key: "quiz", label: "Quiz" },
];

const POPULAR_SUGGESTIONS = [
  "Quantum Physics notes",
  "Calculus derivatives",
  "Organic Chemistry summary",
  "World War II timeline",
  "Data Structures quiz",
  "Macroeconomics flashcards",
];

const MOCK_DOCUMENTS = [
  {
    type: "document",
    id: "doc-1",
    title: "Quantum Mechanics - Chapter 4 Notes",
    excerpt:
      "Wave functions and Schrödinger equation fundamentals with examples...",
    subject: "Physics",
    meta: "3 days ago",
    badge: "PDF",
  },
  {
    type: "document",
    id: "doc-2",
    title: "Calculus II Integration Techniques",
    excerpt:
      "Integration by parts, trig substitutions, and partial fractions explained...",
    subject: "Mathematics",
    meta: "1 week ago",
    badge: "PDF",
  },
  {
    type: "document",
    id: "doc-3",
    title: "Organic Chemistry Reactions Summary",
    excerpt: "SN1, SN2, E1, E2 reaction mechanisms and stereochemistry...",
    subject: "Chemistry",
    meta: "2 weeks ago",
    badge: "DOC",
  },
];

const MOCK_SUBJECTS = SUBJECTS.slice(0, 6).map((name, i) => ({
  type: "subject",
  id: `subj-${i}`,
  title: name,
  badge: `${Math.floor(Math.random() * 20) + 3} docs`,
  meta: SUBJECT_ICONS[i % SUBJECT_ICONS.length],
}));

const MOCK_CHATS = [
  {
    type: "chat",
    id: "chat-1",
    title: "Help with thermodynamics",
    excerpt: "Can you explain the second law and entropy in simple terms?",
    meta: "2 hours ago",
  },
  {
    type: "chat",
    id: "chat-2",
    title: "Algebra linear equations practice",
    excerpt: "Show me step by step how to solve systems of equations...",
    meta: "Yesterday",
  },
];

const MOCK_FLASHCARDS = [
  {
    type: "flashcard",
    id: "fc-1",
    title: "Photosynthesis Process",
    excerpt: "What is the primary function of chlorophyll?",
    subject: "Biology",
    meta: "24 cards",
  },
  {
    type: "flashcard",
    id: "fc-2",
    title: "Programming Data Structures",
    excerpt: "Difference between stack and queue?",
    subject: "Computer Science",
    meta: "42 cards",
  },
];

const MOCK_QUIZZES = [
  {
    type: "quiz",
    id: "quiz-1",
    title: "Physics Midterm Practice",
    excerpt: "Covers kinematics, forces, energy",
    badge: "92%",
    meta: "10 questions · 3 days ago",
  },
  {
    type: "quiz",
    id: "quiz-2",
    title: "History - Renaissance Era",
    excerpt: "Art, science, and humanism topics",
    badge: "78%",
    meta: "15 questions · 1 week ago",
  },
];

const getTypeIcon = (type, metaIcon) => {
  switch (type) {
    case "document":
      return FileText;
    case "subject":
      return ICON_MAP[metaIcon || "BookOpen"] || BookOpen;
    case "chat":
      return MessageSquare;
    case "flashcard":
      return Layers;
    case "quiz":
      return ClipboardList;
  }
};

const getTypeIconBg = (type) => {
  switch (type) {
    case "document":
      return "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400";
    case "subject":
      return "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400";
    case "chat":
      return "bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400";
    case "flashcard":
      return "bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400";
    case "quiz":
      return "bg-warning-50 text-warning-600 dark:bg-warning-950/40 dark:text-warning-400";
  }
};

const highlightText = (text, query) => {
  if (!query.trim()) return text;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-200 rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
};

export const GlobalSearch = () => {
  const { globalSearchOpen, closeGlobalSearch } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [recentSearches, setRecentSearches] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const flatResultsRef = useRef([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [globalSearchOpen]);

  useEffect(() => {
    if (globalSearchOpen) {
      setQuery("");
      setDebouncedQuery("");
      setActiveTab("all");
      setHighlightedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [globalSearchOpen]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const debouncedSet = useMemo(
    () =>
      debounce((v) => {
        setDebouncedQuery(v);
        setHighlightedIndex(-1);
      }, 200),
    [],
  );

  const handleQueryChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    debouncedSet(v);
  };

  const saveRecentSearch = useCallback((term) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (s) => s.toLowerCase() !== term.toLowerCase(),
      );
      const next = [term, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(
          STORAGE_KEYS.RECENT_SEARCHES,
          JSON.stringify(next),
        );
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const removeRecentSearch = (term) => {
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s !== term);
      try {
        localStorage.setItem(
          STORAGE_KEYS.RECENT_SEARCHES,
          JSON.stringify(next),
        );
      } catch {
        // ignore
      }
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch {
      // ignore
    }
  };

  const filteredResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const allItems = [
      ...MOCK_DOCUMENTS,
      ...MOCK_SUBJECTS,
      ...MOCK_CHATS,
      ...MOCK_FLASHCARDS,
      ...MOCK_QUIZZES,
    ];

    const items =
      activeTab === "all"
        ? allItems
        : allItems.filter((i) => i.type === activeTab);

    if (!q) return { all: [], hasQuery: false };

    const filtered = items.filter((item) => {
      const hay =
        `${item.title} ${item.excerpt || ""} ${item.subject || ""}`.toLowerCase();
      return hay.includes(q);
    });

    const grouped = {};
    for (const item of filtered) {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item);
    }

    return { grouped, hasQuery: true, total: filtered.length };
  }, [debouncedQuery, activeTab]);

  const flatResults = useMemo(() => {
    if (!filteredResults.hasQuery) return [];
    const g = filteredResults.grouped || {};
    const order = ["document", "subject", "chat", "flashcard", "quiz"];
    const out = [];
    for (const t of order) {
      if (g[t]) out.push(...g[t]);
    }
    flatResultsRef.current = out;
    return out;
  }, [filteredResults]);

  const navigateToResult = useCallback(
    (item) => {
      saveRecentSearch(debouncedQuery);
      closeGlobalSearch();
      switch (item.type) {
        case "document":
          navigate(ROUTES.upload);
          break;
        case "subject":
          navigate(ROUTES.dashboard);
          break;
        case "chat":
          navigate(`${ROUTES.chat}/${item.id}`);
          break;
        case "flashcard":
          navigate(ROUTES.flashcards);
          break;
        case "quiz":
          navigate(ROUTES.quiz);
          break;
      }
    },
    [debouncedQuery, saveRecentSearch, closeGlobalSearch, navigate],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeGlobalSearch();
      return;
    }
    const len = flatResults.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, len - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (
      e.key === "Enter" &&
      highlightedIndex >= 0 &&
      flatResults[highlightedIndex]
    ) {
      e.preventDefault();
      navigateToResult(flatResults[highlightedIndex]);
    }
  };

  const handleSuggestionClick = (term) => {
    setQuery(term);
    setDebouncedQuery(term);
    inputRef.current?.focus();
  };

  const groupTitles = {
    document: "Documents",
    subject: "Subjects",
    chat: "Chat History",
    flashcard: "Flashcards",
    quiz: "Quizzes",
  };

  return (
    <AnimatePresence>
      {globalSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGlobalSearch}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-[96%] max-w-[720px] rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-5">
              <Search
                className="h-5 w-5 shrink-0 text-slate-400"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                placeholder="Search documents, subjects, chats, flashcards, quizzes..."
                className="flex-1 bg-transparent text-base text-slate-900 placeholder-slate-400 outline-none dark:text-slate-100"
                aria-label="Search input"
                autoComplete="off"
              />

              <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Esc
              </span>
              <button
                type="button"
                onClick={closeGlobalSearch}
                className="btn-ghost h-9 w-9 shrink-0"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 px-3 py-2 sm:px-4">
              {SEARCH_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    setHighlightedIndex(-1);
                  }}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    activeTab === tab.key
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="max-h-[55vh] overflow-y-auto">
              {!filteredResults.hasQuery ? (
                <div className="p-4 sm:p-5 space-y-5">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          Recent searches
                        </h4>
                        <button
                          type="button"
                          onClick={clearRecentSearches}
                          className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <div
                            key={term}
                            className="group inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 pl-3 pr-1.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            <button
                              type="button"
                              onClick={() => handleSuggestionClick(term)}
                              className="hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {term}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRecentSearch(term);
                              }}
                              className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                              aria-label={`Remove ${term}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Popular
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SUGGESTIONS.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSuggestionClick(term)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary-700 dark:hover:bg-primary-950/40 dark:hover:text-primary-400 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (filteredResults.total || 0) === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <Search className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    No results found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    We couldn't find anything matching{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      &ldquo;{debouncedQuery}&rdquo;
                    </span>
                    . Try different keywords.
                  </p>
                </div>
              ) : (
                <div className="p-2 sm:p-3 space-y-4">
                  {["document", "subject", "chat", "flashcard", "quiz"].map(
                    (type) => {
                      const group = filteredResults.grouped?.[type];
                      if (!group || group.length === 0) return null;
                      return (
                        <div key={type}>
                          <h4 className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {groupTitles[type]}
                          </h4>
                          <ul className="space-y-1">
                            {group.map((item) => {
                              const flatIdx = flatResultsRef.current.findIndex(
                                (r) => r.id === item.id && r.type === item.type,
                              );
                              const isHighlighted =
                                flatIdx === highlightedIndex;
                              const Icon = getTypeIcon(item.type, item.meta);
                              return (
                                <li key={`${item.type}-${item.id}`}>
                                  <button
                                    type="button"
                                    onClick={() => navigateToResult(item)}
                                    onMouseEnter={() =>
                                      setHighlightedIndex(flatIdx)
                                    }
                                    className={cn(
                                      "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors",
                                      isHighlighted
                                        ? "bg-primary-50 ring-1 ring-primary-200 dark:bg-primary-950/40 dark:ring-primary-800"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60",
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                        getTypeIconBg(item.type),
                                      )}
                                    >
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                          {highlightText(
                                            item.title,
                                            debouncedQuery,
                                          )}
                                        </p>
                                        {item.badge && (
                                          <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                            {item.badge}
                                          </span>
                                        )}
                                        {item.subject && (
                                          <span className="shrink-0 rounded-md bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
                                            {item.subject}
                                          </span>
                                        )}
                                      </div>
                                      {item.excerpt && (
                                        <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                                          {highlightText(
                                            truncateText(item.excerpt, 90),
                                            debouncedQuery,
                                          )}
                                        </p>
                                      )}
                                      {item.meta && item.type !== "subject" && (
                                        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                                          <Clock className="h-3 w-3" />
                                          {item.meta}
                                        </p>
                                      )}
                                    </div>
                                    <ChevronRight
                                      className={cn(
                                        "h-4 w-4 shrink-0 self-center transition-colors",
                                        isHighlighted
                                          ? "text-primary-500"
                                          : "text-slate-300 dark:text-slate-600",
                                      )}
                                    />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 sm:px-5 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-1.5 py-0.5 font-mono text-[10px]">
                    ↑↓
                  </kbd>
                  Navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-1.5 py-0.5 font-mono text-[10px]">
                    ↵
                  </kbd>
                  Open
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-1.5 py-0.5 font-mono text-[10px]">
                    Esc
                  </kbd>
                  Close
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <Search className="h-3 w-3" />
                <span>
                  Press{" "}
                  <kbd className="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-1 font-mono">
                    ⌘K
                  </kbd>{" "}
                  anytime
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
