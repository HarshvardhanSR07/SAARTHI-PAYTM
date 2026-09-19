const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

// Normalize line endings for replacement
code = code.replace(/\r\n/g, '\n');

// 1. Update processBackendChat to play TTS
const processBackendTarget = `         if (data.action) {
           console.log("[Auto-Listen] Backend returned action:", data.action);
           onNavigateToTab?.('ledger');
           setTimeout(() => {
             window.dispatchEvent(new CustomEvent('ADD_LEDGER_ENTRY', { detail: data.action }));
           }, 300);
         }
         setOrbState('idle');
         setIsProcessing(false);`;

const processBackendReplacement = `         if (data.action) {
           console.log("[Auto-Listen] Backend returned action:", data.action);
           onNavigateToTab?.('ledger');
           setTimeout(() => {
             window.dispatchEvent(new CustomEvent('ADD_LEDGER_ENTRY', { detail: data.action }));
           }, 300);
         }
         
         setIsProcessing(false);
         
         console.log("Audio URL available:", !!data.audioUrl);
         if (data.audioUrl && audioPlayerRef.current) {
           audioPlayerRef.current.src = data.audioUrl;
           audioPlayerRef.current.play().catch(e => console.error("Audio playback failed:", e));
           setOrbState('speaking');
         } else {
           setOrbState('idle');
         }`;

code = code.replace(processBackendTarget.replace(/\r\n/g, '\n'), processBackendReplacement);

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Re-applied TTS logic successfully!');
