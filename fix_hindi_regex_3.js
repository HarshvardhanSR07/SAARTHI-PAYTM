const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

code = code.replace(
  /appLanguage === 'hi-IN'\s*\n\s*\? '.*'\s*\n\s*: 'Demand Radar Alert: Fasting essentials demand is expected to surge by 55% for Navratri. Please keep stock ready.';/g,
  `appLanguage === 'hi-IN'\n        ? 'डिमांड रडार अलर्ट: नवरात्रि के लिए व्रत के सामान की मांग 55% बढ़ने की उम्मीद है। कृपया साबूदाना और कुट्टू का आटा तैयार रखें।'\n        : 'Demand Radar Alert: Fasting essentials demand is expected to surge by 55% for Navratri. Please keep stock ready.';`
);

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed final Hindi string.');
