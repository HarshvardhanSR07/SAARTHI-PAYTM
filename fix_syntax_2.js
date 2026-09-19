const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

const target = `{appLanguage === <>नमस्ते! मैं <span className="text-[#FFB800]">सारथी</span> हूँ 👋</> : <>Namaste! Main <span className="text-[#FFB800]">SAARTHI</span> hoon 👋</>}`;
const replacement = `{appLanguage === 'hi-IN' ? <>नमस्ते! मैं <span className="text-[#FFB800]">सारथी</span> हूँ 👋</> : <>Namaste! Main <span className="text-[#FFB800]">SAARTHI</span> hoon 👋</>}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed line 365');
