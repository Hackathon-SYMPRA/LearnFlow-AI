import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute, GuestRoute } from "@/components/router/ProtectedRoute";
import { PageLoader } from "@/components/ui/Spinner";
import { useTheme } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const UploadPage = lazy(() =>
  import("@/pages/UploadPage").then((m) => ({ default: m.UploadPage })),
);
const ChatPage = lazy(() =>
  import("@/pages/ChatPage").then((m) => ({ default: m.ChatPage })),
);
const NotesPage = lazy(() =>
  import("@/pages/NotesPage").then((m) => ({ default: m.NotesPage })),
);
const MindMapPage = lazy(() =>
  import("@/pages/MindMapPage").then((m) => ({ default: m.MindMapPage })),
);
const AITeacherPage = lazy(() =>
  import("@/pages/AITeacherPage").then((m) => ({ default: m.AITeacherPage })),
);
const QuizPage = lazy(() =>
  import("@/pages/QuizPage").then((m) => ({ default: m.QuizPage })),
);
const FlashcardsPage = lazy(() =>
  import("@/pages/FlashcardsPage").then((m) => ({ default: m.FlashcardsPage })),
);
const PlannerPage = lazy(() =>
  import("@/pages/PlannerPage").then((m) => ({ default: m.PlannerPage })),
);
const HistoryPage = lazy(() =>
  import("@/pages/HistoryPage").then((m) => ({ default: m.HistoryPage })),
);
const AnalyticsPage = lazy(() =>
  import("@/pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })),
);
const ProfilePage = lazy(() =>
  import("@/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const AuthPage = lazy(() =>
  import("@/pages/AuthPage").then((m) => ({ default: m.AuthPage })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const LibraryPage = lazy(() =>
  import("@/pages/LibraryPage").then((m) => ({ default: m.LibraryPage })),
);
const SubjectsPage = lazy(() =>
  import("@/pages/SubjectsPage").then((m) => ({ default: m.SubjectsPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import("@/pages/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  })),
);
const SessionExpiredPage = lazy(() =>
  import("@/pages/SessionExpiredPage").then((m) => ({
    default: m.SessionExpiredPage,
  })),
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader label="Loading..." />}>
    <Component />
  </Suspense>
);

export const AppRouter = () => {
  const { theme } = useTheme();

  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <Suspense fallback={<PageLoader label="Loading..." />}>
                  <AuthPage />
                </Suspense>
              </GuestRoute>
            }
          />

          <Route
            path="/register"
            element={
              <GuestRoute>
                <Suspense fallback={<PageLoader label="Loading..." />}>
                  <AuthPage />
                </Suspense>
              </GuestRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <GuestRoute>{withSuspense(ForgotPasswordPage)}</GuestRoute>
            }
          />

          <Route
            path="/reset-password"
            element={<GuestRoute>{withSuspense(ResetPasswordPage)}</GuestRoute>}
          />

          <Route
            path="/session-expired"
            element={withSuspense(SessionExpiredPage)}
          />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={withSuspense(DashboardPage)} />
            <Route path="/upload" element={withSuspense(UploadPage)} />
            <Route path="/chat" element={withSuspense(ChatPage)} />
            <Route path="/chat/:sessionId" element={withSuspense(ChatPage)} />
            <Route path="/notes" element={withSuspense(NotesPage)} />
            <Route path="/mindmap" element={withSuspense(MindMapPage)} />
            <Route path="/ai-teacher" element={withSuspense(AITeacherPage)} />
            <Route path="/quiz" element={withSuspense(QuizPage)} />
            <Route path="/flashcards" element={withSuspense(FlashcardsPage)} />
            <Route path="/planner" element={withSuspense(PlannerPage)} />
            <Route path="/history" element={withSuspense(HistoryPage)} />
            <Route path="/analytics" element={withSuspense(AnalyticsPage)} />
            <Route path="/profile" element={withSuspense(ProfilePage)} />
            <Route path="/settings" element={withSuspense(SettingsPage)} />
            <Route path="/library" element={withSuspense(LibraryPage)} />
            <Route path="/subjects" element={withSuspense(SubjectsPage)} />
          </Route>

          <Route path="*" element={withSuspense(NotFoundPage)} />
        </Routes>
      </ErrorBoundary>

      <Toaster
        position="top-right"
        theme={theme === "dark" ? "dark" : "light"}
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
          },
          classNames: {
            toast: "group",
          },
        }}
      />
    </>
  );
};
