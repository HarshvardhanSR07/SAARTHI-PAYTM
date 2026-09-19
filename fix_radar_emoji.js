const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

code = code.replace(
  /'ðŸ“ˆ Demand Radar Alert'/g,
  `'📈 Demand Radar Alert'`
);

code = code.replace(
  /'ðŸ“ˆ à¤¡à¤¿à¤®à¤¾à¤‚à¤¡ à¤°à¤¡à¤¾à¤° à¤…à¤²à¤°à¥ à¤Ÿ'/g,
  `'📈 डिमांड रडार अलर्ट'`
);

// If there's a loose unquoted one in the file
code = code.replace(/ðŸ“ˆ Demand Radar Alert/g, '📈 Demand Radar Alert');

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed encoding for Demand Radar Alert emoji.');
