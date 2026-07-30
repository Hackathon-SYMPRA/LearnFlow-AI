import React from 'react';
import { useSympraVoice } from '../contexts/SympraVoiceContext';

const SympraAssistantUI = () => {
  const { agentState, browserSupportsSpeechRecognition, isMicrophoneAvailable, listening, transcript, isAssistantActive, setIsAssistantActive } = useSympraVoice();

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center bg-red-50 dark:bg-red-900/20 shadow-lg rounded-full px-4 py-2 border border-red-200 dark:border-red-800">
        <div className="w-3 h-3 rounded-full mr-3 bg-red-500"></div>
        <span className="text-sm font-medium text-red-700 dark:text-red-400">
          Browser doesn't support Voice AI
        </span>
      </div>
    );
  }

  if (isMicrophoneAvailable === false) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center bg-red-50 dark:bg-red-900/20 shadow-lg rounded-full px-4 py-2 border border-red-200 dark:border-red-800">
        <div className="w-3 h-3 rounded-full mr-3 bg-red-500 animate-pulse"></div>
        <span className="text-sm font-medium text-red-700 dark:text-red-400">
          Please Allow Microphone Access
        </span>
      </div>
    );
  }

  if (!isAssistantActive) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <div 
          onClick={() => setIsAssistantActive(true)}
          className="flex items-center bg-gray-100 dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 border border-gray-300 dark:border-gray-700 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        >
          <div className="w-3 h-3 rounded-full mr-3 bg-red-400"></div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Assistant Offline (Click to Activate)
          </span>
        </div>
      </div>
    );
  }

  if (agentState === 'idle') {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {transcript && (
          <div className="bg-gray-800 text-white text-xs rounded px-3 py-1.5 shadow-lg max-w-xs text-right opacity-80">
            Hearing: "{transcript}"
          </div>
        )}
        <div 
          onClick={() => setIsAssistantActive(false)}
          className="flex items-center bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          title="Click to deactivate assistant"
        >
          <div className={`w-3 h-3 rounded-full mr-3 ${listening ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Say <span className="font-semibold text-primary-500">"Hi Sympra"</span>
          </span>
        </div>
      </div>
    );
  }

  // Determine styles and text based on state
  let text = '';
  let colorClass = '';
  let pulseClass = '';

  switch (agentState) {
    case 'listening':
      text = 'Listening...';
      colorClass = 'bg-blue-500';
      pulseClass = 'animate-pulse';
      break;
    case 'processing':
      text = 'Thinking...';
      colorClass = 'bg-purple-500';
      pulseClass = 'animate-bounce';
      break;
    case 'speaking':
      text = 'Speaking...';
      colorClass = 'bg-green-500';
      pulseClass = 'animate-pulse';
      break;
    default:
      break;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className={`w-4 h-4 rounded-full mr-3 ${colorClass} ${pulseClass}`}></div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Sympra: <span className="font-semibold">{text}</span>
      </span>
    </div>
  );
};

export default SympraAssistantUI;
