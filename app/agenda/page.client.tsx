'use client';

import React, { useState, useEffect } from 'react';
import { useEvents } from '@/lib/data-store';
import { Search, MapPin, Clock, Calendar } from 'lucide-react';
import { parseIndonesianDate } from '@/lib/utils';
import CalendarHeader from '@/components/ui/CalendarHeader';

// Get today's date in WIB (UTC+7) as a plain date (no time)
function getTodayWIB(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wibDate = new Date(utc + 7 * 60 * 60000);
  return new Date(wibDate.getFullYear(), wibDate.getMonth(), wibDate.getDate());
}

export default function AgendaPageClient({
  initialEvents
}: {
  initialEvents: any[];
}) {
  const [eventsList] = useEvents(initialEvents);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real-time WIB date state — updates each day at midnight WIB
  const [todayWIB, setTodayWIB] = useState<Date>(getTodayWIB);

  useEffect(() => {
    const refresh = () => setTodayWIB(getTodayWIB());
    refresh();
    const now = new Date();
    const wibNow = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60000);
    const msLeft = (24 * 3600 - wibNow.getHours() * 3600 - wibNow.getMinutes() * 60 - wibNow.getSeconds()) * 1000;
    const t = setTimeout(refresh, msLeft);
    return () => clearTimeout(t);
  }, []);

  // Calendar View State: default to current WIB month
  const [month, setMonth] = useState<number>(() => getTodayWIB().getMonth());
  const [year, setYear] = useState<number>(() => getTodayWIB().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(getTodayWIB);

  // Sort events from newest to oldest
  const sortedEvents = [...eventsList].sort((a, b) => {
    try {
      return parseIndonesianDate(b.date).getTime() - parseIndonesianDate(a.date).getTime();
    } catch {
      return 0;
    }
  });

  // Helper to parse event date and match it with a JS Date
  const getEventsForDate = (date: Date) => {
    return sortedEvents.filter((event) => {
      try {
        const evDate = parseIndonesianDate(event.date);
        return evDate.getDate() === date.getDate() &&
          evDate.getMonth() === date.getMonth() &&
          evDate.getFullYear() === date.getFullYear();
      } catch {
        return false;
      }
    });
  };

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const calendarCells: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayVal = prevMonthTotalDays - i;
    calendarCells.push({ day: dayVal, isCurrentMonth: false, date: new Date(year, month - 1, dayVal) });
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarCells.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
  }
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
  }

  // Search filter
  const isSearching = searchQuery.trim() !== '';
  const searchResults = sortedEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Selected date events
  const selectedDateEvents = getEventsForDate(selectedDate);

  // Next upcoming events (sorted chronologically ascending, closest first)
  const upcomingEvents = [...eventsList]
    .filter(event => {
      try {
        return parseIndonesianDate(event.date).getTime() >= todayWIB.getTime();
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return parseIndonesianDate(a.date).getTime() - parseIndonesianDate(b.date).getTime();
      } catch {
        return 0;
      }
    })
    .slice(0, 3);

  const formatDateHeading = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div id="agenda-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">

      {/* Page Hero Header */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Kalender Kegiatan Dinas &amp; Kota
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Event &amp; Agenda
          </h1>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-[68px] lg:top-[76px] z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-4">
        <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-slate-100/80 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-all duration-300">
          {/* CalendarHeader: month + year dropdowns + prev/next */}
          <div className="flex-1 min-w-0 flex items-center">
            <CalendarHeader
              month={month}
              year={year}
              onMonthChange={setMonth}
              onYearChange={setYear}
            />
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Cari event, agenda, lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 transition-all font-medium font-inter"
            />
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT: CALENDAR + DETAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* CALENDAR */}
          <div className="lg:col-span-7 bg-white border border-slate-150 rounded-[2rem] p-4 sm:p-5 shadow-sm overflow-hidden">

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-extrabold font-mono text-xs sm:text-sm uppercase tracking-wider pb-2 border-b border-slate-100">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-1.5 text-[#F3702A]">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mt-1.5">
              {calendarCells.map((cell, idx) => {
                const cellEvents = getEventsForDate(cell.date);
                const hasEvents = cellEvents.length > 0;

                const isSelected =
                  selectedDate.getDate() === cell.date.getDate() &&
                  selectedDate.getMonth() === cell.date.getMonth() &&
                  selectedDate.getFullYear() === cell.date.getFullYear();

                const isToday =
                  cell.date.getDate() === todayWIB.getDate() &&
                  cell.date.getMonth() === todayWIB.getMonth() &&
                  cell.date.getFullYear() === todayWIB.getFullYear();

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDate(cell.date)}
                    className={[
                      'aspect-square flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-150 cursor-pointer border',
                      isSelected
                        ? 'border-2 border-primary bg-primary'
                        : isToday
                          ? 'border-[2.5px] border-primary bg-white'
                          : cell.isCurrentMonth
                            ? 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                            : 'border-transparent bg-transparent',
                    ].join(' ')}
                  >
                    {/* Date number — centered */}
                    <span className={[
                      'text-sm font-extrabold leading-none',
                      isSelected
                        ? 'text-white'
                        : isToday
                          ? 'text-primary'
                          : cell.isCurrentMonth
                            ? 'text-slate-700'
                            : 'text-slate-300',
                    ].join(' ')}>
                      {cell.day}
                    </span>

                    {/* Event dots — directly below number */}
                    <div className="flex items-center justify-center gap-1 h-2">
                      {hasEvents && cellEvents.slice(0, 3).map((_, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : 'bg-[#F3702A]'}`}
                        />
                      ))}
                      {hasEvents && cellEvents.length > 3 && (
                        <span className={`w-1.5 h-1.5 rounded-full opacity-40 ${isSelected ? 'bg-white' : 'bg-[#F3702A]'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DETAIL PANEL */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-150 rounded-[2rem] p-6 shadow-sm text-left">

              {/* Header */}
              <div className="pb-4 border-b border-slate-100 mb-5">
                <span className="text-[10px] font-bold tracking-widest text-[#2D9CDB] uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block mb-2 font-mono leading-none">
                  {isSearching ? 'HASIL PENCARIAN' : 'RINCIAN AGENDA'}
                </span>
                <h3 className="font-extrabold text-lg text-[#0E3B66] leading-snug tracking-tight">
                  {isSearching ? `Hasil: "${searchQuery}"` : formatDateHeading(selectedDate)}
                </h3>
              </div>

              {/* Event Lists */}
              {isSearching ? (
                searchResults.length > 0 ? (
                  <div className="space-y-5">
                    {searchResults.map((event) => (
                      <div key={event.id} className="pl-4 border-l-[3px] border-accent py-1 group">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-extrabold text-base text-[#353086] leading-snug group-hover:text-primary transition-colors flex-1">
                            {event.title}
                          </h4>
                          {(() => {
                            let isPast = false;
                            try {
                              const evDate = parseIndonesianDate(event.date);
                              isPast = evDate.getTime() < todayWIB.getTime();
                            } catch { }
                            return isPast ? (
                              <span className="inline-flex items-center text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full shrink-0">
                                Selesai
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                                Mendatang
                              </span>
                            );
                          })()}
                        </div>
                        <div className="mt-2 space-y-1 text-slate-500 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800 text-sm">Tidak Ada Kecocokan</h4>
                    <p className="text-xs text-slate-400 mt-1 font-inter">Coba kata kunci lain atau hapus kolom pencarian.</p>
                  </div>
                )
              ) : (
                selectedDateEvents.length > 0 ? (
                  <div className="space-y-6">
                    {selectedDateEvents.map((event) => (
                      <div key={event.id} className="pl-4 border-l-[3px] border-[#353086] py-1 group">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-extrabold text-base text-[#353086] leading-snug group-hover:text-primary transition-colors flex-1">
                            {event.title}
                          </h4>
                          {(() => {
                            let isPast = false;
                            try {
                              const evDate = parseIndonesianDate(event.date);
                              isPast = evDate.getTime() < todayWIB.getTime();
                            } catch { }
                            return isPast ? (
                              <span className="inline-flex items-center text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full shrink-0">
                                Selesai
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                                Mendatang
                              </span>
                            );
                          })()}
                        </div>
                        <div className="mt-2.5 space-y-1.5 text-slate-500 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#F3702A] shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="py-5 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <Calendar className="h-7 w-7 text-slate-300 mx-auto mb-2" />
                      <h4 className="font-bold text-slate-700 text-sm">Tidak Ada Agenda</h4>
                      <p className="text-xs text-slate-400 mt-1 font-inter">Tidak ada acara terjadwal pada tanggal ini.</p>
                    </div>

                    {upcomingEvents.length > 0 && (
                      <div className="pt-4 border-t border-slate-100">
                        <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest font-mono mb-4">Agenda Mendatang:</h4>
                        <div className="space-y-4">
                          {upcomingEvents.map((event) => (
                            <button
                              key={event.id}
                              type="button"
                              onClick={() => {
                                try { setSelectedDate(parseIndonesianDate(event.date)); } catch { }
                              }}
                              className="w-full text-left pl-3.5 border-l-2 border-slate-200 hover:border-[#353086] py-0.5 group cursor-pointer transition-all"
                            >
                              <h5 className="font-bold text-sm text-slate-700 group-hover:text-[#353086] line-clamp-1 transition-colors">{event.title}</h5>
                              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                                <span>{event.date}</span>
                                <span>•</span>
                                <span>{event.time.split(' ')[0]}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
