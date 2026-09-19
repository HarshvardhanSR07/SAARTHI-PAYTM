const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

const patterns = [
  [/appLanguage === 'hi-IN' \? '.*' : 'Demand Radar Alert: Fasting essentials demand is expected to surge by 55% for Navratri. Please keep stock ready.'/g, `appLanguage === 'hi-IN' ? 'डिमांड रडार अलर्ट: नवरात्रि के लिए व्रत के सामान की मांग 55% बढ़ने की उम्मीद है। कृपया साबूदाना और कुट्टू का आटा तैयार रखें।' : 'Demand Radar Alert: Fasting essentials demand is expected to surge by 55% for Navratri. Please keep stock ready.'`],
  [/appLanguage === 'hi-IN' \? '.*' : <><span className="text-\[#FFB800\]">SAARTHI<\/span> Insight<\/>/g, `appLanguage === 'hi-IN' ? 'सारथी इनसाइट' : <><span className="text-[#FFB800]">SAARTHI</span> Insight</>`],
  [/appLanguage === 'hi-IN' \? '.*' : 'Demand Nudge'/g, `appLanguage === 'hi-IN' ? 'डिमांड अलर्ट' : 'Demand Nudge'`],
  [/appLanguage === 'hi-IN'\s*\n\s*\? '.*'\s*\n\s*: 'Fasting essentials demand expected to surge by 55% for Navratri. Keep Sabudana and Kuttu Atta ready.'/g, `appLanguage === 'hi-IN'\n                ? 'नवरात्रि के लिए व्रत के सामान की मांग 55% बढ़ने की उम्मीद है। कृपया साबूदाना और कुट्टू का आटा तैयार रखें।'\n                : 'Fasting essentials demand expected to surge by 55% for Navratri. Keep Sabudana and Kuttu Atta ready.'`],
  [/appLanguage === 'hi-IN' \? '.*' : 'Dismiss'/g, `appLanguage === 'hi-IN' ? 'हटाएं' : 'Dismiss'`],
  [/appLanguage === 'hi-IN' \? '.*' : 'View Stock'/g, `appLanguage === 'hi-IN' ? 'स्टॉक देखें' : 'View Stock'`],
  [/appLanguage === 'hi-IN' \? `.*` : `Ask me anything about your \$\{selectedPeriod\} business.`/g, `appLanguage === 'hi-IN' ? \`अपने \${selectedPeriod === 'daily' ? 'दैनिक' : selectedPeriod === 'weekly' ? 'साप्ताहिक' : 'मासिक'} व्यवसाय के बारे में मुझसे कुछ भी पूछें।\` : \`Ask me anything about your \${selectedPeriod} business.\``],
  [/appLanguage === 'hi-IN' \? '.*' : <>Say "Hey <span className="text-\[#FFB800\]">Saarthi<\/span>" or Tap<\/>/g, `appLanguage === 'hi-IN' ? 'बोलने के लिए टैप करें' : <>Say "Hey <span className="text-[#FFB800]">Saarthi</span>" or Tap</>`],
  [/appLanguage === 'hi-IN' \? '.*' : 'Listening...'/g, `appLanguage === 'hi-IN' ? 'सुन रहा हूँ...' : 'Listening...'`],
  [/appLanguage === 'hi-IN' \? '.*' : 'Thinking...'/g, `appLanguage === 'hi-IN' ? 'सोच रहा हूँ...' : 'Thinking...'`],
  [/appLanguage === 'hi-IN' \? '.*' : 'Speaking... \(Tap to interrupt\)'/g, `appLanguage === 'hi-IN' ? 'बोल रहा हूँ... (रोकने के लिए टैप करें)' : 'Speaking... (Tap to interrupt)'`],
  [/appLanguage === 'hi-IN' \? '.*' : 'Or type your question here...'/g, `appLanguage === 'hi-IN' ? 'या अपना प्रश्न यहाँ लिखें...' : 'Or type your question here...'`],
  [/appLanguage === 'hi-IN' \? \(period === 'daily' \? 'दैनिक' : period === 'weekly' \? '.*' : 'मासिक'\) : period/g, `appLanguage === 'hi-IN' ? (period === 'daily' ? 'दैनिक' : period === 'weekly' ? 'साप्ताहिक' : 'मासिक') : period`],
  [/appLanguage === 'hi-IN' \? '.*' : 'Suggested Questions'/g, `appLanguage === 'hi-IN' ? 'सुझाए गए प्रश्न' : 'Suggested Questions'`],
  [/appLanguage === 'hi-IN' \? '.*' : 'Tap to ask'/g, `appLanguage === 'hi-IN' ? 'पूछने के लिए टैप करें' : 'Tap to ask'`]
];

for (const [regex, replacement] of patterns) {
  code = code.replace(regex, replacement);
}

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed Hindi encoding via Regex.');
