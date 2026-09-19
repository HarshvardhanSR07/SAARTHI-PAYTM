const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let code = fs.readFileSync(filePath, 'utf8');
  let originalCode = code;
  for (const r of replacements) {
    code = code.replace(r.target, r.replacement);
  }
  if (code !== originalCode) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. MobileHeader.tsx
replaceInFile('src/components/layout/MobileHeader.tsx', [
  {
    target: '              SAARTHI\n            </span>',
    replacement: '              <span className="text-[#FFB800]">SAARTHI</span>\n            </span>'
  }
]);

// 2. PulseOrb.tsx
replaceInFile('src/components/voice/PulseOrb.tsx', [
  {
    target: 'idle: "SAARTHI",',
    replacement: 'idle: <span className="text-[#FFB800]">SAARTHI</span> as any,' // ReactNode workaround if typing complains
  }
]);

// Let's check PulseOrb typing first... PulseOrb expects string or ReactNode?
// The stateText is used as: <span ...>{stateText[state]}</span>
// We can just typecast it as any to bypass TS error in the simple object.

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
  }
]);

// 4. VoiceHubTab.tsx
replaceInFile('src/components/tabs/VoiceHubTab.tsx', [
  {
    target: '          SAARTHI Voice Hub\n',
    replacement: '          <span className="text-[#FFB800]">SAARTHI</span> Voice Hub\n'
  }
]);

// 5. SettingsTab.tsx
replaceInFile('src/components/tabs/SettingsTab.tsx', [
  {
    target: `'Controls the language spoken by the Saarthi Voice Assistant.'`,
    replacement: `<>Controls the language spoken by the <span className="text-[#FFB800]">Saarthi</span> Voice Assistant.</>`
  },
  {
    target: '>Paytm Saarthi Voice Assistant<',
    replacement: '>Paytm <span className="text-[#FFB800]">Saarthi</span> Voice Assistant<'
  }
]);

console.log('Replacements completed.');
