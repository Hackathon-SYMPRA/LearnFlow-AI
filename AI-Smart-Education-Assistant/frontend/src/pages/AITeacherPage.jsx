import React, { useState, useEffect, useRef, useCallback } from "react";
import { GraduationCap, Mic, Sparkles, CheckCircle2, XCircle, Square, Play, FileText, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { aiService, documentService, chatService } from "@/services";
import { useParams, useNavigate } from "react-router-dom";
import { useSympraVoice } from "@/contexts/SympraVoiceContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateId } from "@/utils/format";

export const AITeacherPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isDocumentsLoaded, setIsDocumentsLoaded] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState("");
  
  const [isMockTestActive, setIsMockTestActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(sessionId || null);
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  
  const { currentTask, completeTask, speak, setIsAssistantActive } = useSympraVoice();
  const taskHandledRef = React.useRef(null);
  
  const recognitionRef = useRef(null);
  useEffect(() => {
    fetchDocuments();
    if (sessionId) {
      loadSession(sessionId);
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    
    // Cleanup: re-enable global assistant when leaving the mock test page
    return () => {
      if (setIsAssistantActive) setIsAssistantActive(true);
    };
  }, [sessionId, setIsAssistantActive]);

  const loadSession = async (id) => {
    try {
      const res = await chatService.getSession(id);
      if (res.data) {
        setMessages(res.data.messages || []);
        if (res.data.document_ids && res.data.document_ids.length > 0) {
          setSelectedDoc(res.data.document_ids[0]);
        }
        setIsMockTestActive(true);
      }
    } catch (err) {
      toast.error("Failed to load session");
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await documentService.list();
      setDocuments(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedDoc(res.data[0].id);
      }
      setIsDocumentsLoaded(true);
    } catch (error) {
      toast.error("Failed to fetch documents");
      setIsDocumentsLoaded(true);
    }
  };

  // Autonomous task execution
  useEffect(() => {
    if (currentTask && currentTask.intent === 'AI_TEACHER_TEST' && isDocumentsLoaded) {
      if (taskHandledRef.current === currentTask.timestamp) return;
      taskHandledRef.current = currentTask.timestamp;

      const { source } = currentTask.parameters;
      if (!selectedDoc && documents.length > 0) {
        setSelectedDoc(documents[0].id || documents[0]._id);
      }
      setTimeout(() => {
        startMockTest();
        completeTask();
      }, 500);
    }
  }, [currentTask, documents, selectedDoc, isDocumentsLoaded]);

  const speakText = (text, langStr) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Clean markdown symbols to prevent TTS from reading "asterisk"
      const cleanText = text ? text.replace(/[*_~`#]/g, '').trim() : "";
      const utterance = new SpeechSynthesisUtterance(cleanText);
      let targetLang = "en-IN";
      utterance.lang = targetLang;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        let voice = voices.find(v => v.lang.includes(targetLang) && v.name.includes('Google'));
        if (!voice) voice = voices.find(v => v.lang.includes(targetLang));
        if (voice) {
           utterance.voice = voice;
           utterance.lang = voice.lang;
        }
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startMockTest = async () => {
    if (!selectedDoc) {
      toast.error("Please select a document first");
      return;
    }
    
    setMessages([]);
    setIsMockTestActive(true);
    setIsTyping(true);
    
    // Create new session in DB
    const newId = `sess-${generateId()}`;
    setCurrentSessionId(newId);
    
    let dbSessionId = newId;
    try {
      const doc = documents.find(d => d.id === selectedDoc || d._id === selectedDoc);
      const docName = doc ? (doc.original_name || doc.file_name) : "Document";
      const created = await chatService.createSession(`Mock Test: ${docName}`, [selectedDoc], "Teacher");
      const sessionData = created.data || created;
      dbSessionId = sessionData.id || sessionData._id || newId;
      setCurrentSessionId(dbSessionId);
      // We don't navigate immediately to avoid interrupting the test flow, but you could:
      // navigate(`/ai-teacher/${dbSessionId}`, { replace: true });
    } catch (err) {
      console.error("Failed to create session in DB", err);
    }

    try {
      const res = await aiService.generateMockTestQuestion(selectedDoc, "English", []);
      const question = res.data?.response || "Let's start. Please tell me about the main concepts.";
      
      const newMsgs = [{
        id: Date.now(),
        role: "assistant",
        content: question,
        isExamMode: true,
      }];
      setMessages(newMsgs);
      
      if (dbSessionId && !dbSessionId.startsWith("sess-")) {
        await chatService.updateSession(dbSessionId, { messages: newMsgs }).catch(console.error);
      }
      
      speakText(question, "English");
    } catch (error) {
      toast.error("Failed to start mock test");
      setIsMockTestActive(false);
    } finally {
      setIsTyping(false);
    }
  };

  const stopMockTest = () => {
    setIsMockTestActive(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
  };

  const startRecording = useCallback(() => {
    try {
      if (setIsAssistantActive) setIsAssistantActive(false);
      
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        toast.error("Voice recognition not supported in your browser.");
        return;
      }
      
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsRecording(true);
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      };

      recognition.onresult = (event) => {
        let interimText = "";
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalText += res[0].transcript;
          } else {
            interimText += res[0].transcript;
          }
        }
        setInterimTranscript(interimText);
        
        if (finalText) {
          handleUserAnswer(finalText);
        }
      };

      recognition.onerror = (event) => {
        if (event.error !== "no-speech") {
          toast.error("Voice error: " + event.error);
        }
        setIsRecording(false);
        setInterimTranscript("");
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimTranscript("");
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      toast.error("Could not start recording.");
    }
  }, [selectedDoc, messages, setIsAssistantActive]);

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleUserAnswer = async (answer) => {
    setIsRecording(false);
    setInterimTranscript("");
    
    if (!answer.trim()) return;

    const userMsg = { id: Date.now(), role: "user", content: answer };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Prepare history for context
      const history = newMessages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await aiService.evaluateMockTestAnswer(selectedDoc, "English", answer, history);
      const evaluation = res.data?.response || "Thank you for your answer.";
      
      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: evaluation,
      };
      
      const finalMsgs = [...newMessages, aiMsg];
      setMessages(finalMsgs);
      speakText(evaluation, "English");
      
      if (currentSessionId && !currentSessionId.startsWith("sess-")) {
        await chatService.updateSession(currentSessionId, { messages: finalMsgs }).catch(console.error);
      }
    } catch (error) {
      toast.error("Failed to evaluate answer.");
      const errorMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I'm sorry, I couldn't process your answer due to an error.",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row min-h-16 shrink-0 items-start sm:items-center justify-between border-b border-slate-200 bg-white px-6 py-4 sm:py-0 dark:border-slate-800 dark:bg-slate-900/50 gap-4">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-primary-500 mr-3" />
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Teacher Mock Test</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Oral examination based on your documents</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <FileText className="h-4 w-4 text-slate-500" />
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              disabled={isMockTestActive}
              className="bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none w-32 truncate"
            >
              <option value="" disabled>Select Document</option>
              {documents.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.original_name || doc.file_name}</option>
              ))}
            </select>
          </div>

          {!isMockTestActive ? (
            <button
              onClick={startMockTest}
              disabled={!selectedDoc || isTyping}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
            >
              <Play className="h-4 w-4" /> Start Test
            </button>
          ) : (
            <button
              onClick={stopMockTest}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              <Square className="h-4 w-4" /> End Test
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {!isMockTestActive && messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <GraduationCap className="h-16 w-16 text-slate-400 mb-4" />
            <h2 className="text-xl font-medium text-slate-600 dark:text-slate-300">Ready for an Oral Exam?</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">Select a document above, then click Start Test. The AI will ask you questions using voice, and you must answer using your microphone.</p>
          </div>
        ) : (
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
                    <div className={`rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-tl-none prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1'}`}>
                      {msg.role === 'user' ? (
                        msg.content
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {interimTranscript && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                <div className="flex max-w-[85%] sm:max-w-[75%] gap-3 flex-row-reverse">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-white opacity-70">
                    U
                  </div>
                  <div className="rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 rounded-tr-none italic opacity-70">
                    {interimTranscript}...
                  </div>
                </div>
              </motion.div>
            )}

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
        )}
      </div>

      {/* Input Area */}
      {isMockTestActive && (
        <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-slate-500 mb-3">
            {isRecording ? "Listening to your answer..." : "Click the mic to speak your answer"}
          </p>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTyping}
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all ${
              isRecording 
                ? "bg-rose-500 hover:bg-rose-600 animate-pulse ring-4 ring-rose-500/30" 
                : "bg-primary-600 hover:bg-primary-700 hover:scale-105"
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-7 w-7" />}
          </button>
        </div>
      )}
    </div>
  );
};
