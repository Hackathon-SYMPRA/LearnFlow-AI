import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Mic,
  Square,
  Sparkles,
  X,
  ChevronUp,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { MAX_MESSAGE_LENGTH, SUGGESTED_PROMPTS, FILE_TYPES } from "@/constants";
import { formatFileSize, cn } from "@/utils/format";
import { VoiceRecorder } from "./VoiceRecorder";

const MAX_ROWS = 10;
const MIN_ROWS = 1;

const categorizeFile = (file) => {
  if (file.type.startsWith("image/")) return "image";
  const allDocs = [
    ...(FILE_TYPES.pdf ?? []),
    ...(FILE_TYPES.doc ?? []),
    ...(FILE_TYPES.text ?? []),
  ];
  if (allDocs.includes(file.type)) return "doc";
  return "other";
};

const isAcceptedFile = (file) => {
  const all = [
    ...(FILE_TYPES.pdf ?? []),
    ...(FILE_TYPES.doc ?? []),
    ...(FILE_TYPES.image ?? []),
    ...(FILE_TYPES.text ?? []),
  ];
  return all.includes(file.type);
};

export const ChatInput = ({
  onSend,
  isStreaming,
  onStop,
  placeholder,
  disabled,
}) => {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState(MIN_ROWS);
  const [attachments, setAttachments] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [recordingOpen, setRecordingOpen] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const charCount = value.length;
  const isOverLimit = charCount > MAX_MESSAGE_LENGTH;
  const canSend =
    !disabled && !isStreaming && value.trim().length > 0 && !isOverLimit;

  const updateRows = useCallback((text) => {
    const lineCount = text.split("\n").length;
    setRows(Math.max(MIN_ROWS, Math.min(MAX_ROWS, lineCount)));
  }, []);

  useEffect(() => {
    updateRows(value);
  }, [value, updateRows]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSend = useCallback(() => {
    if (isStreaming) {
      onStop();
      return;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      toast.warning("Please enter a message first");
      return;
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      toast.error(
        `Message is too long (${trimmed.length}/${MAX_MESSAGE_LENGTH} characters)`,
      );
      return;
    }
    onSend(trimmed, attachments.length > 0 ? attachments : undefined);
    setValue("");
    setAttachments((prev) => {
      prev.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
      return [];
    });
    setRows(MIN_ROWS);
  }, [value, attachments, isStreaming, onSend, onStop]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleFilesSelected = useCallback((fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    const accepted = [];
    let rejectedCount = 0;

    files.forEach((f) => {
      if (!isAcceptedFile(f)) {
        rejectedCount++;
        return;
      }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const cat = categorizeFile(f);
      accepted.push({
        id,
        file: f,
        name: f.name,
        size: f.size,
        type: cat,
        previewUrl: cat === "image" ? URL.createObjectURL(f) : undefined,
      });
    });

    if (accepted.length > 0) {
      setAttachments((prev) => [...prev, ...accepted]);
    }
    if (rejectedCount > 0) {
      toast.warning(
        `${rejectedCount} file${rejectedCount === 1 ? "" : "s"} not supported. Allowed: PDF, DOC, Images, Text`,
      );
    }
  }, []);

  const removeAttachment = useCallback((id) => {
    setAttachments((prev) => {
      const next = prev.filter((a) => a.id !== id);
      const removed = prev.find((a) => a.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  }, []);

  const handlePickPrompt = useCallback((prompt) => {
    setValue((prev) => {
      const next = prev ? `${prev} ${prompt}` : prompt;
      return next.trim();
    });
    setShowSuggestions(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }, []);

  const acceptAttr = useMemo(() => {
    const mimeTypes = [];
    Object.values(FILE_TYPES).forEach((arr) => {
      if (Array.isArray(arr)) mimeTypes.push(...arr);
    });
    return mimeTypes.join(",");
  }, []);

  const onVoiceTranscript = useCallback((text) => {
    setValue((prev) => (prev ? `${prev} ${text}` : text).trim());
  }, []);

  return (
    <div className="relative w-full">
      {attachments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 flex flex-wrap gap-2"
        >
          {attachments.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-2 pr-1.5 py-1.5 max-w-xs"
            >
              {a.type === "image" && a.previewUrl ? (
                <img
                  src={a.previewUrl}
                  alt={a.name}
                  className="h-8 w-8 rounded-md object-cover shrink-0"
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                  <FileText className="h-4 w-4" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[10rem]">
                  {a.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {formatFileSize(a.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(a.id)}
                className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                aria-label={`Remove ${a.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div
        className={cn(
          "relative rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all duration-200",
          isOverLimit
            ? "border-rose-300 dark:border-rose-800 ring-2 ring-rose-200 dark:ring-rose-950/60"
            : "border-slate-200 dark:border-slate-700 focus-within:border-primary-400 dark:focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-500/20",
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={rows}
          disabled={disabled}
          placeholder={
            placeholder ??
            "Ask anything about your study materials... (Enter to send, Shift+Enter for new line"
          }
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-11 pr-14 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed max-h-64"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-2 pb-2 pt-1.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isStreaming}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Attach file"
              title="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptAttr}
              multiple
              className="hidden"
              onChange={(e) => {
                handleFilesSelected(e.target.files);
                e.target.value = "";
              }}
            />

            <button
              type="button"
              onClick={() => setRecordingOpen(true)}
              disabled={disabled || isStreaming}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",
                showVoice
                  ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
              aria-label="Voice input"
              title="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>

            <div className="relative" ref={suggestionsRef}>
              <button
                type="button"
                onClick={() => setShowSuggestions((s) => !s)}
                disabled={disabled || isStreaming}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",
                  showSuggestions
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
                aria-label="Suggested prompts"
                title="Suggested prompts"
              >
                <Sparkles className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 mb-2 w-80 max-w-[85vw] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-dropdown p-2 z-30"
                  >
                    <div className="px-2 pt-1 pb-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <Sparkles className="h-3 w-3 text-primary-500" />
                        Suggested prompts
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-0.5">
                      {SUGGESTED_PROMPTS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handlePickPrompt(p)}
                          className="w-full text-left rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <span className="text-primary-500 mr-1.5">
                            \u2022
                          </span>
                          {p}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[11px] tabular-nums px-1.5",
                isOverLimit
                  ? "text-rose-600 dark:text-rose-400 font-medium"
                  : charCount / MAX_MESSAGE_LENGTH > 0.8
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-400 dark:text-slate-500",
              )}
            >
              {charCount}/{MAX_MESSAGE_LENGTH}
            </span>
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend && !isStreaming}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl transition",
                isStreaming
                  ? "bg-rose-600 text-white hover:bg-rose-700"
                  : canSend
                    ? "bg-primary-600 text-white hover:bg-primary-700 shadow-sm"
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed",
              )}
              aria-label={isStreaming ? "Stop generation" : "Send message"}
            >
              {isStreaming ? (
                <Square className="h-4 w-4 fill-current" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOverLimit && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Message exceeds maximum of {MAX_MESSAGE_LENGTH} characters (
          {charCount})
        </motion.div>
      )}

      <VoiceRecorder
        isOpen={recordingOpen}
        onClose={() => setRecordingOpen(false)}
        onTranscript={onVoiceTranscript}
      />

      <AnimatePresence>
        {showVoice && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute -top-10 left-4 rounded-lg bg-slate-900 text-white text-xs px-3 py-1.5 shadow-lg"
          >
            Voice mode ready (stub UI)
            <ChevronUp className="absolute -bottom-1 left-6 h-2 w-2 rotate-45 bg-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
