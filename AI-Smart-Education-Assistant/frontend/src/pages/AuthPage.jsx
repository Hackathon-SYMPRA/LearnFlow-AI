import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  UserCircle,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Layers,
  UploadCloud,
  CheckCircle2,
  WifiOff,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, registerSchema } from "@/utils/validation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Form";
import { toast } from "@/components/ui/Toast";
import { ROUTES } from "@/constants";
import { cn } from "@/utils/format";

const DEMO_EMAIL = "demo@edumind.ai";
const DEMO_PASSWORD = "DemoPass123";

const features = [
  {
    icon: UploadCloud,
    title: "Upload Materials",
    desc: "PDFs, notes, docs, images",
  },
  {
    icon: BrainCircuit,
    title: "AI Tutor",
    desc: "Answers grounded in your sources",
  },
  {
    icon: Layers,
    title: "Flashcards & Quizzes",
    desc: "Active recall, spaced repetition",
  },
  { icon: BookOpen, title: "Smart Planner", desc: "AI-built study schedules" },
];

const SSOButton = ({ provider, icon }) => {
  return (
    <div className="relative group">
      <Button
        type="button"
        variant="outline"
        fullWidth
        disabled
        className="opacity-75 cursor-not-allowed"
        leftIcon={icon}
      >
        Continue with {provider}
      </Button>
      <span className="absolute -top-2 -right-2 inline-flex items-center rounded-full bg-secondary-100 dark:bg-secondary-900/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-700 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800 shadow-sm">
        Coming soon
      </span>
    </div>
  );
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.24 1.4-1.68 4.1-5.5 4.1-3.3 0-6-2.75-6-6.2s2.7-6.2 6-6.2c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.88 3.2 14.64 2.2 12 2.2 6.48 2.2 2 6.69 2 12.2s4.48 10 10 10c5.78 0 9.6-4.06 9.6-9.78 0-.66-.07-1.16-.16-1.66L12 10.2z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.36-3.37-1.36-.46-1.19-1.11-1.51-1.11-1.51-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.29.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85.01 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.44.1 2.7.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
  </svg>
);

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const [mode, setMode] = useState("login");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirmPw, setShowRegConfirmPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(ROUTES.dashboard, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const fillDemo = () => {
    if (mode === "login") {
      loginForm.setValue("email", DEMO_EMAIL, {
        shouldValidate: true,
        shouldDirty: true,
      });
      loginForm.setValue("password", DEMO_PASSWORD, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.info("Demo credentials filled", {
        description: "Click Sign In to explore.",
      });
    } else {
      registerForm.setValue("name", "Demo Student", {
        shouldValidate: true,
        shouldDirty: true,
      });
      registerForm.setValue("email", DEMO_EMAIL, {
        shouldValidate: true,
        shouldDirty: true,
      });
      registerForm.setValue("password", DEMO_PASSWORD, {
        shouldValidate: true,
        shouldDirty: true,
      });
      registerForm.setValue("confirmPassword", DEMO_PASSWORD, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.info("Demo credentials filled", {
        description: "Click Create Account to explore.",
      });
    }
  };

  const onLogin = async (data) => {
    setNetworkError(null);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!", {
        description: "You have signed in successfully.",
      });
      const redirect = location.state?.from?.pathname ?? ROUTES.dashboard;
      navigate(redirect, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      const isNetwork =
        error instanceof TypeError ||
        (error instanceof Error &&
          (error.message.toLowerCase().includes("network") ||
            error.message.toLowerCase().includes("fetch") ||
            error.message.toLowerCase().includes("timeout")));
      if (isNetwork) {
        setNetworkError(
          "We couldn\u2019t reach our servers. Please check your internet connection and try again.",
        );
      }
      toast.error(message, {
        description: isNetwork
          ? "Check your connection and try again."
          : "Please check your credentials and try again.",
      });
    }
  };

  const onRegister = async (data) => {
    setNetworkError(null);
    try {
      await register(data.name, data.email, data.password);
      toast.success("Account created!", {
        description: "Welcome to EduMind AI.",
      });
      navigate(ROUTES.dashboard, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      const isNetwork =
        error instanceof TypeError ||
        (error instanceof Error &&
          (error.message.toLowerCase().includes("network") ||
            error.message.toLowerCase().includes("fetch") ||
            error.message.toLowerCase().includes("timeout")));
      if (isNetwork) {
        setNetworkError(
          "We couldn\u2019t reach our servers. Please check your internet connection and try again.",
        );
      }
      toast.error(message, {
        description: isNetwork
          ? "Check your connection and try again."
          : "Please try a different email.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white p-12 flex-col">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xl font-bold">EduMind AI</p>
            <p className="text-xs text-white/80">Smart Education Assistant</p>
          </div>
        </div>

        <div className="mt-auto space-y-8 max-w-lg">
          <h1 className="text-4xl font-bold leading-tight text-balance">
            Learn smarter with AI that reads alongside you
          </h1>
          <p className="text-lg text-white/80">
            Upload any study material, ask questions, generate quizzes,
            flashcards, and personalized study plans — all grounded in your
            content.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 mb-3">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="font-semibold">{f.title}</p>
                <p className="text-xs text-white/70 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-sm text-white/70">
          © {new Date().getFullYear()} EduMind AI · Built for curious learners.
        </p>

        <div
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary-500/30 blur-3xl"
          aria-hidden="true"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                EduMind AI
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart Education Assistant
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {mode === "login"
                ? "Sign in to continue your learning journey"
                : "Start studying smarter in less than a minute"}
            </p>
          </div>

          {networkError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl border border-danger-200 dark:border-danger-900 bg-danger-50 dark:bg-danger-950/40 p-4 flex items-start gap-3"
              role="alert"
            >
              <WifiOff
                className="h-5 w-5 text-danger-600 dark:text-danger-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="text-sm">
                <p className="font-medium text-danger-800 dark:text-danger-200">
                  Connection error
                </p>
                <p className="mt-0.5 text-danger-700 dark:text-danger-300">
                  {networkError}
                </p>
              </div>
            </motion.div>
          )}

          <div className="card p-6 sm:p-8">
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-slate-100 dark:bg-slate-800 mb-6">
              {[
                { key: "login", label: "Sign In", icon: LogIn },
                { key: "register", label: "Sign Up", icon: UserPlus },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setMode(t.key);
                    setNetworkError(null);
                  }}
                  aria-pressed={mode === t.key}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                    mode === t.key
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                  )}
                >
                  <t.icon className="h-4 w-4" aria-hidden="true" />
                  {t.label}
                </button>
              ))}
            </div>

            {mode === "login" ? (
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
                noValidate
              >
                <Input
                  label="Email"
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register("email")}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    id="login-password"
                    type={showLoginPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
                    rightIcon={
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowLoginPw((s) => !s)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                        aria-label={
                          showLoginPw ? "Hide password" : "Show password"
                        }
                      >
                        {showLoginPw ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    }
                    error={loginForm.formState.errors.password?.message}
                    {...loginForm.register("password")}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline underline-offset-2"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loginForm.formState.isSubmitting || isLoading}
                  rightIcon={
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  }
                >
                  {loginForm.formState.isSubmitting || isLoading
                    ? "Signing in..."
                    : "Sign In"}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="space-y-4"
                noValidate
              >
                <Input
                  label="Full Name"
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Student"
                  leftIcon={
                    <UserCircle className="h-4 w-4" aria-hidden="true" />
                  }
                  error={registerForm.formState.errors.name?.message}
                  {...registerForm.register("name")}
                />

                <Input
                  label="Email"
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
                  error={registerForm.formState.errors.email?.message}
                  {...registerForm.register("email")}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    id="register-password"
                    type={showRegPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="8+ characters, mix of cases and numbers"
                    leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
                    rightIcon={
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowRegPw((s) => !s)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                        aria-label={
                          showRegPw ? "Hide password" : "Show password"
                        }
                      >
                        {showRegPw ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    }
                    error={registerForm.formState.errors.password?.message}
                    {...registerForm.register("password")}
                  />
                </div>
                <div className="relative">
                  <Input
                    label="Confirm Password"
                    id="register-confirm"
                    type={showRegConfirmPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
                    rightIcon={
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowRegConfirmPw((s) => !s)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                        aria-label={
                          showRegConfirmPw ? "Hide password" : "Show password"
                        }
                      >
                        {showRegConfirmPw ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    }
                    error={
                      registerForm.formState.errors.confirmPassword?.message
                    }
                    {...registerForm.register("confirmPassword")}
                  />
                </div>
                <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />

                  <span>
                    I agree to the{" "}
                    <a
                      href="#terms"
                      className="text-primary-600 hover:underline dark:text-primary-400"
                    >
                      Terms
                    </a>{" "}
                    and{" "}
                    <a
                      href="#privacy"
                      className="text-primary-600 hover:underline dark:text-primary-400"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!agreeTerms}
                  loading={registerForm.formState.isSubmitting || isLoading}
                  rightIcon={
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  }
                >
                  {registerForm.formState.isSubmitting || isLoading
                    ? "Creating account..."
                    : "Create Account"}
                </Button>
              </form>
            )}

            <div className="mt-6 flex items-center gap-3 before:flex-1 before:h-px before:bg-slate-200 before:dark:bg-slate-800 after:flex-1 after:h-px after:bg-slate-200 after:dark:bg-slate-800">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Or continue with
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SSOButton provider="Google" icon={<GoogleIcon />} />
              <SSOButton provider="GitHub" icon={<GitHubIcon />} />
            </div>

            <div className="mt-6 flex items-center gap-3 before:flex-1 before:h-px before:bg-slate-200 before:dark:bg-slate-800 after:flex-1 after:h-px after:bg-slate-200 after:dark:bg-slate-800">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Demo credentials
              </span>
            </div>
            <motion.div
              initial={false}
              className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 sm:p-4 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2
                      className="h-3.5 w-3.5 text-accent-600 dark:text-accent-400"
                      aria-hidden="true"
                    />
                    <span className="font-medium">Email:</span> {DEMO_EMAIL}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2
                      className="h-3.5 w-3.5 text-accent-600 dark:text-accent-400"
                      aria-hidden="true"
                    />
                    <span className="font-medium">Password:</span>{" "}
                    {DEMO_PASSWORD}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={fillDemo}
                  className="shrink-0"
                >
                  Fill
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                Explore the app instantly with pre-populated demo data.
              </p>
            </motion.div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setNetworkError(null);
              }}
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
