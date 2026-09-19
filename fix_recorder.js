const fs = require('fs');

let code = fs.readFileSync('src/hooks/useAudioRecorder.ts', 'utf8');

// Replace the silence timeout logic in startAutoListen
const target = `               mediaRecorderRef.current.onstop = () => {
                 const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                 onSpeechCaptured(audioBlob);
               };
               mediaRecorderRef.current.stop();`;

const replacement = `               mediaRecorderRef.current.onstop = () => {
                 const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                 // Clean up the loop completely so it doesn't double-trigger when HomeTab restarts it
                 if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
                 streamRef.current?.getTracks().forEach(track => track.stop());
                 if (audioContextRef.current?.state !== 'closed') {
                   audioContextRef.current?.close().catch(() => {});
                 }
                 onSpeechCaptured(audioBlob);
               };
               mediaRecorderRef.current.stop();`;

code = code.replace(target, replacement);

fs.writeFileSync('src/hooks/useAudioRecorder.ts', code, 'utf8');
console.log('useAudioRecorder fixed');
