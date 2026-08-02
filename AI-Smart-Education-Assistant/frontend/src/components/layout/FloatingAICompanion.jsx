import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/format";

const MiniOrb = ({ state, mousePos }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const ringGroupRef = useRef();
  const glowRef = useRef();

  const targetColor = useMemo(() => {
    switch (state) {
      case "success": return new THREE.Color("#10B981");
      case "warning": return new THREE.Color("#EF4444");
      case "active": return new THREE.Color("#F59E0B");
      case "talking": return new THREE.Color("#06B6D4"); // Cyber Cyan when talking
      default: return new THREE.Color("#8B5CF6");
    }
  }, [state]);

  const targetDistort = useMemo(() => {
    switch (state) {
      case "talking": return 0.8; // High distortion for talking
      case "success": return 0.6;
      case "warning": return 0.8;
      case "active": return 0.5;
      default: return 0.3;
    }
  }, [state]);

  useFrame((stateObj, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    materialRef.current.color.lerp(targetColor, delta * 3);
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, delta * 2);

    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;

    const targetX = (mousePos.x - window.innerWidth / 2) * 0.001;
    const targetY = -(mousePos.y - window.innerHeight / 2) * 0.001;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, delta * 2);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 2);

    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.y += delta * (state === 'talking' ? 3.0 : 1.5);
      ringGroupRef.current.rotation.x += delta * 0.5;
    }

    if (glowRef.current && state === 'talking') {
       glowRef.current.scale.setScalar(1 + Math.sin(stateObj.clock.elapsedTime * 10) * 0.1);
       glowRef.current.material.opacity = 0.2 + Math.sin(stateObj.clock.elapsedTime * 10) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.2, 32, 32]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#8B5CF6"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.3}
          speed={state === 'talking' ? 6 : 2}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      <Sphere ref={glowRef} args={[1.3, 16, 16]}>
        <meshBasicMaterial 
          color={targetColor} 
          transparent 
          opacity={0.2} 
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      <group ref={ringGroupRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.6, 0.02, 16, 100]} />
          <meshBasicMaterial color={targetColor} transparent opacity={0.6} />
        </mesh>
        <mesh position={[1.6, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <group position={[0, 0, 1.1]}>
        <mesh position={[-0.3, 0.1, 0]}>
          <capsuleGeometry args={[0.06, state === 'talking' ? 0.25 : 0.15, 4, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.3, 0.1, 0]}>
          <capsuleGeometry args={[0.06, state === 'talking' ? 0.25 : 0.15, 4, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </Float>
  );
};

const FloatingAICompanion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [hasGreeted, setHasGreeted] = useState(() => {
    return sessionStorage.getItem("learnflow_greeted") === "true";
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const synth = window.speechSynthesis;

  const speak = (text) => {
    if (!voiceEnabled || !synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    
    // Attempt to pick an English voice
    const voices = synth.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en'));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpokenText(text);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setTimeout(() => setSpokenText(""), 2000);
    };
    synth.speak(utterance);
  };

  const handleInteraction = () => {
    if (!hasGreeted && voiceEnabled && synth) {
      setHasGreeted(true);
      sessionStorage.setItem("learnflow_greeted", "true");
      const hours = new Date().getHours();
      let timeGreeting = "Welcome back";
      if (hours < 12) timeGreeting = "Good morning";
      else if (hours < 18) timeGreeting = "Good afternoon";
      else timeGreeting = "Good evening";
  
      const rawName = user?.name || user?.full_name;
      const userName = typeof rawName === "string" && rawName.trim() ? rawName.trim().split(/\s+/)[0] : "Scholar";
      speak(`${timeGreeting}, ${userName}! I am LearnFlow, your AI study companion. Ready to level up your knowledge today?`);
    }
  };

  useEffect(() => {
    // Try to auto-greet on mount. May be blocked by browser autoplay policies.
    const t = setTimeout(() => {
       handleInteraction();
    }, 1500);
    return () => clearTimeout(t);
  }, [user, voiceEnabled]);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    // Also attach interaction listener for first click to trigger speech if autoplay failed
    window.addEventListener("click", handleInteraction, { once: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleInteraction);
    };
  }, [hasGreeted, voiceEnabled, user]);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
      {/* Animated Speech Bubble */}
      <AnimatePresence>
        {spokenText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute bottom-24 left-4 bg-surface-glass backdrop-blur-xl border border-cyber-500/30 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.2)] p-3 w-64 origin-bottom-left"
          >
             <p className="text-xs text-cyber-50 font-medium leading-relaxed italic">
                "{spokenText}"
             </p>
             <div className="absolute -bottom-2 left-6 w-4 h-4 bg-surface-glass border-b border-r border-cyber-500/30 rotate-45 transform" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-surface-glass backdrop-blur-xl border border-electric-500/30 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.15)] p-4 w-72 origin-bottom-left mb-16"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-electric-400" />
                Ask LearnFlow AI
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              I can help you summarize notes, generate quizzes, or explain complex topics. What do you need help with?
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setIsOpen(false); navigate(ROUTES.chat); }}
                className="w-full py-2 px-3 bg-electric-600 hover:bg-electric-500 text-white text-xs font-medium rounded-lg transition-colors text-left flex justify-between items-center"
              >
                Open AI Chat <span>→</span>
              </button>
              <button 
                onClick={() => { setIsOpen(false); navigate(ROUTES.quiz); }}
                className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg transition-colors text-left flex justify-between items-center border border-white/10"
              >
                Generate Quiz <span>→</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Companion and Controls Container */}
      <div className="relative flex items-end justify-start">
        {/* Voice Toggle */}
        <button
          onClick={() => {
            if (isSpeaking) synth?.cancel();
            setVoiceEnabled(!voiceEnabled);
          }}
          className={cn(
            "absolute -right-12 bottom-6 p-2 rounded-full backdrop-blur-md border transition-all z-10 shadow-lg",
            voiceEnabled 
              ? "bg-electric-500/20 border-electric-500/30 text-electric-400 hover:bg-electric-500/30" 
              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700"
          )}
          title={voiceEnabled ? "Mute AI Voice" : "Unmute AI Voice"}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
             if (!isOpen && voiceEnabled && synth) {
               speak("How can I assist you today?");
             }
             setIsOpen(!isOpen);
          }}
          className={cn(
            "relative w-20 h-20 rounded-full group focus:outline-none focus:ring-4 focus:ring-electric-500/50 transition-transform duration-300 hover:scale-105",
            isSpeaking && "animate-pulse"
          )}
          aria-label="Toggle AI Companion"
        >
          <div className={cn(
            "absolute inset-0 rounded-full blur-xl transition-all duration-500",
            isSpeaking ? "bg-cyber-500/40" : "bg-electric-500/20 group-hover:bg-electric-500/40"
          )} />
          <div className="w-full h-full pointer-events-none">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
              <pointLight position={[-5, -5, -5]} intensity={1} color={isSpeaking ? "#06B6D4" : "#EC4899"} />
              <MiniOrb state={isSpeaking ? "talking" : (isOpen ? "active" : "idle")} mousePos={mousePos} />
            </Canvas>
          </div>
        </button>
      </div>
    </div>
  );
};

export default FloatingAICompanion;
