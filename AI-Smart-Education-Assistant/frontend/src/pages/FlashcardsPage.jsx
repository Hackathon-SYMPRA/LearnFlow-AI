import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { NoFlashcards } from "@/components/ui/EmptyState";
import { Sparkles, Layers, BookOpen, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { flashcardService, documentService } from "../services";

const FlashcardItem = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(card.bookmarked || false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "hard": return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      default: return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  return (
    <div 
      className="relative w-full h-64 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front (Question) */}
        <div 
          className="absolute w-full h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Layers className="h-3 w-3" /> {card.subject || "General"}
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md w-fit ${getDifficultyColor(card.difficulty)}`}>
                {card.difficulty || "Medium"}
              </span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
              className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isBookmarked ? 'text-primary-500' : 'text-slate-400'}`}
            >
              <Bookmark className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{card.question}</h3>
          </div>
          <p className="text-xs text-center text-slate-400 mt-4">Click to flip</p>
        </div>

        {/* Back (Answer) */}
        <div 
          className="absolute w-full h-full bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 shadow-sm p-6 flex flex-col"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">Answer</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-center overflow-y-auto">
            <p className="text-base text-slate-700 dark:text-slate-300">{card.answer}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const FlashcardsPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await documentService.list();
        setDocuments(response.data || []);
      } catch (err) {
        toast.error("Failed to load documents");
      }
    };
    fetchDocs();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setFlashcards([]);
    
    try {
      const response = await flashcardService.generate(selectedDoc ? [selectedDoc] : [], { num_flashcards: 6 });
      const data = response.data?.flashcards;
      if (data && Array.isArray(data)) {
        setFlashcards(data);
        toast.success("Flashcards generated successfully!");
      } else {
        toast.error("Failed to parse flashcards data");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.message || "Failed to generate flashcards");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary-500" />
            Flashcards
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Spaced repetition flashcards generated from your study materials
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
          >
            <option value="">Search across all documents...</option>
            {documents.map(doc => (
              <option key={doc._id || doc.id} value={doc._id || doc.id}>{doc.original_name || doc.file_name}</option>
            ))}
          </select>
          <Button
            variant="primary"
            leftIcon={isGenerating ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Sparkles className="h-4 w-4" />}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Flashcards"}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500 dark:border-slate-700 dark:border-t-primary-500 mb-6" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Analyzing Material...</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Extracting key concepts to create flashcards</p>
          </motion.div>
        ) : flashcards.length > 0 ? (
          <motion.div 
            key="cards"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {flashcards.map((card, idx) => (
              <FlashcardItem key={idx} card={card} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardContent className="pt-6">
                <NoFlashcards onGenerate={handleGenerate} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
