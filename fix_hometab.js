const fs = require('fs');

let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

// 1. Fix setCurrentQuery
code = code.replace(
  /setCurrentQuery\(\{[\s\S]*?\} as any\);/g,
  `const newQuery = {
           id: \`query-\${Date.now()}\`,
           userQuery: data.userText || "Voice Query",
           aiResponse: data.aiText || "...",
           timestamp: 'Just now',
           category: 'general',
         } as any;
         setQueryHistory(prev => [...prev, newQuery]);`
);

// 2. We need a helper variable to represent the latest query for the UI pieces that still expect currentQuery.
// Inside HomeTab component, we can add:
// const currentQuery = queryHistory.length > 0 ? queryHistory[queryHistory.length - 1] : INITIAL_QUERIES[0];
// Let's add it right after `const [queryHistory, setQueryHistory]`
code = code.replace(
  `const [queryHistory, setQueryHistory] = useState<VoiceQueryItem[]>([]);`,
  `const [queryHistory, setQueryHistory] = useState<VoiceQueryItem[]>([]);
  const currentQuery = queryHistory.length > 0 ? queryHistory[queryHistory.length - 1] : INITIAL_QUERIES[0];`
);

// 3. Since I already did replacementBubbles which renders queryHistory.map, but wait - there were two instances of bubbles?!
// Let's check if the bubbles were replaced successfully in my previous run.
// The build error says line 520 has `currentQuery.userQuery`. 
// My previous script targeted the exact string of the bubbles, but I might have missed an `isProcessing` state or it was slightly different!
// Let's just find and replace the currentQuery.userQuery and others inside the active state.

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed currentQuery issues!');
