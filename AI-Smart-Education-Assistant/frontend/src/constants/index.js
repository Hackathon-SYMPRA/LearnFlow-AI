export const APP_NAME = import.meta.env.VITE_APP_NAME || "EduMind AI";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const DEFAULT_THEME = import.meta.env.VITE_DEFAULT_THEME || "light";

export const ROUTES = {
  dashboard: "/dashboard",
  upload: "/upload",
  chat: "/chat",
  notes: "/notes",
  mindmap: "/mindmap",
  quiz: "/quiz",
  flashcards: "/flashcards",
  planner: "/planner",
  history: "/history",
  analytics: "/analytics",
  profile: "/profile",
  settings: "/settings",
};

export const STORAGE_KEYS = {
  TOKEN: "edumind_token",
  USER: "edumind_user",
  THEME: "edumind_theme",
  SIDEBAR_COLLAPSED: "edumind_sidebar_collapsed",
  CURRENT_SUBJECT: "edumind_current_subject",
  PINNED_CHATS: "edumind_pinned_chats",
  RECENT_SEARCHES: "edumind_recent_searches",
  NOTIFICATIONS: "edumind_notifications",
  SUBJECTS: "edumind_subjects",
  FAVORITE_DOCS: "edumind_favorite_docs",
  LAST_CHAT_SESSION: "edumind_last_chat_session",
};

export const SUBJECT_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
  "#6366F1",
  "#14B8A6",
  "#F97316",
  "#EC4899",
  "#06B6D4",
  "#34D399",
  "#D946EF",
];

export const SUBJECT_ICONS = [
  "BookOpen",
  "Calculator",
  "Atom",
  "FlaskConical",
  "Brain",
  "Globe",
  "History",
  "Newspaper",
  "LineChart",
  "Theater",
];

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "hi", label: "हिन्दी" },
  { code: "zh", label: "中文" },
];

export const FONT_SIZES = [
  { key: "small", label: "Small", value: "0.875rem" },
  { key: "medium", label: "Medium", value: "1rem" },
  { key: "large", label: "Large", value: "1.125rem" },
];

export const SUGGESTED_PROMPTS = [
  "Summarize this document in 5 bullet points",
  "Give me a quiz on the key concepts",
  "Explain the most challenging topic simply",
  "Create flashcards from the main ideas",
  "What are the key takeaways?",
  "Compare the main theories mentioned",
  "Give me real-world applications",
  "Outline a study plan for this subject",
];

export const MAX_MESSAGE_LENGTH = 4000;

export const MAX_UPLOAD_PARALLEL = 3;

export const NOTIFICATION_SUBTYPES = {
  "upload.completed": "Upload completed",
  "upload.failed": "Upload failed",
  "quiz.generated": "Quiz generated",
  "flashcards.ready": "Flashcards ready",
  "planner.generated": "Study planner ready",
  "ai.ready": "AI assistant ready",
  "network.error": "Network error",
  "login.success": "Login successful",
  "logout.success": "Logout successful",
};

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Geography",
  "English",
  "Economics",
  "Psychology",
];

export const FILE_TYPES = {
  pdf: ["application/pdf"],
  doc: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  image: ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"],
  text: ["text/plain", "text/markdown", "text/csv"],
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const QUERY_KEYS = {
  USER: "user",
  DOCUMENTS: "documents",
  CHAT_SESSIONS: "chat_sessions",
  CHAT_MESSAGES: "chat_messages",
  QUIZZES: "quizzes",
  QUIZ_ATTEMPTS: "quiz_attempts",
  FLASHCARDS: "flashcards",
  STUDY_PLANS: "study_plans",
  ANALYTICS: "analytics",
  NOTIFICATIONS: "notifications",
};

export const TOAST_DURATION = 4000;

export const AXIOS_TIMEOUT = 30000;

export const NAVIGATION_ITEMS = [
  {
    route: "dashboard",
    label: "Dashboard",
    description: "Overview of your learning",
  },
  {
    route: "upload",
    label: "Upload Center",
    description: "Upload study materials",
  },
  {
    route: "chat",
    label: "AI Chat",
    description: "Ask AI about your documents",
  },
  {
    route: "notes",
    label: "Notes Generator",
    description: "Generate smart study notes",
  },
  {
    route: "mindmap",
    label: "Mind Map",
    description: "Visualize concepts",
  },
  {
    route: "quiz",
    label: "Quiz Generator",
    description: "Test your knowledge",
  },
  {
    route: "flashcards",
    label: "Flashcards",
    description: "Spaced repetition learning",
  },
  {
    route: "planner",
    label: "Study Planner",
    description: "Organize your study schedule",
  },
  {
    route: "history",
    label: "Chat History",
    description: "Review past conversations",
  },
  {
    route: "analytics",
    label: "Analytics",
    description: "Track your progress",
  },
  { route: "profile", label: "Profile", description: "Manage your profile" },
  { route: "settings", label: "Settings", description: "App preferences" },
];
