import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '@/constants';
import 'regenerator-runtime/runtime';
import { toast } from 'sonner';

const SympraVoiceContext = createContext();

export const useSympraVoice = () => useContext(SympraVoiceContext);

export const SympraVoiceProvider = ({ children }) => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(true);
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(true);

  const [agentState, setAgentState] = useState('idle'); // idle, listening, processing, speaking
  const [currentTask, setCurrentTask] = useState(null); // The intent data sent to pages
  const [isAssistantActive, setIsAssistantActive] = useState(false); // Start false to comply with browser policies
  const navigate = useNavigate();
  const location = useLocation();

  const silenceTimer = useRef(null);
  const wakeWordDetectedRef = useRef(false);
  const recognitionRef = useRef(null);
  const isAssistantActiveRef = useRef(isAssistantActive);

  useEffect(() => {
    isAssistantActiveRef.current = isAssistantActive;
  }, [isAssistantActive]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Initialize Native Speech Recognition
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setBrowserSupportsSpeechRecognition(false);
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setListening(true);
      setIsMicrophoneAvailable(true);
    };

    recognition.onresult = (event) => {
      let finalStr = '';
      let interimStr = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript;
        } else {
          interimStr += event.results[i][0].transcript;
        }
      }
      // If there's final string, use it. Otherwise show interim.
      const currentTranscript = finalStr || interimStr;
      if (currentTranscript) {
        setTranscript(currentTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error("[SympraVoice] Native Speech Error:", event.error);
      if (event.error === 'not-allowed') {
        setIsMicrophoneAvailable(false);
        setIsAssistantActive(false);
      }
    };

    recognition.onend = () => {
      setListening(false);
      // Robust auto-restart logic if it stopped but should be active
      if (isAssistantActiveRef.current) {
        console.log("[SympraVoice] Auto-restarting native microphone...");
        try {
          recognition.start();
        } catch (e) {
          console.error("Failed to auto-restart mic", e);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
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

      if (response.ok) {
        const data = await response.json();
        const intentData = data.data; 

        setAgentState('speaking');
        await speak(intentData.speech_reply, 'en-US');
        handleIntentExecution(intentData);
      } else {
        setAgentState('speaking');
        await speak("I'm sorry, I encountered an error connecting to my server.");
        setAgentState('idle');
      }
    } catch (error) {
      setAgentState('speaking');
      await speak("Sorry, something went wrong with the network.");
      setAgentState('idle');
    }
  };

  const handleIntentExecution = (intentData) => {
    const { intent, parameters } = intentData;
    setCurrentTask(intentData);

    switch (intent) {
      case 'CHAT': navigate('/chat'); break;
      case 'GENERATE_NOTES': navigate('/notes'); break;
      case 'AI_TEACHER_TEST': navigate('/ai-teacher'); break;
      case 'GENERATE_QUIZ': navigate('/quiz'); break;
      case 'GENERATE_FLASHCARDS': navigate('/flashcards'); break;
      case 'GENERATE_MINDMAP': navigate('/mindmap'); break;
      default: break;
    }
    resetTranscript();
    setAgentState('listening');
  };

  const completeTask = useCallback(() => {
    setCurrentTask(null);
  }, []);

  // Monitor transcript for Wake Word and Commands
  useEffect(() => {
    if (!transcript) return;
    const lowerTranscript = transcript.toLowerCase();

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
      if (recognitionRef.current) recognitionRef.current.stop();
      resetTranscript();
      speak("Assistant deactivated.", "en-US");
      return;
    }

    if (agentState === 'idle' || agentState === 'speaking') {
      const matchedWord = wakeWords.find(w => lowerTranscript.includes(w));
      if (matchedWord) {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        
        const startIndex = lowerTranscript.indexOf(matchedWord) + matchedWord.length;
        const afterText = lowerTranscript.substring(startIndex).trim();

        wakeWordDetectedRef.current = true;
        resetTranscript();

        if (afterText.length > 2) {
          processCommand(afterText);
        } else {
          setAgentState('listening');
          speak("Hello, this is Sympra created by Team Sympra to help you in LearnFlow. How can I help you?")
            .then(() => resetTranscript());
        }
        return;
      }
    }

    if (agentState === 'listening' && wakeWordDetectedRef.current) {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
        if (transcript.trim().length > 0) {
          setAgentState('processing');
          processCommand(transcript);
          resetTranscript();
        }
      }, 1500);
    }
  }, [transcript, agentState, resetTranscript, speak]);

  // Synchronous activation for strict browser policies
  const activateAssistant = useCallback(() => {
    setIsAssistantActive(true);
    if (recognitionRef.current && !listening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Manual start failed", e);
      }
    }
  }, [listening]);

  // Watch for deactivation manually triggered elsewhere
  useEffect(() => {
    if (!isAssistantActive && listening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isAssistantActive, listening]);

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
    setIsAssistantActive,
    activateAssistant
  };

  return (
    <SympraVoiceContext.Provider value={value}>
      {children}
    </SympraVoiceContext.Provider>
  );
};
