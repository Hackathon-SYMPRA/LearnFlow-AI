import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
} from "@/components/ui/Card";
import {
  Clock,
  FileText,
  Trophy,
  Activity,
  TrendingUp,
  Target,
  Layers,
  MessageSquare,
  Calendar,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";

const weeklyStudy = [
  { day: "Mon", hours: 2.5, quizzes: 1 },
  { day: "Tue", hours: 3.2, quizzes: 2 },
  { day: "Wed", hours: 1.8, quizzes: 0 },
  { day: "Thu", hours: 4.1, quizzes: 3 },
  { day: "Fri", hours: 3.5, quizzes: 1 },
  { day: "Sat", hours: 2.0, quizzes: 2 },
  { day: "Sun", hours: 1.2, quizzes: 0 },
];

const subjectScores = [
  { subject: "Math", score: 92, color: "#3b82f6" },
  { subject: "Physics", score: 85, color: "#a855f7" },
  { subject: "Chemistry", score: 78, color: "#22c55e" },
  { subject: "Biology", score: 70, color: "#f97316" },
  { subject: "CS", score: 95, color: "#6366f1" },
  { subject: "English", score: 82, color: "#ef4444" },
];

const quizHistory = [
  { week: "W1", score: 72 },
  { week: "W2", score: 75 },
  { week: "W3", score: 70 },
  { week: "W4", score: 78 },
  { week: "W5", score: 82 },
  { week: "W6", score: 85 },
  { week: "W7", score: 83 },
  { week: "W8", score: 88 },
];

const distributionData = [
  { name: "Chats", value: 147, color: "#3b82f6" },
  { name: "Quizzes", value: 12, color: "#a855f7" },
  { name: "Flashcards", value: 180, color: "#22c55e" },
  { name: "Documents", value: 24, color: "#f97316" },
];

export const AnalyticsPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your learning progress, performance, and growth over time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
            {["Week", "Month", "Year"].map((f, i) => (
              <button
                key={f}
                className={
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all " +
                  (i === 0
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100")
                }
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline" leftIcon={<Calendar className="h-4 w-4" />}>
            Custom Range
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Study Hours"
          value="128.5h"
          description="lifetime learning"
          trend={{ value: 12, isPositive: true }}
          icon={<Clock className="h-6 w-6" />}
          color="primary"
        />

        <StatCard
          title="Documents Processed"
          value={24}
          description="across 6 subjects"
          trend={{ value: 8, isPositive: true }}
          icon={<FileText className="h-6 w-6" />}
          color="secondary"
        />

        <StatCard
          title="Quizzes Completed"
          value={12}
          description="avg. score 84%"
          trend={{ value: 5, isPositive: true }}
          icon={<Trophy className="h-6 w-6" />}
          color="accent"
        />

        <StatCard
          title="Current Streak"
          value="12 days"
          description="keep it up!"
          trend={{ value: 2, isPositive: true }}
          icon={<Target className="h-6 w-6" />}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Study Time Trend</CardTitle>
                <CardDescription>Hours studied per day</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ChevronRight className="h-4 w-4" />}
                onClick={() => navigate(ROUTES.dashboard)}
              >
                Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyStudy}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorHours2"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200 dark:stroke-slate-800"
                  />
                  <XAxis
                    dataKey="day"
                    className="text-xs fill-slate-500 dark:fill-slate-400"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs fill-slate-500 dark:fill-slate-400"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(15 23 42)",
                      border: "1px solid rgb(30 41 59)",
                      borderRadius: "0.75rem",
                      color: "rgb(241 245 249)",
                      fontSize: "0.875rem",
                    }}
                    itemStyle={{ color: "rgb(241 245 249)" }}
                  />

                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorHours2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Activity Mix</CardTitle>
            <CardDescription>Distribution of activity type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {distributionData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(15 23 42)",
                      border: "1px solid rgb(30 41 59)",
                      borderRadius: "0.75rem",
                      color: "rgb(241 245 249)",
                      fontSize: "0.875rem",
                    }}
                    itemStyle={{ color: "rgb(241 245 249)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {distributionData.map((d) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-400">
                    {d.name}
                  </span>
                  <span className="ml-auto font-medium text-slate-900 dark:text-slate-100">
                    {d.value}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quiz Performance Over Time</CardTitle>
                <CardDescription>Average scores per week</CardDescription>
              </div>
              <span className="chip bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400">
                <TrendingUp className="h-3 w-3" /> +16% improvement
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={quizHistory}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200 dark:stroke-slate-800"
                  />
                  <XAxis
                    dataKey="week"
                    className="text-xs fill-slate-500 dark:fill-slate-400"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[50, 100]}
                    className="text-xs fill-slate-500 dark:fill-slate-400"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(15 23 42)",
                      border: "1px solid rgb(30 41 59)",
                      borderRadius: "0.75rem",
                      color: "rgb(241 245 249)",
                      fontSize: "0.875rem",
                    }}
                    itemStyle={{ color: "rgb(241 245 249)" }}
                  />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#22c55e",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Subjects</CardTitle>
            <CardDescription>Ranked by mastery score</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[...subjectScores]
                .sort((a, b) => b.score - a.score)
                .slice(0, 6)
                .map((s) => (
                  <li key={s.subject}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                          style={{ backgroundColor: s.color }}
                        >
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {s.subject}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {s.score}%
                      </span>
                    </div>
                    <Progress value={s.score} color="primary" size="sm" />
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance Comparison</CardTitle>
            <CardDescription>
              Average quiz scores across subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectScores}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200 dark:stroke-slate-800"
                  />
                  <XAxis
                    dataKey="subject"
                    className="text-xs fill-slate-500 dark:fill-slate-400"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    className="text-xs fill-slate-500 dark:fill-slate-400"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(15 23 42)",
                      border: "1px solid rgb(30 41 59)",
                      borderRadius: "0.75rem",
                      color: "rgb(241 245 249)",
                      fontSize: "0.875rem",
                    }}
                    itemStyle={{ color: "rgb(241 245 249)" }}
                  />

                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {subjectScores.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Stats Overview</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-5">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      AI Questions Asked
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total conversations with tutor
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  147
                </span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Flashcards Reviewed
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Spaced repetition practice
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  180
                </span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 dark:bg-secondary-950/40 dark:text-secondary-400">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Questions Correct
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cumulative quiz performance
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  402 / 480
                </span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 text-warning-600 dark:bg-warning-950/40 dark:text-warning-400">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Avg. Session Duration
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Per active learning session
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  52 min
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
