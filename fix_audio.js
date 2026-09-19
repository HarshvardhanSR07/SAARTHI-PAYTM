const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

const target = `           }, 300);
         }
         setOrbState('idle');`;

const replacement = `           }, 300);
         }

         if (data.audioUrl) {
           setOrbState('speaking');
           const audio = new Audio(data.audioUrl);
           audioPlayerRef.current = audio;
           audio.onended = () => { setOrbState('idle'); setIsProcessing(false); };
           audio.play().catch(e => {
             console.warn('Audio play failed:', e);
             setOrbState('idle');
             setIsProcessing(false);
           });
         } else {
           setOrbState('idle');
         }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Restored audioUrl block cleanly!');
