import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phrases = [
  "AI Friend",
  "Voice Viva",
  "PDF Summarizer",
  "Quiz Generator",
  "Flashcards",
  "Study Planner"
];

export const AnimatedTyping = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 overflow-hidden relative w-full flex items-center justify-start mt-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -20, opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400"
        >
          {phrases[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedTyping;
