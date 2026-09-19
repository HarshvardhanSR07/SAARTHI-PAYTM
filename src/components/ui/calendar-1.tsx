'use client'

import { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'

interface Calendar1Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const Calendar1: React.FC<Calendar1Props> = ({ selectedDate, onSelectDate }) => {
  const [holidays, setHolidays] = useState<Date[]>([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const year = new Date().getFullYear();
        const res = await fetch(`https://calendarific.com/api/v2/holidays?api_key=0vu1OhXNKeER1vJMfRiTbNX5L0ng2MuV&country=IN&year=${year}`);
        const data = await res.json();
        if (data && data.response && data.response.holidays) {
          const holidayDates = data.response.holidays.map((h: any) => new Date(h.date.iso));
          setHolidays(holidayDates);
        }
      } catch (e) {
        console.error("Failed to fetch holidays", e);
      }
    };
    fetchHolidays();
  }, []);

  return (
    <section className="flex flex-col items-center max-w-xs mx-auto bg-white p-4 rounded-3xl shadow-sm border border-[#e0e3e6]">
      <Calendar
        mode="single"
        defaultMonth={selectedDate}
        selected={selectedDate}
        onSelect={(date) => {
          if (date) onSelectDate(date);
        }}
        modifiers={{
          festival: holidays
        }}
        modifiersClassNames={{
          festival: "!border-2 !border-red-500 rounded-md !text-red-600 font-bold bg-red-50"
        }}
        classNames={{
          today: "!bg-[#eafaf1] !text-[#00a86b] font-bold",
          selected: "!bg-[#00b9f1] !text-white font-bold",
          day_button: "!ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0"
        }}
        className="transition-all !ring-0 !ring-offset-0 focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 [&_*]:!ring-0 [&_*]:!ring-offset-0 [&_*]:focus:!ring-0 [&_*]:focus-visible:!ring-0 [&_.rdp-day_today]:!bg-transparent"
      />
      <p className="mt-4 text-center text-[11px] text-muted-foreground font-light tracking-wide uppercase" role="region">
        Festival Date Picker
      </p>
    </section>
  );
}

export default Calendar1
