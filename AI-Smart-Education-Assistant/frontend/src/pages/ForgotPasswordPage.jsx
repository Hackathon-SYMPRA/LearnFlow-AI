import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/ui/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Form";
import { toast } from "@/components/ui/Toast";
import { forgotPasswordSchema } from "@/utils/validation";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    try {
      const email = data.email.trim();
      setSubmittedEmail(email);
      setSubmitted(true);
      toast.success("Reset link sent", {
        description: `If ${email} exists, you will receive a reset link shortly.`,
      });
    } catch {
      toast.error("Unable to send reset link", {
        description: "Please try again in a moment.",
      });
      // In production, do not reveal whether the email exists
      setSubmittedEmail(data.email.trim());
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <AuthShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="text-center py-4"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 dark:bg-accent-950/50 mb-5">
            <CheckCircle2
              className="h-8 w-8 text-accent-600 dark:text-accent-400"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Check your inbox
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            If an account exists for{" "}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {submittedEmail}
            </span>
            , we&apos;ve emailed a password reset link. The link expires in 30
            minutes.
          </p>
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate("/login")}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Login
            </Button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}
                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 underline underline-offset-2"
              >
                try a different email
              </button>
              .
            </p>
          </div>
        </motion.div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter the email associated with your account and we&apos;ll send you
            a link to reset your password.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email address"
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={form.formState.isSubmitting}
            rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            {form.formState.isSubmitting
              ? "Sending link..."
              : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 space-y-3 text-center text-sm">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Login
          </Link>
          <p className="text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
