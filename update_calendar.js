const fs = require('fs');

let code = fs.readFileSync('src/components/calendar-11.tsx', 'utf8');

// 1. Change getEventForDate default return
const targetDefault = `    // Default 'Standard Trading Day'
    return {
      id: \`default-\${date.getTime()}\`,
      name: \`\${MONTH_NAMES[date.getMonth()]} \${date.getDate()}, \${date.getFullYear()} Trading Day\`,
      dateString: \`\${MONTH_NAMES[date.getMonth()]} \${date.getDate()}, \${date.getFullYear()}\`,
      dateKey: \`\${date.getFullYear()}-\${date.getMonth()}-\${date.getDate()}\`,
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      bannerTitle: 'Regular Trading Day',
      bannerSubtitle: 'Regular merchant trade. Next upcoming rush is Navratri Mahotsav (+55%).',
      badge: 'Standard Day',
      salesHike: { percentage: '0%', description: '', topItems: [] },
      stockHike: { multiplier: '1x', recommendedInventory: [], reorderDeadline: '' },
      priceHike: { wholesaleSurge: '0%', marginAlert: '', savingsTip: '' },
      aiNudgeText: '',
      spokenText: '',
    };`;

const replacementDefault = `    // Default 'No Festival'
    return {
      id: \`default-\${date.getTime()}\`,
      name: \`\${MONTH_NAMES[date.getMonth()]} \${date.getDate()}, \${date.getFullYear()}\`,
      dateString: \`\${MONTH_NAMES[date.getMonth()]} \${date.getDate()}, \${date.getFullYear()}\`,
      dateKey: \`\${date.getFullYear()}-\${date.getMonth()}-\${date.getDate()}\`,
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      bannerTitle: 'No Major Festival',
      bannerSubtitle: 'Regular merchant trade. Tap a red-boxed date for upcoming festive demand.',
      badge: 'No Festival',
      salesHike: { percentage: '0%', description: '', topItems: [] },
      stockHike: { multiplier: '1x', recommendedInventory: [], reorderDeadline: '' },
      priceHike: { wholesaleSurge: '0%', marginAlert: '', savingsTip: '' },
      aiNudgeText: '',
      spokenText: '',
    };`;

code = code.replace(targetDefault, replacementDefault);

// 2. Change CardFooter Header Logic
const targetHeader = `              <p className="text-[11px] text-[#6d7980]">
                {activeEvent.badge.includes('Standard') ? (
                  <span>Regular Trading Day</span>
                ) : (
                  <span className="text-[#ba1a1a] font-bold">
                    dY" Festive Demand Alert: {activeEvent.name}
                  </span>
                )}
              </p>
            </div>

            <span
              className={\`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider \${
                activeEvent.badge.includes('Standard')
                  ? 'bg-[#e0e3e6] text-[#3d484f]'
                  : 'bg-[#ffdad6] text-[#93000a]'
              }\`}
            >
              <Flame className="size-3 fill-current" />
              {activeEvent.badge}
            </span>`;

const replacementHeader = `              <p className="text-[11px] text-[#6d7980]">
                {activeEvent.badge.includes('No Festival') ? (
                  <span>No special demand event</span>
                ) : (
                  <span className="text-[#ba1a1a] font-bold">
                    🔥 Festive Demand Alert: {activeEvent.name}
                  </span>
                )}
              </p>
            </div>

            <span
              className={\`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider \${
                activeEvent.badge.includes('No Festival')
                  ? 'bg-[#e0e3e6] text-[#3d484f]'
                  : 'bg-[#ffdad6] text-[#93000a]'
              }\`}
            >
              <Flame className="size-3 fill-current" />
              {activeEvent.badge}
            </span>`;

code = code.replace(targetHeader, replacementHeader);

// 3. Conditionally render the big card
const targetCard = `          {/* Agenda Event Cards */}
          <div className="flex w-full flex-col gap-2.5">
            {/* 1. Main Selected Festival Agenda Item */}
            <div className="relative rounded-2xl p-3.5 pl-6 text-sm bg-white border border-[#ffdad6] shadow-xs after:absolute after:inset-y-2.5 after:left-2.5 after:w-1.5 after:rounded-full after:bg-[#ba1a1a]">`;

const replacementCard = `          {/* Agenda Event Cards */}
          <div className="flex w-full flex-col gap-2.5">
            {/* 1. Main Selected Festival Agenda Item (Hide if no festival) */}
            {!activeEvent.badge.includes('No Festival') && (
            <div className="relative rounded-2xl p-3.5 pl-6 text-sm bg-white border border-[#ffdad6] shadow-xs after:absolute after:inset-y-2.5 after:left-2.5 after:w-1.5 after:rounded-full after:bg-[#ba1a1a]">`;

code = code.replace(targetCard, replacementCard);

// 4. Close the conditionally rendered card
const targetListenBtnEnd = `                )}
              </button>
            </div>

            {/* Quick list of other festival surges in this season */}`;

const replacementListenBtnEnd = `                )}
              </button>
            </div>
            )}

            {/* Quick list of other festival surges in this season */}`;

code = code.replace(targetListenBtnEnd, replacementListenBtnEnd);

fs.writeFileSync('src/components/calendar-11.tsx', code, 'utf8');
console.log('calendar-11 updated!');
