import React, { useState } from "react";
import { GraduationCap, Send, Mic, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI Teacher. Are you ready for a quick exam on Thermodynamics?",
    isExamMode: true,
  }
];

export const AITeacherPage = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), role: "user", content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let aiMsg = { id: Date.now() + 1, role: "assistant", content: "" };
      
      if (messages.length === 1) {
        aiMsg.content = "Great! Let's start. What does the First Law of Thermodynamics state?";
      } else if (messages.length === 3) {
        if (userMsg.content.toLowerCase().includes("energy")) {
          aiMsg.content = "Excellent! You got it right. Energy cannot be created or destroyed, only transferred. Ready for the next question?";
          aiMsg.correct = true;
        } else {
          aiMsg.content = "Not quite. The First Law is about the conservation of energy. It states that energy cannot be created or destroyed. Try to remember this!";
          aiMsg.correct = false;
        }
      } else {
        aiMsg.content = "That wraps up our short exam session. You did well! Would you like to review another topic?";
      }

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900/50">
        <GraduationCap className="h-6 w-6 text-primary-500 mr-3" />
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Teacher & Exam Mode</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Interactive tutoring and evaluation</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-semibold text-accent-700 dark:bg-accent-950/40 dark:text-accent-400">
            <Sparkles className="h-3.5 w-3.5" /> Exam Mode Active
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'}`}>
                  {msg.role === 'user' ? 'U' : <GraduationCap className="h-4 w-4" />}
                </div>
                
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                  
                  {msg.correct !== undefined && (
                    <div className={`mt-2 flex items-center gap-1.5 text-sm font-medium ${msg.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {msg.correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {msg.correct ? "Correct Answer" : "Incorrect Answer"}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex max-w-[85%] gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-white border border-slate-200 px-5 py-4 dark:bg-slate-800 dark:border-slate-700 rounded-tl-none shadow-sm">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your answer here..."
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-4 pr-12 text-sm text-slate-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:bg-slate-800"
            />
            <button className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300">
              <Mic className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
