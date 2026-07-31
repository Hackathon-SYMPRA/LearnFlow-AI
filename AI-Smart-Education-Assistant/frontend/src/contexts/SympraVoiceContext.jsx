import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '@/constants';
import 'regenerator-runtime/runtime';
import { toast } from 'sonner';

const SympraVoiceContext = createContext();

export const useSympraVoice = () => useContext(SympraVoiceContext);

export const SympraVoiceProvider = ({ children }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  const [agentState, setAgentState] = useState('idle'); // idle, listening, processing, speaking
  const [currentTask, setCurrentTask] = useState(null); // The intent data sent to pages
  const [isAssistantActive, setIsAssistantActive] = useState(true); // Whether mic should stay on
  const navigate = useNavigate();
  const location = useLocation();

  const silenceTimer = useRef(null);
  const wakeWordDetectedRef = useRef(false);

  // Clean text from markdown symbols so speech synth doesn't say "asterisk"
  const cleanMarkdownForSpeech = (text) => {
    if (!text) return "";
    return text.replace(/[*_~`#]/g, '').trim();
  };

  // Function to make the AI speak
  const speak = useCallback((text, lang = 'en-US') => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const cleanText = cleanMarkdownForSpeech(text);
        const utterance = new SpeechSynthesisUtterance(cleanText);

        let targetLang = 'en-US';

        utterance.lang = targetLang;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          let selectedVoice = voices.find(v => v.lang.includes(targetLang) && v.name.includes('Google'));
          if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.includes(targetLang));
          }
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
          }
        }

        utterance.onend = () => {
          resolve();
        };
        utterance.onerror = () => {
          resolve(); // Resolve even on error to prevent hanging
        };

        window.speechSynthesis.speak(utterance);
      } else {
        resolve(); // Fallback if no TTS
      }
    });
  }, []);

  // Process the command by calling the backend
  const processCommand = async (commandText) => {
    setAgentState('processing');
    try {
      let tokenStr = localStorage.getItem('edumind_token');
      const token = tokenStr ? tokenStr.replace(/^"|"$/g, '') : null;

      const response = await fetch(`${API_BASE_URL}/ai/agent/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          transcript: commandText,
          current_page: location.pathname
        })
      });

      console.log("[SympraVoice] Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("[SympraVoice] Received intent data:", data);
        const intentData = data.data; // { intent, parameters, speech_reply }

        setAgentState('speaking');
        await speak(intentData.speech_reply, 'en-US');

        // Handle navigation and action injection based on intent
        handleIntentExecution(intentData);
      } else {
        const errorText = await response.text();
        console.error(`[SympraVoice] API Error ${response.status}:`, errorText);
        setAgentState('speaking');
        await speak("I'm sorry, I encountered an error connecting to my server.");
        setAgentState('idle');
      }
    } catch (error) {
      console.error("[SympraVoice] Network or Agent error:", error);
      setAgentState('speaking');
      await speak("Sorry, something went wrong with the network.");
      setAgentState('idle');
    }
  };

  const handleIntentExecution = (intentData) => {
    const { intent, parameters } = intentData;

    // Set the task globally so the target page can pick it up in a useEffect
    setCurrentTask(intentData);

    // Route logic
    switch (intent) {
      case 'CHAT':
        navigate('/chat');
        break;
      case 'GENERATE_NOTES':
        navigate('/notes');
        break;
      case 'AI_TEACHER_TEST':
        navigate('/ai-teacher');
        break;
      case 'GENERATE_QUIZ':
        navigate('/quiz');
        break;
      case 'GENERATE_FLASHCARDS':
        navigate('/flashcards');
        break;
      case 'GENERATE_MINDMAP':
        navigate('/mindmap');
        break;
      default:
        // Do nothing for unknown
        break;
    }

    resetTranscript();
    setAgentState('listening');
  };

  // Mark task as completed from the page
  const completeTask = useCallback(() => {
    setCurrentTask(null);
  }, []);

  // Monitor transcript for Wake Word and Commands
  useEffect(() => {
    if (!transcript) return;

    const lowerTranscript = transcript.toLowerCase();

    // 1. Wake Word Detection
    // Adding variations to handle Indian accent misinterpretations
    const wakeWords = [
      'hi sympra', 'hello sympra', 'ok sympra', 'hey sympra',
      'hi simpra', 'hello simpra', 'ok simpra', 'hey simpra',
      'hi simran', 'hi supra', 'hi zebra', 'ok supra', 'ok simran',
      'hi simple', 'hello simple', 'hi simra', 'hello simra', 'ok simra',
      'hi shimpra', 'hello shimpra', 'ok shimpra',
      'hi sampra', 'hello sampra', 'ok sampra', 'hey sampra',
      'hi cimpra', 'hello cimpra', 'ok cimpra', 'hey cimpra',
      'hi shipra', 'hello shipra', 'ok shipra', 'hey shipra',
      'hi simba', 'hello simba', 'ok simba', 'hey simba',
      'hi synpra', 'hello synpra', 'ok synpra', 'hey synpra',
      'hi supreme', 'hello supreme', 'ok supreme', 'hey supreme'
    ];

    const deactivateWords = ['deactivate', 'stop listening', 'stop sympra', 'sympra stop', 'simpra stop', 'ok stop', 'band kara', 'band ho', 'close sympra'];
    if (deactivateWords.some(w => lowerTranscript.includes(w))) {
      setIsAssistantActive(false);
      setAgentState('idle');
      SpeechRecognition.stopListening();
      resetTranscript();
      speak("Assistant deactivated.", "en-US");
      return;
    }

    if (agentState === 'idle' || agentState === 'speaking') {
      const matchedWord = wakeWords.find(w => lowerTranscript.includes(w));
      if (matchedWord) {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        // Extract any command spoken immediately after the wake word (e.g. "hi simra open notes")
        const startIndex = lowerTranscript.indexOf(matchedWord) + matchedWord.length;
        const afterText = lowerTranscript.substring(startIndex).trim();

        wakeWordDetectedRef.current = true;
        resetTranscript();

        if (afterText.length > 2) {
          // If they already said a command, skip the greeting and process it
          processCommand(afterText);
        } else {
          // Otherwise wait for them to speak
          setAgentState('listening');
          speak("Hello, this is Sympra created by Team Sympra to help you in LearnFlow. How can I help you?")
            .then(() => {
              resetTranscript();
            });
        }
        return;
      }
    }

    // 2. Command Detection (After Wake Word)
    if (agentState === 'listening' && wakeWordDetectedRef.current) {
      // Clear previous timeout
      if (silenceTimer.current) clearTimeout(silenceTimer.current);

      // Set new timeout for 1.5 seconds of silence
      silenceTimer.current = setTimeout(() => {
        if (transcript.trim().length > 0) {
          // wakeWordDetectedRef remains true for continuous conversation
          setAgentState('processing');
          processCommand(transcript);
          resetTranscript();
        }
      }, 1500);
    }
  }, [transcript, agentState, resetTranscript, speak]);

  // Start listening continuously when mounted (and restart if it stops unexpectedly)
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn("Browser doesn't support speech recognition.");
      return;
    }

    if (isAssistantActive) {
      if (!listening && agentState !== 'processing' && agentState !== 'speaking') {
        console.log("[SympraVoice] Starting microphone (en-IN)");
        // Add a small delay to prevent rapid start/stop loops which cause 'aborted'
        const timeoutId = setTimeout(() => {
          SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
        }, 300);
        return () => clearTimeout(timeoutId);
      }
    } else if (listening) {
      SpeechRecognition.stopListening();
    }
  }, [browserSupportsSpeechRecognition, listening, agentState, isAssistantActive]);

  const value = {
    agentState,
    currentTask,
    completeTask,
    speak,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    listening,
    transcript,
    isAssistantActive,
    setIsAssistantActive
  };

  return (
    <SympraVoiceContext.Provider value={value}>
      {children}
    </SympraVoiceContext.Provider>
  );
};
