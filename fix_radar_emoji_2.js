const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

const lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("ðŸ“ˆ")) {
    lines[i] = lines[i].replace(/'.*' : '📈 Demand Radar Alert'/, `'📈 डिमांड रडार अलर्ट' : '📈 Demand Radar Alert'`);
  }
  if (lines[i].includes("ðŸ‘‹")) {
    // This is the Namaste line
    lines[i] = lines[i].replace(/'.*ðŸ‘‹'/, `<>नमस्ते! मैं <span className="text-[#FFB800]">सारथी</span> हूँ 👋</>`);
  }
}

fs.writeFileSync('src/components/tabs/HomeTab.tsx', lines.join('\n'), 'utf8');
console.log('Fixed remaining encoding errors.');
