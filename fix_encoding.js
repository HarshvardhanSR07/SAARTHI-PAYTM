const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

// 1. Fix Wave Emoji
code = code.replace(/Namaste! Main SAARTHI hoon ðŸ‘‹/g, 'Namaste! Main SAARTHI hoon 👋');
code = code.replace(/Namaste! Main SAARTHI hoon [^\x00-\x7F]+/g, 'Namaste! Main SAARTHI hoon 👋');

// 2. Fix Rupee Symbol
code = code.replace(/â‚¹/g, '₹');
code = code.replace(/[^\x00-\x7F]+(?=\d)/g, '₹'); // Any corrupt char directly before a digit

// 3. Fix using general matchers for the corrupted hindi strings
code = code.replace(/appLanguage === 'hi-IN' \? '[^\x00-\x7F]+' : 'Say "Hey Saarthi" or Tap'/g, 'appLanguage === \'hi-IN\' ? \'बोलने के लिए टैप करें\' : \'Say "Hey Saarthi" or Tap\'');
code = code.replace(/appLanguage === 'hi-IN' \? '[^\x00-\x7F]+\.\.\.' : 'Listening\.\.\.'/g, 'appLanguage === \'hi-IN\' ? \'सुन रहा हूँ...\' : \'Listening...\'');
code = code.replace(/appLanguage === 'hi-IN' \? '[^\x00-\x7F]+\.\.\.' : 'Thinking\.\.\.'/g, 'appLanguage === \'hi-IN\' ? \'सोच रहा हूँ...\' : \'Thinking...\'');
code = code.replace(/appLanguage === 'hi-IN' \? '[^\x00-\x7F]+\.\.\. \([^)]+\)' : 'Speaking\.\.\. \(Tap to interrupt\)'/g, 'appLanguage === \'hi-IN\' ? \'बोल रहा हूँ... (रोकने के लिए टैप करें)\' : \'Speaking... (Tap to interrupt)\'');

// 4. Fix Demand Radar
code = code.replace(/appLanguage === 'hi-IN' \? '[^\x00-\x7F]+' : 'Demand Radar Alert'/g, 'appLanguage === \'hi-IN\' ? \'डिमांड रडार अलर्ट\' : \'Demand Radar Alert\'');
code = code.replace(/appLanguage === 'hi-IN' \? '[^\x00-\x7F]+' : 'Expect high demand for Vrat essentials due to Navratri\.'/g, 'appLanguage === \'hi-IN\' ? \'नवरात्रि के लिए व्रत सामान की मांग बढ़ने उम्मीद है।\' : \'Expect high demand for Vrat essentials due to Navratri.\'');
code = code.replace(/appLanguage === 'hi-IN' \? '[^\x00-\x7F]+' : 'Please stock up on Sabudana and Kuttu Atta\.'/g, 'appLanguage === \'hi-IN\' ? \'कृपया साबूदाना और कुट्टू का आटा स्टॉक करें।\' : \'Please stock up on Sabudana and Kuttu Atta.\'');

// 5. Fix Input Placeholders
code = code.replace(/appLanguage === 'hi-IN' \? '[^\x00-\x7F]+\.\.\.' : 'Or type your question here\.\.\.'/g, 'appLanguage === \'hi-IN\' ? \'या अपना प्रश्न यहाँ लिखें...\' : \'Or type your question here...\'');

// 6. Fix Suggested Questions Header
code = code.replace(/appLanguage === 'hi-IN' \? '[^\x00-\x7F]+' : 'Suggested Questions'/g, 'appLanguage === \'hi-IN\' ? \'सुझाए गए प्रश्न\' : \'Suggested Questions\'');
code = code.replace(/appLanguage === 'hi-IN' \? '[^\x00-\x7F]+' : 'Tap to ask'/g, 'appLanguage === \'hi-IN\' ? \'पूछने के लिए टैप करें\' : \'Tap to ask\'');

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed encodings!');
