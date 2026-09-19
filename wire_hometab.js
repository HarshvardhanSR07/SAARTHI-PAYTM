const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

const targetStr = `  const [isProcessing, setIsProcessing] = useState(false);

  // Setup interval to toggle the top banner`;

const replacementStr = `  const [isProcessing, setIsProcessing] = useState(false);
  const [liveStats, setLiveStats] = useState<DailyStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch live stats from Supabase
  useEffect(() => {
    setIsLoadingStats(true);
    fetch(\`/api/stats?period=\${selectedPeriod}\`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setLiveStats(data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingStats(false));
  }, [selectedPeriod]);

  // Setup interval to toggle the top banner`;

code = code.replace(targetStr, replacementStr);

const statsTarget = `  const stats = STATS_BY_PERIOD[selectedPeriod];`;
const statsReplacement = `  const stats = liveStats || STATS_BY_PERIOD[selectedPeriod];`;

code = code.replace(statsTarget, statsReplacement);

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('HomeTab wired to Supabase API!');
