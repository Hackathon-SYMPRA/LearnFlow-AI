import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  MessageSquare,
  BrainCircuit,
  Layers,
  CalendarCheck,
  UploadCloud,
  Mic,
  Play,
  Trophy,
  Target,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Brain,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Clock3,
  Zap,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
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
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn, formatRelativeTime } from '@/utils/format';

const weeklyProgress = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.1 },
  { day: 'Fri', hours: 3.5 },
  { day: 'Sat', hours: 2.0 },
  { day: 'Sun', hours: 1.2 },
];

const subjectPerformance = [
  { subject: 'Math', score: 92 },
  { subject: 'Physics', score: 85 },
  { subject: 'Chemistry', score: 78 },
  { subject: 'Biology', score: 70 },
  { subject: 'CS', score: 95 },
  { subject: 'English', score: 82 },
];

const PIE_COLORS = ['#3b82f6', '#a855f7', '#22c55e', '#f97316', '#ef4444', '#6366f1'];

const recentDocuments = [
  { id: '1', name: 'Calculus_Chapter5.pdf', subject: 'Mathematics', status: 'ready', uploadedAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', name: 'Organic_Chemistry_Notes.pdf', subject: 'Chemistry', status: 'ready', uploadedAt: new Date(Date.now() - 7200000 * 2).toISOString() },
  { id: '3', name: 'Physics_Waves.docx', subject: 'Physics', status: 'processing', uploadedAt: new Date(Date.now() - 3600000 * 4).toISOString() },
];

const recentChats = [
  { id: '1', title: 'Integration techniques explained', preview: 'The substitution method is useful when...', time: new Date(Date.now() - 1800000).toISOString() },
  { id: '2', title: 'Understanding SN1 vs SN2 reactions', preview: 'SN1 reactions follow a two-step mechanism...', time: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: '3', title: 'Newton laws of motion review', preview: 'For every action there is an equal and...', time: new Date(Date.now() - 86400000).toISOString() },
];

const recentActivity = [
  { id: '1', type: 'quiz', title: 'Completed Biology Quiz', score: '85%', time: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', type: 'document', title: 'Uploaded Physics Notes', time: new Date(Date.now() - 7200000 * 2).toISOString() },
  { id: '3', type: 'flashcard', title: 'Reviewed 12 Flashcards', time: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: '4', type: 'chat', title: 'Chatted about Trigonometry', time: new Date(Date.now() - 86400000).toISOString() },
];

const upcomingSchedule = [
  { id: '1', title: 'Math Revision - Calculus', subject: 'Mathematics', time: '4:00 PM - 5:30 PM', priority: 'high' },
  { id: '2', title: 'Practice Quiz - Organic Chem', subject: 'Chemistry', time: '6:00 PM - 7:00 PM', priority: 'medium' },
  { id: '3', title: 'Read Physics Waves Notes', subject: 'Physics', time: '8:30 PM - 9:30 PM', priority: 'low' },
];

const recommendations = [
  { id: '1', title: 'Review Integration Formulas', reason: 'You scored 70% on this topic', action: 'Review', route: ROUTES.flashcards, icon: Brain },
  { id: '2', title: 'Generate Quiz on Chemical Bonds', reason: 'Based on your recent uploads', action: 'Generate', route: ROUTES.quiz, icon: BrainCircuit },
  { id: '3', title: 'Study Plan: Week 8', reason: 'Recommended 3 sessions this week', action: 'View Plan', route: ROUTES.planner, icon: CalendarCheck },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    { label: 'Upload PDF', icon: UploadCloud, route: ROUTES.upload, variant: 'primary' as const, color: 'bg-primary-600 hover:bg-primary-700' },
    { label: 'Ask AI', icon: MessageSquare, route: ROUTES.chat, variant: 'secondary' as const, color: 'bg-secondary-600 hover:bg-secondary-700' },
    { label: 'Generate Quiz', icon: BrainCircuit, route: ROUTES.quiz, variant: 'outline' as const, color: 'bg-accent-600 hover:bg-accent-700' },
    { label: 'Generate Flashcards', icon: Layers, route: ROUTES.flashcards, variant: 'outline' as const, color: 'bg-warning-500 hover:bg-warning-600' },
    { label: 'Create Study Plan', icon: CalendarCheck, route: ROUTES.planner, variant: 'outline' as const, color: 'bg-slate-700 hover:bg-slate-800' },
    { label: 'Resume Last Chat', icon: Play, route: ROUTES.chat, variant: 'ghost' as const, color: '' },
    { label: 'Start Voice Chat', icon: Mic, route: ROUTES.chat, variant: 'ghost' as const, color: '' },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="card overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 p-6 sm:p-8 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary-100">
              {getGreeting()}, {user?.name?.split(' ')[0] ?? 'Learner'} 👋
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-balance">
              Welcome back! Ready to continue learning?
            </h1>
            <p className="mt-3 max-w-xl text-sm text-primary-100">
              You have studied <span className="font-semibold text-white">18.3 hours</span> this week.
              Keep up the streak and complete today's study goal!
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="bg-white/15 border-white/20 text-white hover:bg-white/25"
                onClick={() => navigate(ROUTES.chat)}
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                Continue Learning
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/15"
                onClick={() => navigate(ROUTES.upload)}
                leftIcon={<UploadCloud className="h-4 w-4" />}
              >
                Upload Materials
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 lg:min-w-[420px]">
            <div className="rounded-xl bg-white/15 border border-white/20 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-primary-100">
                <Zap className="h-3.5 w-3.5" />
                Streak
              </div>
              <p className="mt-1.5 text-2xl font-bold">12 days</p>
              <p className="mt-0.5 text-xs text-primary-100 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> +2 days
              </p>
            </div>
            <div className="rounded-xl bg-white/15 border border-white/20 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-primary-100">
                <Clock3 className="h-3.5 w-3.5" />
                Today
              </div>
              <p className="mt-1.5 text-2xl font-bold">3.2h</p>
              <p className="mt-0.5 text-xs text-primary-100 flex items-center gap-1">
                <Target className="h-3 w-3" /> Goal: 4h
              </p>
            </div>
            <div className="rounded-xl bg-white/15 border border-white/20 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-primary-100">
                <GraduationCap className="h-3.5 w-3.5" />
                Avg. Score
              </div>
              <p className="mt-1.5 text-2xl font-bold">84%</p>
              <p className="mt-0.5 text-xs text-primary-100 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +5%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-primary-100">Today's Study Goal</span>
            <span className="font-semibold text-white">3.2 / 4.0 hours</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-accent-400 to-white"
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card padded={false}>
          <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">One-click access to important features</p>
            </div>
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => navigate(action.route)}
                className={cn(
                  'group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                )}
              >
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-xl text-white transition-transform duration-200 group-hover:scale-110',
                    action.color || 'bg-primary-600 hover:bg-primary-700'
                  )}
                  style={action.color ? {} : undefined}
                >
                  <action.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Study Hours"
          value="18.3h"
          description="this week"
          trend={{ value: 12, isPositive: true }}
          icon={<Clock className="h-6 w-6" />}
          color="primary"
        />
        <StatCard
          title="Documents Uploaded"
          value={24}
          description="across 6 subjects"
          trend={{ value: 5, isPositive: true }}
          icon={<FileText className="h-6 w-6" />}
          color="secondary"
        />
        <StatCard
          title="Avg. Quiz Score"
          value="84%"
          description="across 12 quizzes"
          trend={{ value: 5, isPositive: true }}
          icon={<Trophy className="h-6 w-6" />}
          color="accent"
        />
        <StatCard
          title="AI Questions Asked"
          value={147}
          description="this month"
          trend={{ value: 23, isPositive: true }}
          icon={<Activity className="h-6 w-6" />}
          color="warning"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>Weekly study time (hours)</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.analytics)} rightIcon={<ChevronRight className="h-4 w-4" />}>
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="day" className="text-xs fill-slate-500 dark:fill-slate-400" tickLine={false} axisLine={false} />
                    <YAxis className="text-xs fill-slate-500 dark:fill-slate-400" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(15 23 42)',
                        border: '1px solid rgb(30 41 59)',
                        borderRadius: '0.75rem',
                        color: 'rgb(241 245 249)',
                        fontSize: '0.875rem',
                      }}
                      itemStyle={{ color: 'rgb(241 245 249)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorHours)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectPerformance}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="score"
                    >
                      {subjectPerformance.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(15 23 42)',
                        border: '1px solid rgb(30 41 59)',
                        borderRadius: '0.75rem',
                        color: 'rgb(241 245 249)',
                        fontSize: '0.875rem',
                      }}
                      itemStyle={{ color: 'rgb(241 245 249)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-4 space-y-2">
                {subjectPerformance.slice(0, 4).map((s, idx) => (
                  <li key={s.subject} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                        aria-hidden="true"
                      />
                      {s.subject}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{s.score}%</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Strong & Weak Subjects</CardTitle>
                  <CardDescription>Areas of excellence and areas to improve</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700 dark:bg-accent-950/40 dark:text-accent-400">
                    <TrendingUp className="h-3 w-3" /> Strong
                  </span>
                  Where you excel the most
                </p>
                <div className="space-y-3">
                  {['Computer Science (95%)', 'Mathematics (92%)', 'Physics (85%)'].map((s) => (
                    <div key={s} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{s.split(' ')[0]} {s.split(' ')[1] ?? ''}</span>
                      <Progress
                        value={parseInt(s.match(/\d+/)?.[0] ?? '0')}
                        size="sm"
                        color="accent"
                        className="w-24"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-xs font-semibold text-warning-700 dark:bg-warning-950/40 dark:text-warning-400">
                    <ArrowDownRight className="h-3 w-3" /> Needs Work
                  </span>
                  Focus on these to improve
                </p>
                <div className="space-y-3">
                  {[
                    { name: 'Biology', score: 70 },
                    { name: 'Chemistry', score: 78 },
                    { name: 'English', score: 82 },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{s.name} ({s.score}%)</span>
                      <Progress
                        value={s.score}
                        size="sm"
                        color="warning"
                        className="w-24"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Personalized study suggestions</CardDescription>
                </div>
                <span className="chip bg-secondary-50 text-secondary-700 dark:bg-secondary-950/40 dark:text-secondary-400">
                  <Lightbulb className="h-3 w-3" /> Powered by AI
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recommendations.map((rec) => {
                  const Icon = rec.icon;
                  return (
                    <li key={rec.id}>
                      <button
                        type="button"
                        onClick={() => navigate(rec.route)}
                        className="w-full flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{rec.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{rec.reason}</p>
                        </div>
                        <span className="shrink-0 rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-950/40 dark:text-primary-400">
                          {rec.action}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Uploads</CardTitle>
                  <CardDescription>Your latest study materials</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.upload)} rightIcon={<ChevronRight className="h-4 w-4" />}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentDocuments.length === 0 ? (
                <EmptyState
                  title="No documents yet"
                  description="Upload PDFs, notes, and images to get AI-powered help."
                  action={{ label: 'Upload Now', onClick: () => navigate(ROUTES.upload), variant: 'primary', icon: <UploadCloud className="h-4 w-4" /> }}
                />
              ) : (
                <ul className="space-y-2">
                  {recentDocuments.map((doc) => (
                    <li key={doc.id}>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
                          <FileText className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{doc.name}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs">
                            <span className="text-slate-500 dark:text-slate-400">{doc.subject}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-slate-500 dark:text-slate-400">{formatRelativeTime(doc.uploadedAt)}</span>
                          </div>
                        </div>
                        <span
                          className={cn(
                            'chip shrink-0',
                            doc.status === 'ready'
                              ? 'bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400'
                              : 'bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400'
                          )}
                        >
                          {doc.status === 'ready' ? 'Ready' : 'Processing'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Chats</CardTitle>
                  <CardDescription>Past conversations with AI tutor</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.history)} rightIcon={<ChevronRight className="h-4 w-4" />}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentChats.length === 0 ? (
                <EmptyState
                  title="No chats yet"
                  description="Start a conversation with your AI tutor to ask questions about your study materials."
                  action={{ label: 'Start Chat', onClick: () => navigate(ROUTES.chat), variant: 'primary', icon: <MessageSquare className="h-4 w-4" /> }}
                />
              ) : (
                <ul className="space-y-2">
                  {recentChats.map((chat) => (
                    <li key={chat.id}>
                      <button
                        type="button"
                        onClick={() => navigate(ROUTES.chat)}
                        className="w-full flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600 dark:bg-secondary-950/40 dark:text-secondary-400">
                          <MessageSquare className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{chat.title}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{chat.preview}</p>
                        </div>
                        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                          {formatRelativeTime(chat.time)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quiz Performance</CardTitle>
                  <CardDescription>Scores across subjects</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.analytics)} rightIcon={<ChevronRight className="h-4 w-4" />}>
                  Full Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="subject" className="text-xs fill-slate-500 dark:fill-slate-400" tickLine={false} axisLine={false} />
                    <YAxis className="text-xs fill-slate-500 dark:fill-slate-400" tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(15 23 42)',
                        border: '1px solid rgb(30 41 59)',
                        borderRadius: '0.75rem',
                        color: 'rgb(241 245 249)',
                        fontSize: '0.875rem',
                      }}
                      itemStyle={{ color: 'rgb(241 245 249)' }}
                    />
                    <Bar dataKey="score" fill="#a855f7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Schedule</CardTitle>
                  <CardDescription>Today's study plan</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.planner)} rightIcon={<CalendarCheck className="h-4 w-4" />}>
                  Planner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingSchedule.length === 0 ? (
                <EmptyState
                  title="No schedule today"
                  description="Create a study plan to organize your learning."
                  action={{ label: 'Create Plan', onClick: () => navigate(ROUTES.planner), variant: 'primary' }}
                />
              ) : (
                <ul className="space-y-3">
                  {upcomingSchedule.map((task) => (
                    <li key={task.id}>
                      <div className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                        <div className="flex flex-col items-center pt-1">
                          <div
                            className={cn(
                              'h-2.5 w-2.5 rounded-full ring-4',
                              task.priority === 'high'
                                ? 'bg-danger-500 ring-danger-100 dark:ring-danger-950/40'
                                : task.priority === 'medium'
                                  ? 'bg-warning-500 ring-warning-100 dark:ring-warning-950/40'
                                  : 'bg-slate-400 ring-slate-100 dark:ring-slate-800'
                            )}
                            aria-hidden="true"
                          />
                          <div className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1 pb-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <BookOpen className="h-3 w-3" />
                            <span>{task.subject}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <Clock className="h-3 w-3" />
                            <span>{task.time}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                      activity.type === 'quiz' && 'bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400',
                      activity.type === 'document' && 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400',
                      activity.type === 'flashcard' && 'bg-secondary-50 text-secondary-600 dark:bg-secondary-950/40 dark:text-secondary-400',
                      activity.type === 'chat' && 'bg-warning-50 text-warning-600 dark:bg-warning-950/40 dark:text-warning-400'
                    )}
                  >
                    {activity.type === 'quiz' && <Trophy className="h-5 w-5" />}
                    {activity.type === 'document' && <FileText className="h-5 w-5" />}
                    {activity.type === 'flashcard' && <Layers className="h-5 w-5" />}
                    {activity.type === 'chat' && <MessageSquare className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {activity.title}
                      {activity.score && (
                        <span className="ml-2 text-accent-600 dark:text-accent-400 font-semibold">
                          {activity.score}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {formatRelativeTime(activity.time)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
