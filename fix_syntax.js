const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

code = code.replace(
  `{appLanguage === '📈 डिमांड रडार अलर्ट' : '📈 Demand Radar Alert'}`,
  `{appLanguage === 'hi-IN' ? '📈 डिमांड रडार अलर्ट' : '📈 Demand Radar Alert'}`
);

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed syntax error on line 334');
