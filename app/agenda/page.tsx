'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useEvents } from '@/lib/data-store';
import { Search, MapPin, Clock, Calendar } from 'lucide-react';
import { parseIndonesianDate } from '@/lib/utils';

export default function AgendaPage() {
  const [eventsList] = useEvents();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Pariwisata', 'Olahraga', 'Kepemudaan', 'Dinas'];

  // Parse and sort events descending or ascending (events usually chronological)
  const sortedEvents = [...eventsList].sort((a, b) => {
    try {
      return parseIndonesianDate(a.date).getTime() - parseIndonesianDate(b.date).getTime();
    } catch {
      return 0; // Fallback
    }
  });

  const filteredEvents = sortedEvents.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="agenda-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">
      
      {/* Page Hero Header */}
      <section className="relative py-20 sm:py-24 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-65">
          <Image
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2000"
            alt="Event & Agenda Kalender Kota Tegal"
            fill
            priority
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Kalender Agenda & Hiburan Kota
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Event & Agenda
          </h1>
        </div>
      </section>

      {/* FILTER & SEARCH INTERACTIVE BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Category Chips Tab Panel */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase font-mono transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-opacity-95'
                    : 'bg-slate-50 text-slate-500 hover:text-[#0E3B66] hover:bg-slate-100 border border-slate-200/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box block - Expanded for ultra elegance */}
          <div className="relative w-full lg:w-96 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Cari event, agenda, lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 transition-all font-medium font-inter"
            />
          </div>

        </div>
      </section>

      {/* EVENT LISTING (MATCHING BERANDA STYLE - LIST GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredEvents.length > 0 ? (
          <div className="w-full max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            <div className="flex flex-col gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-row gap-4 sm:gap-6 items-stretch text-left w-full"
                >
                  {/* Calendar Sheet Icon Box Wrapper */}
                  <div className="flex items-center justify-center shrink-0">
                    <div className="flex flex-col items-center justify-center text-center w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 border border-slate-200/60 rounded-2xl shrink-0 transition-colors duration-300">
                      <span className="text-2xl sm:text-3xl font-black text-[#353086] leading-none">
                        {event.date.split(' ')[0]}
                      </span>
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#353086] mt-1">
                        {event.date.split(' ')[1].slice(0, 3).toUpperCase()}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 mt-0.5">
                        {event.date.split(' ')[2] || '2026'}
                      </span>
                    </div>
                  </div>

                  {/* Event info details on the right */}
                  <div className="flex-grow min-w-0 flex flex-col justify-between">
                    {/* Top Row: Category badge on left, Time on right */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <span className="px-2.5 py-1 text-[10px] font-bold text-[#F3702A] bg-[#FFF7ED] border border-[#FEE8DD] uppercase tracking-wider rounded-lg font-mono leading-none">
                        {event.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[#353086] font-mono text-[10px] sm:text-xs font-bold whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-[#353086] shrink-0" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Middle Row: Title & Description */}
                    <div className="py-2.5 space-y-1">
                      <h3 className="text-sm sm:text-base font-extrabold text-[#353086] hover:text-[#4f4ab6] transition-colors leading-snug line-clamp-1 sm:line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-light font-inter leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    {/* Bottom Row: Location */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-600 font-inter">
                      <MapPin className="w-3.5 h-3.5 text-[#F3702A] shrink-0" />
                      <span className="font-medium truncate text-slate-600">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 max-w-md mx-auto shadow-sm">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">Agenda Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-2 font-inter">
              Tidak ada event atau agenda kegiatan yang terdaftar saat ini berdasarkan filter atau pencarian Anda.
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
