import { useState, useRef, useCallback } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSpeakingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone access denied or pending user gesture.');
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setIsRecording(false);
        streamRef.current?.getTracks().forEach(track => track.stop());
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  const startAutoListen = useCallback(async (onSpeechCaptured: (blob: Blob) => void, onListenStateChange: (state: 'idle' | 'listening') => void) => {
    // FIX: Clean up any existing listeners to prevent orphaned loops in React Strict Mode!
    if (rafIdRef.current) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null; }
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch(e) {}
    }
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    isSpeakingRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.minDecibels = -60;
      analyser.smoothingTimeConstant = 0.8;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      const checkAudioLevel = () => {
        if (!analyserRef.current) return;
        
        // Auto-resume if suspended (and a gesture occurred elsewhere)
        if (audioContextRef.current?.state === 'suspended') {
           // We just let the loop continue. Another global listener will resume it.
        }
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / bufferLength;
        
        if (average > 10) { // Speech detected threshold
          if (!isSpeakingRef.current) {
             console.log("[Auto-Listen] Speech started (avg volume:", average, ")");
             isSpeakingRef.current = true;
             onListenStateChange('listening');
             
             const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
             mediaRecorderRef.current = mediaRecorder;
             chunksRef.current = [];
             mediaRecorder.ondataavailable = (e) => {
               if (e.data.size > 0) chunksRef.current.push(e.data);
             };
             mediaRecorder.start();
          }
          
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          
          silenceTimerRef.current = setTimeout(() => {
             // 4 seconds of silence
             if (isSpeakingRef.current && mediaRecorderRef.current) {
               console.log("[Auto-Listen] 4 seconds of silence detected, stopping and capturing.");
               isSpeakingRef.current = false;
               onListenStateChange('idle');
               
               mediaRecorderRef.current.onstop = () => {
                 const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                 // Clean up the loop completely so it doesn't double-trigger when HomeTab restarts it
                 if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
                 streamRef.current?.getTracks().forEach(track => track.stop());
                 if (audioContextRef.current?.state !== 'closed') {
                   audioContextRef.current?.close().catch(() => {});
                 }
                 onSpeechCaptured(audioBlob);
               };
               mediaRecorderRef.current.stop();
             }
          }, 4000);
        }
        
        rafIdRef.current = requestAnimationFrame(checkAudioLevel);
      };
      
      checkAudioLevel();

      // Add a hidden document listener to resume context on any click if it's suspended
      const resumeContext = () => {
        if (audioContextRef.current?.state === 'suspended') {
           audioContextRef.current.resume().then(() => {
              console.log("[Auto-Listen] AudioContext resumed by user interaction.");
           });
        }
      };
      document.addEventListener('click', resumeContext, { once: true });
      document.addEventListener('touchstart', resumeContext, { once: true });
      
    } catch (err) {
      console.warn('Auto-listen access denied or pending user gesture.');
    }
  }, []);

  const stopAutoListen = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    streamRef.current?.getTracks().forEach(track => track.stop());
    
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }
    
    isSpeakingRef.current = false;
  }, []);

  return { isRecording, startRecording, stopRecording, startAutoListen, stopAutoListen };
}
