import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  Moon,
  Bell,
  Globe,
  Database,
  Volume2,
  Mic,
  Palette,
  Eye,
  KeyRound,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { changePasswordSchema } from "@/utils/validation";
import { toast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Form";
import { SUBJECTS } from "@/constants";
import { cn } from "@/utils/format";

const SettingSection = ({ icon: Icon, title, description, children }) => (
  <Card>
    <CardHeader>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const ToggleRow = ({ title, description, defaultChecked = true, onChange }) => {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <li className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {title}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            onChange?.(e.target.checked);
          }}
          className="sr-only peer"
        />

        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600" />
      </label>
    </li>
  );
};

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  void useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await userService.changePassword(data.currentPassword, data.newPassword);
      toast.success("Password changed successfully");
      reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to change password";
      toast.error(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure preferences, customize the app, and manage your account
        </p>
      </div>

      <SettingSection
        icon={Palette}
        title="Appearance"
        description="Customize how EduMind looks and feels for you"
      >
        <ul className="space-y-3">
          <li className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Theme
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Switch between light and dark mode
                </p>
              </div>
            </div>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
              {["light", "dark"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                    theme === t
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </li>
          <ToggleRow
            title="Compact Mode"
            description="Reduce spacing and increase information density"
            defaultChecked={false}
          />
          <ToggleRow
            title="Reduce Animations"
            description="Minimize motion effects for accessibility"
            defaultChecked={false}
          />
        </ul>
      </SettingSection>

      <SettingSection
        icon={Bell}
        title="Notifications"
        description="Choose what updates you want to receive"
      >
        <ul className="space-y-3">
          <ToggleRow
            title="Study Reminders"
            description="Get reminders for your scheduled study sessions"
            defaultChecked
          />
          <ToggleRow
            title="AI Suggestions"
            description="Weekly personalized study recommendations"
            defaultChecked
          />
          <ToggleRow
            title="Quiz Results"
            description="Notify when a new quiz has been graded"
            defaultChecked
          />
          <ToggleRow
            title="Flashcard Reviews"
            description="Daily reminder to review due flashcards"
            defaultChecked
          />
          <ToggleRow
            title="Marketing"
            description="Occasional product updates and news"
            defaultChecked={false}
          />
        </ul>
      </SettingSection>

      <SettingSection
        icon={Mic}
        title="Voice & Audio"
        description="Settings for voice interaction and audio feedback"
      >
        <ul className="space-y-3">
          <ToggleRow
            title="Voice Input"
            description="Enable microphone for voice questions"
            defaultChecked
          />
          <ToggleRow
            title="AI Voice Responses"
            description="Have responses read aloud"
            defaultChecked={false}
          />
          <li className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Voice Speed
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Playback speed for AI responses
                </p>
              </div>
            </div>
            <select className="input-base w-32 h-9 text-xs">
              <option>Slow</option>
              <option selected>Normal</option>
              <option>Fast</option>
            </select>
          </li>
        </ul>
      </SettingSection>

      <SettingSection
        icon={Eye}
        title="AI Behavior"
        description="Customize how the AI assistant responds"
      >
        <ul className="space-y-3">
          <li className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Response Detail Level
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                How comprehensive answers should be
              </p>
            </div>
            <select className="input-base w-40 h-9 text-xs">
              <option>Concise</option>
              <option selected>Balanced</option>
              <option>Detailed</option>
            </select>
          </li>
          <ToggleRow
            title="Always Include Citations"
            description="Show source references for every answer"
            defaultChecked
          />
          <ToggleRow
            title="Use Simplified Language"
            description="Prefer simpler explanations when possible"
            defaultChecked={false}
          />
          <ToggleRow
            title="Adaptive Difficulty"
            description="Match responses to your understanding level"
            defaultChecked
          />
        </ul>
      </SettingSection>

      <SettingSection
        icon={Globe}
        title="Regional Preferences"
        description="Language and region settings"
      >
        <ul className="space-y-3">

          <li className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Preferred Subjects
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Shown first throughout the app
              </p>
            </div>
            <select
              className="input-base w-44 h-9 text-xs"
              multiple
              size={4}
              defaultValue={SUBJECTS.slice(0, 3)}
            >
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </li>
        </ul>
      </SettingSection>

      <SettingSection
        icon={KeyRound}
        title="Security"
        description="Protect your account and data"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
            <Input
              label="Current Password"
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.currentPassword?.message}
              {...register("currentPassword")}
            />

            <Input
              label="New Password"
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              helperText="Use 8+ chars with uppercase, lowercase and numbers"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />

            <Input
              label="Confirm New Password"
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Retype your new password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Update Password
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <ul className="space-y-3">
            <ToggleRow
              title="Two-Factor Authentication"
              description="Add an extra layer of security"
              defaultChecked={false}
            />
            <ToggleRow
              title="Active Session Logs"
              description="Stay notified of new logins"
              defaultChecked
            />
          </ul>
        </div>
      </SettingSection>

      <SettingSection
        icon={Database}
        title="Data & Storage"
        description="Manage your stored data and preferences"
      >
        <ul className="space-y-3">
          <li className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Storage Used
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                124.5 MB of 2 GB (6.2%)
              </p>
            </div>
            <div className="w-40">
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full w-[6%] rounded-full bg-primary-600" />
              </div>
            </div>
          </li>
          <li className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Export Your Data
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Download all your stored data as JSON
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </li>
          <li className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-danger-200 dark:border-danger-900 bg-danger-50/40 dark:bg-danger-950/20 p-4">
            <div>
              <p className="text-sm font-medium text-danger-700 dark:text-danger-400">
                Delete My Account
              </p>
              <p className="mt-0.5 text-xs text-danger-600/80 dark:text-danger-400/80">
                Permanently delete your account, data, and uploaded documents.
                This cannot be undone.
              </p>
            </div>
            <Button variant="danger" size="sm">
              Delete Account
            </Button>
          </li>
        </ul>
      </SettingSection>
    </motion.div>
  );
};
