import React, { useEffect, useState, useCallback, Suspense, lazy, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Mail,
  Lock,
  UserCircle,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Loader2
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, registerSchema } from "@/utils/validation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Form";
import { ROUTES } from "@/constants";
import { cn } from "@/utils/format";

// Import ultra-premium components
import AuthBackground from "@/components/auth/AuthBackground";
const AICharacter3D = lazy(() => import("@/components/auth/AICharacter3D"));

// Custom Web Audio API Sound Generator
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.error("Audio Context not supported or failed", e);
  }
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.68 4.1-5.5 4.1-3.3 0-6-2.75-6-6.2s2.7-6.2 6-6.2c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.88 3.2 14.64 2.2 12 2.2 6.48 2.2 2 6.69 2 12.2s4.48 10 10 10c5.78 0 9.6-4.06 9.6-9.78 0-.66-.07-1.16-.16-1.66L12 10.2z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
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
  const [rememberMe, setRememberMe] = useState(true);
  
  const [networkError, setNetworkError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState("dark"); // Dark by default as per prompt

  // Orb State and Tracking
  const [orbState, setOrbState] = useState("idle");
  const [speechMsg, setSpeechMsg] = useState("");
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [cardShake, setCardShake] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 3D Card Hover Effect
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardRotateX = useTransform(cardY, [-300, 300], [10, -10]);
  const cardRotateY = useTransform(cardX, [-300, 300], [-10, 10]);

  // Typewriter text
  const features = ["AI Friend", "Voice Viva", "PDF Summarizer", "Quiz Generator", "Flashcards", "Study Planner"];
  const [featureIndex, setFeatureIndex] = useState(0);

  useEffect(() => {
    // Initial greeting
    const hour = new Date().getHours();
    let greeting = "Good evening";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    
    setSpeechMsg(`${greeting}! Welcome back. Ready to learn?`);
    setTimeout(() => {
      if (orbState === "idle") setSpeechMsg("");
    }, 5000);

    const featureInterval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % features.length);
    }, 2500);

    return () => clearInterval(featureInterval);
  }, []);

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    // Update card tilt relative to center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    cardX.set(e.clientX - centerX);
    cardY.set(e.clientY - centerY);
  }, [cardX, cardY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const handleFocus = useCallback((fieldName) => {
    if (fieldName === "password" || fieldName === "confirmPassword") {
      if ((fieldName === "password" && !showLoginPw) || (fieldName === "confirmPassword" && !showRegPw)) {
        setOrbState("eyes_closed");
        setSpeechMsg("I won't look!");
      } else {
        setOrbState("idle");
        setSpeechMsg("");
      }
    } else {
      setOrbState("idle");
      setSpeechMsg(`Entering ${fieldName}...`);
    }
  }, [showLoginPw, showRegPw]);

  const handleBlur = useCallback(() => {
    if (orbState !== "success" && orbState !== "error") {
      setOrbState("idle");
      setSpeechMsg("");
    }
  }, [orbState]);

  const triggerError = (msg) => {
    setOrbState("error");
    setSpeechMsg("Oh no! " + msg);
    setNetworkError(msg);
    setCardShake(true);
    if (soundEnabled) playSound("error");
    setTimeout(() => setCardShake(false), 500);
    setTimeout(() => {
      setOrbState("idle");
      setSpeechMsg("");
    }, 4000);
  };

  const triggerSuccess = (msg) => {
    setOrbState("success");
    setSpeechMsg(msg);
    setSuccessMessage(msg);
    setSubmitSuccess(true);
    if (soundEnabled) playSound("success");
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366F1', '#06B6D4', '#8B5CF6', '#10B981']
    });
  };

  const extractErrorMessage = (error, fallback) => {
    if (!error) return fallback;
    const detail = error.response?.data?.detail || error.details || error.message;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((e) => e.msg || e.message || (typeof e === "string" ? e : JSON.stringify(e)))
        .join("; ");
    }
    if (detail && typeof detail === "object") {
      return detail.msg || detail.message || JSON.stringify(detail);
    }
    return fallback;
  };

  const onLogin = async (data) => {
    setIsSubmittingForm(true);
    setNetworkError(null);
    setSuccessMessage(null);
    
    try {
      await login(data.email, data.password);
      triggerSuccess("Welcome back to LearnFlow!");
      setTimeout(() => navigate(ROUTES.dashboard, { replace: true }), 1000);
    } catch (error) {
      const msg = extractErrorMessage(error, "Invalid credentials. Please try again.");
      triggerError(msg);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const onRegister = async (data) => {
    setIsSubmittingForm(true);
    setNetworkError(null);
    setSuccessMessage(null);
    
    try {
      await register(data.name, data.email, data.password);
      triggerSuccess("Account created successfully!");
      setTimeout(() => navigate(ROUTES.dashboard, { replace: true }), 1000);
    } catch (error) {
      const msg = extractErrorMessage(error, "Registration failed. Please try again.");
      triggerError(msg);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const toggleMode = (m) => {
    if (soundEnabled) playSound("click");
    setMode(m);
    setNetworkError(null);
  };

  const cardVariants = {
    shake: { x: [-10, 10, -10, 10, -5, 5, 0], transition: { duration: 0.4 } }
  };

  return (
    <div className={`min-h-screen w-full relative flex items-center justify-center overflow-hidden font-sans transition-colors duration-500 ${theme === 'dark' ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {theme === 'dark' && <AuthBackground mousePos={mousePos} />}

      {/* Top right controls */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button 
          onClick={() => { setSoundEnabled(!soundEnabled); if(!soundEnabled) playSound('click'); }}
          className={`p-2 rounded-full backdrop-blur-md transition-colors ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300' : 'bg-white/80 hover:bg-slate-200 text-slate-700 shadow-sm'}`}
          title="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
        <button 
          onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); if(soundEnabled) playSound('click'); }}
          className={`p-2 rounded-full backdrop-blur-md transition-colors ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300' : 'bg-white/80 hover:bg-slate-200 text-slate-700 shadow-sm'}`}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="container mx-auto px-4 lg:px-8 h-full min-h-screen flex flex-col lg:flex-row relative z-10 pt-16 lg:pt-0">
        
        {/* Left Panel: Branding & Greetings */}
        <div className="flex-1 flex flex-col justify-center items-start p-4 lg:p-16 lg:max-w-2xl relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/30">
              <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold font-heading tracking-tight">LearnFlow</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h1 className="text-5xl lg:text-7xl font-bold font-heading leading-[1.1] tracking-tight mb-6">
              Learn Smarter <br/> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500 italic">AI</span>
            </h1>
            
            <div className="text-xl lg:text-2xl font-medium mb-8 h-10 flex items-center gap-2">
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Your intelligent</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={featureIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-secondary-500 font-semibold"
                >
                  {features[featureIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 mb-12">
              {['Interactive', 'Personalized', '24/7 Access', 'Smart Analytics'].map((pill, i) => (
                <span key={i} className={`px-3 py-1 text-xs font-medium rounded-full border ${theme === 'dark' ? 'border-slate-700/50 bg-slate-800/30 text-slate-300' : 'border-slate-200 bg-white text-slate-600 shadow-sm'}`}>
                  {pill}
                </span>
              ))}
            </div>

            {/* Quote Strip */}
            <div className={`p-4 rounded-xl border-l-4 border-primary-500 max-w-md ${theme === 'dark' ? 'bg-slate-900/40 backdrop-blur-md' : 'bg-white shadow-md'}`}>
              <p className={`text-sm italic mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                "LearnFlow completely transformed how I study. The AI feels like a real tutor."
              </p>
              <p className="text-xs font-semibold text-primary-500">— Sarah J., Medical Student</p>
            </div>
          </motion.div>
        </div>

        {/* Right Panel: Interactive 3D Orb & Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 relative w-full max-w-xl mx-auto lg:max-w-none lg:mx-0" style={{ perspective: 1200 }}>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
            className="w-full absolute top-[-50px] lg:top-[5%] h-[300px] lg:h-[400px] -z-10"
          >
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>}>
              <AICharacter3D state={orbState} mousePos={mousePos} speechMessage={speechMsg} />
            </Suspense>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} 
            animate={cardShake ? "shake" : { opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.6 }}
            variants={cardVariants}
            style={{ rotateX: cardRotateX, rotateY: cardRotateY }}
            className={`w-full max-w-md p-8 rounded-[30px] relative overflow-hidden group mt-[200px] lg:mt-24 transition-colors duration-500 ${
              theme === 'dark' 
              ? 'bg-[rgba(15,23,42,0.55)] backdrop-blur-[22px] border border-slate-700/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]' 
              : 'bg-white/80 backdrop-blur-[22px] border border-slate-200 shadow-2xl'
            }`}
          >
            {/* Animated conic-gradient rotating border (only visible in dark mode for premium feel) */}
            {theme === 'dark' && (
              <div className="absolute inset-[-1px] rounded-[30px] -z-10 bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#6366F1_100%)] animate-[spin_4s_linear_infinite] opacity-50 mask-image-border" style={{ WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", padding: "1px" }} />
            )}

            {/* Error / Success Banners */}
            <AnimatePresence>
              {networkError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 rounded-xl border border-danger-500/30 bg-danger-500/10 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-danger-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-danger-200">{String(networkError)}</p>
                </motion.div>
              )}
              {successMessage && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 rounded-xl border border-success-500/30 bg-success-500/10 p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-success-200">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`flex rounded-xl p-1 mb-8 relative ${theme === 'dark' ? 'border border-slate-700/50 bg-slate-950/50' : 'bg-slate-100'}`}>
              <motion.div 
                className={`absolute inset-y-1 left-1 rounded-lg shadow-sm w-[calc(50%-4px)] ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}
                animate={{ x: mode === "login" ? 0 : "100%" }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
              {["login", "register"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleMode(t)}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium rounded-lg relative z-10 transition-colors duration-300",
                    mode === t 
                      ? (theme === 'dark' ? "text-white" : "text-slate-900") 
                      : (theme === 'dark' ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")
                  )}
                >
                  {t === "login" ? "Login" : "Create Account"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5 relative z-10">
                  <Input
                    label="Email" type="email" placeholder="you@example.com"
                    leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                    error={loginForm.formState.errors.email?.message}
                    onFocus={() => handleFocus("email")} onBlur={handleBlur}
                    {...loginForm.register("email")}
                    className={theme === 'dark' ? "bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500" : "bg-white"}
                  />
                  
                  <div className="relative">
                    <Input
                      label="Password" type={showLoginPw ? "text" : "password"} placeholder="••••••••"
                      leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                      rightIcon={
                        <button type="button" onClick={() => {setShowLoginPw(!showLoginPw); if(soundEnabled) playSound('click');}} className="text-slate-400 hover:text-primary-500">
                          {showLoginPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                      error={loginForm.formState.errors.password?.message}
                      onFocus={() => handleFocus("password")} onBlur={handleBlur}
                      {...loginForm.register("password")}
                      className={theme === 'dark' ? "bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500" : "bg-white"}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs mt-2">
                    <label className="flex items-center gap-2 text-slate-400 cursor-pointer transition-colors hover:text-primary-400">
                      <input
                        type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-primary-500 focus:ring-primary-500"
                      />
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit" fullWidth disabled={isSubmittingForm || submitSuccess}
                      className="mt-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white border-0 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all h-12 rounded-xl text-base font-semibold overflow-hidden"
                    >
                      <AnimatePresence mode="wait">
                        {isSubmittingForm ? (
                          <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</motion.div>
                        ) : submitSuccess ? (
                          <motion.div key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Success!</motion.div>
                        ) : (
                          <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.form key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4 relative z-10">
                  <Input
                    label="Full Name" placeholder="Alex Student"
                    leftIcon={<UserCircle className="h-4 w-4 text-slate-400" />}
                    error={registerForm.formState.errors.name?.message}
                    onFocus={() => handleFocus("name")} onBlur={handleBlur}
                    {...registerForm.register("name")}
                    className={theme === 'dark' ? "bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500" : "bg-white"}
                  />
                  <Input
                    label="Email" type="email" placeholder="you@example.com"
                    leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                    error={registerForm.formState.errors.email?.message}
                    onFocus={() => handleFocus("email")} onBlur={handleBlur}
                    {...registerForm.register("email")}
                    className={theme === 'dark' ? "bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500" : "bg-white"}
                  />
                  <Input
                    label="Password" type={showRegPw ? "text" : "password"} placeholder="••••••••"
                    leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                    rightIcon={
                      <button type="button" onClick={() => {setShowRegPw(!showRegPw); if(soundEnabled) playSound('click');}} className="text-slate-400 hover:text-primary-500">
                        {showRegPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                    error={registerForm.formState.errors.password?.message}
                    onFocus={() => handleFocus("password")} onBlur={handleBlur}
                    {...registerForm.register("password")}
                    className={theme === 'dark' ? "bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500" : "bg-white"}
                  />
                  <Input
                    label="Confirm Password" type={showRegPw ? "text" : "password"} placeholder="••••••••"
                    leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                    error={registerForm.formState.errors.confirmPassword?.message}
                    onFocus={() => handleFocus("confirmPassword")} onBlur={handleBlur}
                    {...registerForm.register("confirmPassword")}
                    className={theme === 'dark' ? "bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500" : "bg-white"}
                  />
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit" fullWidth disabled={isSubmittingForm || submitSuccess}
                      className="mt-6 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white border-0 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all h-12 rounded-xl text-base font-semibold overflow-hidden"
                    >
                      <AnimatePresence mode="wait">
                        {isSubmittingForm ? (
                          <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</motion.div>
                        ) : submitSuccess ? (
                          <motion.div key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Success!</motion.div>
                        ) : (
                          <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">Create Account <ArrowRight className="h-4 w-4" /></motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-2">
              <div className={`h-px w-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">OR CONTINUE WITH</span>
              <div className={`h-px w-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button disabled className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-colors opacity-70 cursor-not-allowed ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700/50 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                <GoogleIcon /> <span className="text-sm font-medium">Google</span>
              </button>
              <button disabled className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-colors opacity-70 cursor-not-allowed ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700/50 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                <GitHubIcon /> <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
