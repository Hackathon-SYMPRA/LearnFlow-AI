import React from "react";

export const CompactLogo = ({ className = "", size = "56px", showWordmark = false }) => {
  return (
    <div
      className={`group relative inline-flex items-center gap-3 shrink-0 ${className}`}
      style={{
        "--logo-size": size,
        perspective: "400px"
      }}
    >
      <style>{`
        /* Core Infinite Animations */
        @keyframes float-logo-v2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes hue-pulse-v2 {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes scale-pulse-v2 {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes ring-spin-v2 {
          0% { transform: rotateX(65deg) rotateY(10deg) rotateZ(0deg); }
          100% { transform: rotateX(65deg) rotateY(10deg) rotateZ(360deg); }
        }
        @keyframes spark-orbit-v2 {
          0% { transform: rotate(0deg) translateX(50%) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(50%) rotate(-360deg); }
        }
        @keyframes shimmer-text-v2 {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        /* Hover Animations */
        @keyframes hover-burst-v2 {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(1.7); opacity: 0; }
        }

        /* Class Assignments */
        .anim-float-v2 { animation: float-logo-v2 3s ease-in-out infinite; }
        .anim-hue-v2 { animation: hue-pulse-v2 5s linear infinite; }
        .anim-scale-pulse-v2 { animation: scale-pulse-v2 2.2s ease-in-out infinite; }
        .anim-spark-v2 { animation: spark-orbit-v2 3.5s linear infinite; }
        .anim-shimmer-text-v2 {
          background-size: 200% auto !important;
          animation: shimmer-text-v2 4s linear infinite;
        }

        /* Ring Transition (Speed up on hover) */
        .anim-ring-spin-v2 { 
          animation: ring-spin-v2 4s linear infinite; 
          transition: animation-duration 0.3s ease;
        }
        .group:hover .anim-ring-spin-v2 {
          animation-duration: 1.2s;
        }

        /* Orb Glow Transition (Intensify on hover) */
        .orb-glow-v2 {
          box-shadow: 0 0 12px rgba(139,92,246,0.5), inset 0 0 8px rgba(255,255,255,0.4);
          transition: box-shadow 0.3s ease;
        }
        .group:hover .orb-glow-v2 {
          box-shadow: 0 0 25px rgba(139,92,246,0.9), inset 0 0 12px rgba(255,255,255,0.6);
        }
        
        /* Burst Effect */
        .burst-ring-v2 {
          opacity: 0;
          transform: scale(0.6);
        }
        .group:hover .burst-ring-v2 {
          animation: hover-burst-v2 0.6s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .anim-float-v2, .anim-hue-v2, .anim-scale-pulse-v2, 
          .anim-ring-spin-v2, .anim-spark-v2, .anim-shimmer-text-v2,
          .group:hover .burst-ring-v2 {
            animation: none !important;
            transform: none !important;
            filter: none !important;
          }
          .anim-ring-spin-v2 {
            transform: rotateX(65deg) rotateY(10deg) rotateZ(0deg) !important;
          }
        }
      `}</style>

      {/* 56x56 Container */}
      <div 
        className="relative flex items-center justify-center anim-float-v2"
        style={{ width: "var(--logo-size)", height: "var(--logo-size)" }}
      >
        {/* 1. Burst Ring (Triggers on hover) */}
        <div className="absolute w-[90%] h-[90%] rounded-full border-2 border-[#FBBF24] burst-ring-v2 pointer-events-none" />

        {/* 2. 3D Ring with Orbiting Spark */}
        <div className="absolute w-[110%] h-[110%] rounded-full anim-ring-spin-v2 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {/* Main ring visible border */}
          <div 
            className="absolute inset-0 rounded-full border border-transparent"
            style={{ 
              borderTopColor: '#22D3EE',
              borderRightColor: '#22D3EE',
              filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.6))',
              opacity: 0.9
            }}
          />
          {/* Orbiting Spark (Attached to Ring's coordinate space) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* The spark itself needs counter-rotation to face camera if it was a 2D element, but since it's a circle we just translate it to the edge */}
            <div 
              className="w-[15%] h-[15%] bg-[#FBBF24] rounded-full anim-spark-v2"
              style={{ boxShadow: '0 0 6px #FBBF24' }}
            />
          </div>
        </div>

        {/* 3. Glowing Orb */}
        <div className="absolute w-[75%] h-[75%] rounded-full anim-scale-pulse-v2 pointer-events-none">
          <div 
            className="w-full h-full rounded-full orb-glow-v2 anim-hue-v2 relative overflow-hidden"
            style={{
              background: 'conic-gradient(from 0deg, #8B5CF6, #22D3EE, #EC4899, #FBBF24, #8B5CF6)'
            }}
          >
            {/* Radial glossy highlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_50%)]" />
          </div>
        </div>

        {/* 4. Minimal White Flow Icon */}
        <div className="absolute z-10 w-[45%] h-[45%] pointer-events-none">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" }}>
            <path d="M5 16C5 16 8 8 14 8C17 8 19 12 19 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="14" cy="8" r="2.5" fill="white" />
          </svg>
        </div>
      </div>

      {/* 5. Shimmering Wordmark */}
      {showWordmark && (
        <span 
          className="font-bold text-xl tracking-wide anim-shimmer-text-v2 bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #8B5CF6 0%, #22D3EE 25%, #EC4899 50%, #FBBF24 75%, #8B5CF6 100%)"
          }}
        >
          LearnFlow<span className="text-electric-500 bg-none" style={{ WebkitTextFillColor: '#8B5CF6' }}>.ai</span>
        </span>
      )}
    </div>
  );
};
