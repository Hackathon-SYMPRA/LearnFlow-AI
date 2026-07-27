import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";
import { toast } from "sonner";
import {
  Brain,
  FileText,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Flag,
  Send,
  RotateCcw,
  Sparkles,
  Trophy,
  Download,
  Eye,
  Clock,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  Image,
  Check,
  X,
  Star,
  Search,
} from "lucide-react";
import { SUBJECTS, SUBJECT_COLORS } from "@/constants";
import { generateQuizSchema } from "@/utils/validation";
import { documentService, quizService } from "@/services";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { cn, generateId, formatDate, formatDuration } from "@/utils/format";

const MOCK_DOCUMENTS = [
  {
    id: "doc-1",
    name: "Calculus_Chapter5_Integration.pdf",
    subject: "Mathematics",
    pages: 42,
    type: "pdf",
  },
  {
    id: "doc-2",
    name: "Algebra_Linear_Transformations.docx",
    subject: "Mathematics",
    pages: 28,
    type: "doc",
  },
  {
    id: "doc-3",
    name: "Physics_Mechanics_Waves.pdf",
    subject: "Physics",
    pages: 56,
    type: "pdf",
  },
  {
    id: "doc-4",
    name: "Electromagnetism_Notes.pdf",
    subject: "Physics",
    pages: 38,
    type: "pdf",
  },
  {
    id: "doc-5",
    name: "Organic_Chemistry_Reactions.pdf",
    subject: "Chemistry",
    pages: 64,
    type: "pdf",
  },
  {
    id: "doc-6",
    name: "Periodic_Table_Trends.docx",
    subject: "Chemistry",
    pages: 19,
    type: "doc",
  },
  {
    id: "doc-7",
    name: "Cell_Biology_Mitosis.pdf",
    subject: "Biology",
    pages: 33,
    type: "pdf",
  },
  {
    id: "doc-8",
    name: "Data_Structures_Algorithms.pdf",
    subject: "Computer Science",
    pages: 88,
    type: "pdf",
  },
  {
    id: "doc-9",
    name: "World_War_II_History.pdf",
    subject: "History",
    pages: 51,
    type: "pdf",
  },
  {
    id: "doc-10",
    name: "Macroeconomics_Keynes.docx",
    subject: "Economics",
    pages: 24,
    type: "doc",
  },
];

const TOPIC_SUGGESTIONS = {
  Mathematics: [
    "Integration Techniques",
    "Linear Algebra",
    "Differential Equations",
    "Probability Theory",
  ],
  Physics: [
    "Newtonian Mechanics",
    "Electromagnetic Waves",
    "Quantum Basics",
    "Thermodynamics",
  ],
  Chemistry: [
    "Organic Reactions",
    "Chemical Bonds",
    "Periodic Trends",
    "Stoichiometry",
  ],
  Biology: ["Cell Division", "Genetics", "Ecosystems", "Human Anatomy"],
  "Computer Science": [
    "Data Structures",
    "Sorting Algorithms",
    "Dynamic Programming",
    "Graph Theory",
  ],
  History: [
    "World War II",
    "Industrial Revolution",
    "Ancient Rome",
    "Renaissance",
  ],
  Geography: ["Plate Tectonics", "Climate Systems", "Urbanization", "Biomes"],
  English: [
    "Grammar & Syntax",
    "Literary Devices",
    "Essay Writing",
    "Poetry Analysis",
  ],
  Economics: [
    "Microeconomics",
    "Macroeconomics",
    "Game Theory",
    "International Trade",
  ],
  Psychology: [
    "Cognitive Development",
    "Behavioral Theory",
    "Memory Systems",
    "Social Psychology",
  ],
};

const RECENT_QUIZZES = [
  {
    id: "rq-1",
    subject: "Mathematics",
    score: 82,
    questionsCount: 20,
    date: new Date(Date.now() - 86400000).toISOString(),
    title: "Calculus Chapter 5 Quiz",
  },
  {
    id: "rq-2",
    subject: "Physics",
    score: 74,
    questionsCount: 15,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    title: "Mechanics Review",
  },
  {
    id: "rq-3",
    subject: "Chemistry",
    score: 91,
    questionsCount: 25,
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    title: "Organic Reactions",
  },
  {
    id: "rq-4",
    subject: "Computer Science",
    score: 66,
    questionsCount: 30,
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    title: "Data Structures",
  },
];

const QUESTION_LETTERS = ["A", "B", "C", "D"];

const ProcessingStepper = ({ steps }) => (
  <div className="flex flex-col gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
    {steps.map((step, idx) => (
      <div key={step.label} className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
            step.done
              ? "bg-accent-500 text-white"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500",
          )}
        >
          {step.done ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <span className="text-xs font-semibold">{idx + 1}</span>
          )}
        </div>
        <span
          className={cn(
            "text-sm",
            step.done
              ? "text-slate-700 dark:text-slate-300"
              : "text-slate-500 dark:text-slate-400",
          )}
        >
          {step.label}
        </span>
      </div>
    ))}
  </div>
);

const generateMockQuestions = (config) => {
  const questions = [];
  const types = config.questionTypes;

  for (let i = 0; i < config.questionCount; i++) {
    const type = types[i % types.length];
    const qId = generateId();

    let question;

    if (type === "mcq") {
      question = {
        id: qId,
        type: "mcq",
        question: `Which of the following best describes the core concept of ${config.topic} question ${i + 1}?`,
        options: [
          `Primary definition and characteristic properties of the topic`,
          `Secondary interpretation used in advanced applications`,
          `Common misconception students encounter when learning this material`,
          `Unrelated distractor statement that sounds plausible`,
        ],
        correctAnswer: 0,
        explanation: `Option A is correct because the fundamental concept of ${config.topic} centers on definition and properties. The other options describe secondary aspects, common misunderstandings, or unrelated material that may seem correct at first glance.`,
        sourceDoc: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length].name,
        topic: config.topic,
        difficulty: config.difficulty,
        hasImage: i % 7 === 0,
      };
    } else if (type === "true-false") {
      question = {
        id: qId,
        type: "true-false",
        question: `True or False: The fundamental principles of ${config.topic} are directly applicable to the scenario described in your study materials.`,
        correctAnswer: i % 2 === 0,
        explanation: `This statement is ${i % 2 === 0 ? "TRUE" : "FALSE"}. The ${config.topic} framework was designed with these specific applications in mind according to the referenced source material.`,
        sourceDoc: MOCK_DOCUMENTS[(i + 2) % MOCK_DOCUMENTS.length].name,
        topic: config.topic,
        difficulty: config.difficulty,
      };
    } else if (type === "fill-blanks") {
      question = {
        id: qId,
        type: "fill-blanks",
        question: `The process of ___ involves ___ and ___ to achieve the desired outcome in ${config.topic}.`,
        blanks: ["concept1", "concept2", "concept3"],
        correctAnswer: ["analysis", "evaluation", "synthesis"],
        explanation: `The three key steps are analysis (breaking down the problem), evaluation (assessing options), and synthesis (combining insights). Together they form a complete framework for approaching ${config.topic}.`,
        sourceDoc: MOCK_DOCUMENTS[(i + 3) % MOCK_DOCUMENTS.length].name,
        topic: config.topic,
        difficulty: config.difficulty,
      };
    } else {
      question = {
        id: qId,
        type: "short-answer",
        question: `In your own words, explain the core principles of ${config.topic} and provide one practical example of how these principles apply in a real-world context.`,
        correctAnswer: `Core principles involve systematic approach, critical analysis, and iterative refinement. A practical example includes applying these steps to solve complex problems methodically while tracking progress at each stage.`,
        explanation: `Strong answers should: (1) Clearly state the 2-3 foundational principles, (2) Connect them to the underlying theory, (3) Provide a concrete, specific example rather than a vague one, (4) Show how the example illustrates each principle in action.`,
        sourceDoc: MOCK_DOCUMENTS[(i + 4) % MOCK_DOCUMENTS.length].name,
        topic: config.topic,
        difficulty: config.difficulty,
      };
    }

    questions.push(question);
  }

  return questions;
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const getRank = (score) => {
  if (score >= 90)
    return {
      tier: "Platinum",
      color: "from-cyan-400 via-blue-500 to-indigo-600",
      min: 90,
    };
  if (score >= 75)
    return {
      tier: "Gold",
      color: "from-amber-400 via-orange-500 to-orange-600",
      min: 75,
    };
  if (score >= 50)
    return {
      tier: "Silver",
      color: "from-slate-300 via-slate-400 to-slate-500",
      min: 50,
    };
  return {
    tier: "Bronze",
    color: "from-orange-400 via-amber-600 to-amber-800",
    min: 0,
  };
};

export const QuizPage = () => {
  const [state, setState] = useState("config");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [bookmarked, setBookmarked] = useState(new Set());
  const [examMode, setExamMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([
    { label: "Reading notes from documents", done: false },
    { label: "Finding key concepts", done: false },
    { label: "Crafting questions", done: false },
    { label: "Finalizing quiz", done: false },
  ]);
  const [documents, setDocuments] = useState([]);
  const [searchedDoc, setSearchedDoc] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await documentService.list();
        const mappedDocs = (res.data || []).map(doc => ({
          id: doc.id,
          name: doc.original_name || doc.file_name || "Unknown Document",
          subject: doc.subject_id || "General",
          pages: doc.total_pages || 1,
          type: doc.file_type || "pdf"
        }));
        setDocuments(mappedDocs);
      } catch (err) {
        toast.error("Failed to load documents");
      }
    };
    fetchDocs();
  }, []);

  const filteredDocs = useMemo(
    () =>
      documents.filter(
        (d) =>
          (d.name || "").toLowerCase().includes(searchedDoc.toLowerCase()) ||
          (d.subject || "").toLowerCase().includes(searchedDoc.toLowerCase()),
      ),
    [searchedDoc, documents]
  );

  const runGenerationSteps = async (config) => {
    if (!config.documentIds || config.documentIds.length === 0) {
      toast.error("Please select at least one document.");
      return;
    }
    
    setIsGenerating(true);
    setProcessingSteps((prev) => prev.map((s) => ({ ...s, done: false })));

    try {
      // Simulate progress for UI
      const timer = setInterval(() => {
        setProcessingSteps((prev) => {
          const nextIdx = prev.findIndex((s) => !s.done);
          if (nextIdx !== -1 && nextIdx < prev.length - 1) {
            const newSteps = [...prev];
            newSteps[nextIdx].done = true;
            return newSteps;
          }
          return prev;
        });
      }, 1500);

      const res = await quizService.generate(config.documentIds, {
        difficulty: config.difficulty,
        num_questions: config.questionCount,
        topic: config.topic,
      });
      
      clearInterval(timer);
      setProcessingSteps((prev) => prev.map((s) => ({ ...s, done: true })));

      let generatedQs = res.data?.questions || res.data || [];
      if (!Array.isArray(generatedQs)) {
        throw new Error("Invalid response from server");
      }
      
      generatedQs = generatedQs.map((q, idx) => ({
        id: generateId(),
        type: "mcq",
        question: q.question,
        options: q.options || ["A", "B", "C", "D"],
        correctAnswer: q.options ? Math.max(0, q.options.indexOf(q.answer)) : 0,
        explanation: q.explanation || "No explanation provided.",
        sourceDoc: "Selected Document",
        topic: config.topic || "General",
        difficulty: config.difficulty,
      }));
      
      if (generatedQs.length === 0) {
        throw new Error("No questions could be generated");
      }

      setQuestions(generatedQs);
      setAnswers({});
      setFlagged(new Set());
      setBookmarked(new Set());
      setCurrentQ(0);
      setExamMode(config.examMode);
      
      if (config.examMode && config.examDuration) {
        const secs = config.examDuration * 60;
        setTimeLeft(secs);
        setTotalTime(secs);
      } else {
        setTotalTime(0);
        setTimeLeft(0);
      }
      
      setIsGenerating(false);
      setState("quiz");
      toast.success("Quiz generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate quiz. Please try again.");
      setIsGenerating(false);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(generateQuizSchema),
    defaultValues: {
      documentIds: [],
      subject: "",
      topic: "",
      difficulty: "medium",
      questionCount: 10,
      questionTypes: ["mcq"],
      examMode: false,
      examDuration: 20,
      autoSubmit: true,
    },
  });

  const watchedExamMode = watch("examMode");
  const watchedSubject = watch("subject");
  const topicSuggestions = watchedSubject
    ? (TOPIC_SUGGESTIONS[watchedSubject]?.slice(0, 3) ?? [])
    : [];

  useEffect(() => {
    if (state !== "quiz" || !examMode || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          toast.warning("Time is up! Auto-submitting quiz...");
          setState("results");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, examMode]);

  useEffect(() => {
    if (state !== "quiz") return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state]);

  const answeredCount = useMemo(() => {
    return questions.filter((q) => {
      const ans = answers[q.id];
      if (q.type === "fill-blanks") {
        return Array.isArray(ans) && ans.some((a) => a);
      }
      return ans !== undefined && ans !== null && ans !== "";
    }).length;
  }, [questions, answers]);

  const toggleFlag = (id) => {
    setFlagged((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleBookmark = (id) => {
    setBookmarked((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const setAnswer = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const calculateResults = () => {
    let correct = 0;
    const topicStats = {};

    questions.forEach((q) => {
      if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
      topicStats[q.topic].total += 1;

      const userAns = answers[q.id];
      let isCorrect = false;

      if (q.type === "mcq") {
        isCorrect = userAns === q.correctAnswer;
      } else if (q.type === "true-false") {
        isCorrect = userAns === q.correctAnswer;
      } else if (q.type === "fill-blanks") {
        const arr = Array.isArray(userAns) ? userAns : [];
        const correctArr = q.correctAnswer;
        isCorrect = correctArr.every(
          (c, i) => arr[i]?.toLowerCase().trim() === c.toLowerCase(),
        );
      } else if (q.type === "short-answer") {
        const ua = String(userAns ?? "")
          .toLowerCase()
          .trim();
        isCorrect = ua.length > 30;
      }

      if (isCorrect) {
        correct += 1;
        topicStats[q.topic].correct += 1;
      }
    });

    const scorePct =
      questions.length === 0
        ? 0
        : Math.round((correct / questions.length) * 100);
    const skipped = questions.length - answeredCount;

    const weakTopics = [];
    const strongTopics = [];

    Object.entries(topicStats).forEach(([topic, stats]) => {
      const pct = Math.round((stats.correct / stats.total) * 100);
      if (pct < 60) weakTopics.push({ topic, score: pct });
      else strongTopics.push({ topic, score: pct });
    });

    return { correct, scorePct, skipped, weakTopics, strongTopics };
  };

  const exportCSV = () => {
    const { correct, scorePct } = calculateResults();
    const rows = [
      ["Question", "Type", "Your Answer", "Correct Answer", "Status"],
      ...questions.map((q) => {
        const ua = answers[q.id];
        let userAns = "";
        let correctAns = "";
        if (q.type === "mcq") {
          userAns = typeof ua === "number" ? QUESTION_LETTERS[ua] : "";
          correctAns = QUESTION_LETTERS[q.correctAnswer];
        } else if (q.type === "true-false") {
          userAns = ua === undefined ? "" : ua ? "True" : "False";
          correctAns = q.correctAnswer ? "True" : "False";
        } else if (q.type === "fill-blanks") {
          userAns = Array.isArray(ua) ? ua.join(" | ") : "";
          correctAns = q.correctAnswer.join(" | ");
        } else {
          userAns = String(ua ?? "");
          correctAns = String(q.correctAnswer);
        }
        const status = userAns === correctAns ? "Correct" : "Incorrect";
        return [q.question, q.type, userAns, correctAns, status];
      }),
      [],
      ["Score", `${scorePct}%`, "Correct", correct, "Total", questions.length],
    ];

    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Results exported to CSV");
  };

  const renderConfigScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-primary-600 to-secondary-600 p-6 sm:p-8 text-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-20 translate-x-20" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Brain className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">Create a Quiz</h1>
            <p className="mt-2 text-primary-100 max-w-2xl">
              Configure your quiz parameters below. The AI will generate
              targeted questions based on your documents, topic, and difficulty
              selection.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((data) => runGenerationSteps(data))}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                Select Documents
              </CardTitle>
              <CardDescription>
                Choose documents to base your quiz on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchedDoc}
                  onChange={(e) => setSearchedDoc(e.target.value)}
                  className="input-base pl-10"
                  aria-label="Search documents"
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-h-[340px] overflow-y-auto pr-1">
                {filteredDocs.map((doc) => {
                  const selected = watch("documentIds").includes(doc.id);
                  return (
                    <label
                      key={doc.id}
                      className={cn(
                        "relative flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-all",
                        selected
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950/40 dark:border-primary-400"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                        value={doc.id}
                        {...register("documentIds", {})}
                        aria-label={`Select ${doc.name}`}
                      />

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {doc.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="chip bg-secondary-50 text-secondary-700 dark:bg-secondary-950/40 dark:text-secondary-400">
                            {doc.subject}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {doc.pages} pages
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
                {filteredDocs.length === 0 && (
                  <div className="col-span-full text-center py-6 text-sm text-slate-500">
                    No documents found
                  </div>
                )}
              </div>
              {errors.documentIds && (
                <p className="text-sm text-danger-600 dark:text-danger-400">
                  {errors.documentIds.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Configuration</CardTitle>
              <CardDescription>
                Subject, topic, and question settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="label-base mb-1.5" htmlFor="subject">
                  Subject <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                </label>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <select {...field} id="subject" className="input-base">
                      <option value="">Select a subject...</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}
                />

                {errors.subject && (
                  <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label-base mb-1.5" htmlFor="topic">
                  Chapter / Topic <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                </label>
                <input
                  id="topic"
                  {...register("topic")}
                  placeholder="e.g. Integration by Substitution"
                  className="input-base"
                />

                {topicSuggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topicSuggestions.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setValue("topic", t, { shouldValidate: true })
                        }
                        className="chip bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                {errors.topic && (
                  <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                    {errors.topic.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label-base mb-2">Difficulty Level</label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-2">
                      {["easy", "medium", "hard"].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => field.onChange(d)}
                          className={cn(
                            "rounded-xl border-2 py-3 px-4 text-sm font-medium capitalize transition-all",
                            field.value === d
                              ? d === "easy"
                                ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400"
                                : d === "medium"
                                  ? "border-warning-500 bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400"
                                  : "border-danger-500 bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-400"
                              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600",
                          )}
                          role="radio"
                          aria-checked={field.value === d}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-base m-0">Number of Questions</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      {...register("questionCount", { valueAsNumber: true })}
                      className="input-base w-20 h-9 py-1 text-center"
                      aria-label="Number of questions"
                    />

                    <span className="text-xs text-slate-500">/ 50</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  {...register("questionCount", { valueAsNumber: true })}
                  className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 accent-primary-600"
                />

                {errors.questionCount && (
                  <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                    {errors.questionCount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label-base mb-2">Question Types</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["mcq", "true-false", "fill-blanks", "short-answer"].map(
                    (qt) => {
                      const labelMap = {
                        mcq: "MCQ",
                        "true-false": "True/False",
                        "fill-blanks": "Fill Blanks",
                        "short-answer": "Short Answer",
                      };
                      const selected = watch("questionTypes").includes(qt);
                      return (
                        <label
                          key={qt}
                          className={cn(
                            "cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-medium transition-all",
                            selected
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-950/40 dark:border-primary-400 text-primary-700 dark:text-primary-400"
                              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            value={qt}
                            {...register("questionTypes", {})}
                          />

                          {labelMap[qt]}
                        </label>
                      );
                    },
                  )}
                </div>
                {errors.questionTypes && (
                  <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">
                    {errors.questionTypes.message}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-950/40 text-warning-600 dark:text-warning-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Enable Exam Mode
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Adds a countdown timer and auto-submits when time
                        expires
                      </p>
                    </div>
                  </div>
                  <Controller
                    name="examMode"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={field.value}
                        onClick={() => field.onChange(!field.value)}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                          field.value
                            ? "bg-primary-600"
                            : "bg-slate-200 dark:bg-slate-700",
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform",
                            field.value ? "translate-x-5" : "translate-x-0",
                          )}
                        />
                      </button>
                    )}
                  />
                </div>

                <AnimatePresence>
                  {watchedExamMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                        <div>
                          <label className="label-base mb-1.5">
                            Timer Duration
                          </label>
                          <Controller
                            name="examDuration"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                value={field.value ?? 20}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="input-base"
                              >
                                {[10, 20, 30, 45, 60].map((m) => (
                                  <option key={m} value={m}>
                                    {m} minutes
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <AlertTriangle className="h-3.5 w-3.5 text-warning-500" />
                          Your quiz will be automatically submitted when the
                          timer expires.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4">
              {isGenerating ? (
                <ProcessingStepper steps={processingSteps} />
              ) : (
                <>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    fullWidth
                    size="lg"
                    leftIcon={<Sparkles className="h-4 w-4" />}
                  >
                    Generate Quiz
                  </Button>
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                    AI-powered generation typically takes 5-10 seconds
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Quizzes</CardTitle>
              <CardDescription>Click to review past attempts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {RECENT_QUIZZES.map((rq) => (
                <button
                  key={rq.id}
                  type="button"
                  onClick={() => toast.message(`Opening ${rq.title}`)}
                  className="w-full flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${SUBJECT_COLORS[SUBJECTS.indexOf(rq.subject) % SUBJECT_COLORS.length]}20`,
                      color:
                        SUBJECT_COLORS[
                          SUBJECTS.indexOf(rq.subject) % SUBJECT_COLORS.length
                        ],
                    }}
                  >
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {rq.title}
                      </p>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          rq.score >= 75
                            ? "text-accent-600 dark:text-accent-400"
                            : rq.score >= 50
                              ? "text-warning-600 dark:text-warning-400"
                              : "text-danger-600 dark:text-danger-400",
                        )}
                      >
                        {rq.score}%
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{rq.subject}</span>
                      <span>·</span>
                      <span>{rq.questionsCount} Qs</span>
                      <span>·</span>
                      <span>{formatDate(rq.date)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </form>
    </motion.div>
  );

  const question = questions[currentQ];

  const renderQuizScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <Card className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {watchedSubject} — {watch("topic")}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="chip bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Question {currentQ + 1} / {questions.length}
              </span>
              <span
                className={cn(
                  "chip capitalize",
                  watch("difficulty") === "easy"
                    ? "bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400"
                    : watch("difficulty") === "medium"
                      ? "bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400"
                      : "bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-400",
                )}
              >
                {watch("difficulty")}
              </span>
              <span className="chip bg-secondary-50 text-secondary-700 dark:bg-secondary-950/40 dark:text-secondary-400">
                {watchedSubject}
              </span>
            </div>
          </div>
          {examMode && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono font-bold text-lg",
                timeLeft < 60
                  ? "bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-400 animate-pulse"
                  : "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400",
              )}
            >
              <Clock className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <div className="mt-4">
          <Progress
            value={answeredCount}
            max={questions.length}
            color="primary"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        <Card>
          <CardContent className="p-5 sm:p-6 space-y-6">
            {question && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "chip",
                          question.type === "mcq"
                            ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"
                            : question.type === "true-false"
                              ? "bg-secondary-50 text-secondary-700 dark:bg-secondary-950/40 dark:text-secondary-400"
                              : question.type === "fill-blanks"
                                ? "bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400"
                                : "bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400",
                        )}
                      >
                        {question.type === "mcq"
                          ? "MCQ"
                          : question.type === "true-false"
                            ? "True / False"
                            : question.type === "fill-blanks"
                              ? "Fill Blanks"
                              : "Short Answer"}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 text-balance">
                        <span className="text-primary-600 dark:text-primary-400 mr-2">
                          #{currentQ + 1}
                        </span>
                        {question.question}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(question.id)}
                      aria-label="Toggle bookmark"
                      className="shrink-0"
                    >
                      <Star
                        className={cn(
                          "h-5 w-5 transition-colors",
                          bookmarked.has(question.id)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-400 hover:text-amber-400",
                        )}
                      />
                    </button>
                  </div>

                  {question.hasImage && (
                    <div className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 h-40 border border-dashed border-slate-300 dark:border-slate-700">
                      <div className="text-center">
                        <Image className="h-10 w-10 mx-auto text-slate-400" />
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Question reference image
                        </p>
                      </div>
                    </div>
                  )}

                  {question.type === "mcq" && question.options && (
                    <div className="space-y-2.5">
                      {question.options.map((opt, idx) => {
                        const selected = answers[question.id] === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAnswer(question.id, idx)}
                            className={cn(
                              "w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                              selected
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/40 dark:border-primary-400"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold",
                                selected
                                  ? "bg-primary-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                              )}
                            >
                              {QUESTION_LETTERS[idx]}
                            </span>
                            <span
                              className={cn(
                                "text-sm",
                                selected
                                  ? "text-primary-800 dark:text-primary-200 font-medium"
                                  : "text-slate-700 dark:text-slate-300",
                              )}
                            >
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {question.type === "true-false" && (
                    <div className="grid grid-cols-2 gap-4">
                      {[true, false].map((val) => {
                        const selected = answers[question.id] === val;
                        return (
                          <button
                            key={String(val)}
                            type="button"
                            onClick={() => setAnswer(question.id, val)}
                            className={cn(
                              "flex items-center justify-center gap-3 p-5 rounded-xl border-2 transition-all",
                              selected
                                ? val
                                  ? "border-accent-500 bg-accent-50 dark:bg-accent-950/40 dark:border-accent-400"
                                  : "border-danger-500 bg-danger-50 dark:bg-danger-950/40 dark:border-danger-400"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900",
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-11 w-11 items-center justify-center rounded-full",
                                val
                                  ? selected
                                    ? "bg-accent-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-accent-600"
                                  : selected
                                    ? "bg-danger-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-danger-600",
                              )}
                            >
                              {val ? (
                                <Check className="h-6 w-6" />
                              ) : (
                                <X className="h-6 w-6" />
                              )}
                            </div>
                            <span
                              className={cn(
                                "text-lg font-bold",
                                selected
                                  ? val
                                    ? "text-accent-700 dark:text-accent-400"
                                    : "text-danger-700 dark:text-danger-400"
                                  : "text-slate-600 dark:text-slate-400",
                              )}
                            >
                              {val ? "True" : "False"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {question.type === "fill-blanks" && question.blanks && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Fill in the blanks below:
                      </p>
                      {question.blanks.map((_, idx) => {
                        const arr = answers[question.id] || ["", "", ""];
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 shrink-0">
                              Blank {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={arr[idx] || ""}
                              onChange={(e) => {
                                const newArr = [...arr];
                                newArr[idx] = e.target.value;
                                setAnswer(question.id, newArr);
                              }}
                              placeholder={`Type answer for blank ${idx + 1}...`}
                              className="input-base"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {question.type === "short-answer" && (
                    <div className="space-y-2">
                      <textarea
                        value={answers[question.id] || ""}
                        onChange={(e) => setAnswer(question.id, e.target.value)}
                        rows={6}
                        placeholder="Write your answer here. Aim for at least 30 words for full credit."
                        className="input-base resize-y"
                      />

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Suggested: 50-100 words</span>
                        <span>
                          {
                            (answers[question.id] || "")
                              .split(/\s+/)
                              .filter(Boolean).length
                          }{" "}
                          words
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
                      disabled={currentQ === 0}
                      leftIcon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQ((q) =>
                          Math.min(questions.length - 1, q + 1),
                        )
                      }
                      leftIcon={<SkipForward className="h-4 w-4" />}
                    >
                      Skip
                    </Button>
                    <Button
                      variant={flagged.has(question.id) ? "danger" : "outline"}
                      onClick={() => toggleFlag(question.id)}
                      leftIcon={<Flag className="h-4 w-4" />}
                    >
                      {flagged.has(question.id) ? "Flagged" : "Flag"}
                    </Button>
                    <div className="flex-1" />
                    <Button
                      variant="primary"
                      onClick={() =>
                        setCurrentQ((q) =>
                          Math.min(questions.length - 1, q + 1),
                        )
                      }
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      Next
                    </Button>
                    {currentQ === questions.length - 1 &&
                      answers[question.id] !== undefined && (
                        <Button
                          variant="primary"
                          onClick={() => setState("results")}
                          leftIcon={<Send className="h-4 w-4" />}
                        >
                          Submit Quiz
                        </Button>
                      )}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Question Navigator</CardTitle>
            <CardDescription>Click to jump</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q, idx) => {
                const answered =
                  answers[q.id] !== undefined &&
                  answers[q.id] !== "" &&
                  !(
                    Array.isArray(answers[q.id]) &&
                    answers[q.id].every((v) => !v)
                  );
                const isFlagged = flagged.has(q.id);
                const isCurrent = idx === currentQ;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentQ(idx)}
                    aria-label={`Go to question ${idx + 1}`}
                    className={cn(
                      "aspect-square rounded-lg text-xs font-semibold transition-all border-2",
                      isCurrent
                        ? "border-primary-600 bg-primary-600 text-white shadow-md"
                        : isFlagged
                          ? "border-warning-400 bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400"
                          : answered
                            ? "border-accent-400 bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600",
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-accent-50 border border-accent-400" />
                <span className="text-slate-600 dark:text-slate-400">
                  Answered
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-warning-50 border border-warning-400" />
                <span className="text-slate-600 dark:text-slate-400">
                  Flagged
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-primary-600 border border-primary-600" />
                <span className="text-slate-600 dark:text-slate-400">
                  Current
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700" />
                <span className="text-slate-600 dark:text-slate-400">
                  Seen / Unanswered
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setState("review")}
                leftIcon={<Eye className="h-4 w-4" />}
              >
                Preview Answers
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => setState("results")}
                leftIcon={<Send className="h-4 w-4" />}
              >
                Submit Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const getQuestionResult = (q) => {
    const ua = answers[q.id];
    if (q.type === "mcq") {
      const uaIdx = typeof ua === "number" ? ua : -1;
      const caIdx = q.correctAnswer;
      return {
        correct: uaIdx === caIdx,
        userAnswerText:
          uaIdx >= 0 && q.options
            ? `${QUESTION_LETTERS[uaIdx]}. ${q.options[uaIdx]}`
            : "No answer",
        correctAnswerText: q.options
          ? `${QUESTION_LETTERS[caIdx]}. ${q.options[caIdx]}`
          : "",
      };
    }
    if (q.type === "true-false") {
      const uaVal = ua;
      const caVal = q.correctAnswer;
      return {
        correct: uaVal === caVal,
        userAnswerText:
          uaVal === undefined ? "No answer" : uaVal ? "True" : "False",
        correctAnswerText: caVal ? "True" : "False",
      };
    }
    if (q.type === "fill-blanks") {
      const uaArr = Array.isArray(ua) ? ua : [];
      const caArr = q.correctAnswer;
      const correct = caArr.every(
        (c, i) => uaArr[i]?.toLowerCase().trim() === c.toLowerCase(),
      );
      return {
        correct,
        userAnswerText: uaArr.length ? uaArr.join(", ") : "No answer",
        correctAnswerText: caArr.join(", "),
      };
    }
    const uaStr = String(ua ?? "");
    return {
      correct: uaStr.length > 30,
      userAnswerText: uaStr || "No answer",
      correctAnswerText: String(q.correctAnswer),
    };
  };

  const renderReviewScreen = () => {
    const q = question;
    if (!q) return null;
    const result = getQuestionResult(q);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-5"
      >
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              Review Mode — Question {currentQ + 1} / {questions.length}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setState("quiz")}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Back to Quiz
              </Button>
              <Button
                variant="primary"
                onClick={() => setState("results")}
                leftIcon={<Trophy className="h-4 w-4" />}
              >
                View Results
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Progress
              value={currentQ + 1}
              max={questions.length}
              color="primary"
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
          <Card>
            <CardContent className="p-5 sm:p-6 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "chip",
                          result.correct
                            ? "bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400"
                            : "bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-400",
                        )}
                      >
                        {result.correct ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" /> Incorrect
                          </>
                        )}
                      </span>
                      <span
                        className={cn(
                          "chip",
                          q.type === "mcq"
                            ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"
                            : q.type === "true-false"
                              ? "bg-secondary-50 text-secondary-700 dark:bg-secondary-950/40 dark:text-secondary-400"
                              : q.type === "fill-blanks"
                                ? "bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400"
                                : "bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400",
                        )}
                      >
                        {q.type === "mcq"
                          ? "MCQ"
                          : q.type === "true-false"
                            ? "True / False"
                            : q.type === "fill-blanks"
                              ? "Fill Blanks"
                              : "Short Answer"}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 text-balance">
                        <span className="text-primary-600 dark:text-primary-400 mr-2">
                          #{currentQ + 1}
                        </span>
                        {q.question}
                      </h2>
                    </div>
                  </div>

                  {q.type === "mcq" && q.options && (
                    <div className="space-y-2.5">
                      {q.options.map((opt, idx) => {
                        const isCorrect = idx === q.correctAnswer;
                        const isUser = answers[q.id] === idx;
                        let stateClass = "";
                        if (isCorrect)
                          stateClass =
                            "border-accent-500 bg-accent-50 dark:bg-accent-950/40 dark:border-accent-400";
                        else if (isUser && !isCorrect)
                          stateClass =
                            "border-danger-500 bg-danger-50 dark:bg-danger-950/40 dark:border-danger-400";
                        else
                          stateClass =
                            "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900";
                        return (
                          <div
                            key={idx}
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-xl border-2",
                              stateClass,
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold",
                                isCorrect
                                  ? "bg-accent-600 text-white"
                                  : isUser && !isCorrect
                                    ? "bg-danger-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                              )}
                            >
                              {isCorrect && !isUser ? (
                                <Check className="h-5 w-5" />
                              ) : isUser && !isCorrect ? (
                                <X className="h-5 w-5" />
                              ) : (
                                QUESTION_LETTERS[idx]
                              )}
                            </span>
                            <span className="text-sm flex-1">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.type === "true-false" && (
                    <div className="grid grid-cols-2 gap-4">
                      {[true, false].map((val) => {
                        const isCorrect = q.correctAnswer === val;
                        const isUser = answers[q.id] === val;
                        let stateClass = "";
                        if (isCorrect)
                          stateClass = val
                            ? "border-accent-500 bg-accent-50 dark:bg-accent-950/40 dark:border-accent-400"
                            : "border-accent-500 bg-accent-50 dark:bg-accent-950/40 dark:border-accent-400";
                        else if (isUser && !isCorrect)
                          stateClass =
                            "border-danger-500 bg-danger-50 dark:bg-danger-950/40 dark:border-danger-400";
                        else
                          stateClass =
                            "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900";
                        return (
                          <div
                            key={String(val)}
                            className={cn(
                              "flex items-center justify-center gap-3 p-5 rounded-xl border-2",
                              stateClass,
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-11 w-11 items-center justify-center rounded-full",
                                isCorrect
                                  ? "bg-accent-600 text-white"
                                  : isUser && !isCorrect
                                    ? "bg-danger-600 text-white"
                                    : val
                                      ? "bg-slate-100 dark:bg-slate-800 text-accent-600"
                                      : "bg-slate-100 dark:bg-slate-800 text-danger-600",
                              )}
                            >
                              {val ? (
                                <Check className="h-6 w-6" />
                              ) : (
                                <X className="h-6 w-6" />
                              )}
                            </div>
                            <span className="text-lg font-bold">
                              {val ? "True" : "False"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.type === "fill-blanks" && (
                    <div className="space-y-3">
                      <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Your Answers
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {result.userAnswerText || "No answer provided"}
                        </p>
                      </div>
                      <div className="rounded-xl p-4 bg-accent-50 dark:bg-accent-950/30 space-y-2 border border-accent-200 dark:border-accent-900">
                        <p className="text-xs font-semibold text-accent-700 dark:text-accent-400 uppercase tracking-wide">
                          Correct Answers
                        </p>
                        <p className="text-sm text-accent-800 dark:text-accent-300 font-medium">
                          {result.correctAnswerText}
                        </p>
                      </div>
                    </div>
                  )}

                  {q.type === "short-answer" && (
                    <div className="space-y-3">
                      <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Your Answer
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {result.userAnswerText || "No answer provided"}
                        </p>
                      </div>
                      <div className="rounded-xl p-4 bg-accent-50 dark:bg-accent-950/30 space-y-2 border border-accent-200 dark:border-accent-900">
                        <p className="text-xs font-semibold text-accent-700 dark:text-accent-400 uppercase tracking-wide">
                          Acceptable Response
                        </p>
                        <p className="text-sm text-accent-800 dark:text-accent-300">
                          {result.correctAnswerText}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-secondary-200 dark:border-secondary-800 bg-secondary-50/50 dark:bg-secondary-950/20 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="chip bg-secondary-500 text-white">
                        <Lightbulb className="h-3 w-3" /> Explanation
                      </span>
                      <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <BookOpen className="h-3 w-3" /> Source: {q.sourceDoc}
                      </span>
                      <span
                        className={cn(
                          "chip",
                          result.correct
                            ? "bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400"
                            : "bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400",
                        )}
                      >
                        {result.correct ? "Strong Topic" : "Weak Topic"}:{" "}
                        {q.topic}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setCurrentQ((qIdx) => Math.max(0, qIdx - 1))
                      }
                      disabled={currentQ === 0}
                      leftIcon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Previous
                    </Button>
                    <div className="flex-1" />
                    <Button
                      variant="primary"
                      onClick={() =>
                        setCurrentQ((qIdx) =>
                          Math.min(questions.length - 1, qIdx + 1),
                        )
                      }
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      Next
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Question Navigator</CardTitle>
              <CardDescription>Click to jump</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((qu, idx) => {
                  const r = getQuestionResult(qu);
                  const isCurrent = idx === currentQ;
                  return (
                    <button
                      key={qu.id}
                      type="button"
                      onClick={() => setCurrentQ(idx)}
                      className={cn(
                        "aspect-square rounded-lg text-xs font-semibold transition-all border-2",
                        isCurrent
                          ? "border-primary-600 bg-primary-600 text-white"
                          : r.correct
                            ? "border-accent-400 bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400"
                            : "border-danger-400 bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-400",
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  };

  const renderResultsScreen = () => {
    const { correct, scorePct, skipped, weakTopics, strongTopics } =
      calculateResults();
    const wrong = questions.length - correct - skipped;
    const rank = getRank(scorePct);
    const timeTakenSec = examMode
      ? Math.max(0, totalTime - timeLeft)
      : Math.round(answeredCount * 45);
    const timeTaken = formatDuration(Math.round(timeTakenSec / 60));
    const circumference = 2 * Math.PI * 90;
    const dashOffset = circumference - (scorePct / 100) * circumference;

    const pieData = [
      { name: "Correct", value: correct, color: "#22c55e" },
      { name: "Incorrect", value: wrong, color: "#ef4444" },
      { name: "Skipped", value: skipped, color: "#94a3b8" },
    ];

    const aiSuggestions = [
      {
        icon: BookOpen,
        text: `Revise ${weakTopics[0]?.topic ?? "chapter 3"} concepts thoroughly`,
        color:
          "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400",
      },
      {
        icon: Brain,
        text: `Practice more MCQs on ${weakTopics[1]?.topic ?? "key topics"} to improve speed`,
        color:
          "bg-secondary-50 text-secondary-700 dark:bg-secondary-950/40 dark:text-secondary-400",
      },
      {
        icon: Sparkles,
        text: "Generate a targeted quiz on incorrect questions",
        color:
          "bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400",
      },
      {
        icon: Clock,
        text: "Spend 20 min daily reviewing flashcards for weak areas",
        color:
          "bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-400",
      },
      {
        icon: Lightbulb,
        text: "Ask the AI tutor to explain missed concepts step-by-step",
        color:
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      },
      {
        icon: Trophy,
        text: `Schedule a ${watchedSubject} mock exam for next week`,
        color:
          "bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-400",
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-indigo-600 via-primary-600 to-secondary-600 p-6 sm:p-8 text-white">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0 flex items-center gap-5 sm:items-start">
                  <div className="relative shrink-0">
                    <svg
                      width="180"
                      height="180"
                      className="transform -rotate-90"
                    >
                      <circle
                        cx="90"
                        cy="90"
                        r="90"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="12"
                      />
                      <motion.circle
                        cx="90"
                        cy="90"
                        r="90"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: dashOffset }}
                        transition={{
                          duration: 1.2,
                          ease: "easeOut",
                          delay: 0.2,
                        }}
                      />

                      <defs>
                        <linearGradient
                          id="scoreGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.5,
                          type: "spring",
                        }}
                        className="text-5xl font-extrabold"
                      >
                        {scorePct}%
                      </motion.span>
                      <span className="text-primary-100 text-sm mt-1">
                        Score
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${rank.color} px-4 py-1.5 text-sm font-bold text-white shadow-lg`}
                      >
                        <Trophy className="h-4 w-4" /> {rank.tier} Rank
                      </span>
                    </div>
                    <h1 className="mt-3 text-2xl sm:text-3xl font-bold">
                      {scorePct >= 75
                        ? "Outstanding performance!"
                        : scorePct >= 50
                          ? "Good effort — keep pushing!"
                          : "Time to review and try again"}
                    </h1>
                    <p className="mt-2 text-primary-100">
                      {watchedSubject} · {watch("topic")} · {questions.length}{" "}
                      questions
                      {examMode && ` · Exam mode (${timeTaken})`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Final Score"
            value={`${scorePct}%`}
            description={rank.tier + " rank"}
            icon={<Trophy className="h-6 w-6" />}
            color="primary"
          />
          <StatCard
            title="Correct Answers"
            value={`${correct} / ${questions.length}`}
            description={`${questions.length - correct - skipped} wrong · ${skipped} skipped`}
            icon={<CheckCircle2 className="h-6 w-6" />}
            color="accent"
          />
          <StatCard
            title="Wrong Answers"
            value={wrong}
            description="Questions to review"
            icon={<XCircle className="h-6 w-6" />}
            color="danger"
          />
          <StatCard
            title="Time Taken"
            value={timeTaken || "N/A"}
            description={
              examMode
                ? `of ${formatDuration(totalTime / 60)} total`
                : "Estimated"
            }
            icon={<Clock className="h-6 w-6" />}
            color="secondary"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>Distribution of answers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "rgb(15 23 42)",
                        border: "1px solid rgb(30 41 59)",
                        borderRadius: "0.75rem",
                        color: "rgb(241 245 249)",
                        fontSize: "0.875rem",
                      }}
                    />

                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Topic Analysis</CardTitle>
              <CardDescription>Strong and weak areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {strongTopics.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-accent-700 dark:text-accent-400 mb-3 flex items-center gap-2">
                    <TrendingUpFake className="h-4 w-4" /> Strong Topics
                  </p>
                  <div className="space-y-3">
                    {strongTopics.map((t) => (
                      <div key={t.topic}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-700 dark:text-slate-300">
                            {t.topic}
                          </span>
                          <span className="font-semibold text-accent-600 dark:text-accent-400">
                            {t.score}%
                          </span>
                        </div>
                        <Progress value={t.score} color="accent" size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {weakTopics.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-danger-700 dark:text-danger-400 mb-3 flex items-center gap-2">
                    <TrendingDownFake className="h-4 w-4" /> Weak Topics (Needs
                    Work)
                  </p>
                  <div className="space-y-3">
                    {weakTopics.map((t) => (
                      <div key={t.topic}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-700 dark:text-slate-300">
                            {t.topic}
                          </span>
                          <span className="font-semibold text-danger-600 dark:text-danger-400">
                            {t.score}%
                          </span>
                        </div>
                        <Progress value={t.score} color="danger" size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>AI Study Suggestions</CardTitle>
                <CardDescription>
                  Personalized next steps based on your results
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {aiSuggestions.map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className={cn(
                    "flex items-start gap-3 rounded-xl p-4",
                    s.color,
                  )}
                >
                  <s.icon className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">
                    {s.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setState("quiz");
                  setAnswers({});
                  setCurrentQ(0);
                  setFlagged(new Set());
                  if (examMode && totalTime) setTimeLeft(totalTime);
                  toast.success("Quiz restarted");
                }}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Retake Quiz
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setState("config");
                  reset();
                }}
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                Generate New Quiz
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setState("review")}
                leftIcon={<Eye className="h-4 w-4" />}
              >
                Review Answers
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={exportCSV}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <AnimatePresence mode="wait">
        {state === "config" && <div key="config">{renderConfigScreen()}</div>}
        {state === "quiz" && <div key="quiz">{renderQuizScreen()}</div>}
        {state === "review" && <div key="review">{renderReviewScreen()}</div>}
        {state === "results" && (
          <div key="results">{renderResultsScreen()}</div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TrendingUpFake = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const TrendingDownFake = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </svg>
);
