import type {
  User,
  Document,
  ChatSession,
  ChatMessage,
  Quiz,
  QuizAttempt,
  Flashcard,
  StudyPlan,
  AnalyticsData,
  Notification,
  Subject,
  SearchResult,
} from '@/types';
import { api } from './apiClient';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return api.post('/auth/login', { email, password });
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    return api.post('/auth/register', { name, email, password });
  },

  async logout(): Promise<void> {
    return api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    return api.get('/auth/me');
  },

  async forgotPassword(email: string): Promise<void> {
    return api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string, confirmPassword: string): Promise<void> {
    return api.post('/auth/reset-password', { token, password, confirmPassword });
  },
};

export const documentService = {
  async list(): Promise<Document[]> {
    return api.get('/documents');
  },

  async upload(file: File, subject?: string, onProgress?: (progress: number) => void): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    if (subject) formData.append('subject', subject);
    return api.upload('/documents', formData, onProgress);
  },

  async remove(id: string): Promise<void> {
    return api.delete(`/documents/${id}`);
  },

  async getById(id: string): Promise<Document> {
    return api.get(`/documents/${id}`);
  },

  async update(id: string, partial: Partial<Document>): Promise<Document> {
    return api.patch(`/documents/${id}`, partial);
  },

  async rename(id: string, name: string): Promise<Document> {
    return api.patch(`/documents/${id}`, { name });
  },

  async replace(id: string, file: File, onProgress?: (progress: number) => void): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload(`/documents/${id}/replace`, formData, onProgress);
  },

  async download(id: string): Promise<Blob> {
    return api.download(`/documents/${id}/download`);
  },

  async favoriteToggle(id: string): Promise<Document> {
    return api.post(`/documents/${id}/favorite`);
  },

  async duplicateDetect(name: string, size: number): Promise<{ isDuplicate: boolean; documentId?: string }> {
    return api.post('/documents/detect-duplicate', { name, size });
  },
};

export const chatService = {
  async listSessions(): Promise<ChatSession[]> {
    return api.get('/chat/sessions');
  },

  async createSession(title?: string, documentIds?: string[]): Promise<ChatSession> {
    return api.post('/chat/sessions', { title, documentIds });
  },

  async getSession(id: string): Promise<ChatSession> {
    return api.get(`/chat/sessions/${id}`);
  },

  async sendMessage(
    sessionId: string,
    message: string
  ): Promise<ChatMessage> {
    return api.post(`/chat/sessions/${sessionId}/messages`, { message });
  },

  async deleteSession(id: string): Promise<void> {
    return api.delete(`/chat/sessions/${id}`);
  },

  streamMessage(
    sessionId: string,
    message: string,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (error: Error) => void
  ): void {
    api.stream(
      `/chat/sessions/${sessionId}/messages/stream`,
      { message },
      onChunk,
      onDone,
      onError
    );
  },

  async renameSession(id: string, title: string): Promise<ChatSession> {
    return api.patch(`/chat/sessions/${id}`, { title });
  },

  async pinSession(id: string, pinned?: boolean): Promise<ChatSession> {
    return api.patch(`/chat/sessions/${id}`, { pinned: pinned ?? true });
  },

  async exportSession(id: string): Promise<Blob> {
    return api.download(`/chat/sessions/${id}/export`);
  },

  async continueSession(id: string): Promise<ChatSession> {
    return api.post(`/chat/sessions/${id}/continue`);
  },
};

export const quizService = {
  async list(): Promise<Quiz[]> {
    return api.get('/quizzes');
  },

  async generate(documentIds: string[], options?: { subject?: string; count?: number; difficulty?: 'easy' | 'medium' | 'hard' }): Promise<Quiz> {
    return api.post('/quizzes/generate', { documentIds, ...options });
  },

  async getById(id: string): Promise<Quiz> {
    return api.get(`/quizzes/${id}`);
  },

  async submitAttempt(quizId: string, answers: Record<string, string | number>): Promise<QuizAttempt> {
    return api.post(`/quizzes/${quizId}/attempts`, { answers });
  },

  async listAttempts(quizId: string): Promise<QuizAttempt[]> {
    return api.get(`/quizzes/${quizId}/attempts`);
  },
};

export const flashcardService = {
  async list(): Promise<Flashcard[]> {
    return api.get('/flashcards');
  },

  async generate(documentIds: string[], options?: { subject?: string; count?: number }): Promise<Flashcard[]> {
    return api.post('/flashcards/generate', { documentIds, ...options });
  },

  async create(card: Omit<Flashcard, 'id' | 'reviewCount' | 'createdAt'>): Promise<Flashcard> {
    return api.post('/flashcards', card);
  },

  async update(id: string, card: Partial<Flashcard>): Promise<Flashcard> {
    return api.put(`/flashcards/${id}`, card);
  },

  async remove(id: string): Promise<void> {
    return api.delete(`/flashcards/${id}`);
  },

  async review(id: string, quality: number): Promise<Flashcard> {
    return api.post(`/flashcards/${id}/review`, { quality });
  },
};

export const plannerService = {
  async list(): Promise<StudyPlan[]> {
    return api.get('/planner');
  },

  async generate(options?: { durationDays?: number; subjects?: string[]; goals?: string[] }): Promise<StudyPlan> {
    return api.post('/planner/generate', options);
  },

  async create(plan: Omit<StudyPlan, 'id' | 'createdAt'>): Promise<StudyPlan> {
    return api.post('/planner', plan);
  },

  async update(id: string, plan: Partial<StudyPlan>): Promise<StudyPlan> {
    return api.put(`/planner/${id}`, plan);
  },

  async remove(id: string): Promise<void> {
    return api.delete(`/planner/${id}`);
  },
};

export const analyticsService = {
  async getOverview(): Promise<AnalyticsData> {
    return api.get('/analytics/overview');
  },
};

export const notificationService = {
  async list(): Promise<Notification[]> {
    return api.get('/notifications');
  },

  async markRead(id: string): Promise<void> {
    return api.patch(`/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    return api.post('/notifications/read-all');
  },

  async remove(id: string): Promise<void> {
    return api.delete(`/notifications/${id}`);
  },

  async clearAll(): Promise<void> {
    return api.delete('/notifications');
  },

  async getCountUnread(): Promise<{ count: number }> {
    return api.get('/notifications/unread-count');
  },
};

export const subjectService = {
  async list(): Promise<Subject[]> {
    return api.get('/subjects');
  },

  async create(data: Omit<Subject, 'id' | 'createdAt' | 'documentCount'>): Promise<Subject> {
    return api.post('/subjects', data);
  },

  async update(id: string, data: Partial<Subject>): Promise<Subject> {
    return api.patch(`/subjects/${id}`, data);
  },

  async remove(id: string): Promise<void> {
    return api.delete(`/subjects/${id}`);
  },

  async recent(): Promise<Subject[]> {
    return api.get('/subjects/recent');
  },
};

export const searchService = {
  async global(query: string, options?: { types?: string[]; subjects?: string[] }): Promise<SearchResult[]> {
    return api.get('/search', { query, ...options });
  },
};

export const notificationCategoryService = {};

export const userService = {
  async updateProfile(data: Partial<User> & { course?: string; semester?: string; college?: string; language?: string }): Promise<User> {
    return api.patch('/users/profile', data);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return api.post('/users/password', { currentPassword, newPassword });
  },
};

export type AuthService = typeof authService;
