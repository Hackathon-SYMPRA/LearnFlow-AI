import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FilePlus2,
  X,
  FileText,
  Image as ImageIcon,
  File,
  FileType,
  Trash2,
  WifiOff,
  Search,
  Eye,
  Pencil,
  Upload as UploadIcon,
  UploadCloud as CloudUpload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  RotateCcw,
  Folder,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ROUTES,
  STORAGE_KEYS,
  MAX_FILE_SIZE,
  MAX_UPLOAD_PARALLEL,
  FILE_TYPES,
} from "@/constants";
import { useOnlineStatus, useLocalStorage } from "@/hooks";
import { toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Spinner } from "@/components/ui/Spinner";
import { NoDocuments } from "@/components/ui/EmptyState";
import {
  cn,
  formatFileSize,
  formatRelativeTime,
  generateId,
} from "@/utils/format";

const ACCEPTED_TYPES = Object.values(FILE_TYPES).flat();

const detectDocType = (file) => {
  const t = file.type;
  if (t === "application/pdf") return "pdf";
  if (FILE_TYPES.doc.includes(t)) return "doc";
  if (FILE_TYPES.image.includes(t)) return "image";
  if (FILE_TYPES.text.includes(t)) return "text";
  return "other";
};

const getFileIcon = (type) => {
  switch (type) {
    case "pdf":
      return (
        <FileText
          className="h-5 w-5 text-primary-600 dark:text-primary-400"
          aria-hidden="true"
        />
      );
    case "doc":
      return (
        <File
          className="h-5 w-5 text-secondary-600 dark:text-secondary-400"
          aria-hidden="true"
        />
      );
    case "image":
      return (
        <ImageIcon
          className="h-5 w-5 text-accent-600 dark:text-accent-400"
          aria-hidden="true"
        />
      );
    case "text":
      return (
        <FileType
          className="h-5 w-5 text-slate-600 dark:text-slate-400"
          aria-hidden="true"
        />
      );
    default:
      return (
        <FileText
          className="h-5 w-5 text-slate-600 dark:text-slate-400"
          aria-hidden="true"
        />
      );
  }
};

const getDemoSubjects = () => [
  {
    id: generateId(),
    name: "Mathematics",
    color: "#3B82F6",
    icon: "Calculator",
    documentCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastUsedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: generateId(),
    name: "Physics",
    color: "#8B5CF6",
    icon: "Atom",
    documentCount: 5,
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    lastUsedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: generateId(),
    name: "Chemistry",
    color: "#10B981",
    icon: "FlaskConical",
    documentCount: 6,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    lastUsedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: generateId(),
    name: "Biology",
    color: "#F59E0B",
    icon: "Brain",
    documentCount: 4,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    lastUsedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: generateId(),
    name: "Computer Science",
    color: "#F43F5E",
    icon: "BookOpen",
    documentCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    lastUsedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: generateId(),
    name: "History",
    color: "#6366F1",
    icon: "History",
    documentCount: 3,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    lastUsedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: generateId(),
    name: "English Literature",
    color: "#14B8A6",
    icon: "Newspaper",
    documentCount: 7,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastUsedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: generateId(),
    name: "Economics",
    color: "#06B6D4",
    icon: "LineChart",
    documentCount: 2,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastUsedAt: undefined,
  },
];

const getInitialDocuments = () => [
  {
    id: generateId(),
    name: "Calculus_Chapter5_Integration.pdf",
    type: "pdf",
    size: 3200000,
    status: "ready",
    uploadDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    subject: "Mathematics",
    pages: 45,
    favorite: true,
    lastOpened: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: generateId(),
    name: "Organic_Chemistry_Notes.pdf",
    type: "pdf",
    size: 5400000,
    status: "ready",
    uploadDate: new Date(Date.now() - 3600000 * 5).toISOString(),
    subject: "Chemistry",
    pages: 72,
    favorite: false,
    lastOpened: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: generateId(),
    name: "Physics_Waves.docx",
    type: "doc",
    size: 890000,
    status: "ready",
    uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    subject: "Physics",
    pages: 18,
    favorite: false,
    lastOpened: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: generateId(),
    name: "Mitochondria_Diagram.png",
    type: "image",
    size: 2100000,
    status: "ready",
    uploadDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    subject: "Biology",
    favorite: true,
    lastOpened: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: generateId(),
    name: "Algorithms_Notes.txt",
    type: "text",
    size: 145000,
    status: "ready",
    uploadDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    subject: "Computer Science",
    pages: 12,
    favorite: false,
    lastOpened: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: generateId(),
    name: "WWII_Timeline.pdf",
    type: "pdf",
    size: 2800000,
    status: "ready",
    uploadDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    subject: "History",
    pages: 34,
    favorite: false,
  },
  {
    id: generateId(),
    name: "Macro_Study_Guide.pdf",
    type: "pdf",
    size: 4100000,
    status: "ready",
    uploadDate: new Date(Date.now() - 86400000 * 6).toISOString(),
    subject: "Economics",
    pages: 58,
    favorite: true,
  },
  {
    id: generateId(),
    name: "Hamlet_Analysis.docx",
    type: "doc",
    size: 520000,
    status: "ready",
    uploadDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    subject: "English Literature",
    pages: 22,
    favorite: false,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export const UploadPage = () => {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [storedSubjects] = useLocalStorage(STORAGE_KEYS.SUBJECTS, []);
  const [subjects, setSubjects] = useState(
    storedSubjects.length > 0 ? storedSubjects : getDemoSubjects(),
  );
  const [documents, setDocuments] = useState(getInitialDocuments());
  const [jobs, setJobs] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);
  const simulationTimers = useRef({});

  useEffect(() => {
    if (subjects.length === 0) setSubjects(getDemoSubjects());
  }, [subjects.length]);

  useEffect(() => {
    return () => {
      Object.values(simulationTimers.current).forEach((t) => clearInterval(t));
    };
  }, []);

  const recentSubjects = useMemo(() => {
    return [...subjects]
      .sort((a, b) => {
        const at = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
        const bt = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
        return bt - at;
      })
      .slice(0, 6);
  }, [subjects]);

  const stats = useMemo(() => {
    const totalBytes = documents.reduce((sum, d) => sum + d.size, 0);
    return {
      totalFiles: documents.length,
      sizeUsed: totalBytes,
      processing: jobs.filter(
        (j) => j.status === "uploading" || j.status === "processing",
      ).length,
      completed: documents.length,
    };
  }, [documents, jobs]);

  const runningCount = jobs.filter((j) => j.status === "uploading").length;

  const validateFile = useCallback((file, existingDocs) => {
    const id = generateId();
    const base = {
      id,
      file,
      fileName: file.name,
      size: file.size,
      type: detectDocType(file),
      progress: 0,
      status: "queued",
    };

    if (file.size === 0) {
      return {
        ...base,
        status: "invalid",
        invalidReason: "empty",
        error: "File is empty (0 bytes). Please select a valid file.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        ...base,
        status: "invalid",
        invalidReason: "too-large",
        error: `File is too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`,
      };
    }

    if (
      !ACCEPTED_TYPES.includes(file.type) &&
      !(file.name.endsWith(".docx") || file.name.endsWith(".doc"))
    ) {
      if (base.type === "other") {
        return {
          ...base,
          status: "invalid",
          invalidReason: "unsupported",
          error: `Unsupported file type "${file.type || file.name.split(".").pop()}". Accepts PDF, DOCX, TXT, and images.`,
        };
      }
    }

    const isDup = existingDocs.some(
      (d) => d.name === file.name && Math.abs(d.size - file.size) < 1024,
    );
    if (isDup) {
      toast.warning("Duplicate detected", {
        description: `"${file.name}" appears to already exist.`,
      });
    }

    return base;
  }, []);

  const enqueueFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) {
        toast.warning("Please select files to upload");
        return;
      }

      const validJobs = [];
      const invalidJobs = [];

      Array.from(files).forEach((file) => {
        const j = validateFile(file, documents);
        if (j) {
          if (j.status === "invalid") invalidJobs.push(j);
          else validJobs.push(j);
        }
      });

      setJobs((prev) => [...prev, ...invalidJobs, ...validJobs]);

      if (validJobs.length > 0) {
        toast.success(
          `${validJobs.length} file${validJobs.length > 1 ? "s" : ""} added to queue`,
        );
      }
    },
    [validateFile, documents],
  );

  useEffect(() => {
    const toStart = jobs.filter((j) => j.status === "queued");
    if (toStart.length === 0 || runningCount >= MAX_UPLOAD_PARALLEL) return;

    const availableSlots = MAX_UPLOAD_PARALLEL - runningCount;
    toStart.slice(0, availableSlots).forEach((job) => startJob(job.id));
  }, [jobs, runningCount]);

  const startJob = useCallback((jobId) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, status: "uploading", progress: 0 } : j,
      ),
    );

    simulationTimers.current[jobId] = setInterval(() => {
      setJobs((prev) => {
        const current = prev.find((j) => j.id === jobId);
        if (!current || current.status !== "uploading") {
          if (simulationTimers.current[jobId]) {
            clearInterval(simulationTimers.current[jobId]);
            delete simulationTimers.current[jobId];
          }
          return prev;
        }

        const nextProg = current.progress + Math.random() * 12 + 4;
        if (nextProg >= 100) {
          if (simulationTimers.current[jobId]) {
            clearInterval(simulationTimers.current[jobId]);
            delete simulationTimers.current[jobId];
          }
          const shouldFail = Math.random() < 0.05;
          if (shouldFail) {
            return prev.map((j) =>
              j.id === jobId
                ? {
                    ...j,
                    status: "failed",
                    progress: 92,
                    error: "Network error during upload. Please retry.",
                  }
                : j,
            );
          }

          setTimeout(() => {
            setJobs((j2) =>
              j2.map((j) =>
                j.id === jobId ? { ...j, status: "processing" } : j,
              ),
            );
            setTimeout(
              () => {
                setJobs((j2) => {
                  const job = j2.find((x) => x.id === jobId);
                  if (!job || job.status !== "processing") return j2;
                  const newDoc = {
                    id: generateId(),
                    name: job.fileName,
                    type: job.type,
                    size: job.size,
                    status: "ready",
                    uploadDate: new Date().toISOString(),
                    subject: job.subject,
                    pages:
                      job.type === "image"
                        ? undefined
                        : Math.floor(Math.random() * 80) + 5,
                    favorite: false,
                  };
                  setDocuments((docs) => [newDoc, ...docs]);
                  toast.success(`${job.fileName} uploaded successfully`);
                  return j2.map((j) =>
                    j.id === jobId
                      ? { ...j, status: "done", progress: 100 }
                      : j,
                  );
                });
              },
              1200 + Math.random() * 1200,
            );
          }, 400);

          return prev.map((j) =>
            j.id === jobId ? { ...j, progress: 100 } : j,
          );
        }

        return prev.map((j) =>
          j.id === jobId ? { ...j, progress: nextProg } : j,
        );
      });
    }, 280);
  }, []);

  const removeJob = useCallback((jobId) => {
    if (simulationTimers.current[jobId]) {
      clearInterval(simulationTimers.current[jobId]);
      delete simulationTimers.current[jobId];
    }
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  const cancelJob = useCallback((jobId) => {
    if (simulationTimers.current[jobId]) {
      clearInterval(simulationTimers.current[jobId]);
      delete simulationTimers.current[jobId];
    }
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId &&
        (j.status === "uploading" ||
          j.status === "processing" ||
          j.status === "queued")
          ? { ...j, status: "cancelled" }
          : j,
      ),
    );
  }, []);

  const retryJob = useCallback((jobId) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId && (j.status === "failed" || j.status === "cancelled")
          ? { ...j, status: "queued", progress: 0, error: undefined }
          : j,
      ),
    );
  }, []);

  const cancelAll = useCallback(() => {
    Object.keys(simulationTimers.current).forEach((k) => {
      clearInterval(simulationTimers.current[k]);
      delete simulationTimers.current[k];
    });
    setJobs((prev) =>
      prev.map((j) =>
        j.status === "uploading" ||
        j.status === "processing" ||
        j.status === "queued"
          ? { ...j, status: "cancelled" }
          : j,
      ),
    );
    toast.info("All active uploads cancelled");
  }, []);

  const clearCompleted = useCallback(() => {
    setJobs((prev) =>
      prev.filter(
        (j) =>
          j.status !== "done" &&
          j.status !== "invalid" &&
          j.status !== "cancelled",
      ),
    );
  }, []);

  const setJobSubject = useCallback((jobId, subject) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, subject: subject || undefined } : j,
      ),
    );
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    if (!isOnline) return;
    setIsDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isOnline) {
      toast.error("Network disconnected", {
        description: "Connect to the internet to upload files.",
      });
      return;
    }
    enqueueFiles(e.dataTransfer.files);
  };

  const handleDeleteDoc = (docId) => {
    if (window.confirm("Delete this document? This cannot be undone.")) {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      toast.success("Document deleted");
    }
  };

  const handleRenameDoc = (doc) => {
    const name = window.prompt("Rename document:", doc.name);
    if (name && name.trim()) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, name: name.trim() } : d)),
      );
      toast.success("Document renamed");
    }
  };

  const handleReplaceDoc = (doc) => {
    toast.info(`Select a new file to replace ${doc.name}`);
  };

  const handlePreviewDoc = (doc) => {
    toast.info(`Opening preview for ${doc.name}`);
    navigate(ROUTES.library);
  };

  const filteredDocs = useMemo(() => {
    const base = [...documents].sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
    );
    if (!search.trim()) return base.slice(0, 10);
    const q = search.trim().toLowerCase();
    return base.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 10);
  }, [documents, search]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 rounded-xl border border-warning-200 dark:border-warning-900 bg-warning-50 dark:bg-warning-950/30 px-5 py-4"
            role="alert"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-100 dark:bg-warning-950/50 text-warning-600 dark:text-warning-400">
              <WifiOff className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-warning-900 dark:text-warning-100">
                Network disconnected
              </h3>
              <p className="mt-0.5 text-sm text-warning-700 dark:text-warning-300">
                Uploads are paused. Please check your connection and try again.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={item}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Upload Center
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Upload your study materials for AI-powered learning
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<CloudUpload className="h-4 w-4" />}
              onClick={() => navigate(ROUTES.library)}
            >
              Go to Library
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          title="Total Files"
          value={stats.totalFiles}
          description="in your library"
          icon={<FileText className="h-6 w-6" />}
          color="primary"
        />

        <StatCard
          title="Storage Used"
          value={formatFileSize(stats.sizeUsed)}
          description="of 5 GB available"
          icon={<Folder className="h-6 w-6" />}
          color="secondary"
        />

        <StatCard
          title="Processing"
          value={stats.processing}
          description="right now"
          icon={<Spinner size="sm" />}
          color="warning"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          description="uploads this session"
          icon={<CheckCircle2 className="h-6 w-6" />}
          color="accent"
        />
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Drop Files Here</CardTitle>
                <CardDescription>
                  Drag & drop or click to browse. Multiple files supported.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Max {formatFileSize(MAX_FILE_SIZE)} each
                </span>
                <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  PDF / DOCX / TXT / Images
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {recentSubjects.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Quick-assign subject (applied to new uploads):
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {recentSubjects.slice(0, 6).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="chip transition-all hover:scale-105"
                      style={{
                        backgroundColor: `${s.color}18`,
                        color: s.color,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                        aria-hidden="true"
                      />
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              role="button"
              tabIndex={isOnline ? 0 : -1}
              aria-disabled={!isOnline}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => {
                if (!isOnline) return;
                fileInputRef.current?.click();
              }}
              onKeyDown={(e) => {
                if (!isOnline) return;
                if (e.key === "Enter" || e.key === " ")
                  fileInputRef.current?.click();
              }}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-200",
                !isOnline
                  ? "opacity-60 cursor-not-allowed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                  : isDragOver
                    ? "cursor-pointer border-primary-500 bg-primary-50 dark:bg-primary-950/30 scale-[1.01] shadow-lg shadow-primary-500/10"
                    : "cursor-pointer border-slate-300 bg-slate-50 hover:border-primary-400 hover:bg-primary-50/40 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-primary-950/20",
              )}
              aria-label="Drop files here or click to upload"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                disabled={!isOnline}
                onChange={(e) => {
                  enqueueFiles(e.target.files);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              />

              <motion.div
                animate={
                  isDragOver ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }
                }
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20"
              >
                <Upload className="h-8 w-8" aria-hidden="true" />
              </motion.div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {isDragOver
                  ? "Drop your files here"
                  : "Drop files here or click to browse"}
              </h3>
              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Up to {formatFileSize(MAX_FILE_SIZE)} each. Supports PDF, DOCX,
                images (PNG/JPG/GIF/WebP), TXT, and Markdown.
              </p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="mt-5"
                leftIcon={<FilePlus2 className="h-4 w-4" />}
                disabled={!isOnline}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Select Files
              </Button>
              {!isOnline && (
                <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-warning-100 dark:bg-warning-950/40 px-3 py-1.5 text-xs font-medium text-warning-700 dark:text-warning-400">
                  <WifiOff className="h-3 w-3" /> Uploads disabled offline
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm">
              <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Sparkles className="h-4 w-4" />
                Parallel uploads:
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {runningCount} / {MAX_UPLOAD_PARALLEL}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCompleted}
                  disabled={
                    !jobs.some(
                      (j) =>
                        j.status === "done" ||
                        j.status === "invalid" ||
                        j.status === "cancelled",
                    )
                  }
                >
                  Clear Completed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<X className="h-4 w-4" />}
                  onClick={cancelAll}
                  disabled={
                    !jobs.some(
                      (j) =>
                        j.status === "queued" ||
                        j.status === "uploading" ||
                        j.status === "processing",
                    )
                  }
                >
                  Cancel All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upload Queue</CardTitle>
                    <CardDescription>
                      {jobs.filter((j) => j.status === "queued").length} queued
                      •{" "}
                      {
                        jobs.filter(
                          (j) =>
                            j.status === "uploading" ||
                            j.status === "processing",
                        ).length
                      }{" "}
                      active • {jobs.filter((j) => j.status === "done").length}{" "}
                      done
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {jobs.map((job) => (
                    <JobRow
                      key={job.id}
                      job={job}
                      subjects={subjects}
                      onSetSubject={setJobSubject}
                      onCancel={cancelJob}
                      onRemove={removeJob}
                      onRetry={retryJob}
                    />
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>Last 10 completed uploads</CardDescription>
              </div>
              <div className="relative w-56">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search documents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-base pl-9 w-full"
                  aria-label="Search uploaded documents"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredDocs.length === 0 ? (
              <NoDocuments onUpload={() => fileInputRef.current?.click()} />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDocs.map((doc) => (
                  <CompletedDocCard
                    key={doc.id}
                    doc={doc}
                    subjects={subjects}
                    onPreview={() => handlePreviewDoc(doc)}
                    onRename={() => handleRenameDoc(doc)}
                    onReplace={() => handleReplaceDoc(doc)}
                    onDelete={() => handleDeleteDoc(doc.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const statusStyles = {
  queued: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  uploading:
    "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400",
  processing:
    "bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400",
  done: "bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400",
  failed:
    "bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-400",
  cancelled:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  invalid:
    "bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-400",
};

const statusIcons = {
  queued: <Clock className="h-3 w-3" />,
  uploading: <Spinner size="sm" />,
  processing: <Spinner size="sm" />,
  done: <CheckCircle2 className="h-3 w-3" />,
  failed: <XCircle className="h-3 w-3" />,
  cancelled: <X className="h-3 w-3" />,
  invalid: <AlertTriangle className="h-3 w-3" />,
};

const statusLabels = {
  queued: "Queued",
  uploading: "Uploading",
  processing: "Processing",
  done: "Ready",
  failed: "Failed",
  cancelled: "Cancelled",
  invalid: "Invalid",
};

const JobRow = ({
  job,
  subjects,
  onSetSubject,
  onCancel,
  onRemove,
  onRetry,
}) => {
  const canCancel =
    job.status === "queued" ||
    job.status === "uploading" ||
    job.status === "processing";
  const canRetry = job.status === "failed" || job.status === "cancelled";
  const canRemove =
    job.status === "done" ||
    job.status === "cancelled" ||
    job.status === "invalid" ||
    job.status === "queued";

  return (
    <li
      className={cn(
        "rounded-xl border p-4 transition-colors",
        job.status === "invalid"
          ? "border-danger-200 dark:border-danger-900 bg-danger-50/40 dark:bg-danger-950/10"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          {getFileIcon(job.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className="truncate text-sm font-medium text-slate-900 dark:text-slate-100"
                title={job.fileName}
              >
                {job.fileName}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{formatFileSize(job.size)}</span>
                <span>•</span>
                <span className={cn("chip !py-0.5", statusStyles[job.status])}>
                  {statusIcons[job.status]}
                  {statusLabels[job.status]}
                </span>
              </div>
              {job.error && (
                <p className="mt-1 text-xs text-danger-600 dark:text-danger-400 inline-flex items-start gap-1">
                  <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                  {job.error}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-3">
            {(job.status === "queued" ||
              job.status === "uploading" ||
              job.status === "processing" ||
              job.status === "done" ||
              job.status === "failed" ||
              job.status === "cancelled") && (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {job.status === "uploading"
                        ? "Uploading…"
                        : job.status === "processing"
                          ? "Processing…"
                          : job.status === "done"
                            ? "Complete"
                            : job.status === "queued"
                              ? "Waiting"
                              : "Progress"}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {Math.round(job.progress)}%
                    </span>
                  </div>
                  <Progress
                    value={job.progress}
                    size="sm"
                    color={
                      job.status === "done"
                        ? "accent"
                        : job.status === "failed"
                          ? "danger"
                          : job.status === "processing"
                            ? "warning"
                            : "primary"
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {(job.status === "queued" ||
                job.status === "uploading" ||
                job.status === "processing" ||
                job.status === "done" ||
                job.status === "failed" ||
                job.status === "cancelled") && (
                <div className="w-full sm:w-44">
                  <select
                    value={job.subject ?? ""}
                    onChange={(e) => onSetSubject(job.id, e.target.value)}
                    className="input-base text-xs h-9 py-1 appearance-none bg-[length:1.1rem] bg-no-repeat bg-[right_0.6rem_center] pr-8"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                    }}
                    aria-label={`Subject for ${job.fileName}`}
                  >
                    <option value="">Uncategorized</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex-1" />

              {canRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                  onClick={() => onRetry(job.id)}
                >
                  Retry
                </Button>
              )}
              {canCancel && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCancel(job.id)}
                >
                  Cancel
                </Button>
              )}
              {canRemove && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onRemove(job.id)}
                  aria-label="Remove"
                  className={cn(
                    job.status === "invalid"
                      ? "text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/30"
                      : "text-slate-500",
                  )}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const CompletedDocCard = ({
  doc,
  subjects,
  onPreview,
  onRename,
  onReplace,
  onDelete,
}) => {
  const subject = subjects.find((s) => s.name === doc.subject);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div whileHover={{ y: -3 }}>
      <Card hoverable padded={false} className="overflow-hidden group">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl",
              doc.type === "pdf" && "bg-primary-100 dark:bg-primary-950/40",
              doc.type === "doc" && "bg-secondary-100 dark:bg-secondary-950/40",
              doc.type === "image" && "bg-accent-100 dark:bg-accent-950/40",
              doc.type === "text" && "bg-slate-100 dark:bg-slate-800",
            )}
          >
            {getFileIcon(doc.type)}
          </div>
          {doc.subject && subject && (
            <span
              className="chip absolute bottom-3 left-3 backdrop-blur-sm"
              style={{
                backgroundColor: `${subject.color}22`,
                color: subject.color,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: subject.color }}
                aria-hidden="true"
              />
              {doc.subject}
            </span>
          )}
          <span
            className={cn(
              "chip absolute bottom-3 right-3 backdrop-blur-sm",
              doc.status === "ready" &&
                "bg-accent-50 text-accent-700 dark:bg-accent-950/60 dark:text-accent-400",
              doc.status === "processing" &&
                "bg-warning-50 text-warning-700 dark:bg-warning-950/60 dark:text-warning-400",
              doc.status === "uploading" &&
                "bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-400",
              doc.status === "failed" &&
                "bg-danger-50 text-danger-700 dark:bg-danger-950/60 dark:text-danger-400",
            )}
          >
            {doc.status === "ready" && "Ready"}
            {doc.status === "processing" && "Processing"}
            {doc.status === "uploading" && "Uploading"}
            {doc.status === "failed" && "Failed"}
          </span>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h3
              className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate"
              title={doc.name}
            >
              {doc.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{formatFileSize(doc.size)}</span>
              {doc.pages !== undefined && <span>• {doc.pages}p</span>}
              <span>• {formatRelativeTime(doc.uploadDate)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800 -mx-4 px-4">
            <button
              type="button"
              onClick={onPreview}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Preview"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button
              type="button"
              onClick={onRename}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Rename"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onReplace}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Replace"
            >
              <UploadIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:bg-danger-50 dark:hover:bg-danger-950/30 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
