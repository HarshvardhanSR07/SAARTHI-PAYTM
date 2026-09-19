const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

// 1. Change State from currentQuery to queryHistory
code = code.replace(
  `const [currentQuery, setCurrentQuery] = useState<VoiceQueryItem>(INITIAL_QUERIES[0]);`,
  `const [queryHistory, setQueryHistory] = useState<VoiceQueryItem[]>([]);`
);

// 2. Add to History instead of setting Current Query
const targetSetCurrent = `         setCurrentQuery({
           id: \`query-\${Date.now()}\`,
           userQuery: data.userText || "Voice Query",
           aiResponse: data.aiText || "...",
           timestamp: 'Just now',
           category: 'general',
         } as any);`;

const replacementSetCurrent = `         const newQuery = {
           id: \`query-\${Date.now()}\`,
           userQuery: data.userText || "Voice Query",
           aiResponse: data.aiText || "...",
           timestamp: 'Just now',
           category: 'general',
         } as any;
         setQueryHistory(prev => [...prev, newQuery]);`;

code = code.replace(targetSetCurrent, replacementSetCurrent);

// 3. Update the Conversational Bubbles Area in 'answered' state
const targetBubbles = `          {/* Conversational Bubbles Area */}
          <div className="flex flex-col gap-3">
            {/* User Message Bubble */}
            <div className="flex justify-end">
              <div className="bg-[#0043cf] text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-[14px] font-medium leading-snug">
                {currentQuery.userQuery}
              </div>
            </div>

            {/* SAARTHI AI Response Bubble */}
            <div className="flex justify-start">
              <div className="bg-white text-[#191c1e] p-4 rounded-2xl rounded-tl-sm max-w-[92%] shadow-md border border-[#e0e3e6] flex flex-col gap-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00b9f1] flex items-center justify-center shrink-0 text-[#0043cf] shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">
                      smart_toy
                    </span>
                  </div>
                  <div className="flex-1 mt-0.5 text-[13px] text-[#3d484f] font-medium leading-relaxed">
                    {currentQuery.aiResponse}
                  </div>
                </div>
                
                {/* Embedded Actions / Highlights (if any) */}
                <div className="bg-[#f0f7ff] rounded-xl p-3 border border-[#d6e8ff] flex items-center justify-between mt-1">
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-[#0043cf] font-bold uppercase tracking-wider">Related Insight</span>
                      <span className="text-[12px] text-[#191c1e] font-semibold">Demand expected to rise +15%</span>
                   </div>
                   <button className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-[#0043cf] shadow-sm active:scale-95 transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>
            </div>
          </div>`;

const replacementBubbles = `          {/* Conversational Bubbles Area */}
          <div className="flex flex-col gap-5">
            {queryHistory.map((query, index) => (
              <div key={query.id} className="flex flex-col gap-3">
                {/* User Message Bubble */}
                <div className="flex justify-end">
                  <div className="bg-[#0043cf] text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-[14px] font-medium leading-snug">
                    {query.userQuery}
                  </div>
                </div>

                {/* SAARTHI AI Response Bubble */}
                <div className="flex justify-start">
                  <div className="bg-white text-[#191c1e] p-4 rounded-2xl rounded-tl-sm max-w-[92%] shadow-md border border-[#e0e3e6] flex flex-col gap-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00b9f1] flex items-center justify-center shrink-0 text-[#0043cf] shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">
                          smart_toy
                        </span>
                      </div>
                      <div className="flex-1 mt-0.5 text-[13px] text-[#3d484f] font-medium leading-relaxed">
                        {query.aiResponse}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats Below Queries */}
          <div className="mt-6 pt-5 border-t border-[#e0e3e6]">
            <h4 className="text-[11px] font-bold text-[#6d7980] uppercase tracking-wider mb-3">Today's Summary</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white border border-[#e0e3e6] p-2.5 rounded-xl text-center shadow-sm">
                <span className="text-[9px] font-bold text-[#6d7980] block uppercase mb-1">Total Sales</span>
                <span className="text-[13px] font-extrabold text-[#191c1e]">₹{stats.totalSales.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-[#f0fbf5] border border-[#d2f3e2] p-2.5 rounded-xl text-center shadow-sm">
                <span className="text-[9px] font-bold text-[#00875a] block uppercase mb-1">Upflow (UPI)</span>
                <span className="text-[13px] font-extrabold text-[#00875a]">₹{stats.upiAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-[#fff5f4] border border-[#ffd2cd] p-2.5 rounded-xl text-center shadow-sm">
                <span className="text-[9px] font-bold text-[#ba1a1a] block uppercase mb-1">Udhaar</span>
                <span className="text-[13px] font-extrabold text-[#ba1a1a]">₹{stats.pendingUdhaar.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
`;

code = code.replace(targetBubbles, replacementBubbles);

// Also remove currentQuery from the query header where it says "What are the losses of today?"
const targetQueryHeader = `              <span className="text-[13px] font-bold text-[#191c1e] text-center max-w-[200px] truncate">
                "{currentQuery.userQuery}"
              </span>`;
const replacementQueryHeader = `              <span className="text-[13px] font-bold text-[#191c1e] text-center max-w-[200px] truncate">
                {queryHistory.length > 0 ? \`"\${queryHistory[queryHistory.length - 1].userQuery}"\` : "Recent Queries"}
              </span>`;

code = code.replace(targetQueryHeader, replacementQueryHeader);

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Done modifying HomeTab!');
