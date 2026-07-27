import { api } from "./apiClient";

export const authService = {
  async login(email, password) {
    return api.post("/auth/login", { email, password });
  },

  async register(name, email, password) {
    return api.post("/auth/register", { 
      full_name: name, 
      email: email, 
      password: password, 
      confirm_password: password 
    });
  },

  async logout() {
    return api.post("/auth/logout");
  },

  async getCurrentUser() {
    return api.get("/users/me");
  },

  async forgotPassword(email) {
    return api.post("/auth/forgot-password", { email });
  },

  async resetPassword(token, password, confirmPassword) {
    return api.post("/auth/reset-password", {
      token,
      password,
      confirmPassword,
    });
  },
};

export const documentService = {
  async list() {
    return api.get("/documents");
  },

  async upload(file, subject, onProgress) {
    const formData = new FormData();
    formData.append("file", file);
    if (subject) formData.append("subject", subject);
    return api.upload("/documents", formData, onProgress);
  },

  async remove(id) {
    return api.delete(`/documents/${id}`);
  },

  async getById(id) {
    return api.get(`/documents/${id}`);
  },

  async update(id, partial) {
    return api.patch(`/documents/${id}`, partial);
  },

  async rename(id, name) {
    return api.patch(`/documents/${id}`, { name });
  },

  async replace(id, file, onProgress) {
    const formData = new FormData();
    formData.append("file", file);
    return api.upload(`/documents/${id}/replace`, formData, onProgress);
  },

  async download(id) {
    return api.download(`/documents/${id}/download`);
  },

  async favoriteToggle(id) {
    return api.post(`/documents/${id}/favorite`);
  },

  async duplicateDetect(name, size) {
    return api.post("/documents/detect-duplicate", { name, size });
  },
};

export const chatService = {
  async listSessions() {
    return api.get("/chat/sessions");
  },

  async createSession(title, documentIds = [], chatType = "General") {
    return api.post("/chat/sessions", { title, documentIds, chat_type: chatType });
  },

  async getSession(id) {
    return api.get(`/chat/sessions/${id}`);
  },

  async sendMessage(sessionId, message, options = {}) {
    return api.post(`/chat/sessions/${sessionId}/messages`, { message, ...options });
  },

  async deleteSession(id) {
    return api.delete(`/chat/sessions/${id}`);
  },

  streamMessage(sessionId, message, options = {}, onChunk, onDone, onError) {
    api.stream(
      `/chat/sessions/${sessionId}/messages/stream`,
      { message, ...options },
      onChunk,
      onDone,
      onError,
    );
  },

  async renameSession(id, title) {
    return api.patch(`/chat/sessions/${id}`, { title });
  },

  async updateSession(id, data) {
    return api.patch(`/chat/sessions/${id}`, data);
  },

  async pinSession(id, pinned) {
    return api.patch(`/chat/sessions/${id}`, { pinned: pinned ?? true });
  },

  async exportSession(id) {
    return api.download(`/chat/sessions/${id}/export`);
  },

  async continueSession(id) {
    return api.post(`/chat/sessions/${id}/continue`);
  },
};

export const quizService = {
  async list() {
    return api.get("/quizzes");
  },

  async generate(documentIds, options) {
    return api.post("/quizzes/generate", { documentIds, ...options });
  },

  async getById(id) {
    return api.get(`/quizzes/${id}`);
  },

  async submitAttempt(quizId, answers) {
    return api.post(`/quizzes/${quizId}/attempts`, { answers });
  },

  async listAttempts(quizId) {
    return api.get(`/quizzes/${quizId}/attempts`);
  },
};

export const flashcardService = {
  async list() {
    return api.get("/flashcards");
  },

  async generate(documentIds, options) {
    return api.post("/flashcards/generate", { documentIds, ...options });
  },

  async create(card) {
    return api.post("/flashcards", card);
  },

  async update(id, card) {
    return api.put(`/flashcards/${id}`, card);
  },

  async remove(id) {
    return api.delete(`/flashcards/${id}`);
  },

  async review(id, quality) {
    return api.post(`/flashcards/${id}/review`, { quality });
  },
};

export const plannerService = {
  async list() {
    return api.get("/study-plans");
  },

  async generate(options) {
    return api.post("/study-plans/generate", options);
  },

  async create(plan) {
    return api.post("/study-plans", plan);
  },

  async update(id, plan) {
    return api.put(`/study-plans/${id}`, plan);
  },

  async remove(id) {
    return api.delete(`/study-plans/${id}`);
  },
};

export const analyticsService = {
  async getOverview() {
    return api.get("/analytics/overview");
  },
};

export const notificationService = {
  async list() {
    return api.get("/notifications");
  },

  async markRead(id) {
    return api.patch(`/notifications/${id}/read`);
  },

  async markAllRead() {
    return api.post("/notifications/read-all");
  },

  async remove(id) {
    return api.delete(`/notifications/${id}`);
  },

  async clearAll() {
    return api.delete("/notifications");
  },

  async getCountUnread() {
    return api.get("/notifications/unread-count");
  },
};

export const subjectService = {
  async list() {
    return api.get("/subjects");
  },

  async create(data) {
    return api.post("/subjects", data);
  },

  async update(id, data) {
    return api.patch(`/subjects/${id}`, data);
  },

  async remove(id) {
    return api.delete(`/subjects/${id}`);
  },

  async recent() {
    return api.get("/subjects/recent");
  },
};

export const searchService = {
  async global(query, options) {
    return api.get("/search", { params: { query, ...options } });
  },
};

export const notificationCategoryService = {};

export const userService = {
  async updateProfile(data) {
    return api.patch("/users/profile", data);
  },

  async changePassword(currentPassword, newPassword) {
    return api.post("/users/password", { currentPassword, newPassword });
  },
};

export const aiService = {
  async generateMindMap(document_id) {
    return api.post("/ai/generate/mindmap", { document_id });
  },
  async generateNotes(document_id, note_type) {
    return api.post("/ai/generate/notes", { document_id, note_type });
  },
  async generateMockTestQuestion(document_id, language, chat_history) {
    return api.post("/ai/mock-test/question", { document_id, language, chat_history });
  },
  async evaluateMockTestAnswer(document_id, language, user_answer, chat_history) {
    return api.post("/ai/mock-test/evaluate", { document_id, language, user_answer, chat_history });
  },
};
