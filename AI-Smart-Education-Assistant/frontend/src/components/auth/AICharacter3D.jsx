import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Html } from "@react-three/drei";
import * as THREE from "three";

// The actual 3D Orb Component
const HolographicOrb = ({ state, mousePos }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const ringGroupRef = useRef();

  // Define target states
  const targetColor = useMemo(() => {
    switch (state) {
      case "success": return new THREE.Color("#10B981"); // Success green
      case "error": return new THREE.Color("#EF4444"); // Danger red
      case "eyes_closed": return new THREE.Color("#8B5CF6"); // Privacy purple
      default: return new THREE.Color("#38BDF8"); // Idle cyan
    }
  }, [state]);

  const targetDistort = useMemo(() => {
    switch (state) {
      case "success": return 0.6; // Bubbly and happy
      case "error": return 0.8; // Spiky and erratic
      case "eyes_closed": return 0.2; // Calm and smooth
      default: return 0.4; // Normal breathing
    }
  }, [state]);

  const targetSpeed = useMemo(() => {
    switch (state) {
      case "success": return 4;
      case "error": return 6;
      case "eyes_closed": return 1;
      default: return 2;
    }
  }, [state]);

  useFrame((stateObj, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    // Smoothly interpolate color, distortion, and speed
    materialRef.current.color.lerp(targetColor, delta * 3);
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, delta * 2);
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, delta * 2);

    // Mouse follow
    const targetX = (mousePos.x - window.innerWidth / 2) * 0.002;
    const targetY = -(mousePos.y - window.innerHeight / 2) * 0.002;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, delta * 2);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 2);
    
    // Slight rotation based on mouse
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetY * 2, delta * 2);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX * 2, delta * 2);

    // Orbiting Ring
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.y += delta * 1.5;
      ringGroupRef.current.rotation.x += delta * 0.5;
      ringGroupRef.current.rotation.z += delta * 1.0;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#38BDF8"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.2}
          distort={0.4}
          speed={2}
          wireframe={state === "error"}
          transparent
          opacity={0.85}
        />
      </Sphere>
      
      {/* Glow effect */}
      <Sphere args={[1.6, 32, 32]}>
        <meshBasicMaterial 
          color={targetColor} 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Orbiting Ring with Dot */}
      <group ref={ringGroupRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.0, 0.02, 16, 100]} />
          <meshBasicMaterial color={targetColor} transparent opacity={0.4} />
        </mesh>
        <mesh position={[2.0, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Eyes */}
      {state !== "eyes_closed" && state !== "error" && (
        <group position={[0, 0, 1.3]}>
          <mesh position={[-0.4, 0.2, 0]}>
            <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.4, 0.2, 0]}>
            <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}
      
      {/* Closed eyes line */}
      {state === "eyes_closed" && (
        <group position={[0, 0, 1.3]}>
          <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.03, 0.3, 4, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.03, 0.3, 4, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}
      
      {/* Mouth */}
      {state === "success" && (
        // Happy smile
        <mesh position={[0, -0.2, 1.35]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.2, 0.04, 16, 32, Math.PI]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
      {state === "error" && (
        // Sad frown
        <mesh position={[0, -0.3, 1.35]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.2, 0.04, 16, 32, Math.PI]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
      {state !== "success" && state !== "error" && (
        // Neutral line
        <mesh position={[0, -0.2, 1.35]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.02, 0.2, 4, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </Float>
  );
};

export const AICharacter3D = ({ state = "idle", mousePos = { x: 0, y: 0 }, speechMessage = "" }) => {
  return (
    <div className="w-full h-[400px] flex items-center justify-center pointer-events-none relative">
      {speechMessage && (
        <div 
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 font-medium text-sm transition-all animate-fade-in"
          role="alert"
          aria-live="assertive"
        >
          {speechMessage}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700 transform rotate-45" />
        </div>
      )}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#8B5CF6" />
        <pointLight position={[0, 5, 5]} intensity={2} color="#38BDF8" />
        <HolographicOrb state={state} mousePos={mousePos} />
      </Canvas>
    </div>
  );
};

export default AICharacter3D;
