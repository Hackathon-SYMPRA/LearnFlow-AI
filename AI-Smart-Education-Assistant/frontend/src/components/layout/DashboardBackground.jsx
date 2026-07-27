import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const DashboardBackground = () => {
  const canvasRef = useRef(null);
  const spotlightRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const { theme } = useTheme();

  // Handle Mouse Move for Interactive Glow without triggering React re-renders
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Update spotlight position directly via DOM
      if (spotlightRef.current) {
        const color = theme === 'dark' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.02)';
        spotlightRef.current.style.background = `radial-gradient(circle 600px at ${e.clientX}px ${e.clientY}px, ${color}, transparent 80%)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [theme]);

  // Canvas Starfield and Floating Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    const numParticles = 60; // Subtle dust particles

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        
        const colors = [
          'rgba(139, 92, 246, OPACITY)', // Violet
          'rgba(6, 182, 212, OPACITY)',  // Cyan
          'rgba(245, 158, 11, OPACITY)'  // Amber
        ];
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      }

      update(mouseX, mouseY) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        if (mouseX && mouseY) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor.replace('OPACITY', this.opacity.toString());
        ctx.fill();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(mousePos.current.x, mousePos.current.y);
        p.draw();
      });
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">
      {/* Deep Base Background */}
      <div className="absolute inset-0 bg-surface-light dark:bg-surface transition-colors duration-700" />
      
      {/* Mesh Gradients (Dark Mode only) */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-40' : 'opacity-0'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-electric-600/20 blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyber-600/20 blur-[120px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-flame-500/10 blur-[100px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Mesh Gradients (Light Mode) */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-0' : 'opacity-60'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-electric-400/20 blur-[120px] mix-blend-multiply animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyber-400/20 blur-[120px] mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Canvas for Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60" />

      {/* Mouse Spotlight Glow */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 z-10 transition-opacity duration-300 mix-blend-screen"
      />
    </div>
  );
};

export default DashboardBackground;
