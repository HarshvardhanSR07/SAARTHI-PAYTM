
const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

code = code.replace(/\{appLanguage === 'hi-IN' \? '[^]+?' : 'Namaste! Main SAARTHI hoon [^]*?'\}/g, '{appLanguage === \'hi-IN\' ? \'??????! ??? ????? ??? ??\' : \'Namaste! Main SAARTHI hoon ??\'}');
code = code.replace(/₹/g, '?');
code = code.replace(/[^\\x00-\\x7F]*18,450/g, '?18,450');

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed simple ones!');

