const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

// Add pendingUserQuery state
if (!code.includes('pendingUserQuery')) {
  code = code.replace(
    `const [textInput, setTextInput] = useState('');`,
    `const [textInput, setTextInput] = useState('');\n  const [pendingUserQuery, setPendingUserQuery] = useState('Voice Query');`
  );

  code = code.replace(
    `const handleQuerySubmit = async (questionText: string) => {`,
    `const handleQuerySubmit = async (questionText: string) => {\n    setPendingUserQuery(questionText);`
  );
  
  code = code.replace(
    `const handleSelectSuggestedQuestion = (question: string) => {`,
    `const handleSelectSuggestedQuestion = (question: string) => {\n    setPendingUserQuery(question);`
  );

  code = code.replace(
    `const audioBlob = await stopRecording();`,
    `const audioBlob = await stopRecording();\n      setPendingUserQuery('Voice Query...');`
  );
  
  code = code.replace(
    `const resData = await processBackendChat(formData, true);`,
    `setPendingUserQuery('Voice Query...');\n      const resData = await processBackendChat(formData, true);`
  );
}

// Now let's carefully replace the ENTIRE active block
const startIndex = code.indexOf(`{activeState === 'active' && (`);
const activeEndMarker = `{/* Active Chat Response container finishes above */}`;
const endIndex = code.indexOf(activeEndMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newActiveBlock = `{activeState === 'active' && (
        <div className="flex flex-col gap-5 w-full animate-in fade-in duration-300">
          
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,37,110,0.08)] border border-[#e0e3e6] text-center relative overflow-hidden">
            <span className="text-[12px] font-extrabold text-[#0043cf] uppercase tracking-widest mb-1">
              {isProcessing ? 'Thinking...' : 'Query Answered'}
            </span>
            <p className="text-[15px] font-semibold text-[#191c1e] mb-2 px-2">
              "{isProcessing ? pendingUserQuery : (queryHistory.length > 0 ? queryHistory[queryHistory.length - 1].userQuery : pendingUserQuery)}"
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setActiveState('idle')}
                className="px-3 py-1 bg-transparent text-[#6d7980] hover:text-[#191c1e] text-[12px] font-medium transition-all border border-[#e0e3e6] rounded-full"
              >
                Go Back
              </button>
            </div>
          </div>

          {/* Conversational Bubbles Area */}
          <div className="flex flex-col gap-5">
            {queryHistory.map((query) => (
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
                      <div>
                        <p className="text-[14px] text-[#191c1e] leading-relaxed font-normal">
                          {query.aiResponse}
                        </p>

                        {query.highlightMetric && (
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-[#c0e8ff]/50 border border-[#71d2ff]/40 px-2.5 py-1 rounded-lg text-[12px] font-bold text-[#0043cf]">
                            <Sparkles className="w-3.5 h-3.5 text-[#0043cf]" />
                            Key Metric: {query.highlightMetric}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pending Bubble (Only when processing) */}
            {isProcessing && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-end">
                  <div className="bg-[#0043cf] text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-[14px] font-medium leading-snug opacity-80">
                    {pendingUserQuery}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white text-[#191c1e] p-4 rounded-2xl rounded-tl-sm max-w-[92%] shadow-md border border-[#e0e3e6] flex flex-col gap-3.5 opacity-80">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00b9f1] flex items-center justify-center shrink-0 text-[#0043cf] shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">
                          smart_toy
                        </span>
                      </div>
                      <div>
                        <p className="text-[14px] text-[#191c1e] leading-relaxed font-normal animate-pulse">
                          ...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
        </div>
      )}

      `;

  code = code.substring(0, startIndex) + newActiveBlock + code.substring(endIndex);
  fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
  console.log("Successfully replaced active block.");
} else {
  console.log("Could not find start/end indexes.");
}
