import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  BrainCircuit,
  Layers,
  UploadCloud,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { APP_NAME } from '@/constants';
import { cn } from '@/utils/format';

const features = [
  { icon: UploadCloud, title: 'Upload Materials', desc: 'PDFs, notes, docs, images' },
  { icon: BrainCircuit, title: 'AI Tutor', desc: 'Answers grounded in your sources' },
  { icon: Layers, title: 'Flashcards & Quizzes', desc: 'Active recall, spaced repetition' },
  { icon: BookOpen, title: 'Smart Planner', desc: 'AI-built study schedules' },
];

interface AuthShellProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

const AuthShellHero: React.FC = () => {
  return (
    <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white p-8 lg:p-12 flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xl font-bold">{APP_NAME}</p>
          <p className="text-xs text-white/80">Smart Education Assistant</p>
        </div>
      </div>

      <div className="mt-auto space-y-8 max-w-lg">
        <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-balance">
          Learn smarter with AI that reads alongside you
        </h2>
        <p className="text-base lg:text-lg text-white/80">
          Upload any study material, ask questions, generate quizzes, flashcards, and personalized study plans — all grounded in your content.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm p-4 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 mb-3">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="font-semibold">{f.title}</p>
              <p className="text-xs text-white/70 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-sm text-white/70">
        © {new Date().getFullYear()} {APP_NAME} · Built for curious learners.
      </p>

      <div
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary-500/30 blur-3xl"
        aria-hidden="true"
      />
    </div>
  );
};

const MobileBrand: React.FC = () => {
  return (
    <div className="md:hidden flex items-center gap-3 mb-8 justify-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
        <Sparkles className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{APP_NAME}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Smart Education Assistant</p>
      </div>
    </div>
  );
};

export const AuthShell: React.FC<AuthShellProps> = ({
  children,
  className,
  maxWidth = 'max-w-md',
}) => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex md:grid md:grid-cols-2">
      <AuthShellHero />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn('w-full', maxWidth)}
        >
          <MobileBrand />
          <Card className={cn('p-6 sm:p-8', className)}>{children}</Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthShell;
