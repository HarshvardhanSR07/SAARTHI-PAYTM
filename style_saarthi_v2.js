const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let code = fs.readFileSync(filePath, 'utf8');
  let originalCode = code;
  for (const r of replacements) {
    // Escape regex strings except if we pass regex manually. But here we just use split/join for exact match
    if (typeof r.target === 'string') {
      code = code.split(r.target).join(r.replacement);
    } else {
      code = code.replace(r.target, r.replacement);
    }
  }
  if (code !== originalCode) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. MobileHeader.tsx
replaceInFile('src/components/layout/MobileHeader.tsx', [
  {
    target: '              SAARTHI\r\n            </span>',
    replacement: '              <span className="text-[#FFB800]">SAARTHI</span>\r\n            </span>'
  },
  {
    target: '              SAARTHI\n            </span>',
    replacement: '              <span className="text-[#FFB800]">SAARTHI</span>\n            </span>'
  }
]);

// 2. PulseOrb.tsx
replaceInFile('src/components/voice/PulseOrb.tsx', [
  {
    target: '<span key={i} className="loader-letter">{letter}</span>',
    replacement: '<span key={i} className={`loader-letter ${state === \'idle\' ? \'text-[#FFB800]\' : \'\'}`}>{letter}</span>'
  }
]);

// 3. HomeTab.tsx
replaceInFile('src/components/tabs/HomeTab.tsx', [
  {
    target: `'SAARTHI Insight'`,
    replacement: `<><span className="text-[#FFB800]">SAARTHI</span> Insight</>`
  },
  {
    target: `'Namaste! Main SAARTHI hoon 👋'`,
    replacement: `<>Namaste! Main <span className="text-[#FFB800]">SAARTHI</span> hoon 👋</>`
  },
  {
    target: `'Say "Hey Saarthi" or Tap'`,
    replacement: `<>Say "Hey <span className="text-[#FFB800]">Saarthi</span>" or Tap</>`
  },
  {
    target: `'नमस्ते! मैं सारथी हूँ 👋'`,
    replacement: `<>नमस्ते! मैं <span className="text-[#FFB800]">सारथी</span> हूँ 👋</>`
  },
  {
    target: `'साझा इनसाइट'`, // Hindi for SAARTHI insight was actually "साझा इनसाइट" (shared insight)? Let's check original.
    replacement: `<><span className="text-[#FFB800]">सारथी</span> इनसाइट</>`
  },
  {
    target: `'सारथी इनसाइट'`, // just in case
    replacement: `<><span className="text-[#FFB800]">सारथी</span> इनसाइट</>`
  }
]);

// 4. VoiceHubTab.tsx
replaceInFile('src/components/tabs/VoiceHubTab.tsx', [
  {
    target: 'SAARTHI Voice Hub',
    replacement: '<span className="text-[#FFB800]">SAARTHI</span> Voice Hub'
  }
]);

// 5. SettingsTab.tsx
replaceInFile('src/components/tabs/SettingsTab.tsx', [
  {
    target: `'Controls the language spoken by the Saarthi Voice Assistant.'`,
    replacement: `<>Controls the language spoken by the <span className="text-[#FFB800]">Saarthi</span> Voice Assistant.</>`
  },
  {
    target: `Paytm Saarthi Voice Assistant`,
    replacement: `Paytm <span className="text-[#FFB800]">Saarthi</span> Voice Assistant`
  },
  {
    target: `'यह सेटिंग सारथी वॉइस असिस्टेंट के बोलने की भाषा बदलती है।'`,
    replacement: `<>यह सेटिंग <span className="text-[#FFB800]">सारथी</span> वॉइस असिस्टेंट के बोलने की भाषा बदलती है।</>`
  }
]);

console.log('Replacements completed.');
