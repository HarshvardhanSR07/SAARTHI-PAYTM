'use client';

import React, { useState } from 'react';
import { FESTIVAL_EVENTS } from '@/lib/mockData';
import { FestivalEvent } from '@/lib/types';
import { soundService } from '@/lib/soundEffects';
import { getEventForDate } from '@/components/calendar-11';
import Calendar1 from '@/components/ui/calendar-1';
import {
  Volume2,
  VolumeX,
  Share2,
} from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export const FestivalTab: React.FC = () => {
  // Default selected event is Diwali (biggest festival)
  const diwaliEvent = FESTIVAL_EVENTS.find((e) => e.id === 'fest-diwali') || FESTIVAL_EVENTS[0];
  const [selectedEvent, setSelectedEvent] = useState<FestivalEvent>(diwaliEvent);
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(diwaliEvent.year, diwaliEvent.month, diwaliEvent.day)
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const audioTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePlayVoiceNudge = (eventToPlay: FestivalEvent = selectedEvent) => {
    if (typeof window === 'undefined') return;

    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioTimerRef.current) clearTimeout(audioTimerRef.current);
      setIsPlayingAudio(false);
      setCurrentSpokenText('');
      soundService.playMicStopBeep();
      return;
    }

    soundService.playPaytmSoundboxChime();
    setIsPlayingAudio(true);

    const narrationText =
      `Demand alert for ${eventToPlay.name}. ` +
      `Expected sales hike is ${eventToPlay.salesHike.percentage}. ` +
      `Recommended inventory target is ${eventToPlay.stockHike.multiplier} with wholesale reorder deadline by ${eventToPlay.stockHike.reorderDeadline}. ` +
      `Wholesale price surge: ${eventToPlay.priceHike.wholesaleSurge}. ` +
      `Smart savings tip: ${eventToPlay.priceHike.savingsTip}. `;

    setCurrentSpokenText(narrationText);

    if (audioTimerRef.current) clearTimeout(audioTimerRef.current);
    audioTimerRef.current = setTimeout(() => {
      setIsPlayingAudio(false);
      setCurrentSpokenText('');
    }, 7000);

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(narrationText);
        (window as any)._saarthiUtterance = utterance;

        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(
          (v) =>
            v.lang.includes('hi') ||
            v.lang.includes('en-IN') ||
            v.name.includes('India') ||
            v.name.includes('Hindi')
        );
        if (indianVoice) utterance.voice = indianVoice;
        utterance.rate = 0.95;

        utterance.onstart = () => setIsPlayingAudio(true);
        utterance.onend = () => {
          if (audioTimerRef.current) clearTimeout(audioTimerRef.current);
          setIsPlayingAudio(false);
          setCurrentSpokenText('');
          (window as any)._saarthiUtterance = null;
        };
        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis event error:', e);
        };

        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 120);
      } catch (err) {
        console.warn('Speech error:', err);
      }
    }
  };

  const handleShareChecklist = () => {
    soundService.playSuccessChime();
    const text = encodeURIComponent(
      `*Demand Radar: ${selectedEvent.name}*\n` +
        `Date: ${selectedEvent.dateString}\n` +
        `Expected Sales Hike: ${selectedEvent.salesHike.percentage}\n` +
        `Stock Multiplier: ${selectedEvent.stockHike.multiplier}\n` +
        `Wholesale Surge: ${selectedEvent.priceHike.wholesaleSurge}\n\n` +
        `*Must Stock Items:*\n` +
        selectedEvent.stockHike.recommendedInventory
          .map((i) => `- ${i}`)
          .join('\n') +
        `\n\n_Powered by Paytm Saarthi_`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full pb-8 pt-2">
      {/* 1. Page Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-black text-[#191c1e] tracking-tight">Demand Radar</h2>
          <p className="text-[13px] text-[#6d7980]">What to order before the rush</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[12px] font-black text-[#191c1e]">{selectedEvent.dateString}</span>
          <button 
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="px-2.5 py-1 bg-white border border-[#e0e3e6] rounded-md text-[11px] font-bold text-[#3d484f] active:scale-95 shadow-sm"
          >
            {isCalendarOpen ? 'Close' : 'Change Date'}
          </button>
        </div>
      </div>

      {/* 2. Calendar Sheet/Collapsible */}
      {isCalendarOpen && (
        <div className="mb-6 bg-white border border-[#e0e3e6] rounded-2xl shadow-sm animate-in slide-in-from-top-2 overflow-hidden">
          <Calendar1
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              const ev = getEventForDate(date);
              setSelectedEvent(ev);
              setIsCalendarOpen(false); // Auto-close on select
            }}
          />
        </div>
      )}

      {/* 3. Main Paper Card (Taste Skill UI) */}
      <div className="bg-white rounded-3xl border border-[#e0e3e6] shadow-sm overflow-hidden flex flex-col">
        {/* Forest Accent Bar (top rim) */}
        <div className="h-1.5 w-full bg-[#0043cf]" />
        
        <div className="p-5">
          {/* Event Title & Listen */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[11px] font-extrabold text-[#6d7980] uppercase tracking-wider mb-1 block">
                {selectedEvent.badge}
              </span>
              <h3 className="text-[24px] font-black text-[#191c1e] leading-none mb-1.5">
                {selectedEvent.name}
              </h3>
              <p className="text-[13px] text-[#3d484f] leading-snug">
                {selectedEvent.bannerSubtitle}
              </p>
            </div>
            
            {/* Minimal Listen Control */}
            <button
              onClick={() => handlePlayVoiceNudge(selectedEvent)}
              className={`px-3.5 py-2 rounded-full text-[12px] font-bold flex items-center gap-1.5 border transition-all shrink-0 ${
                isPlayingAudio 
                  ? 'bg-[#0043cf] text-white border-[#0043cf]' 
                  : 'bg-white text-[#0043cf] border-[#e0e3e6] hover:bg-[#f7f9fc]'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              {isPlayingAudio ? 'Stop' : 'Listen'}
            </button>
          </div>

          {/* Live Audio Narration (Minimal) */}
          {isPlayingAudio && (
            <div className="mb-6 p-3 bg-[#f7f9fc] rounded-xl border border-[#e0e3e6] animate-in fade-in">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-[#0043cf] rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-[#0043cf] rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-[#0043cf] rounded-full animate-pulse delay-150" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0043cf]">AI Narration</span>
              </div>
              <p className="text-[12px] text-[#191c1e] leading-relaxed font-medium">
                {currentSpokenText || 'Speaking details...'}
              </p>
            </div>
          )}

          {/* Lead Number (Sales Hike) */}
          <div className="mb-6 border-b border-[#e0e3e6] pb-5">
            <span className="text-[44px] font-black text-[#0043cf] tracking-tighter leading-none block mb-1">
              {selectedEvent.salesHike.percentage}
            </span>
            <span className="text-[13px] font-bold text-[#6d7980]">
              Expected sales volume surge
            </span>
          </div>

          {/* Ranked Stock Lifts */}
          <div className="mb-6">
            <h4 className="text-[13px] font-bold text-[#6d7980] uppercase tracking-wider mb-3">Top Movers</h4>
            <div className="flex flex-wrap gap-2">
              {selectedEvent.salesHike.topItems.map((item, idx) => (
                <div key={idx} className="px-3 py-1.5 bg-white border border-[#e0e3e6] rounded-lg flex items-center gap-2 shadow-sm">
                  <span className="text-[12px] font-semibold text-[#3d484f]">{item.name}</span>
                  <span className="text-[12px] font-black text-[#00a86b]">{item.surge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Checklist (Stock target) */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
              <h4 className="text-[15px] font-black text-[#191c1e]">Must-Stock Checklist</h4>
              <span className="text-[11px] font-bold text-[#ba1a1a]">Order by {selectedEvent.stockHike.reorderDeadline}</span>
            </div>
            
            <div className="space-y-2">
              {selectedEvent.stockHike.recommendedInventory.map((rec, idx) => (
                <label key={idx} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[#e0e3e6] hover:bg-[#f7f9fc] active:bg-[#e0e3e6]/30 cursor-pointer shadow-sm transition-all">
                  <input type="checkbox" className="mt-0.5 size-4 rounded border-[#bcc8d0] text-[#0043cf] focus:ring-[#0043cf] cursor-pointer" />
                  <span className="text-[13px] font-semibold text-[#191c1e] leading-snug">{rec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* One Tip */}
          <div className="mb-6 p-4 bg-[#f7f9fc] rounded-xl border border-[#e0e3e6]">
            <h4 className="text-[11px] font-black text-[#191c1e] uppercase tracking-wider mb-1.5">Smart Saving Tip</h4>
            <p className="text-[13px] text-[#3d484f] leading-relaxed">
              {selectedEvent.priceHike.savingsTip} (Wholesale surge: {selectedEvent.priceHike.wholesaleSurge})
            </p>
          </div>

          {/* Share (Outline, Last) */}
          <button
            onClick={handleShareChecklist}
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20b858] active:scale-95 text-white font-bold rounded-xl text-[13px] flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <WhatsAppIcon className="size-4" /> 
            Share Checklist
          </button>
        </div>
      </div>
    </div>
  );
};
