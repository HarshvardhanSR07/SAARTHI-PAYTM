'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Volume2,
  Sparkles,
  TrendingUp,
  Package,
  AlertTriangle,
  Flame,
  Calendar as CalendarIcon,
  ChevronRight,
  Info,
} from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FESTIVAL_EVENTS } from '@/lib/mockData';
import { FestivalEvent } from '@/lib/types';
import { soundService } from '@/lib/soundEffects';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Helper to get or create event details for ANY clicked date
export function getEventForDate(date: Date): FestivalEvent {
  const matched = FESTIVAL_EVENTS.find(
    (e) =>
      e.year === date.getFullYear() &&
      e.month === date.getMonth() &&
      e.day === date.getDate()
  );
  if (matched) return matched;

  // Find nearest upcoming festival surge
  const nextFestival =
    FESTIVAL_EVENTS.find(
      (e) => new Date(e.year, e.month, e.day).getTime() >= date.getTime()
    ) || FESTIVAL_EVENTS[0];

  const monthName = MONTH_NAMES[date.getMonth()];
  const dateString = `${monthName.slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;

  return {
    id: `date-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    name: `${dateString} Trading Day`,
    dateString,
    dateKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    bannerTitle: `Demand Forecast for ${dateString}`,
    bannerSubtitle: `Regular merchant trade. Next upcoming rush is ${nextFestival.name} (${nextFestival.salesHike.percentage}).`,
    badge: 'Standard Day',
    salesHike: {
      percentage: '+8% to +12%',
      description:
        'Normal daily customer footfall. Steady sales across grocery, dairy, bakery, and FMCG essentials.',
      topItems: [
        { name: 'Fresh Milk & Dairy', surge: '+12%' },
        { name: 'Packaged Bread & Biscuits', surge: '+10%' },
        { name: 'Cold Drinks & Mineral Water', surge: '+15%' },
        { name: 'Packaged Spices & Oil', surge: '+8%' },
      ],
    },
    stockHike: {
      multiplier: '1.0x - 1.2x',
      recommendedInventory: [
        'Keep standard daily buffer stock on counter',
        `Pre-book wholesale orders for upcoming ${nextFestival.name}`,
      ],
      reorderDeadline: nextFestival.stockHike.reorderDeadline,
    },
    priceHike: {
      wholesaleSurge: 'Stable (0% to +3%)',
      marginAlert: 'Standard distributor wholesale prices currently active.',
      savingsTip: `Lock orders for ${nextFestival.name} ahead of time to avoid peak distributor surcharges.`,
    },
    aiNudgeText: `Aaj standard trading day hai. Apni dukaan ka regular stock maintain karein aur aane wale ${nextFestival.name} ke liye tayyari shuru karein.`,
  };
}

interface Calendar11Props {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  selectedEvent?: FestivalEvent;
  onSelectEvent?: (event: FestivalEvent) => void;
  onPlayVoiceNudge?: (event: FestivalEvent) => void;
  isPlayingAudio?: boolean;
}

export const Calendar11: React.FC<Calendar11Props> = ({
  selectedDate: propSelectedDate,
  onSelectDate,
  selectedEvent: propSelectedEvent,
  onSelectEvent,
  onPlayVoiceNudge,
  isPlayingAudio = false,
}) => {
  // Default to Diwali date (Nov 1, 2026)
  const diwaliEvent =
    FESTIVAL_EVENTS.find((e) => e.id === 'fest-diwali') || FESTIVAL_EVENTS[0];

  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(
    new Date(diwaliEvent.year, diwaliEvent.month, diwaliEvent.day)
  );
  const [internalMonth, setInternalMonth] = useState<Date>(
    new Date(diwaliEvent.year, diwaliEvent.month, 1)
  );

  const activeDate = propSelectedDate || internalSelectedDate;

  // Sync internal state when selectedDate changes externally
  useEffect(() => {
    if (propSelectedDate) {
      setInternalSelectedDate(propSelectedDate);
      setInternalMonth(
        new Date(propSelectedDate.getFullYear(), propSelectedDate.getMonth(), 1)
      );
    }
  }, [propSelectedDate]);

  // Find festival or demand profile for activeDate dynamically
  const activeEvent = useMemo(() => {
    // If propSelectedEvent matches activeDate day/month/year, use it
    if (
      propSelectedEvent &&
      propSelectedEvent.year === activeDate.getFullYear() &&
      propSelectedEvent.month === activeDate.getMonth() &&
      propSelectedEvent.day === activeDate.getDate()
    ) {
      return propSelectedEvent;
    }
    return getEventForDate(activeDate);
  }, [activeDate, propSelectedEvent]);

  // Other festivals in season for quick recommendations
  const otherFestivals = useMemo(() => {
    return FESTIVAL_EVENTS.filter((e) => e.id !== activeEvent.id).slice(0, 3);
  }, [activeEvent]);

  // Check if a given date is a red-marked festival date
  const isFestiveDate = (rawDate: Date | { date?: Date } | undefined) => {
    if (!rawDate) return false;
    const date =
      rawDate instanceof Date
        ? rawDate
        : rawDate.date instanceof Date
        ? rawDate.date
        : new Date(rawDate as unknown as string);
    if (isNaN(date.getTime())) return false;

    return FESTIVAL_EVENTS.some(
      (e) =>
        e.year === date.getFullYear() &&
        e.month === date.getMonth() &&
        e.day === date.getDate()
    );
  };

  // Safe handler that handles both raw Date and react-day-picker CalendarDay object
  const handleSelectDay = (rawDate: unknown) => {
    if (!rawDate) return;
    let date: Date | null = null;

    if (rawDate instanceof Date) {
      date = rawDate;
    } else if (
      typeof rawDate === 'object' &&
      rawDate !== null &&
      'date' in rawDate &&
      (rawDate as { date: unknown }).date instanceof Date
    ) {
      date = (rawDate as { date: Date }).date;
    } else if (typeof rawDate === 'string' || typeof rawDate === 'number') {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) date = parsed;
    }

    if (!date || isNaN(date.getTime())) return;

    setInternalSelectedDate(date);
    if (onSelectDate) onSelectDate(date);

    const event = getEventForDate(date);
    if (onSelectEvent) onSelectEvent(event);

    soundService.playPaytmSoundboxChime();
  };

  const handleTriggerListen = (eventToListen: FestivalEvent) => {
    if (onPlayVoiceNudge) {
      onPlayVoiceNudge(eventToListen);
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full rounded-3xl border border-[#e0e3e6] bg-white py-4 shadow-sm overflow-hidden">
        {/* Quick Month Switcher Strip */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-[#e0e3e6]/60">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0043cf]">
            <CalendarIcon className="size-4 text-[#0043cf]" />
            <span>Festival Calendar 2026</span>
          </div>

          <div className="flex items-center gap-1 bg-[#f2f4f7] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                const octDate = new Date(2026, 9, 1);
                setInternalMonth(octDate);
                const dussehra = FESTIVAL_EVENTS.find((e) => e.id === 'fest-dussehra');
                if (dussehra) {
                  handleSelectDay(new Date(2026, 9, dussehra.day));
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                internalMonth.getMonth() === 9
                  ? 'bg-[#0043cf] text-white shadow-xs'
                  : 'text-[#3d484f] hover:text-[#191c1e]'
              }`}
            >
              Oct &apos;26
            </button>
            <button
              type="button"
              onClick={() => {
                const novDate = new Date(2026, 10, 1);
                setInternalMonth(novDate);
                const diwali = FESTIVAL_EVENTS.find((e) => e.id === 'fest-diwali');
                if (diwali) {
                  handleSelectDay(new Date(2026, 10, diwali.day));
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                internalMonth.getMonth() === 10
                  ? 'bg-[#0043cf] text-white shadow-xs'
                  : 'text-[#3d484f] hover:text-[#191c1e]'
              }`}
            >
              Nov &apos;26
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between px-4 pt-2.5 text-[11px] text-[#6d7980]">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#ffdad6]" />
            <span className="font-extrabold text-[#ba1a1a]">Red Marked:</span>
            <span>Festive Rush Peak</span>
          </span>
          <span className="text-[10px] text-[#0043cf] font-semibold">
            Tap date to listen & view hikes
          </span>
        </div>

        {/* Quick One-Tap Festival Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-3 pt-2 pb-1 scrollbar-none">
          {FESTIVAL_EVENTS.map((fest) => {
            const isSelected =
              activeEvent?.id === fest.id ||
              (activeDate.getFullYear() === fest.year &&
                activeDate.getMonth() === fest.month &&
                activeDate.getDate() === fest.day);
            return (
              <button
                key={fest.id}
                type="button"
                onClick={() => {
                  const d = new Date(fest.year, fest.month, fest.day);
                  setInternalMonth(new Date(fest.year, fest.month, 1));
                  handleSelectDay(d);
                }}
                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#ba1a1a] text-white shadow-xs ring-2 ring-[#ba1a1a]/30'
                    : 'bg-[#f7f9fc] hover:bg-[#ffdad6]/50 text-[#3d484f] hover:text-[#ba1a1a] border border-[#e0e3e6]'
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-[#ba1a1a]'
                  }`}
                />
                <span>{fest.name}</span>
                <span className="text-[10px] font-extrabold opacity-90">
                  {fest.salesHike.percentage}
                </span>
              </button>
            );
          })}
        </div>

        {/* shadcn Calendar component from calendar-11 */}
        <CardContent className="px-3 pt-2 pb-2">
          <Calendar
            mode="single"
            month={internalMonth}
            onMonthChange={setInternalMonth}
            selected={activeDate}
            onSelect={(date) => handleSelectDay(date)}
            onDayClick={(calendarDay) => handleSelectDay(calendarDay)}
            modifiers={{
              festive: (date) => isFestiveDate(date),
            }}
            classNames={{
              today: '!bg-transparent font-bold',
              day_button:
                '!ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 cursor-pointer',
              month: 'w-full space-y-2',
            }}
            className="w-full !bg-transparent p-0"
            required
          />
        </CardContent>

        {/* Agenda Section from calendar-11 */}
        <CardFooter className="flex flex-col items-start gap-3 border-t border-[#e0e3e6] bg-[#f7f9fc]/70 px-4 pt-3.5 pb-4">
          {/* Header of Agenda: Selected Date Title + Indicator */}
          <div className="flex w-full items-center justify-between">
            <div>
              <div className="text-[13px] font-extrabold text-[#0043cf]">
                {MONTH_NAMES[activeDate.getMonth()]} {activeDate.getDate()},{' '}
                {activeDate.getFullYear()}
              </div>
              <p className="text-[11px] text-[#6d7980]">
                {activeEvent.badge.includes('Standard') ? (
                  <span>Regular Trading Day</span>
                ) : (
                  <span className="text-[#ba1a1a] font-bold">
                    🔥 Festive Demand Alert: {activeEvent.name}
                  </span>
                )}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                activeEvent.badge.includes('Standard')
                  ? 'bg-[#e0e3e6] text-[#3d484f]'
                  : 'bg-[#ffdad6] text-[#93000a]'
              }`}
            >
              <Flame className="size-3 fill-current" />
              {activeEvent.badge}
            </span>
          </div>

          {/* Agenda Event Cards */}
          <div className="flex w-full flex-col gap-2.5">
            {/* 1. Main Selected Festival Agenda Item (Hide if no festival) */}
            {!activeEvent.badge.includes('No Festival') && (
            <div className="relative rounded-2xl p-3.5 pl-6 text-sm bg-white border border-[#ffdad6] shadow-xs after:absolute after:inset-y-2.5 after:left-2.5 after:w-1.5 after:rounded-full after:bg-[#ba1a1a]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-extrabold text-[#0043cf] text-[15px] leading-tight">
                    {activeEvent.name}
                  </div>
                  <div className="text-[11px] text-[#3d484f] mt-0.5">
                    {activeEvent.bannerSubtitle}
                  </div>
                </div>
              </div>

              {/* Hikes Metric Row inside Calendar-11 Agenda */}
              <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2.5 border-t border-[#f2f4f7]">
                <div className="bg-[#f0fbf5] p-1.5 rounded-lg text-center border border-[#d2f3e2]">
                  <span className="text-[9px] text-[#00875a] block uppercase font-bold">
                    Sales Hike
                  </span>
                  <span className="text-[13px] font-black text-[#00875a]">
                    {activeEvent.salesHike.percentage}
                  </span>
                </div>

                <div className="bg-[#f0f7ff] p-1.5 rounded-lg text-center border border-[#d6e8ff]">
                  <span className="text-[9px] text-[#0043cf] block uppercase font-bold">
                    Stock Target
                  </span>
                  <span className="text-[13px] font-black text-[#0043cf]">
                    {activeEvent.stockHike.multiplier}
                  </span>
                </div>

                <div className="bg-[#fff5f4] p-1.5 rounded-lg text-center border border-[#ffd2cd]">
                  <span className="text-[9px] text-[#ba1a1a] block uppercase font-bold">
                    Price Surge
                  </span>
                  <span className="text-[13px] font-black text-[#ba1a1a]">
                    {activeEvent.priceHike.wholesaleSurge}
                  </span>
                </div>
              </div>

              {/* KEY USER REQUIREMENT: Voice option to listen what all are the Sales Hike, Stock Hike, etc. */}
              <button
                type="button"
                onClick={() => handleTriggerListen(activeEvent)}
                className={`w-full mt-3 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xs cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-[#0043cf] text-white ring-2 ring-[#00b9f1] animate-pulse'
                    : 'bg-gradient-to-r from-[#0043cf] to-[#0043cf] hover:from-[#0043cf] hover:to-[#001d4a] text-white'
                }`}
              >
                <Volume2
                  className={`size-4 shrink-0 ${
                    isPlayingAudio
                      ? 'animate-bounce text-[#00b9f1]'
                      : 'text-white'
                  }`}
                />
                <span className="truncate">
                  {isPlayingAudio
                    ? 'Speaking Sales, Stock & Price Hike...'
                    : '🔊 Listen Sales Hike & Stock Strategy'}
                </span>
                {isPlayingAudio && (
                  <span className="flex items-center gap-0.5 shrink-0 ml-1">
                    <span className="w-1 h-3 bg-[#00b9f1] rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-white rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-[#00b9f1] rounded-full animate-pulse delay-150" />
                  </span>
                )}
              </button>
            </div>
            )}

            {/* Quick list of other festival surges in this season */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-[#6d7980] block mb-1.5 px-1">
                Other Major Festivals in 2026:
              </span>
              <div className="space-y-1.5">
                {otherFestivals.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => {
                      const d = new Date(ev.year, ev.month, ev.day);
                      setInternalMonth(new Date(ev.year, ev.month, 1));
                      handleSelectDay(d);
                    }}
                    className="relative cursor-pointer rounded-xl p-2 pl-6 text-xs bg-white hover:bg-[#f7f9fc] border border-[#e0e3e6] transition-all flex items-center justify-between after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full after:bg-[#0043cf] active:scale-[0.99]"
                  >
                    <div>
                      <span className="font-bold text-[#191c1e]">{ev.name}</span>
                      <span className="text-[10px] text-[#6d7980] ml-1.5">
                        ({ev.dateString})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-extrabold text-[#00875a]">
                        Sales {ev.salesHike.percentage}
                      </span>
                      <ChevronRight className="size-3 text-[#6d7980]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      <p className="mt-2 text-center text-[11px] text-[#6d7980]">
        Interactive Watermelon Calendar 11 • Integrated with Paytm Saarthi Demand Radar
      </p>
    </div>
  );
};

export default Calendar11;
