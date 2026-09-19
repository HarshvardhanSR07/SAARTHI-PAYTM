const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

// The original file used specific Hindi text for Saarthi
code = code.replace(
  /'साझा इनसाइट'/g, 
  `<><span className="text-[#FFB800]">सारथी</span> इनसाइट</>`
);
code = code.replace(
  /'सारथी इनसाइट'/g, 
  `<><span className="text-[#FFB800]">सारथी</span> इनसाइट</>`
);

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Hindi strings updated.');
