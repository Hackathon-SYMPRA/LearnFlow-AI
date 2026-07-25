import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCircle,
  Mail,
  Save,
  Camera,
  BookOpen,
  Clock,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/Card";
import { profileSchema } from "@/utils/validation";
import { getInitials, formatDate } from "@/utils/format";
import { toast } from "@/components/ui/Toast";

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const onSubmit = async (_data) => {
    try {
      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
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
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account details and personal information
        </p>
      </div>

      <Card className="overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white border-0 p-0">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur-sm ring-4 ring-white/20 shadow-lg">
                  {user ? getInitials(user.name) : "U"}
                </div>
              )}
              <button
                type="button"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary-600 shadow-lg hover:bg-primary-50 transition-colors"
                aria-label="Change avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold">
                {user?.name ?? "User Name"}
              </h2>
              <p className="mt-1 text-sm text-white/80">
                {user?.email ?? "user@example.com"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : "Student"}
                </span>
                {user?.createdAt && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur-sm">
                    <Clock className="h-3 w-3" />
                    Member since {formatDate(user.createdAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 backdrop-blur-sm">
                <p className="text-xs text-white/70">Study Hours</p>
                <p className="mt-1 text-xl font-bold">128.5h</p>
              </div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 backdrop-blur-sm">
                <p className="text-xs text-white/70">Documents</p>
                <p className="mt-1 text-xl font-bold">24</p>
              </div>
              <div className="rounded-xl bg-white/15 border border-white/20 p-3 backdrop-blur-sm">
                <p className="text-xs text-white/70">Quizzes</p>
                <p className="mt-1 text-xl font-bold">12</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title="Current Streak"
          value="12 days"
          description="keep it going!"
          icon={<Trophy className="h-6 w-6" />}
          color="warning"
        />

        <StatCard
          title="Avg. Quiz Score"
          value="84%"
          description="across 12 quizzes"
          icon={<BookOpen className="h-6 w-6" />}
          color="accent"
        />

        <StatCard
          title="Documents Studied"
          value={24}
          description="total processed"
          icon={<BookOpen className="h-6 w-6" />}
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                id="name"
                leftIcon={<UserCircle className="h-4 w-4" />}
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Email Address"
                id="email"
                type="email"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Save Changes
                </Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Preferences</CardTitle>
            <CardDescription>
              Personalize your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Default Subject
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    New documents will be tagged with this
                  </p>
                </div>
                <select className="input-base w-40 h-9 text-xs">
                  <option>None</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                </select>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Daily Study Goal
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Target hours of study per day
                  </p>
                </div>
                <select className="input-base w-32 h-9 text-xs">
                  <option>2 hours</option>
                  <option selected>4 hours</option>
                  <option>6 hours</option>
                  <option>8 hours</option>
                </select>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Notifications
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Email and app notifications
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600" />
                </label>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
