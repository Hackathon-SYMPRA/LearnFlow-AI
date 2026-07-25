import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { NoFlashcards } from '@/components/ui/EmptyState';
import { Layers, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';

export const FlashcardsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Flashcards</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Spaced repetition flashcards generated from your study materials
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Sparkles className="h-4 w-4" />}
          onClick={() => navigate(ROUTES.upload)}
        >
          Generate Flashcards
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {['Math', 'Physics', 'Chemistry', 'Biology'].map((subject) => (
          <Card key={subject} hoverable>
            <div className="flex h-24 items-center justify-center rounded-t-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-950/60 dark:to-secondary-950/60">
              <Layers className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
            <CardHeader>
              <CardTitle>{subject}</CardTitle>
              <CardDescription>No cards yet · 0 reviewed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800" />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">0% mastery</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Flashcards</CardTitle>
          <CardDescription>Browse and review your flashcard decks</CardDescription>
        </CardHeader>
        <CardContent>
          <NoFlashcards onGenerate={() => navigate(ROUTES.upload)} />
        </CardContent>
      </Card>
    </motion.div>
  );
};
