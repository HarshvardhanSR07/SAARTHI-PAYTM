const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');
code = code.replace(/\r\n/g, '\n');

// 1. Add unlock to handleOrbClick
const orbClickTarget = `  const handleOrbClick = async () => {
    if (orbState === 'idle') {`;

const orbClickReplacement = `  const handleOrbClick = async () => {
    // Unlock audio element on user gesture
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = 0;
      audioPlayerRef.current.play().catch(() => {});
      audioPlayerRef.current.volume = 1;
    }
    
    if (orbState === 'idle') {`;

code = code.replace(orbClickTarget, orbClickReplacement);

// 2. Add unlock to handleQuerySubmit
const querySubmitTarget = `  const handleQuerySubmit = async (questionText: string) => {
    setPendingUserQuery(questionText);`;

const querySubmitReplacement = `  const handleQuerySubmit = async (questionText: string) => {
    // Unlock audio element on user gesture
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = 0;
      audioPlayerRef.current.play().catch(() => {});
      audioPlayerRef.current.volume = 1;
    }
    
    setPendingUserQuery(questionText);`;

code = code.replace(querySubmitTarget, querySubmitReplacement);

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Audio unlocked!');
