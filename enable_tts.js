const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

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
         
         if (data.audioUrl && audioPlayerRef.current) {
           audioPlayerRef.current.src = data.audioUrl;
           audioPlayerRef.current.play().catch(console.error);
           setOrbState('speaking');
         } else {
           setOrbState('idle');
         }`;

code = code.replace(processBackendTarget, processBackendReplacement);

// 2. Add <audio> element to JSX
// We'll replace the very end of the file.
const endOfFileTarget = `    </div>
  );
};`;

const endOfFileReplacement = `      {/* Hidden audio element for TTS playback */}
      <audio ref={audioPlayerRef} onEnded={() => setOrbState('idle')} className="hidden" />
    </div>
  );
};`;

code = code.replace(endOfFileTarget, endOfFileReplacement);

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('TTS logic enabled and audio element added!');
