const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

// Suppress the AbortError from hitting console.error (which triggers Next.js Dev Overlay)
code = code.replace(
  /audioPlayerRef\.current\.play\(\)\.catch\(e => console\.error\("Audio playback failed:", e\)\);/g,
  `audioPlayerRef.current.play().catch(e => { if (e.name !== 'AbortError') console.error("Audio playback failed:", e); });`
);

// Also add a key to the audio element just to be safe if React is diffing weirdly
// Wait, replacing the audio tag exactly:
code = code.replace(
  /<audio ref=\{audioPlayerRef\} onEnded=\{\(\) => setOrbState\('idle'\)\} className="hidden" \/>/g,
  `<audio key="saarthi-tts-player" ref={audioPlayerRef} onEnded={() => setOrbState('idle')} className="hidden" />`
);

// Make sure handleQuerySubmit also cleans up autoListen so text input doesn't clash with background voice
const targetQuerySubmit = `const handleQuerySubmit = async (questionText: string) => {`;
const replacementQuerySubmit = `const handleQuerySubmit = async (questionText: string) => {
    // If user types, we should stop background listening to avoid clashes
    try { (window as any).stopAutoListen?.(); } catch(e) {}
`;
code = code.replace(targetQuerySubmit, replacementQuerySubmit);


fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed AbortError overlay and added audio key.');
