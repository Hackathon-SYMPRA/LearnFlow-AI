export type Theme = 'light' | 'dark';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  course?: string;
  semester?: string;
  college?: string;
  language?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'text' | 'other';
  size: number;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
  uploadDate: string;
  subject?: string;
  pages?: number;
  progress?: number;
  favorite?: boolean;
  lastOpened?: string;
  duplicateOfId?: string;
  processingError?: string;
  uploadedById?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error' | 'warning';
  content: string;
  timestamp: string;
  citations?: Citation[];
  isStreaming?: boolean;
  reactions?: Record<string, number>;
  relatedQuestions?: string[];
}

export interface Citation {
  documentName: string;
  page?: number;
  text: string;
  confidence?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  subject?: string;
  pinned?: boolean;
  messageCount?: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  subject?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  totalQuestions: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  createdAt: string;
  answers: Record<string, string | number>;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  reviewCount: number;
  nextReview?: string;
}

export interface StudyPlanItem {
  id: string;
  title: string;
  description?: string;
  subject: string;
  startTime: string;
  endTime: string;
  duration: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface StudyPlan {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  items: StudyPlanItem[];
  createdAt: string;
}

export interface AnalyticsData {
  totalStudyHours: number;
  documentsUploaded: number;
  quizzesCompleted: number;
  averageQuizScore: number;
  flashcardsReviewed: number;
  chatMessages: number;
  streakDays: number;
  weeklyProgress: { day: string; hours: number }[];
  subjectPerformance: { subject: string; score: number }[];
  weakSubjects: string[];
  strongSubjects: string[];
}

export interface Subject {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  documentCount?: number;
  createdAt: string;
  lastUsedAt?: string;
}

export interface UploadJob {
  id: string;
  file: File;
  documentId?: string;
  progress: number;
  status: 'queued' | 'uploading' | 'processing' | 'done' | 'failed' | 'cancelled';
  fileName: string;
  size: number;
  error?: string;
  startAt: number;
  subject?: string;
}

export interface SearchResult {
  type: 'document' | 'subject' | 'chat' | 'flashcard' | 'quiz';
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  subject?: string;
  lastOpened?: string;
}

export type NotificationSubtype =
  | 'upload.completed'
  | 'upload.failed'
  | 'quiz.generated'
  | 'flashcards.ready'
  | 'planner.generated'
  | 'ai.ready'
  | 'network.error'
  | 'login.success'
  | 'logout.success';

export type NotificationCategory =
  | 'upload'
  | 'ai'
  | 'quiz'
  | 'flashcards'
  | 'planner'
  | 'system'
  | 'auth';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  subtype?: NotificationSubtype;
  actionUrl?: string;
  entityId?: string;
  category?: NotificationCategory;
}

export interface InternetStatus {
  isOnline: boolean;
}

export interface AIStatus {
  isReady: boolean;
  activeModels: number;
}

export type PageRoute =
  | 'dashboard'
  | 'upload'
  | 'chat'
  | 'quiz'
  | 'flashcards'
  | 'planner'
  | 'history'
  | 'analytics'
  | 'profile'
  | 'settings';
