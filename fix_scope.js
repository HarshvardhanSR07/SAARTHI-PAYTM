const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

code = code.replace(
  /try \{ \(window as any\)\.stopAutoListen\?\.\(\); \} catch\(e\) \{\}/g,
  `stopAutoListen();`
);

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed stopAutoListen scope.');
