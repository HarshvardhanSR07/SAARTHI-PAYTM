const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAudioRecorder.ts', 'utf8');

const target = `  const startAutoListen = useCallback(async (onSpeechCaptured: (blob: Blob) => void, onListenStateChange: (state: 'idle' | 'listening') => void) => {
    try {`;

const replacement = `  const startAutoListen = useCallback(async (onSpeechCaptured: (blob: Blob) => void, onListenStateChange: (state: 'idle' | 'listening') => void) => {
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

    try {`;

code = code.replace(target, replacement);
fs.writeFileSync('src/hooks/useAudioRecorder.ts', code, 'utf8');
console.log('Fixed orphaned loops in useAudioRecorder.');
