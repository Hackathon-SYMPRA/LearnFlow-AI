import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Square,
  X,
  PlayCircle,
  ShieldX,
  AlertCircle,
  Volume2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/format';

interface VoiceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
}

type RecorderState =
  | 'idle'
  | 'recording'
  | 'permission-denied'
  | 'unsupported'
  | 'too-short'
  | 'finished'
  | 'replaying';

const MAX_RECORDING_SECONDS = 60;
const MIN_RECORDING_SECONDS = 1;

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isOpen,
  onClose,
  onTranscript,
}) => {
  const [state, setState] = useState<RecorderState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 32 }, () => 0.2)
  );

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const barsRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (barsRef.current) {
      clearInterval(barsRef.current);
      barsRef.current = null;
    }
  }, []);

  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const resetAll = useCallback(() => {
    clearTimers();
    stopMedia();
    setState('idle');
    setElapsed(0);
    setTranscript('');
    setInterim('');
    setBars(Array.from({ length: 32 }, () => 0.2));
    audioBlobRef.current = null;
    mediaRecorderRef.current = null;
  }, [clearTimers, stopMedia]);

  useEffect(() => {
    if (!isOpen) {
      resetAll();
    }
  }, [isOpen, resetAll]);

  useEffect(() => {
    return () => {
      resetAll();
    };
  }, [resetAll]);

  const startBars = useCallback(() => {
    barsRef.current = setInterval(() => {
      setBars(
        Array.from({ length: 32 }, () => 0.3 + Math.random() * 0.7)
      );
    }, 90);
  }, []);

  const finalizeRecording = useCallback(() => {
    clearTimers();
    stopMedia();

    const seconds = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );

    if (seconds < MIN_RECORDING_SECONDS) {
      setState('too-short');
      return;
    }

    const finalText = (transcript + ' ' + interim).trim();
    if (finalText.length === 0) {
      setState('too-short');
      return;
    }

    setTranscript(finalText);
    setInterim('');
    setState('finished');
  }, [clearTimers, stopMedia, transcript, interim]);

  const startRecording = useCallback(async () => {
    try {
      const SR =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        setState('unsupported');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      try {
        const mr = new MediaRecorder(stream);
        const chunks: Blob[] = [];
        mr.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        mr.onstop = () => {
          audioBlobRef.current = new Blob(chunks, { type: 'audio/webm' });
        };
        mr.start();
        mediaRecorderRef.current = mr;
      } catch {
        // MediaRecorder not critical; transcript will still work
      }

      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (e: SpeechRecognitionEvent) => {
        let interimText = '';
        let finalText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) {
            finalText += res[0].transcript;
          } else {
            interimText += res[0].transcript;
          }
        }
        if (finalText) {
          setTranscript((prev) => (prev ? prev + ' ' : '') + finalText.trim());
        }
        setInterim(interimText.trim());
      };

      recognition.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setState('permission-denied');
          clearTimers();
          stopMedia();
        } else if (e.error === 'no-speech') {
          // ignore; will show too-short on stop
        } else {
          toast.error('Voice recognition error: ' + e.error);
        }
      };

      recognition.onend = () => {
        // Only auto-finalize if elapsed reached max
        if (state === 'recording' && elapsed >= MAX_RECORDING_SECONDS) {
          finalizeRecording();
        }
      };

      recognition.start();
      recognitionRef.current = recognition;

      startTimeRef.current = Date.now();
      setState('recording');
      startBars();

      timerRef.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(secs);
        if (secs >= MAX_RECORDING_SECONDS) {
          try {
            recognitionRef.current?.stop();
          } catch {
            /* ignore */
          }
        }
      }, 250);
    } catch (err) {
      const e = err as { name?: string };
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setState('permission-denied');
      } else if (e.name === 'NotFoundError') {
        toast.error('No microphone found on this device');
      } else {
        toast.error('Could not start voice recording');
      }
    }
  }, [clearTimers, stopMedia, startBars, state, elapsed, finalizeRecording]);

  const stopRecording = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    try {
      mediaRecorderRef.current?.stop();
    } catch {
      /* ignore */
    }
    finalizeRecording();
  }, [finalizeRecording]);

  const replayAudio = useCallback(() => {
    if (!audioBlobRef.current) return;
    const url = URL.createObjectURL(audioBlobRef.current);
    if (!audioElRef.current) {
      audioElRef.current = new Audio(url);
      audioElRef.current.onended = () => setState('finished');
    } else {
      audioElRef.current.src = url;
    }
    audioElRef.current.play().catch(() => {
      toast.error('Could not play audio');
    });
    setState('replaying');
  }, []);

  const handleUseTranscript = useCallback(() => {
    const text = transcript.trim();
    if (!text) {
      toast.warning('Nothing to send. Please try recording again.');
      return;
    }
    onTranscript(text);
    onClose();
  }, [transcript, onTranscript, onClose]);

  const handleClose = useCallback(() => {
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }
    onClose();
  }, [onClose]);

  const formatClock = (s: number) => {
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Voice Input
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Speak naturally — your words will become a message
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close voice recorder"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {state === 'unsupported' && (
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Voice not supported
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      Your browser does not support speech recognition. Try Chrome, Edge, or Safari.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {state === 'permission-denied' && (
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-4">
                <div className="flex items-start gap-3">
                  <ShieldX className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-rose-800 dark:text-rose-300">
                      Microphone permission denied
                    </p>
                    <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">
                      Grant microphone permission in your browser settings, then retry.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {state === 'too-short' && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Please speak a bit longer
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      We couldn&apos;t capture any words. Record at least a second of speech.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {(state === 'idle' ||
              state === 'recording' ||
              state === 'too-short') && (
              <div className="flex flex-col items-center my-6">
                <button
                  type="button"
                  onClick={
                    state === 'recording' ? stopRecording : startRecording
                  }
                  disabled={false}
                  className={cn(
                    'relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300',
                    state === 'recording'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  )}
                >
                  {state === 'recording' && (
                    <>
                      <motion.span
                        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.2, 0.5] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full bg-rose-500/40"
                      />
                      <motion.span
                        animate={{ scale: [1, 1.5, 1], opacity: [0.35, 0, 0.35] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full bg-rose-500/30"
                      />
                    </>
                  )}
                  {state === 'recording' ? (
                    <Square className="h-8 w-8 relative z-10" />
                  ) : (
                    <Mic className="h-10 w-10 relative z-10" />
                  )}
                </button>

                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span
                    className={cn(
                      'tabular-nums',
                      state === 'recording'
                        ? MAX_RECORDING_SECONDS - elapsed <= 10
                          ? 'text-rose-600 dark:text-rose-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-200'
                        : 'text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {formatClock(elapsed)} / {formatClock(MAX_RECORDING_SECONDS)}
                  </span>
                </div>

                <div className="mt-6 h-16 w-full flex items-end justify-center gap-[2px] px-2">
                  {bars.map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        height: `${Math.max(6, h * 100)}%`,
                        opacity: state === 'recording' ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.09 }}
                      className={cn(
                        'w-1.5 rounded-full',
                        state === 'recording'
                          ? i % 2 === 0
                            ? 'bg-primary-500'
                            : 'bg-secondary-500'
                          : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    />
                  ))}
                </div>

                {(interim || transcript) && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 max-h-28 overflow-y-auto"
                  >
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {transcript}{' '}
                      <span className="text-slate-400 dark:text-slate-500">
                        {interim}
                      </span>
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {(state === 'finished' || state === 'replaying') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="my-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Transcript
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    {formatClock(elapsed)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 max-h-36 overflow-y-auto">
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    <span className="bg-primary-100 dark:bg-primary-950/50 rounded px-0.5">
                      {transcript}
                    </span>
                  </p>
                </div>
                {audioBlobRef.current && (
                  <button
                    type="button"
                    onClick={replayAudio}
                    disabled={state === 'replaying'}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-60 disabled:no-underline"
                  >
                    <PlayCircle className="h-4 w-4" />
                    {state === 'replaying' ? 'Playing...' : 'Replay recording'}
                  </button>
                )}
                {!audioBlobRef.current && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                    <Volume2 className="h-4 w-4" />
                    Replay unavailable in this browser
                  </div>
                )}
              </motion.div>
            )}

            <div className="mt-2 flex items-center justify-end gap-2">
              {(state === 'idle' ||
                state === 'too-short' ||
                state === 'permission-denied' ||
                state === 'unsupported') && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-10 px-4 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
              )}
              {state === 'recording' && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-10 px-4 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
              )}
              {(state === 'finished' || state === 'replaying') && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      resetAll();
                      setState('idle');
                    }}
                    className="h-10 px-4 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Re-record
                  </button>
                  <button
                    type="button"
                    onClick={handleUseTranscript}
                    className="h-10 px-5 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition"
                  >
                    Use Transcript
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
