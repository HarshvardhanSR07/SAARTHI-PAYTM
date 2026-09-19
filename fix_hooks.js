const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/HomeTab.tsx', 'utf8');

const targetStr = `interface HomeTabProps {
  onNavigateToTab?: (tab: TabType) => void;
}
  useEffect(() => {`;

const replacementStr = `interface HomeTabProps {
  onNavigateToTab?: (tab: TabType) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigateToTab }) => {
  const { appLanguage, speechLanguage } = useLanguage();
  const [showDemandPopup, setShowDemandPopup] = useState(false);
  const [activeState, setActiveState] = useState<'idle' | 'active'>('idle');
  const [activeBanner, setActiveBanner] = useState<'insight' | 'demand'>('insight');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('daily');
  const [activeMetricTab, setActiveMetricTab] = useState<'totalSales' | 'upflow' | 'udhaar' | null>(null);
  const [currentQuery, setCurrentQuery] = useState<VoiceQueryItem>(INITIAL_QUERIES[0]);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Setup interval to toggle the top banner
  useEffect(() => {`;

code = code.replace(targetStr, replacementStr);

// Wrap the active tab content
const activeTabTarget = `{/* Active Tab Content */}
          <div className="bg-white p-4 rounded-2xl border border-[#0043cf]/20 shadow-sm animate-in fade-in zoom-in-95 duration-200 min-h-[90px] flex flex-col justify-center items-center">
            {activeMetricTab === 'totalSales'`;

const activeTabReplacement = `{/* Active Tab Content */}
          {activeMetricTab && (
            <div className="bg-white p-4 rounded-2xl border border-[#0043cf]/20 shadow-sm animate-in fade-in zoom-in-95 duration-200 min-h-[90px] flex flex-col justify-center items-center">
              {activeMetricTab === 'totalSales'`;

code = code.replace(activeTabTarget, activeTabReplacement);

// Close the wrapper
const closeTarget = `                  View {stats.pendingUdhaarCount} pending accounts <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Suggested Voice Queries`;

const closeReplacement = `                  View {stats.pendingUdhaarCount} pending accounts <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
            </div>
          )}

          {/* Suggested Voice Queries`;

code = code.replace(closeTarget, closeReplacement);

fs.writeFileSync('src/components/tabs/HomeTab.tsx', code, 'utf8');
console.log('Fixed state layout and conditional wrapper cleanly!');
