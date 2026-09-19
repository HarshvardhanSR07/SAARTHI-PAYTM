'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechSynthesisHook {
  isSpeaking: boolean;
  isPaused: boolean;
  speak: (text: string, onEnd?: () => void) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isSupported: boolean;
  progress: number;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [progress, setProgress] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<any>(null);
  const durationEstimateRef = useRef<number>(6);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setProgress(0);
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        return;
      }

      stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Select natural Indian English or Hindi voice if available
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(
        (v) => v.lang.includes('hi') || v.lang.includes('en-IN') || v.name.includes('India')
      );
      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Estimate progress
      const wordCount = text.split(/\s+/).length;
      const estimatedSecs = Math.max(3, Math.min(12, wordCount * 0.45));
      durationEstimateRef.current = estimatedSecs;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setProgress(0);

        const startTime = Date.now();
        progressTimerRef.current = setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000;
          const pct = Math.min(98, (elapsed / durationEstimateRef.current) * 100);
          setProgress(pct);
        }, 100);
      };

      utterance.onend = () => {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
        setProgress(100);
        setTimeout(() => {
          setIsSpeaking(false);
          setIsPaused(false);
          setProgress(0);
          if (onEnd) onEnd();
        }, 300);
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
        setIsSpeaking(false);
        setIsPaused(false);
        setProgress(0);
      };

      window.speechSynthesis.speak(utterance);
    },
    [stop]
  );

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  return {
    isSpeaking,
    isPaused,
    speak,
    pause,
    resume,
    stop,
    isSupported,
    progress,
  };
}
