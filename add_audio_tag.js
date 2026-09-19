const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

// The activeBlock replacement from earlier accidentally wiped out the <audio> tag 
// because I ran the rebuild_hometab.js AFTER I ran enable_tts.js, and rebuild_hometab.js used the original code state or overwrote the end!
// Wait! Let's check rebuild_hometab.js. It replaced from `{activeState === 'active' && (` to `{/* Active Chat Response container finishes above */}`.
// It shouldn't have touched the very end of the file.
// But maybe enable_tts.js failed silently on the second replace due to line ending differences!

if (!code.includes('<audio ref={audioPlayerRef}')) {
  // Replace the closing tags
  code = code.replace(
    /\{\/\* Active Chat Response container finishes above \*\/\}\s*<\/div>\s*\);\s*\};\s*$/,
    `{/* Active Chat Response container finishes above */}
      {/* Hidden audio element for TTS playback */}
      <audio ref={audioPlayerRef} onEnded={() => setOrbState('idle')} className="hidden" />
    </div>
  );
};`
  );
  
  fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
  console.log('Added audio tag successfully!');
} else {
  console.log('Audio tag already exists.');
}
