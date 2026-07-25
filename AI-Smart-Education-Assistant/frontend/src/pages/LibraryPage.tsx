import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Star,
  MoreVertical,
  Eye,
  Download,
  Pencil,
  Upload as UploadIcon,
  Trash2,
  FileText,
  File,
  Image as ImageIcon,
  FileType,
  X,
  Folder,
  SortAsc,
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Brain,
  Globe,
  History,
  Newspaper,
  LineChart,
  Theater,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Document, Subject } from '@/types';
import { ROUTES, SUBJECT_COLORS, SUBJECT_ICONS, STORAGE_KEYS } from '@/constants';
import { useDebounce, useLocalStorage } from '@/hooks';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Form';
import { NoDocuments, NoSearchResults } from '@/components/ui/EmptyState';
import { cn, formatFileSize, formatRelativeTime, formatDate, generateId } from '@/utils/format';

const subjectIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Brain,
  Globe,
  History,
  Newspaper,
  LineChart,
  Theater,
};

const getDemoDocuments = (): Document[] => [
  { id: generateId(), name: 'Calculus_Chapter5_Integration.pdf', type: 'pdf', size: 3200000, status: 'ready', uploadDate: new Date(Date.now() - 3600000 * 2).toISOString(), subject: 'Mathematics', pages: 45, favorite: true, lastOpened: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: generateId(), name: 'Organic_Chemistry_Notes_Reactions.pdf', type: 'pdf', size: 5400000, status: 'ready', uploadDate: new Date(Date.now() - 3600000 * 5).toISOString(), subject: 'Chemistry', pages: 72, favorite: false, lastOpened: new Date(Date.now() - 86400000).toISOString() },
  { id: generateId(), name: 'Physics_Waves_and_Optics.docx', type: 'doc', size: 890000, status: 'processing', uploadDate: new Date(Date.now() - 3600000 * 1).toISOString(), subject: 'Physics', pages: 18, progress: 65, favorite: false },
  { id: generateId(), name: 'Diagram_Mitochondria_Structure.png', type: 'image', size: 2100000, status: 'ready', uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(), subject: 'Biology', favorite: true, lastOpened: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: generateId(), name: 'CS_Algorithms_Notes.txt', type: 'text', size: 145000, status: 'ready', uploadDate: new Date(Date.now() - 86400000).toISOString(), subject: 'Computer Science', pages: 12, favorite: false, lastOpened: new Date(Date.now() - 3600000 * 6).toISOString() },
  { id: generateId(), name: 'World_War_II_Timeline.pdf', type: 'pdf', size: 2800000, status: 'ready', uploadDate: new Date(Date.now() - 86400000 * 5).toISOString(), subject: 'History', pages: 34, favorite: false },
  { id: generateId(), name: 'Macroeconomics_Study_Guide.pdf', type: 'pdf', size: 4100000, status: 'ready', uploadDate: new Date(Date.now() - 86400000 * 3).toISOString(), subject: 'Economics', pages: 58, favorite: true, lastOpened: new Date(Date.now() - 3600000 * 10).toISOString() },
  { id: generateId(), name: 'Hamlet_Act_by_Act_Analysis.docx', type: 'doc', size: 520000, status: 'ready', uploadDate: new Date(Date.now() - 86400000 * 4).toISOString(), subject: 'English Literature', pages: 22, favorite: false, lastOpened: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: generateId(), name: 'Quantum_Mechanics_Lecture.jpg', type: 'image', size: 3500000, status: 'ready', uploadDate: new Date(Date.now() - 86400000 * 6).toISOString(), subject: 'Physics', favorite: false },
  { id: generateId(), name: 'Neural_Networks_Overview.pdf', type: 'pdf', size: 6200000, status: 'failed', uploadDate: new Date(Date.now() - 3600000 * 30).toISOString(), subject: 'Computer Science', pages: 88, favorite: false, processingError: 'File corrupted during upload' },
];

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'smallest' | 'largest' | 'name-asc' | 'name-desc';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const getFileIcon = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />;
    case 'doc':
      return <File className="h-5 w-5 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />;
    case 'image':
      return <ImageIcon className="h-5 w-5 text-accent-600 dark:text-accent-400" aria-hidden="true" />;
    case 'text':
      return <FileType className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />;
    default:
      return <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />;
  }
};

const getSubjectColor = (subjectName: string, subjects: Subject[]): string => {
  const found = subjects.find((s) => s.name === subjectName);
  return found?.color ?? SUBJECT_COLORS[0];
};

interface PreviewModalProps {
  open: boolean;
  doc: Document | null;
  onClose: () => void;
  onDownload: (doc: Document) => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ open, doc, onClose, onDownload }) => {
  if (!open || !doc) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white dark:bg-slate-900 shadow-dropdown border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="min-w-0 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                {getFileIcon(doc.type)}
              </div>
              <div className="min-w-0">
                <h2 id="preview-modal-title" className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {doc.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatFileSize(doc.size)} {doc.pages !== undefined ? `• ${doc.pages} pages` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={() => onDownload(doc)}
              >
                Download
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-950/50">
              <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-8 min-h-[500px]">
                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 mb-4">
                    {getFileIcon(doc.type)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{doc.name.replace(/\.[^.]+$/, '')}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Preview of document contents</p>
                </div>
                <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p className="font-medium text-lg text-slate-900 dark:text-slate-100">Document Summary</p>
                  <p>
                    This is a preview representation of your study document. In production, this would render the actual
                    PDF pages, document text, or image content. The preview allows you to quickly verify the document
                    content before asking questions or generating quizzes.
                  </p>
                  <p className="font-medium text-lg text-slate-900 dark:text-slate-100 mt-6">Key Topics</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Introduction to core concepts and foundational material</li>
                    <li>Detailed analysis with examples and diagrams</li>
                    <li>Practical applications and real-world scenarios</li>
                    <li>Summary and review questions at the end of each section</li>
                    <li>References and further reading recommendations</li>
                  </ul>
                  <p className="font-medium text-lg text-slate-900 dark:text-slate-100 mt-6">Page Preview</p>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm italic text-slate-500 dark:text-slate-400 mb-2">Page 1 of {doc.pages ?? 'N/A'}</p>
                    <p className="text-sm leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                      et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="hidden lg:block w-72 shrink-0 border-l border-slate-200 dark:border-slate-800 p-5 overflow-auto bg-white dark:bg-slate-900">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
                Metadata
              </h4>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500 dark:text-slate-400 text-xs">Type</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100 mt-0.5 uppercase">{doc.type}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400 text-xs">Subject</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-2">
                    <span
                      className="inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: SUBJECT_COLORS[0] }}
                      aria-hidden="true"
                    />
                    {doc.subject ?? 'Uncategorized'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400 text-xs">File Size</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">{formatFileSize(doc.size)}</dd>
                </div>
                {doc.pages !== undefined && (
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400 text-xs">Pages</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">{doc.pages}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-slate-500 dark:text-slate-400 text-xs">Uploaded</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">{formatDate(doc.uploadDate)}</dd>
                </div>
                {doc.lastOpened && (
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400 text-xs">Last Opened</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">{formatRelativeTime(doc.lastOpened)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-slate-500 dark:text-slate-400 text-xs">Status</dt>
                  <dd className="mt-0.5">
                    <span
                      className={cn(
                        'chip',
                        doc.status === 'ready' && 'bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400',
                        doc.status === 'processing' && 'bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400',
                        doc.status === 'uploading' && 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400',
                        doc.status === 'failed' && 'bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-400'
                      )}
                    >
                      {doc.status === 'ready' && 'Ready'}
                      {doc.status === 'processing' && 'Processing'}
                      {doc.status === 'uploading' && 'Uploading'}
                      {doc.status === 'failed' && 'Failed'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400 text-xs">Favorite</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1.5">
                    <Star className={cn('h-4 w-4', doc.favorite ? 'fill-warning-500 text-warning-500' : 'text-slate-300 dark:text-slate-600')} aria-hidden="true" />
                    {doc.favorite ? 'Yes' : 'No'}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface ContextMenuProps {
  open: boolean;
  doc: Document | null;
  onClose: () => void;
  onFavorite: (doc: Document) => void;
  onPreview: (doc: Document) => void;
  onDownload: (doc: Document) => void;
  onRename: (doc: Document) => void;
  onReplace: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ open, doc, onClose, onFavorite, onPreview, onDownload, onRename, onReplace, onDelete }) => {
  if (!open || !doc) return null;

  return (
    <div
      className="fixed inset-0 z-30"
      onClick={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-hidden="true"
    >
      <div
        className="absolute right-4 top-4 z-40 w-52 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-dropdown p-1.5"
        role="menu"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={() => { onFavorite(doc); onClose(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" role="menuitem">
          <Star className="h-4 w-4" /> {doc.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
        <button type="button" onClick={() => { onPreview(doc); onClose(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" role="menuitem">
          <Eye className="h-4 w-4" /> Preview
        </button>
        <button type="button" onClick={() => { onDownload(doc); onClose(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" role="menuitem">
          <Download className="h-4 w-4" /> Download
        </button>
        <button type="button" onClick={() => { onRename(doc); onClose(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" role="menuitem">
          <Pencil className="h-4 w-4" /> Rename
        </button>
        <button type="button" onClick={() => { onReplace(doc); onClose(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" role="menuitem">
          <UploadIcon className="h-4 w-4" /> Replace File
        </button>
        <div className="my-1 border-t border-slate-200 dark:border-slate-800" />
        <button type="button" onClick={() => { onDelete(doc); onClose(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-danger-50 dark:hover:bg-danger-950/30 text-danger-600 dark:text-danger-400" role="menuitem">
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </div>
  );
};

interface DocCardProps {
  doc: Document;
  subjects: Subject[];
  onToggleFavorite: (doc: Document) => void;
  onPreview: (doc: Document) => void;
  onDownload: (doc: Document) => void;
  onRename: (doc: Document) => void;
  onReplace: (doc: Document) => void;
  onDelete: (doc: Document) => void;
  onOpenMenu: (doc: Document) => void;
}

const DocCardGrid: React.FC<DocCardProps> = ({ doc, subjects, onToggleFavorite, onPreview, onDownload, onRename, onReplace, onDelete, onOpenMenu }) => {
  const subjectColor = getSubjectColor(doc.subject ?? '', subjects);
  const isFavorite = !!doc.favorite;

  return (
    <motion.div variants={item} whileHover={{ y: -4 }}>
      <Card hoverable padded={false} className="overflow-hidden group h-full flex flex-col">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden">
          {doc.type === 'image' && (
            <div className="absolute inset-0 bg-gradient-to-br from-accent-200 to-primary-200 dark:from-accent-950/30 dark:to-primary-950/30 opacity-50" />
          )}
          <div className={cn(
            'relative flex h-20 w-20 items-center justify-center rounded-2xl',
            doc.type === 'pdf' && 'bg-primary-100 dark:bg-primary-950/40',
            doc.type === 'doc' && 'bg-secondary-100 dark:bg-secondary-950/40',
            doc.type === 'image' && 'bg-accent-100 dark:bg-accent-950/40',
            doc.type === 'text' && 'bg-slate-100 dark:bg-slate-800'
          )}>
            {getFileIcon(doc.type)}
          </div>
          <button
            type="button"
            onClick={() => onToggleFavorite(doc)}
            className="absolute top-3 left-3 p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-500 hover:text-warning-500 dark:hover:text-warning-400 transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={cn('h-4 w-4 transition-colors', isFavorite ? 'fill-warning-500 text-warning-500' : '')} />
          </button>
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenMenu(doc);
              }}
              className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-500 hover:bg-white dark:hover:bg-slate-900 transition-colors opacity-0 group-hover:opacity-100"
              aria-label={`Actions for ${doc.name}`}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
          {doc.subject && (
            <div className="absolute bottom-3 left-3">
              <span
                className="chip backdrop-blur-sm"
                style={{ backgroundColor: `${subjectColor}20`, color: subjectColor }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: subjectColor }} aria-hidden="true" />
                {doc.subject}
              </span>
            </div>
          )}
          <span
            className={cn(
              'chip absolute bottom-3 right-3 backdrop-blur-sm',
              doc.status === 'ready' && 'bg-accent-50 text-accent-700 dark:bg-accent-950/60 dark:text-accent-400',
              doc.status === 'processing' && 'bg-warning-50 text-warning-700 dark:bg-warning-950/60 dark:text-warning-400',
              doc.status === 'uploading' && 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-400',
              doc.status === 'failed' && 'bg-danger-50 text-danger-700 dark:bg-danger-950/60 dark:text-danger-400'
            )}
          >
            {doc.status === 'ready' && 'Ready'}
            {doc.status === 'processing' && 'Processing'}
            {doc.status === 'uploading' && 'Uploading'}
            {doc.status === 'failed' && 'Failed'}
          </span>
        </div>

        <div className="p-4 flex flex-col flex-1 gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate" title={doc.name}>
              {doc.name}
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400">{formatFileSize(doc.size)}</span>
            {doc.pages !== undefined && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400">{doc.pages} pages</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-auto">
            <span>Uploaded {formatRelativeTime(doc.uploadDate)}</span>
            {doc.lastOpened && (
              <span>• Opened {formatRelativeTime(doc.lastOpened)}</span>
            )}
          </div>

          <div className="flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800 -mx-4 px-4 mt-auto">
            <button
              type="button"
              onClick={() => onPreview(doc)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Preview document"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button
              type="button"
              onClick={() => onDownload(doc)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Download document"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </button>
            <button
              type="button"
              onClick={() => onDelete(doc)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:bg-danger-50 dark:hover:bg-danger-950/30 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
              aria-label="Delete document"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

interface DocRowProps extends DocCardProps {}

const DocRowList: React.FC<DocRowProps> = ({ doc, subjects, onToggleFavorite, onPreview, onDownload, onRename, onReplace, onDelete, onOpenMenu }) => {
  const subjectColor = getSubjectColor(doc.subject ?? '', subjects);
  const isFavorite = !!doc.favorite;

  return (
    <motion.div
      variants={item}
      className="flex items-center gap-3 sm:gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    >
      <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
        {getFileIcon(doc.type)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(doc)}
            className="text-slate-400 hover:text-warning-500 dark:hover:text-warning-400 shrink-0"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={cn('h-4 w-4', isFavorite ? 'fill-warning-500 text-warning-500' : '')} />
          </button>
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100" title={doc.name}>
            {doc.name}
          </p>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {doc.subject && (
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: subjectColor }} aria-hidden="true" />
              {doc.subject}
            </span>
          )}
          <span>{formatFileSize(doc.size)}</span>
          {doc.pages !== undefined && <span>{doc.pages} pages</span>}
        </div>
      </div>

      <div className="hidden md:block text-xs text-slate-500 dark:text-slate-400 shrink-0 w-24 text-right">
        {doc.lastOpened ? formatRelativeTime(doc.lastOpened) : '—'}
      </div>

      <div className="shrink-0">
        <span
          className={cn(
            'chip',
            doc.status === 'ready' && 'bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400',
            doc.status === 'processing' && 'bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400',
            doc.status === 'uploading' && 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400',
            doc.status === 'failed' && 'bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-400'
          )}
        >
          {doc.status === 'ready' && 'Ready'}
          {doc.status === 'processing' && 'Processing'}
          {doc.status === 'uploading' && 'Uploading'}
          {doc.status === 'failed' && 'Failed'}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={() => onPreview(doc)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Preview"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDownload(doc)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Download"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onOpenMenu(doc)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="More actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [storedSubjects] = useLocalStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, []);
  const [documents, setDocuments] = useState<Document[]>([]);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [menuDoc, setMenuDoc] = useState<Document | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setDocuments(getDemoDocuments());
  }, []);

  const uniqueSubjects = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((d) => {
      if (d.subject) set.add(d.subject);
    });
    storedSubjects.forEach((s) => set.add(s.name));
    return Array.from(set).sort();
  }, [documents, storedSubjects]);

  const filtered = useMemo(() => {
    let list = documents;
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    if (selectedSubjects.length > 0) {
      list = list.filter((d) => d.subject && selectedSubjects.includes(d.subject));
    }
    if (favoritesOnly) {
      list = list.filter((d) => d.favorite);
    }
    const sorted = [...list];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
        break;
      case 'smallest':
        sorted.sort((a, b) => a.size - b.size);
        break;
      case 'largest':
        sorted.sort((a, b) => b.size - a.size);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    return sorted;
  }, [documents, debouncedSearch, selectedSubjects, sortBy, favoritesOnly]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const clearSubjects = () => setSelectedSubjects([]);

  const handleToggleFavorite = (doc: Document) => {
    setDocuments((list) =>
      list.map((d) => (d.id === doc.id ? { ...d, favorite: !d.favorite } : d))
    );
    toast.success(doc.favorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handlePreview = (doc: Document) => {
    setPreviewDoc(doc);
    setPreviewOpen(true);
  };

  const handleDownload = (doc: Document) => {
    toast.success(`Downloading ${doc.name}`);
  };

  const handleRename = (doc: Document) => {
    const newName = window.prompt('Rename document:', doc.name);
    if (newName && newName.trim()) {
      setDocuments((list) =>
        list.map((d) => (d.id === doc.id ? { ...d, name: newName.trim() } : d))
      );
      toast.success('Document renamed');
    }
  };

  const handleReplace = (doc: Document) => {
    toast.info(`Select a new file to replace ${doc.name}`);
  };

  const handleDelete = (doc: Document) => {
    if (window.confirm(`Delete "${doc.name}"? This cannot be undone.`)) {
      setDocuments((list) => list.filter((d) => d.id !== doc.id));
      toast.success('Document deleted');
    }
  };

  const handleOpenMenu = (doc: Document) => {
    setMenuDoc(doc);
    setMenuOpen(true);
  };

  const commonActions = {
    onToggleFavorite: handleToggleFavorite,
    onPreview: handlePreview,
    onDownload: handleDownload,
    onRename: handleRename,
    onReplace: handleReplace,
    onDelete: handleDelete,
    onOpenMenu: handleOpenMenu,
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Document Library</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {documents.length} document{documents.length !== 1 && 's'} organized and ready
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={cn(
                  'inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium transition-all',
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-3.5 w-3.5" /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
                className={cn(
                  'inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium transition-all',
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                aria-label="List view"
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
            </div>
            <Button
              variant="primary"
              leftIcon={<Upload className="h-4 w-4" />}
              onClick={() => navigate(ROUTES.upload)}
            >
              Upload
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card padded={false}>
          <div className="p-4 sm:p-5 space-y-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1 min-w-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Search documents by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  aria-label="Search documents"
                />
              </div>

              <div className="flex items-center gap-2">
                <SelectDocSort value={sortBy} onChange={setSortBy} />
                <button
                  type="button"
                  onClick={() => setFavoritesOnly((v) => !v)}
                  aria-pressed={favoritesOnly}
                  className={cn(
                    'inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border text-sm font-medium transition-all',
                    favoritesOnly
                      ? 'border-warning-300 bg-warning-50 text-warning-700 dark:border-warning-900 dark:bg-warning-950/30 dark:text-warning-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  )}
                  aria-label={favoritesOnly ? 'Show all documents' : 'Show favorites only'}
                >
                  <Star className={cn('h-4 w-4', favoritesOnly ? 'fill-warning-500 text-warning-500' : '')} />
                  <span className="hidden sm:inline">Favorites</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={clearSubjects}
                className={cn(
                  'chip transition-all',
                  selectedSubjects.length === 0
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 ring-1 ring-primary-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                )}
              >
                All
              </button>
              {uniqueSubjects.map((subj) => {
                const isActive = selectedSubjects.includes(subj);
                const color = getSubjectColor(subj, storedSubjects);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => toggleSubject(subj)}
                    className={cn(
                      'chip transition-all',
                      isActive ? 'ring-1' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    )}
                    style={
                      isActive
                        ? { backgroundColor: `${color}20`, color: color, boxShadow: `0 0 0 1px ${color}40` }
                        : undefined
                    }
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                    {subj}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        {filtered.length === 0 && documents.length > 0 && debouncedSearch ? (
          <NoSearchResults query={debouncedSearch} />
        ) : filtered.length === 0 ? (
          <NoDocuments onUpload={() => navigate(ROUTES.upload)} />
        ) : viewMode === 'grid' ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((doc) => (
              <DocCardGrid
                key={doc.id}
                doc={doc}
                subjects={storedSubjects}
                {...commonActions}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {filtered.map((doc) => (
              <DocRowList
                key={doc.id}
                doc={doc}
                subjects={storedSubjects}
                {...commonActions}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      <PreviewModal
        open={previewOpen}
        doc={previewDoc}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewDoc(null);
        }}
        onDownload={handleDownload}
      />

      <ContextMenu
        open={menuOpen}
        doc={menuDoc}
        onClose={() => {
          setMenuOpen(false);
          setMenuDoc(null);
        }}
        onFavorite={handleToggleFavorite}
        onPreview={handlePreview}
        onDownload={handleDownload}
        onRename={handleRename}
        onReplace={handleReplace}
        onDelete={handleDelete}
      />
    </motion.div>
  );
};

interface SelectDocSortProps {
  value: SortOption;
  onChange: (v: SortOption) => void;
}

const SelectDocSort: React.FC<SelectDocSortProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <SortAsc className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="Sort documents"
        className="input-base pl-9 w-40 appearance-none bg-[length:1.25rem] bg-no-repeat bg-[right_0.75rem_center] pr-10"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
        }}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="smallest">Smallest size</option>
        <option value="largest">Largest size</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  );
};
