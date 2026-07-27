import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  Terminal,
  Send,
  Award,
  Crown
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/utils/format";

// --- Mock Data ---
const weeklyProgress = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 1.8 },
  { day: "Thu", hours: 4.1 },
  { day: "Fri", hours: 3.5 },
  { day: "Sat", hours: 2.0 },
  { day: "Sun", hours: 1.2 },
];

const subjectSkills = [
  { name: "Mathematics", score: 92, color: "from-cyber-500 to-cyber-400" },
  { name: "Computer Science", score: 95, color: "from-electric-500 to-electric-400" },
  { name: "Physics", score: 85, color: "from-flame-500 to-flame-400" },
  { name: "Literature", score: 72, color: "from-success-500 to-success-400" },
];

const scheduleTasks = [
  { id: 1, title: "Quantum Physics Review", priority: "High", color: "text-electric-400 bg-electric-500/10 border-electric-500/20", time: "10:00 AM" },
  { id: 2, title: "Calculus Assignment", priority: "Medium", color: "text-flame-400 bg-flame-500/10 border-flame-500/20", time: "2:00 PM" },
  { id: 3, title: "Read Chapter 4 Notes", priority: "Low", color: "text-cyber-400 bg-cyber-500/10 border-cyber-500/20", time: "5:00 PM" },
];

// --- Animations ---
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// --- Subcomponents ---
const GlassCard = ({ children, className, tilt = false, glowColor = "electric" }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!tilt) return;
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    setRotateX(((y - centerY) / centerY) * -10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    setRotateX(0);
    setRotateY(0);
  };

  const glowClass = {
    electric: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] group-hover:border-electric-500/50",
    cyber: "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group-hover:border-cyber-500/50",
    flame: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] group-hover:border-flame-500/50",
    success: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] group-hover:border-success-500/50",
  }[glowColor];

  return (
    <motion.div
      style={tilt ? { perspective: 1000 } : {}}
      className={cn("h-full w-full group", className)}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={tilt ? { rotateX, rotateY } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "h-full rounded-2xl bg-white/60 dark:bg-surface-glass backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 transition-all duration-300",
          glowClass
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [terminalInput, setTerminalInput] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-20 relative z-10">
      
      {/* A. Hero Welcome Card */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-electric-600 to-electric-400 dark:from-electric-900 dark:to-electric-600 p-8 sm:p-10 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-20" />
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/20 blur-3xl rounded-full" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl text-white">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                {getGreeting()}, {user?.name?.split(" ")[0] ?? "Learner"}! 🚀
              </h1>
              <p className="text-electric-100 font-medium text-lg mb-6">
                "The beautiful thing about learning is nobody can take it away from you."
              </p>
              <Button
                size="lg"
                onClick={() => navigate(ROUTES.chat)}
                className="bg-white text-electric-600 hover:bg-slate-50 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse-glow"
                leftIcon={<Sparkles className="w-5 h-5" />}
              >
                Resume Learning
              </Button>
            </div>
            
            <div className="hidden md:flex flex-col gap-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 min-w-[280px]">
              <div className="flex justify-between items-center text-white/80 text-sm font-medium">
                <span>Daily XP Goal</span>
                <span className="text-white">850 / 1000 XP</span>
              </div>
              <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.5 }}
                  className="h-full bg-gradient-to-r from-cyber-400 to-electric-400 rounded-full" 
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* B. Metrics Cards Row */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard tilt glowColor="cyber">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyber-500/10 rounded-xl text-cyber-500 dark:text-cyber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Hours Studied</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-mono">24.5h</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-success-500">
            <TrendingUp className="w-3 h-3" /> +2.5h this week
          </div>
        </GlassCard>

        <GlassCard tilt glowColor="success">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-success-500/10 rounded-xl text-success-500 dark:text-success-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Quizzes Mastered</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-mono">18</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-success-500">
            <Award className="w-3 h-3" /> 92% Avg Accuracy
          </div>
        </GlassCard>

        <GlassCard tilt glowColor="electric">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-electric-500/10 rounded-xl text-electric-500 dark:text-electric-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Cards Learned</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-mono">342</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-electric-500">
            <Zap className="w-3 h-3" /> 52 due today
          </div>
        </GlassCard>

        <GlassCard tilt glowColor="flame">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-flame-500/10 rounded-xl text-flame-500 dark:text-flame-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">AI Credits</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-mono">850</h3>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full mt-2">
            <div className="h-full bg-gradient-to-r from-flame-500 to-flame-400 w-[85%] rounded-full" />
          </div>
        </GlassCard>
      </motion.div>

      {/* C. Interactive Core AI Tools (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Terminal & Quiz Builder */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <motion.div variants={item} className="flex-1">
            <GlassCard glowColor="cyber" className="h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="w-5 h-5 text-cyber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick AI Terminal</h3>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/10 p-4 font-mono text-sm relative group overflow-hidden flex flex-col justify-end min-h-[160px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-500 to-electric-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="space-y-2 mb-4 text-slate-500 dark:text-slate-400">
                  <p>$ LearnFlow System Initialized...</p>
                  <p>$ Type a command or ask a question to begin.</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
                  <span className="text-electric-500 font-bold ml-2">❯</span>
                  <input 
                    type="text" 
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="E.g., Summarize Newton's laws..." 
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <button className="p-2 bg-electric-500 hover:bg-electric-600 text-white rounded-md transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-md transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GlassCard glowColor="electric" className="cursor-pointer" tilt>
              <div onClick={() => navigate(ROUTES.quiz)} className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-2xl bg-electric-500/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <BrainCircuit className="w-8 h-8 text-electric-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Quiz Builder</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Generate tests from notes instantly.</p>
              </div>
            </GlassCard>
            
            <GlassCard glowColor="flame" className="cursor-pointer" tilt>
              <div onClick={() => navigate(ROUTES.upload)} className="h-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center p-6 hover:border-flame-500 dark:hover:border-flame-500 transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Drop PDF / Notes</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">We'll process it with AI.</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Schedule & Tasks */}
        <motion.div variants={item} className="flex flex-col h-full">
          <GlassCard glowColor="success" className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-success-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart Schedule</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-8">View All</Button>
            </div>
            
            <div className="flex-1 space-y-4">
              {scheduleTasks.map(task => (
                <div key={task.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border border-transparent dark:hover:border-white/5 cursor-pointer">
                  <div className="w-2 h-2 mt-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{task.title}</p>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">{task.time}</p>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2 py-1 rounded-md border", task.color)}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md">
              + Add Task
            </Button>
          </GlassCard>
        </motion.div>
      </div>

      {/* D & E. Visual Analytics & Gamification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard glowColor="electric">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Performance</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Hours spent learning across all subjects</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cyberGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis dataKey="day" className="text-xs fill-slate-500 font-mono" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs fill-slate-500 font-mono" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#06B6D4', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#cyberGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Gamification Hub */}
        <motion.div variants={item} className="space-y-6">
          <GlassCard glowColor="flame">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Crown className="w-5 h-5 text-flame-500" /> Subject Mastery
            </h3>
            <div className="space-y-5">
              {subjectSkills.map(subject => (
                <div key={subject.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{subject.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{subject.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${subject.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full bg-gradient-to-r", subject.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </motion.div>
  );
};
