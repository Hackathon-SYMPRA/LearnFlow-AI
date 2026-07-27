import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const AuthBackground = ({ mousePos = { x: 0, y: 0 } }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    resize();

    // Init Stars
    const stars = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      opacity: Math.random(),
      speed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2
    }));

    // Init Particles
    const particles = Array.from({ length: 46 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: Math.random() * -0.5 - 0.2,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Stars
      stars.forEach(star => {
        star.phase += star.speed;
        star.opacity = (Math.sin(star.phase) + 1) / 2 * 0.8 + 0.1;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Draw Particles
      particles.forEach(p => {
        // Drifting up
        p.x += p.vx;
        p.y += p.vy;

        // Pull gently toward mouse
        if (mousePos.x !== 0 && mousePos.y !== 0) {
          const dx = mousePos.x - p.x;
          const dy = mousePos.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            p.x += dx * 0.001;
            p.y += dy * 0.001;
          }
        }

        // Reset if off screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`; // Accent purple
        ctx.fill();
      });

      // Draw Cursor Radial Glow
      if (mousePos.x !== 0 && mousePos.y !== 0) {
        const gradient = ctx.createRadialGradient(
          mousePos.x, mousePos.y, 0,
          mousePos.x, mousePos.y, 400
        );
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.08)'); // Sky blue glow
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#020617]">
      {/* Base Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] to-[#0F172A]" />
      
      {/* Rotating conic-gradient sweep */}
      <div className="absolute inset-0 opacity-20 bg-[conic-gradient(from_0deg_at_50%_50%,#020617_0deg,#6366F1_90deg,#020617_180deg,#06B6D4_270deg,#020617_360deg)] animate-[spin_20s_linear_infinite]" />

      {/* Aurora Mesh Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary-600/30 blur-[120px] mix-blend-screen"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, -90, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-secondary-600/30 blur-[120px] mix-blend-screen"
      />

      <motion.div
        animate={{
          y: [0, -50, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-accent-600/30 blur-[100px] mix-blend-screen"
      />

      {/* Canvas Layer for stars, particles, and cursor glow */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Overlay to dim slightly */}
      <div className="absolute inset-0 bg-slate-950/40 mix-blend-overlay" />
    </div>
  );
};

export default AuthBackground;
