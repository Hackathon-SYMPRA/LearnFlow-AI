import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  BookMarked,
  Sparkles,
  Lightbulb,
  Eye,
  X,
} from 'lucide-react';
import type { Citation } from '@/types';
import { cn } from '@/utils/format';

interface RelatedDocument {
  id: string;
  name: string;
  pages?: number;
  subject?: string;
}

interface ExamTip {
  id: string;
  text: string;
}

interface CitationPanelProps {
  citations: Citation[];
  className?: string;
  open?: boolean;
  onClose?: () => void;
  relatedDocuments?: RelatedDocument[];
  topics?: string[];
  examTips?: ExamTip[];
}

const DEFAULT_RELATED: RelatedDocument[] = [
  { id: 'r1', name: 'Calculus_Chapter3_Limits.pdf', pages: 42, subject: 'Mathematics' },
  { id: 'r2', name: 'LinearAlgebra_Vectors_Notes.docx', pages: 18, subject: 'Mathematics' },
  { id: 'r3', name: 'Physics_Mechanics_StudyGuide.pdf', pages: 67, subject: 'Physics' },
  { id: 'r4', name: 'Chemistry_Bonding_Summary.pdf', pages: 24, subject: 'Chemistry' },
];

const DEFAULT_TOPICS = [
  'Derivatives',
  'Chain Rule',
  'Limits',
  'Continuity',
  'Integration',
  'Applications',
];

const DEFAULT_TIPS: ExamTip[] = [
  {
    id: 't1',
    text: 'Always verify continuity before applying L\u2019H\u00f4pital\u2019s rule on limits.',
  },
  {
    id: 't2',
    text: 'Remember the chain rule when differentiating composite functions step by step.',
  },
  {
    id: 't3',
    text: 'Sketch graphs of functions first to visually estimate limit behaviour.',
  },
];

const getConfidenceTone = (c?: number) => {
  if (typeof c !== 'number') {
    return {
      label: 'Reference',
      classes:
        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      bar: 'bg-slate-400',
    };
  }
  if (c >= 0.85) {
    return {
      label: 'High Confidence',
      classes:
        'bg-accent-100 text-accent-700 dark:bg-accent-950/60 dark:text-accent-400',
      bar: 'bg-accent-500',
    };
  }
  if (c >= 0.6) {
    return {
      label: 'Medium Confidence',
      classes:
        'bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-400',
      bar: 'bg-primary-500',
    };
  }
  return {
    label: 'Low Confidence',
    classes:
      'bg-warning-100 text-warning-700 dark:bg-warning-950/60 dark:text-warning-400',
    bar: 'bg-warning-500',
  };
};

export const CitationPanel: React.FC<CitationPanelProps> = ({
  citations,
  className,
  open = true,
  onClose,
  relatedDocuments = DEFAULT_RELATED,
  topics = DEFAULT_TOPICS,
  examTips = DEFAULT_TIPS,
}) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [snippetOpen, setSnippetOpen] = useState<number | null>(null);

  const toggle = (idx: number) =>
    setExpandedIdx((prev) => (prev === idx ? null : idx));

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className={cn(
            'flex h-full flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 lg:w-80 xl:w-96',
            className
          )}
        >
          <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <ShieldCheck className="h-4 w-4 text-primary-500" />
                Sources Used
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {citations.length} source{citations.length === 1 ? '' : 's'} cited in the answer
              </p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close citations panel"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            <section>
              {citations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center">
                  <FileText className="h-6 w-6 mx-auto text-slate-400" />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    No sources cited yet. Ask a question about your documents to see references.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {citations.map((c, idx) => {
                    const tone = getConfidenceTone(c.confidence);
                    const isOpen = expandedIdx === idx;
                    const confidencePct =
                      typeof c.confidence === 'number'
                        ? Math.round(c.confidence * 100)
                        : null;
                    return (
                      <motion.article
                        key={idx}
                        layout
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggle(idx)}
                          className="w-full flex items-start gap-3 p-3 text-left hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition"
                        >
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-primary-600 dark:text-primary-400">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                {c.documentName}
                              </p>
                              <span className="shrink-0 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                #{idx + 1}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                              {c.page && (
                                <span className="chip bg-slate-200/70 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300">
                                  Page {c.page}
                                </span>
                              )}
                              <span className={cn('chip', tone.classes)}>
                                {tone.label}
                                {confidencePct !== null &&
                                  ` \u2022 ${confidencePct}%`}
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 mt-1 text-slate-400">
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 pt-0">
                                <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3">
                                  <div className="mb-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    <div
                                      className={cn('h-full rounded-full', tone.bar)}
                                      style={{
                                        width: `${
                                          typeof c.confidence === 'number'
                                            ? Math.max(10, c.confidence * 100)
                                            : 50
                                        }%`,
                                      }}
                                    />
                                  </div>
                                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-4">
                                    {c.text}
                                  </p>
                                  <div className="mt-2 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSnippetOpen(idx);
                                      }}
                                      className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                      View snippet
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                <BookMarked className="h-3.5 w-3.5" />
                Related Documents
              </h4>
              <div className="space-y-1.5">
                {relatedDocuments.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    className="w-full flex items-center gap-3 rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary-100 text-secondary-600 dark:bg-secondary-950/60 dark:text-secondary-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {doc.subject}
                        {doc.pages ? ` \u2022 ${doc.pages} pages` : ''}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                <Sparkles className="h-3.5 w-3.5" />
                Topics Mentioned
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {topics.map((t) => (
                  <span
                    key={t}
                    className="chip bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 border border-primary-100 dark:border-primary-900/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900/40 p-4">
                <h4 className="flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-300">
                  <Lightbulb className="h-4 w-4" />
                  Exam Tips
                </h4>
                <ul className="mt-3 space-y-2">
                  {examTips.map((tip) => (
                    <li
                      key={tip.id}
                      className="flex gap-2 text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90"
                    >
                      <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>{tip.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <AnimatePresence>
            {snippetOpen !== null && citations[snippetOpen] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
                onClick={() => setSnippetOpen(null)}
              >
                <motion.div
                  initial={{ scale: 0.96, y: 8 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 8 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                  className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <header className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {citations[snippetOpen].documentName}
                        </p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          {citations[snippetOpen].page && (
                            <span className="chip bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              Page {citations[snippetOpen].page}
                            </span>
                          )}
                          {typeof citations[snippetOpen].confidence ===
                            'number' && (
                            <span
                              className={cn(
                                'chip',
                                getConfidenceTone(
                                  citations[snippetOpen].confidence
                                ).classes
                              )}
                            >
                              {
                                getConfidenceTone(
                                  citations[snippetOpen].confidence
                                ).label
                              }{' '}
                              \u2022{' '}
                              {Math.round(
                                (citations[snippetOpen].confidence ?? 0) * 100
                              )}
                              %
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSnippetOpen(null)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label="Close snippet"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </header>
                  <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <span>Confidence</span>
                        <span>
                          {typeof citations[snippetOpen].confidence === 'number'
                            ? Math.round(citations[snippetOpen].confidence! * 100)
                            : '\u2014'}
                          %
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            getConfidenceTone(
                              citations[snippetOpen].confidence
                            ).bar
                          )}
                          style={{
                            width: `${
                              typeof citations[snippetOpen].confidence ===
                              'number'
                                ? citations[snippetOpen].confidence! * 100
                                : 50
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4">
                      <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                        {citations[snippetOpen].text}
                      </p>
                    </div>
                  </div>
                  <footer className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800 px-5 py-3">
                    <button
                      type="button"
                      onClick={() => setSnippetOpen(null)}
                      className="h-9 px-4 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Close
                    </button>
                  </footer>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
