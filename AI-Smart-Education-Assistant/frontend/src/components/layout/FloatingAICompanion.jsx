import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

const MiniOrb = ({ state, mousePos }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const ringGroupRef = useRef();

  const targetColor = useMemo(() => {
    switch (state) {
      case "success": return new THREE.Color("#10B981"); // Emerald
      case "warning": return new THREE.Color("#EF4444"); // Fire Red
      case "active": return new THREE.Color("#F59E0B"); // Amber Gold
      default: return new THREE.Color("#8B5CF6"); // Electric Violet
    }
  }, [state]);

  const targetDistort = useMemo(() => {
    switch (state) {
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

    // Subtle breathing rotation
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;

    // Eye tracking (look at mouse)
    const targetX = (mousePos.x - window.innerWidth / 2) * 0.001;
    const targetY = -(mousePos.y - window.innerHeight / 2) * 0.001;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, delta * 2);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 2);

    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.y += delta * 1.5;
      ringGroupRef.current.rotation.x += delta * 0.5;
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
          speed={2}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Outer Glow */}
      <Sphere args={[1.3, 16, 16]}>
        <meshBasicMaterial 
          color={targetColor} 
          transparent 
          opacity={0.2} 
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Orbiting Ring */}
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

      {/* Mini Eyes */}
      <group position={[0, 0, 1.1]}>
        <mesh position={[-0.3, 0.1, 0]}>
          <capsuleGeometry args={[0.06, 0.15, 4, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.3, 0.1, 0]}>
          <capsuleGeometry args={[0.06, 0.15, 4, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </Float>
  );
};

const FloatingAICompanion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-surface-glass backdrop-blur-xl border border-electric-500/30 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.15)] p-4 w-72 origin-bottom-right"
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

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-20 h-20 rounded-full group focus:outline-none focus:ring-4 focus:ring-electric-500/50"
        aria-label="Toggle AI Companion"
      >
        <div className="absolute inset-0 bg-electric-500/20 rounded-full blur-xl group-hover:bg-electric-500/40 transition-colors duration-500" />
        <div className="w-full h-full pointer-events-none">
          <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
            <pointLight position={[-5, -5, -5]} intensity={1} color="#EC4899" />
            <MiniOrb state={isOpen ? "active" : "idle"} mousePos={mousePos} />
          </Canvas>
        </div>
      </button>
    </div>
  );
};

export default FloatingAICompanion;
