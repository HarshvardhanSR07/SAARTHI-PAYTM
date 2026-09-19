'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PeriodType, VoiceQueryItem, TabType, DailyStats } from '@/lib/types';
import { STATS_BY_PERIOD, INITIAL_QUERIES, SUGGESTED_QUESTIONS } from '@/lib/mockData';
import { ArrowLeft, ArrowRight, Send, Sparkles, Bell, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PulseOrb, VoiceState } from '@/components/voice/PulseOrb';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

interface HomeTabProps {
  onNavigateToTab?: (tab: TabType) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigateToTab }) => {
  const { appLanguage, speechLanguage } = useLanguage();
  const [showDemandPopup, setShowDemandPopup] = useState(false);
  const [activeState, setActiveState] = useState<'idle' | 'active'>('idle');
  const [activeBanner, setActiveBanner] = useState<'insight' | 'demand'>('insight');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('daily');
  const [activeMetricTab, setActiveMetricTab] = useState<'totalSales' | 'upflow' | 'udhaar' | null>(null);
  const [queryHistory, setQueryHistory] = useState<VoiceQueryItem[]>([]);
  const currentQuery = queryHistory.length > 0 ? queryHistory[queryHistory.length - 1] : INITIAL_QUERIES[0];
  const [textInput, setTextInput] = useState('');
  const [pendingUserQuery, setPendingUserQuery] = useState('Voice Query');
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveStats, setLiveStats] = useState<DailyStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch live stats from Supabase
  useEffect(() => {
    setIsLoadingStats(true);
    fetch(`/api/stats?period=${selectedPeriod}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setLiveStats(data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingStats(false));
  }, [selectedPeriod]);

  // Setup interval to toggle the top banner
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev === 'insight' ? 'demand' : 'insight'));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Voice Orb States
  const [orbState, setOrbState] = useState<VoiceState>('idle');
  const { isRecording, startRecording, stopRecording, startAutoListen, stopAutoListen } = useAudioRecorder();
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);



  const stats = liveStats || STATS_BY_PERIOD[selectedPeriod];

  // Simulate an incoming demand radar alert that pops up and speaks aloud (only once per session)
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('demand_alert_shown')) {
      return; // Already shown in this session
    }

    const timer = setTimeout(() => {
      setShowDemandPopup(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('demand_alert_shown', 'true');
      }
      
      const alertText = appLanguage === 'hi-IN'
        ? 'डिमांड रडार अलर्ट: नवरात्रि के लिए व्रत के सामान की मांग 55% बढ़ने की उम्मीद है। कृपया साबूदाना और कुट्टू का आटा तैयार रखें।'
        : 'Demand Radar Alert: Fasting essentials demand is expected to surge by 55% for Navratri. Please keep stock ready.';
      
      const formData = new FormData();
      formData.append('text', alertText);
      // processBackendChat(formData); // Disabled auto-TTS to prevent NotAllowedError
    }, 4500);

    return () => clearTimeout(timer);
  }, [appLanguage]);

  const handleSelectSuggestedQuestion = (question: string) => {
    setPendingUserQuery(question);
    setActiveState('active');
    handleQuerySubmit(question);
  };

  const handleOrbClick = async () => {
    // Unlock audio element on user gesture
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = 0;
      audioPlayerRef.current.play().catch(() => {});
      audioPlayerRef.current.volume = 1;
    }
    
    if (orbState === 'idle') {
      // Stop any playing audio
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      }
      // Start listening
      setOrbState('listening');
      await startRecording();
    } else if (orbState === 'listening') {
      // Stop listening and process
      setOrbState('thinking');
      const audioBlob = await stopRecording();
      setPendingUserQuery('Voice Query...');
      
      if (audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice.webm');
        await processBackendChat(formData);
      } else {
        setOrbState('idle');
      }
    } else if (orbState === 'speaking') {
      // Interrupt speaking
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setOrbState('idle');
    }
  };

  const handleQuerySubmit = async (questionText: string) => {
    // If user types, we should stop background listening to avoid clashes
    stopAutoListen();

    // Unlock audio element on user gesture
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = 0;
      audioPlayerRef.current.play().catch(() => {});
      audioPlayerRef.current.volume = 1;
    }
    
    setPendingUserQuery(questionText);
    if (!questionText.trim()) return;
    setActiveState('active');
    setOrbState('thinking');
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('text', questionText);
    await processBackendChat(formData);
    setTextInput('');
  };

  const processBackendChat = async (formData: FormData, isBackground = false) => {
    try {
      if (!isBackground) {
        setActiveState('active');
        setIsProcessing(true);
      }
      formData.append('language', speechLanguage); // Append selected language
      
      // Enforce a minimum 'thinking' delay of 3 seconds to buff up the perceived processing time (UX Enhancement)
      const minThinkingTime = new Promise(resolve => setTimeout(resolve, 3000));
      const resPromise = fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      const [res] = await Promise.all([resPromise, minThinkingTime]);
      
      if (res.ok) {
         const data = await res.json();
         
         if (data.wakeWordMiss) {
           setOrbState('idle');
           setIsProcessing(false);
           // Only reset if it was in the background
           if (isBackground) setActiveState('idle');
           return data; // Return early, don't show active UI
         }

         if (isBackground) {
           setActiveState('active');
           setIsProcessing(true);
         }

         const newQuery = {
           id: `query-${Date.now()}`,
           userQuery: data.userText || "Voice Query",
           aiResponse: data.aiText || "...",
           timestamp: 'Just now',
           category: 'general',
         } as any;
         setQueryHistory(prev => [...prev, newQuery]);

         if (data.action) {
           console.log("[Auto-Listen] Backend returned action:", data.action);
           onNavigateToTab?.('ledger');
           setTimeout(() => {
             window.dispatchEvent(new CustomEvent('ADD_LEDGER_ENTRY', { detail: data.action }));
           }, 300);
         }
         
         setIsProcessing(false);
         
         console.log("Audio URL available:", !!data.audioUrl);
         if (data.audioUrl && audioPlayerRef.current) {
           audioPlayerRef.current.src = data.audioUrl;
           audioPlayerRef.current.play().catch(e => { if (e.name !== 'AbortError') console.error("Audio playback failed:", e); });
           setOrbState('speaking');
         } else {
           setOrbState('idle');
         }
      }
    } catch (err) {
      console.error("Backend chat error:", err);
      setOrbState('idle');
      setIsProcessing(false);
    }
  };

  // Continuous Auto-Listen Setup
  useEffect(() => {
    let mounted = true;
    let autoListenStarted = false;
    
    const handleSpeechCaptured = async (blob: Blob) => {
      setOrbState('thinking');
      const formData = new FormData();
      formData.append('audio', blob, 'voice.webm');
      formData.append('wakeWordCheck', 'true'); // Enforce wake word check
      
      setPendingUserQuery('Voice Query...');
      const resData = await processBackendChat(formData, true);
      
      // Resume auto-listen after processing finishes (or if it was a wake word miss)
      if (mounted) {
        startAutoListen(handleSpeechCaptured, (state) => setOrbState(state)).catch(console.error);
      }
    };

    const tryStartAutoListen = () => {
      if (autoListenStarted) return;
      startAutoListen(handleSpeechCaptured, (state) => setOrbState(state))
        .then(() => {
          autoListenStarted = true;
          // Clean up global listeners once started
          window.removeEventListener('click', tryStartAutoListen);
          window.removeEventListener('touchstart', tryStartAutoListen);
        })
        .catch(err => {
          console.log("Auto-listen failed to start, waiting for interaction.", err);
        });
    };

    // Try starting on mount
    // Start on first interaction to prevent NotAllowedError
    // Fallback: start on first interaction if blocked
    window.addEventListener('click', tryStartAutoListen);
    window.addEventListener('touchstart', tryStartAutoListen);

    return () => {
      mounted = false;
      window.removeEventListener('click', tryStartAutoListen);
      window.removeEventListener('touchstart', tryStartAutoListen);
      stopAutoListen();
    };
  }, [startAutoListen, stopAutoListen]);

  return (
    <div className="flex flex-col w-full pb-8 relative">
      
      {/* 0. Top-level Alternating INSIGHT / DEMAND Banner */}
      <div className="flex w-full items-center justify-center p-4 pt-1">
        <div className="relative w-full h-[70px]">
          {/* SAARTHI INSIGHT (Orange) */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeBanner === 'insight' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="border-[#f4952d]/40 bg-orange-50 shadow-sm relative isolate flex h-full w-full items-center justify-between overflow-hidden rounded-2xl border px-4 tracking-tight">
              <div aria-hidden="true" className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl">
                <div style={{ clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)' }} className="from-[#f4952d] to-[#f4952d]/60 aspect-[577/310] w-[36rem] bg-gradient-to-r opacity-30" />
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full pr-6 gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#f4952d] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    lightbulb
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-[#f4952d] uppercase tracking-wide">
                      {appLanguage === 'hi-IN' ? 'सारथी इनसाइट' : <><span className="text-[#012b72]">SAARTHI</span> Insight</>}
                    </span>
                    <span className="text-[#191c1e] text-[13px] font-medium leading-snug line-clamp-2">
                      {currentQuery.insight || 'Your evening sales are consistently higher. Consider keeping fast-selling items stocked after 6 PM.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DEMAND NUDGE (Green) */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeBanner === 'demand' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="border-[#00a86b]/40 bg-[#eafaf1] shadow-sm relative isolate flex h-full w-full items-center justify-between overflow-hidden rounded-2xl border px-4 tracking-tight cursor-pointer hover:bg-[#eafaf1]/80" onClick={() => onNavigateToTab?.('festivals')}>
              <div aria-hidden="true" className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl">
                <div style={{ clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)' }} className="from-[#00a86b] to-[#00a86b]/60 aspect-[577/310] w-[36rem] bg-gradient-to-r opacity-30" />
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full pr-6 gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#00a86b] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-[#00a86b] uppercase tracking-wide flex items-center gap-1.5">
                      {appLanguage === 'hi-IN' ? 'डिमांड अलर्ट' : 'Demand Nudge'}
                      <span className="bg-[#ba1a1a] text-white text-[9px] px-1.5 py-0.5 rounded-full lowercase tracking-normal">New</span>
                    </span>
                    <span className="text-[#191c1e] text-[13px] font-medium leading-snug line-clamp-2">
                      <strong className="text-[#005e3e]">Navratri in 3 days.</strong> Fasting essentials demand expected to surge +55%.
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#00a86b]/70 flex flex-col items-center">
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDemandPopup && (
        <div className="fixed top-[72px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[388px] z-50 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-[#0043cf] p-4 flex items-start gap-4 animate-in slide-in-from-top-10 duration-500">
          <div className="bg-[#0043cf]/10 p-2 rounded-full mt-1 shrink-0">
            <Bell className="w-6 h-6 text-[#0043cf] animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#191c1e] text-[15px] mb-1">
              {appLanguage === 'hi-IN' ? '📈 डिमांड रडार अलर्ट' : '📈 Demand Radar Alert'}
            </h3>
            <p className="text-[#3d484f] text-[13px] leading-relaxed">
              {appLanguage === 'hi-IN'
                ? 'नवरात्रि के लिए व्रत के सामान की मांग 55% बढ़ने की उम्मीद है। कृपया साबूदाना और कुट्टू का आटा तैयार रखें।'
                : 'Fasting essentials demand expected to surge by 55% for Navratri. Keep Sabudana and Kuttu Atta ready.'}
            </p>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => setShowDemandPopup(false)} 
                className="px-4 py-1.5 bg-[#f2f4f7] hover:bg-[#e0e3e6] text-[#3d484f] rounded-lg text-[12px] font-bold transition-colors"
              >
                {appLanguage === 'hi-IN' ? 'हटाएं' : 'Dismiss'}
              </button>
              <button 
                onClick={() => { setShowDemandPopup(false); if(onNavigateToTab) onNavigateToTab('festivals'); }} 
                className="px-4 py-1.5 bg-[#0043cf] text-white rounded-lg text-[12px] font-bold shadow-sm transition-colors active:scale-95"
              >
                {appLanguage === 'hi-IN' ? 'स्टॉक देखें' : 'View Stock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Greeting Banner */}
      <div className="mb-4">
        <h1
          className="text-[24px] font-extrabold text-[#191c1e] tracking-tight leading-tight mb-1"
          style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
        >
          {appLanguage === 'hi-IN' ? <>नमस्ते! मैं <span className="text-[#012b72]">सारथी</span> हूँ 👋</> : <>Namaste! Main <span className="text-[#012b72]">SAARTHI</span> hoon 👋</>}
        </h1>
        <p className="text-[14px] text-[#3d484f]">
          {appLanguage === 'hi-IN' ? `अपने ${selectedPeriod === 'daily' ? 'दैनिक' : selectedPeriod === 'weekly' ? 'साप्ताहिक' : 'मासिक'} व्यवसाय के बारे में मुझसे कुछ भी पूछें।` : `Ask me anything about your ${selectedPeriod} business.`}
        </p>
      </div>

      {/* VoiceOrb Interface */}
      <div className="flex flex-col items-center justify-center p-8 mb-6 relative overflow-hidden">
        <PulseOrb state={orbState} onClick={handleOrbClick} />
        <p className="mt-6 text-[15px] font-bold text-[#3d484f] tracking-wide">
          {orbState === 'idle' && (appLanguage === 'hi-IN' ? 'बोलने के लिए टैप करें' : <>Say "Hey <span className="text-[#012b72]">Saarthi</span>" or Tap</>)}
          {orbState === 'listening' && (appLanguage === 'hi-IN' ? 'सुन रहा हूँ...' : 'Listening...')}
          {orbState === 'thinking' && (appLanguage === 'hi-IN' ? 'सोच रहा हूँ...' : 'Thinking...')}
          {orbState === 'speaking' && (appLanguage === 'hi-IN' ? 'बोल रहा हूँ... (रोकने के लिए टैप करें)' : 'Speaking... (Tap to interrupt)')}
        </p>
      </div>

      {/* Manual Type / Ask Input Bar */}
          <div className="mb-6 flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#bcc8d0]/60 shadow-sm">
            <input
              type="text"
              placeholder={appLanguage === 'hi-IN' ? 'या अपना प्रश्न यहाँ लिखें...' : 'Or type your question here...'}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && textInput && handleQuerySubmit(textInput)}
              className="flex-1 bg-transparent px-3 py-1.5 text-[13px] text-[#191c1e] focus:outline-none placeholder:text-[#6d7980]"
            />
            <button
              onClick={() => textInput && handleQuerySubmit(textInput)}
              disabled={!textInput.trim() || isProcessing}
              className="w-9 h-9 rounded-xl bg-[#0043cf] disabled:bg-[#bcc8d0] text-white flex items-center justify-center transition-all active:scale-95 shadow-sm shrink-0"
              aria-label="Send typed query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

{/* 1. Period Selector Toggle (Daily / Weekly / Monthly) from Stitch */}
      <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-[#0043cf] via-[#003882] to-[#0043cf] p-1.5 rounded-full shadow-inner w-full">
        {(['daily', 'weekly', 'monthly'] as PeriodType[]).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`flex-1 py-1.5 rounded-full text-[13px] capitalize font-semibold transition-all duration-200 text-center ${
              selectedPeriod === period
                ? 'bg-white text-[#0043cf] font-bold shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {appLanguage === 'hi-IN' ? (period === 'daily' ? 'दैनिक' : period === 'weekly' ? 'साप्ताहिक' : 'मासिक') : period}
          </button>
        ))}
      </div>

      {/* 4. IDLE STATE CONTAINER */}
      {activeState === 'idle' && (
        <div className="flex flex-col gap-5 w-full animate-in fade-in duration-300">
          
          {/* Quick Stats Image Tabs */}
          <div className="flex justify-between gap-3 bg-transparent">
            {/* Tab 1: Total Sales */}
            <button 
              onClick={() => setActiveMetricTab('totalSales')}
              className={`flex-1 p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${activeMetricTab === 'totalSales' ? 'bg-white border-[#0043cf] shadow-md scale-105' : 'bg-white border-[#e0e3e6]'}`}
            >
              <img src="/images/total-sales.jpg" className="w-10 h-10 object-cover rounded-md mb-1.5 " alt="Total Sales" />
              <span className="text-[10px] uppercase font-bold text-[#6d7980] block leading-tight">Total Sales</span>
            </button>
            
            {/* Tab 2: Upflow */}
            <button 
              onClick={() => setActiveMetricTab('upflow')}
              className={`flex-1 p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${activeMetricTab === 'upflow' ? 'bg-white border-[#0043cf] shadow-md scale-105' : 'bg-white border-[#e0e3e6]'}`}
            >
              <img src="/images/upflow.jpg" className="w-10 h-10 object-cover rounded-md mb-1.5 " alt="Upflow" />
              <span className="text-[10px] uppercase font-bold text-[#6d7980] block leading-tight">Upflow</span>
            </button>

            {/* Tab 3: Udhaar */}
            <button 
              onClick={() => setActiveMetricTab('udhaar')}
              className={`flex-1 p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${activeMetricTab === 'udhaar' ? 'bg-white border-[#0043cf] shadow-md scale-105' : 'bg-white border-[#e0e3e6]'}`}
            >
              <img src="/images/udhaar.jpg" className="w-10 h-10 object-cover rounded-md mb-1.5 " alt="Udhaar Dues" />
              <span className="text-[10px] uppercase font-bold text-[#6d7980] block leading-tight">Udhaar</span>
            </button>
          </div>

          {/* Active Tab Content */}
          {activeMetricTab && (
            <div className="bg-white p-4 rounded-2xl border border-[#0043cf]/20 shadow-sm animate-in fade-in zoom-in-95 duration-200 min-h-[90px] flex flex-col justify-center items-center">
              {activeMetricTab === 'totalSales' && (
              <div className="text-center w-full animate-in slide-in-from-left-4 fade-in">
                <span className="text-[11px] uppercase font-bold text-[#6d7980] tracking-wider block mb-0.5">Total Sales (Today)</span>
                <span className="text-[26px] font-black text-[#0043cf] block leading-none mb-1">
                  ₹{stats.totalSales.toLocaleString()}
                </span>
                <span className="text-[12px] text-[#00a86b] font-bold inline-flex items-center gap-1 bg-[#eafaf1] px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" /> +{stats.growthPercent}% vs yesterday
                </span>
              </div>
            )}
            {activeMetricTab === 'upflow' && (
              <div className="text-center w-full animate-in slide-in-from-bottom-4 fade-in">
                <span className="text-[11px] uppercase font-bold text-[#6d7980] tracking-wider block mb-0.5">UPI Upflow</span>
                <span className="text-[26px] font-black text-[#0043cf] block leading-none mb-1">
                  ₹{stats.upiAmount.toLocaleString()}
                </span>
                <span className="text-[12px] text-[#3d484f] font-semibold block">
                  From {stats.upiCount} successful orders
                </span>
              </div>
            )}
            {activeMetricTab === 'udhaar' && (
              <div className="text-center w-full animate-in slide-in-from-right-4 fade-in">
                <span className="text-[11px] uppercase font-bold text-[#6d7980] tracking-wider block mb-0.5">Pending Udhaar Dues</span>
                <span className="text-[26px] font-black text-[#ba1a1a] block leading-none mb-1">
                  ₹{stats.pendingUdhaar.toLocaleString()}
                </span>
                <button 
                  onClick={() => onNavigateToTab?.('ledger')}
                  className="text-[12px] text-[#0043cf] font-bold hover:underline inline-flex items-center gap-1"
                >
                  View {stats.pendingUdhaarCount} pending accounts <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
            </div>
          )}

          {/* Suggested Voice Queries (From Stitch Design) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-[#6d7980] uppercase tracking-wider">
                {appLanguage === 'hi-IN' ? 'सुझाए गए प्रश्न' : 'Suggested Questions'}
              </span>
              <span className="text-[11px] text-[#0043cf] font-semibold">
                {appLanguage === 'hi-IN' ? 'पूछने के लिए टैप करें' : 'Tap to ask'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestedQuestion(question)}
                  className="bg-white hover:bg-[#c0e8ff]/30 active:scale-95 border border-[#bcc8d0]/40 text-[#191c1e] px-4 py-2.5 rounded-full text-[13px] font-medium shadow-sm transition-all flex items-center gap-2 text-left"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#0043cf]">
                    arrow_back_ios_new
                  </span>
                  <span>{question}</span>
                </button>
              ))}
            </div>
          </div>

          
        </div>
      )}

{/* 5. ACTIVE CHAT & RESPONSE STATE CONTAINER */}
      {activeState === 'active' && (
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

      {/* Active Chat Response container finishes above */}
      {/* Hidden audio element for TTS playback */}
      <audio key="saarthi-tts-player" ref={audioPlayerRef} onEnded={() => setOrbState('idle')} className="hidden" />
    </div>
  );
};