import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const uploadDocumentSchema = z.object({
  subject: z.string().optional(),
  files: z
    .custom()
    .refine(
      (files) => files && files.length > 0,
      "Please select at least one file",
    ),
});

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message is too long"),
});

export const generateQuizSchema = z
  .object({
    documentIds: z
      .array(z.string())
      .min(1, "Please select at least one document"),
    subject: z.string().optional(),
    topic: z
      .string()
      .max(200, "Topic is too long")
      .optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    questionCount: z
      .number()
      .min(1, "At least 1 question")
      .max(50, "Maximum 50 questions"),
    questionTypes: z
      .array(z.enum(["mcq", "true-false", "fill-blanks", "short-answer"]))
      .min(1, "Please select at least one question type"),
    examMode: z.boolean().default(false),
    examDuration: z.number().optional(),
    autoSubmit: z.boolean().default(true),
  })
  .refine((data) => !data.examMode || (data.examMode && data.examDuration), {
    message: "Exam duration is required when exam mode is enabled",
    path: ["examDuration"],
  });

export const generateFlashcardsSchema = z.object({
  documentIds: z
    .array(z.string())
    .min(1, "Please select at least one document"),
  subject: z.string().optional(),
  count: z
    .number()
    .min(1, "At least 1 flashcard")
    .max(200, "Maximum 200 flashcards")
    .optional(),
});

export const studyPlanSchema = z
  .object({
    examDate: z.string().min(1, "Exam date is required"),
    dailyHours: z
      .number()
      .min(1, "At least 1 hour per day")
      .max(12, "Maximum 12 hours per day"),
    subjects: z.array(z.string()).min(1, "Please select at least one subject"),
    subjectPriorities: z
      .record(z.string(), z.number().min(1).max(10))
      .optional(),
    weakSubjects: z.array(z.string()).optional(),
    additionalGoals: z.string().max(1000, "Goals are too long").optional(),
  })
  .refine(
    (data) => {
      if (!data.weakSubjects) return true;
      return data.weakSubjects.every((ws) => data.subjects.includes(ws));
    },
    {
      message: "Weak subjects must be a subset of selected subjects",
      path: ["weakSubjects"],
    },
  );

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;

export const subjectSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),
  color: z.string().regex(hexColorRegex, "Invalid hex color").optional(),
  icon: z.string().optional(),
  documents: z.array(z.string()).optional(),
});

export const renameChatSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
});

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(200, "Search query is too long"),
  types: z
    .array(z.enum(["document", "subject", "chat", "flashcard", "quiz"]))
    .optional(),
  subjects: z.array(z.string()).optional(),
});
