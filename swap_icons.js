const fs = require('fs');

let code = fs.readFileSync('src/components/layout/BottomNav.tsx', 'utf8');

// 1. Demand Radar SVG path (the old users icon)
const demandRadarOldPath = `<path
                d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor"
              ></path>`;

// 2. Ledger SVG path (the old chat bubble icon)
const ledgerOldPath = `<path
                d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor"
              ></path>`;

// 3. New Demand Radar SVG based on the user's uploaded image (Bars + Upward arrow, fill style matching the visual exactly)
const newDemandRadarContent = `<path d="M5 22H2V14H5V22ZM11 22H8V11H11V22ZM17 22H14V9H17V22ZM23 22H20V6H23V22ZM14.5 4.5V1L21.5 5.5L18 9C15.5 8.2 13 8.3 11 9.5C8 11.2 5 12.5 2.5 12.5C5.5 11.5 9 10 12 8.5C13 8 13.8 7.8 14.5 4.5Z" fill="currentColor"></path>`;

// Steps:
// A. Replace Ledger's path with Demand Radar's old path
code = code.replace(ledgerOldPath, demandRadarOldPath);

// B. Replace Demand Radar's path with the new custom trending bar chart path
// Wait, since we replaced Ledger with demandRadarOldPath, now there are TWO instances of demandRadarOldPath in the file!
// We only want to replace the SECOND one (which is inside the Demand Radar Tab section).
const splitCode = code.split(demandRadarOldPath);
if (splitCode.length === 3) {
  // It found exactly two instances.
  code = splitCode[0] + demandRadarOldPath + splitCode[1] + newDemandRadarContent + splitCode[2];
  
  // Wait, I need to remove the `strokeLinejoin="round"` attributes from the parent <svg> if I am using fill?
  // Actually, the new path itself just ignores the strokes and uses `fill="currentColor"`. The parent SVG stroke="none" or strokeWidth="0" is fine, or the path just overrides with `fill="currentColor"`.
}

fs.writeFileSync('src/components/layout/BottomNav.tsx', code, 'utf8');
console.log('Icons swapped and updated!');
