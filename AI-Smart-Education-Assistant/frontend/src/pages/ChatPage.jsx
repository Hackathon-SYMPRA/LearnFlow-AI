import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Pin,
  PinOff,
  Pencil,
  Download,
  Trash2,
  MoreVertical,
  PanelLeft,
  PanelRight,
  X,
  Users,
  BrainCircuit,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Sparkles,
  ShieldCheck,
  Info,
  AlertTriangle,
  AlertCircle,
  Check,
  Menu,
  Send,
  CheckCircle2,
  FileText,
  Eye,
  Clock,
  Square,
  Volume2,
} from "lucide-react";
import { chatService } from "@/services";
import { ROUTES, SUGGESTED_PROMPTS, SUBJECT_COLORS } from "@/constants";
import { useIsMobile, useDebounce, useCopyToClipboard } from "@/hooks";
import {
  cn,
  formatRelativeTime,
  formatDateTime,
  generateId,
  formatFileSize,
} from "@/utils/format";
import { CitationPanel } from "@/components/chat/CitationPanel";
import { ChatInput } from "@/components/chat/ChatInput";
import {
  ThinkingDots,
  ProcessingStepper,
} from "@/components/chat/ThinkingIndicator";

const groupDateKey = (d) => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);
  const startOf7Days = new Date(startOfToday);
  startOf7Days.setDate(startOfToday.getDate() - 7);

  const t = d.getTime();
  if (t >= startOfToday.getTime()) return "Today";
  if (t >= startOfYesterday.getTime()) return "Yesterday";
  if (t >= startOf7Days.getTime()) return "Previous 7 Days";
  return "Older";
};

// Removed MOCK_SESSIONS and mock data

const subjectColorFor = (subject) => {
  if (!subject) return SUBJECT_COLORS[0];
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = (hash * 31 + subject.charCodeAt(i)) >>> 0;
  }
  return SUBJECT_COLORS[hash % SUBJECT_COLORS.length];
};

const escapeHtml = (s) => {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

const inlineMathRe = /\$\$([^$\n]+?)\$\$/g;
const boldRe = /\*\*([^*]+?)\*\*/g;
const italicRe = /(^|[^*])\*([^*\n]+?)\*(?!\*)/g;
const inlineCodeRe = /`([^`]+)`/g;

const renderInline = (raw) => {
  let html = escapeHtml(raw);
  html = html.replace(inlineMathRe, (_m, math) => {
    return `<span class="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 font-mono text-xs text-slate-800 dark:text-slate-200 mx-0.5">${math}</span>`;
  });
  html = html.replace(
    inlineCodeRe,
    (_m, code) =>
      `<code class="rounded bg-slate-100 dark:bg-slate-800 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 text-[0.85em] font-mono">${code}</code>`,
  );
  html = html.replace(
    boldRe,
    (_m, text) =>
      `<strong class="font-semibold text-slate-900 dark:text-slate-100">${text}</strong>`,
  );
  html = html.replace(
    italicRe,
    (_m, pre, text) => `${pre}<em class="italic">${text}</em>`,
  );
  return html;
};

const renderMarkdown = (raw) => {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;

  const pushPara = (buf) => {
    if (buf.length === 0) return;
    const joined = buf.join(" ").trim();
    if (joined) {
      out.push(
        `<p class="mb-3 leading-relaxed text-slate-800 dark:text-slate-200">${renderInline(joined)}</p>`,
      );
    }
    buf.length = 0;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*```/.test(line)) {
      pushPara([]);
      const langMatch = line.match(/```\s*([\w+\-.#]*)/);
      const lang = langMatch?.[1] ?? "";
      const codeLines = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      const codeHtml = escapeHtml(codeLines.join("\n"));
      out.push(
        `<div class="my-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950">
          ${lang ? `<div class="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-[11px] font-medium uppercase tracking-wider text-slate-400"><span>${escapeHtml(lang)}</span></div>` : ""}
          <pre class="px-4 py-3 overflow-x-auto text-[12.5px] leading-relaxed"><code class="font-mono text-slate-100">${codeHtml}</code></pre>
        </div>`,
      );
      continue;
    }

    const blockMathMatch = line.match(/^\s*\$\$\s*$/);
    if (blockMathMatch) {
      pushPara([]);
      const mathLines = [];
      i++;
      while (i < lines.length && !/^\s*\$\$\s*$/.test(lines[i])) {
        mathLines.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        `<div class="my-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 px-4 py-3 font-mono text-sm text-indigo-900 dark:text-indigo-100 overflow-x-auto">${escapeHtml(mathLines.join("\n"))}</div>`,
      );
      continue;
    }

    if (/^\s*###\s+/.test(line)) {
      pushPara([]);
      out.push(
        `<h3 class="mt-5 mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">${renderInline(line.replace(/^\s*###\s+/, ""))}</h3>`,
      );
      i++;
      continue;
    }
    if (/^\s*##\s+/.test(line)) {
      pushPara([]);
      out.push(
        `<h2 class="mt-6 mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">${renderInline(line.replace(/^\s*##\s+/, ""))}</h2>`,
      );
      i++;
      continue;
    }
    if (/^\s*#\s+/.test(line)) {
      pushPara([]);
      out.push(
        `<h1 class="mt-6 mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">${renderInline(line.replace(/^\s*#\s+/, ""))}</h1>`,
      );
      i++;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      pushPara([]);
      const quoteLines = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      out.push(
        `<blockquote class="my-4 border-l-4 border-primary-400 dark:border-primary-600 bg-primary-50/60 dark:bg-primary-950/30 px-4 py-2.5 rounded-r-lg text-sm italic text-slate-700 dark:text-slate-300">${renderInline(quoteLines.join(" "))}</blockquote>`,
      );
      continue;
    }

    if (/^\s*\|\s*.+\|\s*$/.test(line)) {
      pushPara([]);
      const tableLines = [line];
      i++;
      while (i < lines.length && /^\s*\|\s*.+\|\s*$/.test(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.map((l) =>
        l
          .replace(/^\s*\|\s*/, "")
          .replace(/\s*\|\s*$/, "")
          .split(/\s*\|\s*/),
      );
      let headerIdx = -1;
      if (
        rows.length >= 2 &&
        rows[1].every((c) => /^:?-{2,}:?$/.test(c.trim()))
      ) {
        headerIdx = 0;
      }
      let html =
        '<div class="my-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700"><table class="w-full text-sm">';
      rows.forEach((r, idx) => {
        if (idx === 1 && headerIdx === 0) return;
        const tag = idx === headerIdx ? "th" : "td";
        const rowBg =
          idx === headerIdx
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            : idx % 2 === 0
              ? "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300";
        html += `<tr>${r
          .map(
            (c) =>
              `<${tag} class="${rowBg} border-b border-slate-200 dark:border-slate-700 px-3 py-2 align-top">${renderInline(c)}</${tag}>`,
          )
          .join("")}</tr>`;
      });
      html += "</table></div>";
      out.push(html);
      continue;
    }

    const ulMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ulMatch) {
      pushPara([]);
      const items = [ulMatch[1]];
      i++;
      while (i < lines.length && /^\s*[-*+]\s+(.*)$/.test(lines[i])) {
        const m = lines[i].match(/^\s*[-*+]\s+(.*)$/);
        if (m) items.push(m[1]);
        i++;
      }
      out.push(
        `<ul class="my-3 space-y-1.5 pl-6 list-disc marker:text-primary-500 text-slate-800 dark:text-slate-200">${items
          .map((it) => `<li class="leading-relaxed">${renderInline(it)}</li>`)
          .join("")}</ul>`,
      );
      continue;
    }

    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (olMatch) {
      pushPara([]);
      const items = [olMatch[1]];
      i++;
      while (i < lines.length && /^\s*\d+\.\s+(.*)$/.test(lines[i])) {
        const m = lines[i].match(/^\s*\d+\.\s+(.*)$/);
        if (m) items.push(m[1]);
        i++;
      }
      out.push(
        `<ol class="my-3 space-y-1.5 pl-6 list-decimal marker:font-semibold marker:text-primary-600 dark:marker:text-primary-400 text-slate-800 dark:text-slate-200">${items
          .map((it) => `<li class="leading-relaxed">${renderInline(it)}</li>`)
          .join("")}</ol>`,
      );
      continue;
    }

    if (line.trim() === "") {
      pushPara([]);
      i++;
      continue;
    }

    const paraBuf = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^\s*```/.test(lines[i]) &&
      !/^\s*#/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*\|\s*.+\|\s*$/.test(lines[i]) &&
      !/^\s*\$\$\s*$/.test(lines[i])
    ) {
      paraBuf.push(lines[i]);
      i++;
    }
    pushPara(paraBuf);
  }

  return out.join("\n");
};

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const downloadJSON = (filename, data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const ChatPage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const isMobile = useIsMobile();
  const { copy, copied } = useCopyToClipboard();

  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    chatService.listSessions().then(res => {
      // The API returns a list of sessions, often in the data property
      const fetchedSessions = res.data || [];
      // Normalize _id to id so it works with the rest of the component
      const normalized = fetchedSessions.map(s => {
        const msgs = s.messages || [];
        const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1].content : "";
        return {
          ...s,
          id: s._id || s.id,
          updatedAt: s.updated_at || s.updatedAt || new Date().toISOString(),
          createdAt: s.created_at || s.createdAt || new Date().toISOString(),
          messages: msgs,
          lastMessage: lastMsg,
          messageCount: msgs.length
        };
      });
      setSessions(normalized);
    }).catch(err => {
      console.error("Failed to load sessions:", err);
      toast.error("Failed to load chat history");
    });
  }, []);
  const [streamingMsgId, setStreamingMsgId] = useState(null);
  const [procStep, setProcStep] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingTitleInline, setEditingTitleInline] = useState(false);
  const [editingTitleInlineValue, setEditingTitleInlineValue] = useState("");

  const [menuOpenSession, setMenuOpenSession] = useState(null);
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [snippetModal, setSnippetModal] = useState(null);

  const [reactions, setReactions] = useState({});
  const [speakingId, setSpeakingId] = useState(null);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isStreaming) return; // Do not overwrite messages while streaming
    if (!sessionId) {
      setCurrentSession(null);
      setMessages([]);
      return;
    }
    const found = sessions.find((s) => s.id === sessionId);
    if (found) {
      setCurrentSession(found);
      setMessages(found.messages ?? []);
    } else {
      setCurrentSession(null);
      setMessages([]);
    }
  }, [sessionId, sessions, isStreaming]);

  useEffect(() => {
    if (!isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [isMobile]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  useEffect(() => {
    const el = messagesEndRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && isStreaming) {
            // already handled by effect above; observer ensures scroll on re-layout
          }
        });
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isStreaming]);

  const filteredSessions = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.lastMessage.toLowerCase().includes(q) ||
        (s.subject ?? "").toLowerCase().includes(q),
    );
  }, [sessions, debouncedSearch]);

  const { pinned, grouped } = useMemo(() => {
    const pinnedArr = filteredSessions.filter((s) => s.pinned);
    const unpinned = filteredSessions.filter((s) => !s.pinned);
    const groups = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      Older: [],
    };
    unpinned.forEach((s) => {
      const g = groupDateKey(new Date(s.updatedAt));
      groups[g].push(s);
    });
    Object.keys(groups).forEach((k) => {
      groups[k].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    });
    pinnedArr.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return { pinned: pinnedArr, grouped: groups };
  }, [filteredSessions]);

  const currentCitations = useMemo(() => {
    const last = [...messages]
      .reverse()
      .find((m) => m.role === "assistant" && m.citations);
    return last?.citations ?? [];
  }, [messages]);

  const createNewSession = useCallback(async () => {
    if (isStreaming) return;
    try {
      const created = await chatService.createSession();
      const sessionData = created.data || created;
      const newSess = {
        ...sessionData,
        id: sessionData.id ?? `sess-${generateId()}`,
        title: sessionData.title ?? "New Chat",
        lastMessage: "",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSessions((prev) => [newSess, ...prev]);
      navigate(`${ROUTES.chat}/${newSess.id}`);
      setMobileDrawerOpen(false);
    } catch {
      const id = `sess-${generateId()}`;
      const newSess = {
        id,
        title: "New Chat",
        lastMessage: "",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinned: false,
        messageCount: 0,
      };
      setSessions((prev) => [newSess, ...prev]);
      navigate(`${ROUTES.chat}/${id}`);
      setMobileDrawerOpen(false);
    }
  }, [isStreaming, navigate]);

  const selectSession = useCallback(
    (id) => {
      navigate(`${ROUTES.chat}/${id}`);
      setMobileDrawerOpen(false);
      setMenuOpenSession(null);
    },
    [navigate],
  );

  const pinToggle = useCallback(
    async (id) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, pinned: !s.pinned, updatedAt: new Date().toISOString() }
            : s,
        ),
      );
      try {
        const target = sessions.find((s) => s.id === id);
        await chatService.pinSession(id, !target?.pinned);
      } catch {
        /* ignore */
      }
    },
    [sessions],
  );

  const startRename = useCallback((id, title) => {
    setEditingSessionId(id);
    setEditingTitle(title);
    setMenuOpenSession(null);
  }, []);

  const commitRename = useCallback(async () => {
    const id = editingSessionId;
    if (!id) return;
    const title = editingTitle.trim() || "Untitled";
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, title, updatedAt: new Date().toISOString() } : s,
      ),
    );
    setCurrentSession((prev) =>
      prev && prev.id === id ? { ...prev, title } : prev,
    );
    setEditingSessionId(null);
    try {
      await chatService.renameSession(id, title);
    } catch {
      /* ignore */
    }
  }, [editingSessionId, editingTitle]);

  const startInlineTitleEdit = useCallback((current) => {
    setEditingTitleInlineValue(current);
    setEditingTitleInline(true);
  }, []);

  const commitInlineTitleEdit = useCallback(async () => {
    if (!currentSession) {
      setEditingTitleInline(false);
      return;
    }
    const title = editingTitleInlineValue.trim() || currentSession.title;
    setCurrentSession((prev) => (prev ? { ...prev, title } : prev));
    setSessions((prev) =>
      prev.map((s) => (s.id === currentSession.id ? { ...s, title } : s)),
    );
    setEditingTitleInline(false);
    try {
      await chatService.renameSession(currentSession.id, title);
    } catch {
      /* ignore */
    }
  }, [currentSession, editingTitleInlineValue]);

  const exportSession = useCallback(
    async (id) => {
      const sess = sessions.find((s) => s.id === id) ?? currentSession;
      if (!sess) return;
      setMenuOpenSession(null);
      setTopMenuOpen(false);
      try {
        const blob = await chatService.exportSession(id);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${sess.title.replace(/[^a-z0-9_-]+/gi, "_")}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success("Session exported");
      } catch {
        downloadJSON(
          sess.title.replace(/[^a-z0-9_-]+/gi, "_") || "chat_export",
          sess,
        );
        toast.success("Session exported");
      }
    },
    [sessions, currentSession],
  );

  const deleteSession = useCallback(
    async (id) => {
      setConfirmDeleteId(null);
      setMenuOpenSession(null);
      setTopMenuOpen(false);
      try {
        await chatService.deleteSession(id);
      } catch {
        /* ignore */
      }
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (currentSession?.id === id) {
        navigate(ROUTES.chat);
      }
      toast.success("Chat deleted");
    },
    [currentSession, navigate],
  );

  const toggleReaction = useCallback((msgId, reaction) => {
    setReactions((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === reaction ? null : reaction,
    }));
  }, []);

  const handleSpeak = useCallback((text, messageId) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (speakingId === messageId) {
        setSpeakingId(null);
        return;
      }
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
  }, [speakingId]);

  const regenerateLast = useCallback(async () => {
    if (!currentSession || isStreaming) return;
    const lastUserIdx = [...messages]
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => m.role === "user")
      .pop();
    if (!lastUserIdx) return;
    const userMsg = lastUserIdx.m;
    setMessages((prev) => prev.slice(0, lastUserIdx.i + 1));
    handleSend(userMsg.content, undefined, true);
  }, [currentSession, messages, isStreaming]);

  const handleSend = useCallback(
    async (text, attachments, isRegenerate = false) => {
      if (isStreaming) return;

      let session = currentSession;
      if (!session) {
        const newId = `sess-${generateId()}`;
        session = {
          id: newId,
          title: text.slice(0, 60).trim() || "New Chat",
          lastMessage: text,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pinned: false,
          messageCount: 0,
          subject: "General",
        };
        setSessions((prev) => [session, ...prev]);
        navigate(`${ROUTES.chat}/${newId}`, { replace: true });
        try {
          try {
            const created = await chatService.createSession(session.title);
            const sessionData = created.data || created;
            const createdId = sessionData.id || sessionData._id;
            if (createdId && createdId !== newId) {
              session = { ...session, id: createdId };
              setSessions((prev) =>
                prev.map((s) => (s.id === newId ? session : s)),
              );
              navigate(`${ROUTES.chat}/${createdId}`, { replace: true });
            }
          } catch {}
        } catch {
          /* ignore */
        }
      }

      const base64Images = [];
      if (attachments?.length) {
        for (const att of attachments) {
          if (att.type === "image" && att.file) {
            try {
              const b64 = await fileToBase64(att.file);
              base64Images.push(b64);
            } catch (e) {
              console.error("Failed to read image", e);
            }
          }
        }
      }

      const userMsg = {
        id: `u-${generateId()}`,
        role: "user",
        content: attachments?.length
          ? `${text}\n\n[Attached: ${attachments.map((a) => a.name).join(", ")} (${attachments.map((a) => formatFileSize(a.size)).join(", ")})]`
          : text,
        timestamp: new Date().toISOString(),
      };

      const assistantId = `a-${generateId()}`;
      const assistantMsg = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStreamingMsgId(assistantId);
      setIsStreaming(true);
      setProcStep(0);

      let appended = "";
      let stopped = false;
      window.__chatStop = () => { stopped = true; };

      try {
        chatService.streamMessage(
          session.id,
          text,
          { language: selectedLanguage, images: base64Images },
          (chunk) => {
             if (stopped) return;
             setProcStep(3); // done thinking
             appended += chunk;
             setMessages((prev) =>
               prev.map((m) => m.id === assistantId ? { ...m, content: appended } : m)
             );
          },
          () => {
             setIsStreaming(false);
             setStreamingMsgId(null);
             setMessages((prev) => {
               const newMsgs = prev.map((m) => m.id === assistantId ? { ...m, isStreaming: false } : m);
               setSessions((prevSessions) => prevSessions.map((s) => {
                 if (s.id === session.id) {
                   return {
                     ...s,
                     messages: newMsgs,
                     lastMessage: newMsgs[newMsgs.length - 1]?.content || s.lastMessage,
                     messageCount: newMsgs.length,
                     updatedAt: new Date().toISOString(),
                   };
                 }
                 return s;
               }));
               return newMsgs;
             });
          },
          (error) => {
             console.error("Stream error", error);
             setIsStreaming(false);
             setStreamingMsgId(null);
          }
        );
      } catch (e) {
        console.error(e);
      }
    },
    [currentSession, isStreaming, navigate, selectedLanguage],
  );

  const handleStop = useCallback(() => {
    if (typeof window !== "undefined") {
      const w = window;
      if (typeof w.__chatStop === "function") w.__chatStop();
    }
  }, []);

  const pickSuggestedPrompt = useCallback(
    (prompt) => {
      handleSend(prompt);
    },
    [handleSend],
  );

  const confidenceFromCitations = (citations) => {
    if (!citations || citations.length === 0)
      return { level: "Medium", value: 0.72 };
    const avg =
      citations.reduce(
        (sum, c) =>
          sum + (typeof c.confidence === "number" ? c.confidence : 0.7),
        0,
      ) / citations.length;
    if (avg >= 0.85) return { level: "High", value: avg };
    if (avg >= 0.6) return { level: "Medium", value: avg };
    return { level: "Low", value: avg };
  };

  const subjectColor = subjectColorFor(currentSession?.subject);

  const renderSidebarSessionRow = (s, pinned = false) => {
    const isActive = currentSession?.id === s.id;
    const isEditing = editingSessionId === s.id;
    const color = subjectColorFor(s.subject);
    return (
      <motion.div
        key={s.id}
        layout
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        onMouseEnter={() => !isEditing && setMenuOpenSession(null)}
        className="relative"
      >
        {isEditing ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-900/50">
            <input
              autoFocus
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setEditingSessionId(null);
              }}
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none"
            />

            <button
              type="button"
              onClick={commitRename}
              className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-primary-600 text-white text-xs"
              aria-label="Confirm rename"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setEditingSessionId(null)}
              className="h-7 w-7 inline-flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="Cancel rename"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => selectSession(s.id)}
            className={cn(
              "w-full flex items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition group",
              isActive
                ? "bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-900/50"
                : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent",
            )}
          >
            <span
              className={cn(
                "mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2",
                pinned ? "ring-amber-200 dark:ring-amber-900/40" : "",
                isActive ? "ring-primary-200 dark:ring-primary-900/40" : "",
              )}
              style={{ backgroundColor: color }}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {pinned && <Pin className="h-3 w-3 shrink-0 text-amber-500" />}
                <p
                  className={cn(
                    "truncate text-sm leading-tight",
                    pinned
                      ? "font-semibold text-slate-900 dark:text-slate-100"
                      : "font-medium text-slate-800 dark:text-slate-200",
                    isActive && "!text-primary-700 dark:!text-primary-300",
                  )}
                >
                  {s.title}
                </p>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {s.lastMessage || "No messages yet"}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(s.updatedAt)}
                {s.messageCount ? ` \u2022 ${s.messageCount} msgs` : ""}
              </p>
            </div>

            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {menuOpenSession === s.id ? (
                <div className="absolute right-2 top-10 z-40 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-dropdown p-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      pinToggle(s.id);
                      setMenuOpenSession(null);
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {s.pinned ? (
                      <>
                        <PinOff className="h-3.5 w-3.5" />
                        Unpin chat
                      </>
                    ) : (
                      <>
                        <Pin className="h-3.5 w-3.5" />
                        Pin to top
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startRename(s.id, s.title);
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportSession(s.id);
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export JSON
                  </button>
                  <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(s.id);
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      pinToggle(s.id);
                    }}
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                    aria-label={s.pinned ? "Unpin" : "Pin"}
                  >
                    {s.pinned ? (
                      <PinOff className="h-3.5 w-3.5" />
                    ) : (
                      <Pin className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenSession((prev) =>
                        prev === s.id ? null : s.id,
                      );
                    }}
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                    aria-label="Chat options"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </button>
        )}
      </motion.div>
    );
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Chats
          </h2>
          {!isMobile && (
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={createNewSession}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats"
            className="input-base pl-9 h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {pinned.length > 0 && (
          <section>
            <div className="px-2 mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Pin className="h-3 w-3 text-amber-500" />
              Pinned
            </div>
            <div className="space-y-1">
              {pinned.map((s) => renderSidebarSessionRow(s, true))}
            </div>
          </section>
        )}
        <section>
          <div className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recents
          </div>
          {["Today", "Yesterday", "Previous 7 Days", "Older"].map(
            (g) =>
              grouped[g].length > 0 && (
                <div key={g} className="mb-3">
                  <div className="px-2 mb-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    {g}
                  </div>
                  <div className="space-y-1">
                    {grouped[g].map((s) => renderSidebarSessionRow(s))}
                  </div>
                </div>
              ),
          )}
          {filteredSessions.length === 0 && (
            <div className="py-8 text-center">
              <Search className="h-6 w-6 mx-auto text-slate-400" />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                No chats match &ldquo;{debouncedSearch}&rdquo;
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-5rem)] -mx-6 -my-6 flex bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {!isMobile && sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="shrink-0 h-full w-[300px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {SidebarContent}
        </motion.aside>
      )}

      <AnimatePresence>
        {isMobile && mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileDrawerOpen(false)}
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl lg:hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 min-w-0">
            {!sidebarOpen && !isMobile && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}
            {isMobile && (
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open chats"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div className="min-w-0 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-primary-100 dark:ring-primary-950/60"
                style={{ backgroundColor: subjectColor }}
              />

              {editingTitleInline ? (
                <input
                  autoFocus
                  value={editingTitleInlineValue}
                  onChange={(e) => setEditingTitleInlineValue(e.target.value)}
                  onBlur={commitInlineTitleEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitInlineTitleEdit();
                    if (e.key === "Escape") setEditingTitleInline(false);
                  }}
                  className="min-w-0 bg-transparent text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none border-b border-primary-400"
                />
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    currentSession && startInlineTitleEdit(currentSession.title)
                  }
                  className="min-w-0 text-left"
                >
                  <h1 className="truncate text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100">
                    {currentSession?.title ?? "New Conversation"}
                  </h1>
                </button>
              )}
              {currentSession?.subject && (
                <span
                  className="chip hidden sm:inline-flex"
                  style={{
                    backgroundColor: `${subjectColor}22`,
                    color: subjectColor,
                  }}
                >
                  {currentSession.subject}
                </span>
              )}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="ml-2 text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-md px-2 py-1 outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Users className="h-3.5 w-3.5" />1 user + 1 AI
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setRightPanelOpen((o) => !o)}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle citation panel"
              title="Sources panel"
            >
              <PanelRight className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTopMenuOpen((o) => !o)}
                disabled={!currentSession}
                className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Conversation options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {topMenuOpen && currentSession && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-11 z-40 w-52 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-dropdown p-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setTopMenuOpen(false);
                        startInlineTitleEdit(currentSession.title);
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => exportSession(currentSession.id)}
                      className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export JSON
                    </button>
                    <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(currentSession.id)}
                      className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete conversation
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
          onClick={() => {
            setTopMenuOpen(false);
            setMenuOpenSession(null);
          }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4 py-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-xl"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white shadow-lg shadow-primary-500/20">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h2 className="mt-4 text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Ask LearnFlow AI anything
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Start a conversation using your uploaded study materials.
                  Answers include citations, related questions, and exam tips.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED_PROMPTS.map((p, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      type="button"
                      onClick={() => pickSuggestedPrompt(p)}
                      className="group flex items-start gap-2 text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/60 dark:hover:bg-primary-950/30 transition"
                    >
                      <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-primary-500" />
                      <span className="text-xs md:text-sm leading-snug text-slate-700 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                        {p}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-3 md:px-6 py-6 space-y-4">
              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                const isAssistant = m.role === "assistant";
                const isSystem = m.role === "system";
                const isError = m.role === "error";
                const isWarning = m.role === "warning";
                const isStreamingMsg = m.id === streamingMsgId && isStreaming;
                const variants = isUser
                  ? {
                      initial: { opacity: 0, x: 20 },
                      animate: { opacity: 1, x: 0 },
                    }
                  : {
                      initial: { opacity: 0, x: -20 },
                      animate: { opacity: 1, x: 0 },
                    };
                return (
                  <React.Fragment key={m.id}>
                    {isSystem && (
                      <motion.div
                        {...variants}
                        transition={{ duration: 0.25, delay: idx * 0.02 }}
                        className="flex justify-center"
                      >
                        <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <Info className="h-3.5 w-3.5" />
                          {m.content}
                        </span>
                      </motion.div>
                    )}
                    {isError && (
                      <motion.div
                        {...variants}
                        transition={{ duration: 0.25 }}
                        className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-3 flex items-start gap-2"
                      >
                        <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-rose-700 dark:text-rose-300 leading-relaxed">
                          {m.content}
                        </p>
                      </motion.div>
                    )}
                    {isWarning && (
                      <motion.div
                        {...variants}
                        transition={{ duration: 0.25 }}
                        className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-3 flex items-start gap-2"
                      >
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                          {m.content}
                        </p>
                      </motion.div>
                    )}

                    {isUser && (
                      <motion.div
                        {...variants}
                        transition={{ duration: 0.25, delay: idx * 0.02 }}
                        className="flex items-end justify-end gap-2.5"
                      >
                        <div className="max-w-[80%] md:max-w-[70%] flex flex-col items-end">
                          <div className="rounded-2xl rounded-br-md bg-primary-600 text-white shadow-sm px-4 py-2.5">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {m.content}
                            </p>
                          </div>
                          <span className="mt-1 px-1 text-[10px] text-slate-400 dark:text-slate-500">
                            {formatDateTime(m.timestamp)}
                          </span>
                        </div>
                        <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                          JD
                        </div>
                      </motion.div>
                    )}

                    {isAssistant && (
                      <motion.div
                        {...variants}
                        transition={{ duration: 0.3, delay: idx * 0.02 }}
                        className="relative flex items-start gap-2.5 group/message"
                      >
                        <div className="mt-1 h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white flex items-center justify-center shadow-md">
                          <BrainCircuit className="h-4.5 w-4.5" />
                        </div>

                        <div className="min-w-0 flex-1 max-w-[92%] md:max-w-[82%]">
                          {isStreamingMsg && procStep < 3 ? (
                            <div className="rounded-2xl rounded-tl-md border-l-4 border-primary-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm px-4 py-3 mb-2">
                              <ProcessingStepper step={procStep} />
                            </div>
                          ) : (
                            <>
                              <div
                                className={cn(
                                  "rounded-2xl rounded-tl-md border-l-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm px-4 py-3 relative",
                                  isStreamingMsg
                                    ? "border-primary-400 dark:border-primary-500"
                                    : "border-primary-500 dark:border-primary-600",
                                )}
                              >
                                {isStreamingMsg && (
                                  <button
                                    type="button"
                                    onClick={handleStop}
                                    className="absolute right-3 top-3 inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
                                    title="Stop generating"
                                  >
                                    <Square className="h-3 w-3 fill-current" />
                                    Stop
                                  </button>
                                )}
                                {m.content ? (
                                  <div
                                    className="chat-markdown text-sm [&_:last-child]:mb-0"
                                    dangerouslySetInnerHTML={{
                                      __html: renderMarkdown(m.content),
                                    }}
                                  />
                                ) : (
                                  isStreamingMsg &&
                                  procStep >= 3 && (
                                    <div className="py-2 text-slate-500 dark:text-slate-400">
                                      <ThinkingDots />
                                    </div>
                                  )
                                )}
                                {isStreamingMsg &&
                                  !m.content &&
                                  procStep < 3 && (
                                    <div className="py-3 text-slate-400">
                                      <ThinkingDots />
                                    </div>
                                  )}
                                {!isStreamingMsg && m.content && (
                                  <>
                                    {m.citations && m.citations.length > 0 && (
                                      <div className="mt-4">
                                        <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                          <FileText className="h-3.5 w-3.5 text-primary-500" />
                                          Cited Sources
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {m.citations.map((c, ci) => {
                                            const tone =
                                              confidenceFromCitations([c]);
                                            return (
                                              <button
                                                key={ci}
                                                type="button"
                                                onClick={() =>
                                                  setSnippetModal({
                                                    msgId: m.id,
                                                    citationIdx: ci,
                                                  })
                                                }
                                                className="flex items-start gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 p-2.5 text-left transition"
                                              >
                                                <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-primary-500 flex items-center justify-center">
                                                  <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                                                    {c.documentName}
                                                  </p>
                                                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                                                    {c.page
                                                      ? `Page ${c.page}`
                                                      : "Source"}
                                                    {" \u2022 "}
                                                    {tone.level}{" "}
                                                    {Math.round(
                                                      tone.value * 100,
                                                    )}
                                                    %
                                                  </p>
                                                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-primary-600 dark:text-primary-400 hover:underline">
                                                    <Eye className="h-3 w-3" />
                                                    View snippet
                                                  </span>
                                                </div>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                      {(() => {
                                        const conf = confidenceFromCitations(
                                          m.citations,
                                        );
                                        return (
                                          <span
                                            className={cn(
                                              "chip",
                                              conf.level === "High" &&
                                                "bg-accent-100 text-accent-700 dark:bg-accent-950/60 dark:text-accent-400",
                                              conf.level === "Medium" &&
                                                "bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-400",
                                              conf.level === "Low" &&
                                                "bg-warning-100 text-warning-700 dark:bg-warning-950/60 dark:text-warning-400",
                                            )}
                                          >
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            {conf.level} Confidence
                                            {" \u2022 "}
                                            {Math.round(conf.value * 100)}%
                                          </span>
                                        );
                                      })()}
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-950/40 dark:via-secondary-950/40 dark:to-accent-950/30 border border-primary-100 dark:border-primary-900/40 px-3 py-2">
                                      <Sparkles className="h-4 w-4 shrink-0 text-primary-500" />
                                      <p className="text-xs text-slate-700 dark:text-slate-200">
                                        Answer generated from your{" "}
                                        <span className="font-semibold">
                                          uploaded notes
                                        </span>{" "}
                                        and study materials
                                      </p>
                                    </div>
                                    {m.relatedQuestions &&
                                      m.relatedQuestions.length > 0 && (
                                        <div className="mt-3">
                                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                            Follow up
                                          </p>
                                          <div className="flex flex-wrap gap-1.5">
                                            {m.relatedQuestions.map((q, qi) => (
                                              <button
                                                key={qi}
                                                type="button"
                                                onClick={() => handleSend(q)}
                                                className="chip bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-700 dark:hover:text-primary-300 transition"
                                              >
                                                <Send className="h-3 w-3" />
                                                Ask: {q}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                  </>
                                )}
                              </div>

                              <div className="mt-1.5 flex items-center gap-3 flex-wrap">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                  {formatDateTime(m.timestamp)}
                                </span>
                                {!isStreamingMsg && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover/message:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        copy(m.content);
                                        if (!copied)
                                          toast.success("Copied to clipboard");
                                      }}
                                      className="inline-flex items-center gap-1 h-7 px-2 rounded-lg text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                      title="Copy answer"
                                    >
                                      {copied ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-500" />
                                      ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                      )}
                                      <span className="hidden sm:inline">
                                        {copied ? "Copied" : "Copy"}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSpeak(m.content, m.id)}
                                      className="inline-flex items-center gap-1 h-7 px-2 rounded-lg text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                      title={speakingId === m.id ? "Stop reading" : "Read aloud"}
                                    >
                                      {speakingId === m.id ? (
                                        <Square className="h-3.5 w-3.5" />
                                      ) : (
                                        <Volume2 className="h-3.5 w-3.5" />
                                      )}
                                      <span className="hidden sm:inline">
                                        {speakingId === m.id ? "Stop" : "Listen"}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={regenerateLast}
                                      className="inline-flex items-center gap-1 h-7 px-2 rounded-lg text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                      title="Regenerate answer"
                                    >
                                      <RotateCcw className="h-3.5 w-3.5" />
                                      <span className="hidden sm:inline">
                                        Regenerate
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleReaction(m.id, "like")
                                      }
                                      className={cn(
                                        "inline-flex items-center gap-1 h-7 px-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition",
                                        reactions[m.id] === "like"
                                          ? "text-accent-600 bg-accent-50 dark:bg-accent-950/40 dark:text-accent-400"
                                          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                                      )}
                                      title="Helpful"
                                    >
                                      <ThumbsUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleReaction(m.id, "dislike")
                                      }
                                      className={cn(
                                        "inline-flex items-center gap-1 h-7 px-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition",
                                        reactions[m.id] === "dislike"
                                          ? "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400"
                                          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                                      )}
                                      title="Not helpful"
                                    >
                                      <ThumbsDown className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const url = `${window.location.origin}/chat/${currentSession?.id ?? ""}#${m.id}`;
                                        copy(url);
                                        toast.success("Link copied");
                                      }}
                                      className="inline-flex items-center gap-1 h-7 px-2 rounded-lg text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                      title="Share link"
                                    >
                                      <Share2 className="h-3.5 w-3.5" />
                                      <span className="hidden sm:inline">
                                        Share
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 md:px-6 py-3">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSend={handleSend}
              isStreaming={isStreaming}
              onStop={handleStop}
              sessionId={currentSession?.id}
              placeholder={
                currentSession
                  ? "Ask anything about your study materials..."
                  : 'Start a new conversation (e.g. "Summarize Chapter 3")'
              }
            />

            <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
              Answers may include AI-generated content. Always verify with your
              notes.
            </p>
          </div>
        </div>
      </main>

      {!isMobile ? (
        rightPanelOpen && (
          <CitationPanel
            citations={currentCitations}
            onClose={() => setRightPanelOpen(false)}
            open
          />
        )
      ) : (
        <AnimatePresence>
          {rightPanelOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
                onClick={() => setRightPanelOpen(false)}
              />

              <motion.div
                initial={{ x: 360 }}
                animate={{ x: 0 }}
                exit={{ x: 360 }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
                className="fixed inset-y-0 right-0 z-50 w-[88%] max-w-sm lg:hidden shadow-2xl"
              >
                <CitationPanel
                  citations={currentCitations}
                  onClose={() => setRightPanelOpen(false)}
                  open
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
            onClick={() => setConfirmDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Delete this chat?
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    This will permanently remove the conversation and its
                    messages.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="h-9 px-4 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteSession(confirmDeleteId)}
                  className="h-9 px-4 rounded-lg text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 transition"
                >
                  Delete chat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {snippetModal &&
          (() => {
            const msg = messages.find((m) => m.id === snippetModal.msgId);
            const cit = msg?.citations?.[snippetModal.citationIdx];
            if (!cit) return null;
            const conf = confidenceFromCitations([cit]);
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
                onClick={() => setSnippetModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.96, y: 8 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 8 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <header className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {cit.documentName}
                        </p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          {cit.page && (
                            <span className="chip bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              Page {cit.page}
                            </span>
                          )}
                          <span
                            className={cn(
                              "chip",
                              conf.level === "High" &&
                                "bg-accent-100 text-accent-700 dark:bg-accent-950/60 dark:text-accent-400",
                              conf.level === "Medium" &&
                                "bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-400",
                              conf.level === "Low" &&
                                "bg-warning-100 text-warning-700 dark:bg-warning-950/60 dark:text-warning-400",
                            )}
                          >
                            {conf.level} \u2022 {Math.round(conf.value * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSnippetModal(null)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label="Close snippet"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </header>
                  <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <span>Confidence</span>
                        <span>{Math.round(conf.value * 100)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            conf.level === "High" && "bg-accent-500",
                            conf.level === "Medium" && "bg-primary-500",
                            conf.level === "Low" && "bg-warning-500",
                          )}
                          style={{ width: `${conf.value * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4">
                      <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                        {cit.text}
                      </p>
                    </div>
                  </div>
                  <footer className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800 px-5 py-3">
                    <button
                      type="button"
                      onClick={() => setSnippetModal(null)}
                      className="h-9 px-4 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Close
                    </button>
                  </footer>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </div>
  );
};
