import React, { useState } from "react";
import { Sparkles, FileText, Download, Copy, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useCopyToClipboard } from "@/hooks";
import { SUBJECTS } from "@/constants";

// Mock documents for selection
const MOCK_DOCS = [
  { id: "1", name: "Introduction to Calculus.pdf", subject: "Mathematics" },
  { id: "2", name: "Physics Chapter 4 - Thermodynamics.pdf", subject: "Physics" },
  { id: "3", name: "World War II Summary.docx", subject: "History" },
];

const NOTE_TYPES = [
  { id: "short", label: "Short Notes", desc: "Brief bullet points for quick revision" },
  { id: "detailed", label: "Detailed Notes", desc: "Comprehensive notes with explanations" },
  { id: "summary", label: "Chapter Summary", desc: "A high-level overview of the entire document" },
  { id: "formula", label: "Formula & Key Points", desc: "Extracted formulas and key definitions only" },
];

const MOCK_GENERATED_NOTE = `## Thermodynamics Summary

### 1. The Laws of Thermodynamics
- **First Law (Conservation of Energy):** Energy cannot be created or destroyed, only altered in form. $\\Delta U = Q - W$
- **Second Law (Entropy):** The total entropy of an isolated system can never decrease over time.
- **Third Law:** As temperature approaches absolute zero, the entropy of a system approaches a constant minimum.

### 2. Key Concepts
- **Heat (Q):** Energy transferred due to a temperature difference.
- **Work (W):** Energy transferred when an object is moved over a distance by an external force.
- **Internal Energy (U):** Total kinetic and potential energy of particles in a system.

### 3. Important Formulas
- $Q = mc\\Delta T$ (Specific Heat Capacity)
- $PV = nRT$ (Ideal Gas Law)
- $W = P\\Delta V$ (Work done by a gas)

> **Study Tip:** Remember that in an isothermal process, temperature remains constant, meaning $\\Delta U = 0$ for an ideal gas.
`;

export const NotesPage = () => {
  const [selectedDoc, setSelectedDoc] = useState("");
  const [selectedType, setSelectedType] = useState("detailed");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNote, setGeneratedNote] = useState("");
  const [copyToClipboard, { success: isCopied }] = useCopyToClipboard();

  const handleGenerate = () => {
    if (!selectedDoc) {
      toast.error("Please select a document first");
      return;
    }
    
    setIsGenerating(true);
    setGeneratedNote("");
    
    // Simulate API Call for generation
    setTimeout(() => {
      setGeneratedNote(MOCK_GENERATED_NOTE);
      setIsGenerating(false);
      toast.success("Notes generated successfully!");
    }, 2500);
  };

  const handleCopy = () => {
    if (generatedNote) {
      copyToClipboard(generatedNote);
      toast.success("Notes copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (generatedNote) {
      const blob = new Blob([generatedNote], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Study_Notes.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Notes downloaded as Markdown");
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900/50">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-500" />
            AI Notes Generator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Generate structured study notes from your uploaded materials
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-80 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 overflow-y-auto shrink-0 flex flex-col gap-6">
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Select Study Material
            </label>
            <div className="relative">
              <select 
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                value={selectedDoc}
                onChange={(e) => setSelectedDoc(e.target.value)}
              >
                <option value="" disabled>Choose a document...</option>
                {MOCK_DOCS.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Note Type
            </label>
            <div className="flex flex-col gap-3">
              {NOTE_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={\`flex flex-col items-start rounded-xl border p-3 transition-all \${
                    selectedType === type.id 
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500" 
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                  }\`}
                >
                  <span className={\`text-sm font-semibold \${selectedType === type.id ? "text-primary-700 dark:text-primary-400" : "text-slate-900 dark:text-slate-100"}\`}>
                    {type.label}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-left">
                    {type.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Notes
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Content - Output */}
        <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900 flex flex-col relative p-6">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="generating"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500 dark:border-slate-700 dark:border-t-primary-500 mb-6" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Analyzing Document...</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Extracting key concepts and preparing structured notes</p>
              </motion.div>
            ) : generatedNote ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800/80">
                  <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-500" />
                    Generated Notes
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      Copy
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download MD
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8">
                  {/* Basic Markdown Rendering (Simulation) */}
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                     <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 bg-transparent border-0 p-0 m-0 text-base leading-relaxed">
                        {generatedNote}
                     </pre>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto"
              >
                <div className="h-20 w-20 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-full flex items-center justify-center mb-6">
                  <FileText className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Notes Generated Yet</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Select a study material from the left panel and choose the type of notes you want to generate. Our AI will automatically extract and organize the information for you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
