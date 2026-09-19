'use client';

import React, { useState } from 'react';
import { INITIAL_QUERIES } from '@/lib/mockData';
import { VoiceQueryItem } from '@/lib/types';
import { soundService } from '@/lib/soundEffects';
import {
  Mic,
  Volume2,
  QrCode,
  Sparkles,
  Play,
  Globe,
  HelpCircle,
  Clock,
  TrendingUp,
  Package,
} from 'lucide-react';

interface VoiceHubTabProps {
  onOpenQR: () => void;
  onSelectQuery: (query: string) => void;
}

export const VoiceHubTab: React.FC<VoiceHubTabProps> = ({ onOpenQR, onSelectQuery }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('Hinglish');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  const languages = [
    { code: 'hi-IN', label: 'हिंदी (Hindi)' },
    { code: 'hi-en', label: 'Hinglish' },
    { code: 'en-IN', label: 'English (India)' },
    { code: 'mr-IN', label: 'मराठी (Marathi)' },
    { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
    { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  ];

  const quickActions = [
    {
      title: 'Soundbox Volume Test',
      subtitle: 'Paytm chime verify karein',
      icon: 'volume_up',
      color: 'bg-[#eafaf1] text-[#006b47]',
      action: () => {
        soundService.playPaytmSoundboxChime();
      },
    },
    {
      title: 'Dukan Ka QR Code',
      subtitle: 'Grahak scan ke liye dikhayein',
      icon: 'qr_code_scanner',
      color: 'bg-[#c0e8ff] text-[#0043cf]',
      action: () => {
        onOpenQR();
      },
    },
    {
      title: 'Sabse Zyada Bikri',
      subtitle: 'Top selling item status',
      icon: 'trending_up',
      color: 'bg-[#ffdcc0] text-[#8d4f00]',
      action: () => {
        onSelectQuery('Sabse zyada kya bik raha hai?');
      },
    },
    {
      title: 'Settlement Time',
      subtitle: 'Bank transfer timing',
      icon: 'account_balance',
      color: 'bg-[#e6e8eb] text-[#0043cf]',
      action: () => {
        onSelectQuery('Kal ki payment settle kab hogi?');
      },
    },
  ];

  const handlePlayVoiceHistory = (item: VoiceQueryItem) => {
    soundService.playMicBeep();
    setActiveAudioId(item.id);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(item.spokenText);
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(
        (v) => v.lang.includes('hi') || v.lang.includes('en-IN') || v.name.includes('India')
      );
      if (indianVoice) utterance.voice = indianVoice;

      utterance.onend = () => {
        setActiveAudioId(null);
      };
      utterance.onerror = () => {
        setActiveAudioId(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setActiveAudioId(null), 3000);
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* 1. Header */}
      <div className="mb-4">
        <h2 className="text-[20px] font-extrabold text-[#0043cf] tracking-tight">
          <span className="text-[#012b72]">SAARTHI</span> Voice Hub
        </h2>
        <p className="text-[13px] text-[#3d484f]">
          Voice command shortcuts & conversational history
        </p>
      </div>

      {/* 2. Language Selector Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#e0e3e6] shadow-sm mb-4">
        <div className="flex items-center gap-1.5 mb-2 text-[12px] font-bold text-[#0043cf]">
          <Globe className="w-4 h-4 text-[#0043cf]" />
          <span>Select Speaking Language (Bhasha)</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLanguage(lang.label);
                soundService.playSuccessChime();
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                selectedLanguage === lang.label
                  ? 'bg-[#0043cf] text-white shadow-sm'
                  : 'bg-[#f2f4f7] text-[#3d484f] hover:bg-[#e6e8eb]'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Voice Shortcut Cards */}
      <div className="mb-4">
        <span className="text-[11px] font-bold text-[#6d7980] uppercase tracking-wider px-1 block mb-2">
          Voice Shortcuts
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((qa, i) => (
            <button
              key={i}
              onClick={qa.action}
              className="bg-white p-3.5 rounded-2xl border border-[#e0e3e6] hover:border-[#0043cf]/40 active:scale-95 transition-all text-left shadow-sm flex flex-col justify-between h-28 group"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${qa.color}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {qa.icon}
                </span>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-[#191c1e] leading-tight group-hover:text-[#0043cf] transition-colors">
                  {qa.title}
                </h4>
                <p className="text-[11px] text-[#6d7980] truncate mt-0.5">
                  {qa.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Voice Query History Log */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[11px] font-bold text-[#6d7980] uppercase tracking-wider">
            Previous Voice Queries
          </span>
          <span className="text-[11px] text-[#0043cf] font-semibold">
            {INITIAL_QUERIES.length} recorded
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {INITIAL_QUERIES.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-[#e0e3e6] shadow-sm flex flex-col gap-2"
            >
              {/* Question & Time */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#c0e8ff] flex items-center justify-center text-[#0043cf] shrink-0">
                    <Mic className="w-3.5 h-3.5" />
                  </span>
                  <h4 className="text-[13px] font-bold text-[#191c1e]">
                    "{item.userQuery}"
                  </h4>
                </div>
                <span className="text-[11px] text-[#6d7980] shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.timestamp}
                </span>
              </div>

              {/* AI Answer snippet */}
              <p className="text-[12px] text-[#3d484f] pl-8 leading-relaxed">
                {item.aiResponse}
              </p>

              {/* Footer play button & metrics */}
              <div className="flex items-center justify-between pl-8 pt-1 border-t border-[#e0e3e6]/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0043cf] bg-[#c0e8ff]/50 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>

                <button
                  onClick={() => handlePlayVoiceHistory(item)}
                  className="px-2.5 py-1 bg-[#f2f4f7] hover:bg-[#c0e8ff]/40 text-[#0043cf] active:scale-95 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {activeAudioId === item.id ? 'pause' : 'play_arrow'}
                  </span>
                  {activeAudioId === item.id ? 'Playing...' : 'Play Audio'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
