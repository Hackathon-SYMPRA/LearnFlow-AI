import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { AuthShell } from '@/components/ui/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form';
import { toast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { resetPasswordSchema, type ResetPasswordInput } from '@/utils/validation';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (_data: ResetPasswordInput) => {
    try {
      // In production: call authService.resetPassword(token, data.newPassword)
      setSuccess(true);
      toast.success('Password updated', {
        description: 'Your password has been reset. You can now sign in.',
      });
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch {
      toast.error('Reset failed', {
        description:
          'This link may be expired or invalid. Please request a new password reset link.',
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 sm:p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning-50 dark:bg-warning-950/50 mb-5">
              <AlertTriangle
                className="h-8 w-8 text-warning-600 dark:text-warning-400"
                aria-hidden="true"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Invalid reset link
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Your password reset link appears to be missing or malformed. Please request a new
              reset link from the forgot password page.
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/forgot-password')}
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Request new link
              </Button>
              <Link
                to="/login"
                className="block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Back to Login
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (success) {
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
            Password reset complete
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Redirecting you to the login page...
          </p>
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
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/50">
            <KeyRound
              className="h-5 w-5 text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Create new password
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Must be different from your previous password.
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Input
              label="New password"
              id="reset-new"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="8+ characters, mix of cases and numbers"
              leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((s) => !s)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              }
              error={form.formState.errors.newPassword?.message}
              {...form.register('newPassword')}
            />
          </div>

          <div className="relative">
            <Input
              label="Confirm new password"
              id="reset-confirm"
              type={showConfirmPw ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPw((s) => !s)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPw ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              }
              error={form.formState.errors.confirmPassword?.message}
              {...form.register('confirmPassword')}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={form.formState.isSubmitting}
            rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            {form.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </AuthShell>
  );
};

export default ResetPasswordPage;
