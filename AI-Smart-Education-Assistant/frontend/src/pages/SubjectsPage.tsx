import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Search,
  SortAsc,
  MoreVertical,
  Pencil,
  Trash2,
  Palette,
  X,
  ChevronRight,
  ChevronLeft,
  FolderOpen,
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
  Eye,
  EyeOff,
} from 'lucide-react';
import type { Subject } from '@/types';
import { STORAGE_KEYS, SUBJECT_COLORS, SUBJECT_ICONS } from '@/constants';
import { subjectSchema, type SubjectInput } from '@/utils/validation';
import { useLocalStorage } from '@/hooks';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Select, FormField } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn, generateId, formatRelativeTime } from '@/utils/format';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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

const getDemoSubjects = (): Subject[] => [
  { id: generateId(), name: 'Mathematics', color: '#3B82F6', icon: 'Calculator', documentCount: 8, createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), lastUsedAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: generateId(), name: 'Physics', color: '#8B5CF6', icon: 'Atom', documentCount: 5, createdAt: new Date(Date.now() - 86400000 * 25).toISOString(), lastUsedAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: generateId(), name: 'Chemistry', color: '#10B981', icon: 'FlaskConical', documentCount: 6, createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), lastUsedAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: generateId(), name: 'Biology', color: '#F59E0B', icon: 'Brain', documentCount: 4, createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), lastUsedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: generateId(), name: 'Computer Science', color: '#F43F5E', icon: 'BookOpen', documentCount: 12, createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), lastUsedAt: new Date(Date.now() - 3600000 * 1).toISOString() },
  { id: generateId(), name: 'History', color: '#6366F1', icon: 'History', documentCount: 3, createdAt: new Date(Date.now() - 86400000 * 8).toISOString(), lastUsedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: generateId(), name: 'English Literature', color: '#14B8A6', icon: 'Newspaper', documentCount: 7, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), lastUsedAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: generateId(), name: 'Economics', color: '#06B6D4', icon: 'LineChart', documentCount: 2, createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), lastUsedAt: undefined },
];

type SortOption = 'name' | 'date' | 'count';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

interface SubjectCardProps {
  subject: Subject;
  onRename: (s: Subject) => void;
  onDelete: (s: Subject) => void;
  onSetColor: (s: Subject) => void;
  onSetIcon: (s: Subject) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onRename, onDelete, onSetColor, onSetIcon }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const IconComponent = subject.icon ? iconMap[subject.icon] : BookOpen;

  return (
    <motion.div variants={item} whileHover={{ y: -4 }}>
      <Card hoverable padded={false} className="overflow-hidden relative group">
        <div className="h-2 w-full" style={{ backgroundColor: subject.color ?? SUBJECT_COLORS[0] }} aria-hidden="true" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm"
              style={{ backgroundColor: subject.color ?? SUBJECT_COLORS[0] }}
            >
              {IconComponent ? <IconComponent className="h-6 w-6" aria-hidden="true" /> : <BookOpen className="h-6 w-6" aria-hidden="true" />}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-opacity text-slate-500 dark:text-slate-400"
                aria-label={`Actions for ${subject.name}`}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-dropdown p-1.5"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => { onRename(subject); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    role="menuitem"
                  >
                    <Pencil className="h-4 w-4" /> Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => { onSetColor(subject); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    role="menuitem"
                  >
                    <Palette className="h-4 w-4" /> Set Color
                  </button>
                  <button
                    type="button"
                    onClick={() => { onSetIcon(subject); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    role="menuitem"
                  >
                    <BookOpen className="h-4 w-4" /> Set Icon
                  </button>
                  <div className="my-1 border-t border-slate-200 dark:border-slate-800" />
                  <button
                    type="button"
                    onClick={() => { onDelete(subject); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-danger-50 dark:hover:bg-danger-950/30 text-danger-600 dark:text-danger-400"
                    role="menuitem"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 truncate">{subject.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <span className="chip bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <FolderOpen className="h-3 w-3" />
              {subject.documentCount ?? 0} docs
            </span>
            {subject.lastUsedAt ? (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatRelativeTime(subject.lastUsedAt)}
              </span>
            ) : (
              <span className="chip bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">New</span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

interface SubjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectInput) => void;
  editing?: Subject | null;
  mode: 'create' | 'rename' | 'color' | 'icon';
}

const SubjectModal: React.FC<SubjectModalProps> = ({ open, onClose, onSubmit, editing, mode }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectInput>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: editing?.name ?? '',
      color: editing?.color ?? SUBJECT_COLORS[0],
      icon: editing?.icon ?? SUBJECT_ICONS[0],
    },
  });

  useEffect(() => {
    if (open && editing) {
      reset({ name: editing.name, color: editing.color, icon: editing.icon });
    } else if (open) {
      reset({ name: '', color: SUBJECT_COLORS[0], icon: SUBJECT_ICONS[0] });
    }
  }, [open, editing, reset]);

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');
  const SelectedIconComponent = selectedIcon ? iconMap[selectedIcon] : BookOpen;

  if (!open) return null;

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
          className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-dropdown border border-slate-200 dark:border-slate-800 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subject-modal-title"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 id="subject-modal-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {mode === 'create' && 'Create New Subject'}
                {mode === 'rename' && `Rename ${editing?.name ?? 'Subject'}`}
                {mode === 'color' && `Set Color for ${editing?.name ?? 'Subject'}`}
                {mode === 'icon' && `Set Icon for ${editing?.name ?? 'Subject'}`}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {mode === 'create' && 'Organize your study materials with subject categories'}
                {mode === 'rename' && 'Update the display name of this subject'}
                {mode === 'color' && 'Choose a color to visually identify this subject'}
                {mode === 'icon' && 'Pick an icon that represents this subject'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
              onClose();
            })}
            className="space-y-5"
          >
            {(mode === 'create' || mode === 'rename') && (
              <FormField label="Subject Name" htmlFor="subject-name" error={errors.name?.message}>
                <Input
                  id="subject-name"
                  placeholder="e.g. Organic Chemistry"
                  autoFocus
                  {...register('name')}
                />
              </FormField>
            )}

            {(mode === 'create' || mode === 'color') && (
              <FormField label="Color">
                <div className="grid grid-cols-6 gap-2">
                  {SUBJECT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue('color', color, { shouldValidate: true })}
                      className={cn(
                        'h-10 w-full rounded-xl transition-all duration-200 ring-offset-2 dark:ring-offset-slate-900',
                        selectedColor === color ? 'ring-2 ring-slate-900 dark:ring-slate-100 scale-105' : 'hover:scale-105'
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="h-4 w-4 rounded-full" style={{ backgroundColor: selectedColor }} aria-hidden="true" />
                    <span>{selectedColor}</span>
                  </div>
                )}
              </FormField>
            )}

            {(mode === 'create' || mode === 'icon') && (
              <FormField label="Icon">
                <div className="grid grid-cols-5 gap-2">
                  {SUBJECT_ICONS.map((iconKey) => {
                    const IconComp = iconMap[iconKey];
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setValue('icon', iconKey, { shouldValidate: true })}
                        className={cn(
                          'flex h-14 w-full items-center justify-center rounded-xl border transition-all duration-200',
                          selectedIcon === iconKey
                            ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 ring-2 ring-primary-500/20'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                        )}
                        aria-label={`Select icon ${iconKey}`}
                      >
                        {IconComp ? <IconComp className="h-5 w-5" aria-hidden="true" /> : <BookOpen className="h-5 w-5" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
                {selectedIcon && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    {SelectedIconComponent ? <SelectedIconComponent className="h-4 w-4" aria-hidden="true" /> : <BookOpen className="h-4 w-4" aria-hidden="true" />}
                    <span>{selectedIcon}</span>
                  </div>
                )}
              </FormField>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                {mode === 'create' ? 'Create Subject' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface DeleteDialogProps {
  open: boolean;
  subject: Subject | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, subject, onConfirm, onCancel }) => {
  if (!open || !subject) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-dropdown border border-slate-200 dark:border-slate-800 p-6"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-danger-50 text-danger-600 dark:bg-danger-950/40 dark:text-danger-400">
              <Trash2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 id="delete-dialog-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Delete "{subject.name}"?
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                This will remove the subject category. Documents are not deleted - they will become uncategorized.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm}>Delete Subject</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, []);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showEmpty, setShowEmpty] = useState(false);
  const [carouselStart, setCarouselStart] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'rename' | 'color' | 'icon'>('create');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  useEffect(() => {
    if (subjects.length === 0) {
      const demo = getDemoSubjects();
      setSubjects(demo);
    }
  }, []);

  const recentSubjects = useMemo(() => {
    return [...subjects]
      .filter((s) => s.lastUsedAt)
      .sort((a, b) => new Date(b.lastUsedAt!).getTime() - new Date(a.lastUsedAt!).getTime())
      .slice(0, 6);
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    let list = subjects;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'count') {
      sorted.sort((a, b) => (b.documentCount ?? 0) - (a.documentCount ?? 0));
    }
    return sorted;
  }, [subjects, search, sortBy]);

  const openCreate = () => {
    setEditingSubject(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openRename = (s: Subject) => {
    setEditingSubject(s);
    setModalMode('rename');
    setModalOpen(true);
  };

  const openSetColor = (s: Subject) => {
    setEditingSubject(s);
    setModalMode('color');
    setModalOpen(true);
  };

  const openSetIcon = (s: Subject) => {
    setEditingSubject(s);
    setModalMode('icon');
    setModalOpen(true);
  };

  const handleSubmit = (data: SubjectInput) => {
    if (modalMode === 'create') {
      const newSubject: Subject = {
        id: generateId(),
        name: data.name,
        color: data.color,
        icon: data.icon,
        documentCount: 0,
        createdAt: new Date().toISOString(),
      };
      setSubjects([newSubject, ...subjects]);
      toast.success(`Subject "${data.name}" created`);
    } else if (editingSubject) {
      const updated = subjects.map((s) =>
        s.id === editingSubject.id
          ? {
              ...s,
              name: modalMode === 'rename' ? data.name : s.name,
              color: modalMode === 'color' ? data.color : s.color,
              icon: modalMode === 'icon' ? data.icon : s.icon,
            }
          : s
      );
      setSubjects(updated);
      toast.success(`Subject "${editingSubject.name}" updated`);
    }
  };

  const handleDelete = () => {
    if (!deletingSubject) return;
    setSubjects(subjects.filter((s) => s.id !== deletingSubject.id));
    toast.success(`Subject "${deletingSubject.name}" deleted`);
    setDeleteOpen(false);
    setDeletingSubject(null);
  };

  const carouselVisible = recentSubjects.slice(carouselStart, carouselStart + 4);

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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Subjects</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage and organize your study subjects
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-56"
                aria-label="Search subjects"
              />
            </div>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-44"
              options={[
                { value: 'name', label: 'Sort: Name' },
                { value: 'date', label: 'Sort: Date Created' },
                { value: 'count', label: 'Sort: Document Count' },
              ]}
            >
              <SortAsc className="h-4 w-4" />
            </Select>
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
              New Subject
            </Button>
          </div>
        </div>
      </motion.div>

      {recentSubjects.length > 0 && (
        <motion.div variants={item}>
          <Card padded={false}>
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Recent Subjects</h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Subjects you recently worked with</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCarouselStart((s) => Math.max(0, s - 1))}
                  disabled={carouselStart === 0}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Scroll previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCarouselStart((s) => Math.min(Math.max(0, recentSubjects.length - 4), s + 1))}
                  disabled={carouselStart >= recentSubjects.length - 4}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Scroll next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {carouselVisible.map((s) => {
                const IconComp = s.icon ? iconMap[s.icon] : BookOpen;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${s.name}`}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: s.color ?? SUBJECT_COLORS[0] }}
                    >
                      {IconComp ? <IconComp className="h-4 w-4" aria-hidden="true" /> : <BookOpen className="h-4 w-4" aria-hidden="true" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{s.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{s.documentCount ?? 0} docs</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            All Subjects
            <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">({filteredSubjects.length})</span>
          </h2>
          <button
            type="button"
            onClick={() => setShowEmpty((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {showEmpty ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showEmpty ? 'Hide empty' : 'Show empty'}
          </button>
        </div>

        {filteredSubjects.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-8 w-8" />}
            title={search ? `No subjects match "${search}"` : 'No subjects yet'}
            description={search ? 'Try a different search term or create a new subject.' : 'Create subjects to organize your study materials into categories.'}
            action={search ? undefined : { label: 'Create Subject', onClick: openCreate, variant: 'primary', icon: <Plus className="h-4 w-4" /> }}
          />
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredSubjects.map((s) => (
              <SubjectCard
                key={s.id}
                subject={s}
                onRename={openRename}
                onDelete={(subj) => {
                  setDeletingSubject(subj);
                  setDeleteOpen(true);
                }}
                onSetColor={openSetColor}
                onSetIcon={openSetIcon}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      <SubjectModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSubject(null);
        }}
        onSubmit={handleSubmit}
        editing={editingSubject}
        mode={modalMode}
      />

      <DeleteDialog
        open={deleteOpen}
        subject={deletingSubject}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeletingSubject(null);
        }}
      />
    </motion.div>
  );
};
