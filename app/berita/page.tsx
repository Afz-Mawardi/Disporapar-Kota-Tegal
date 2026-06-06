'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { News } from '@/lib/data';
import { useNews } from '@/lib/data-store';
import { Search, Calendar, User, ChevronRight, Newspaper, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parseIndonesianDate } from '@/lib/utils';

export default function BeritaPage() {
  const [newsList] = useNews();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNewsDetail, setActiveNewsDetail] = useState<News | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Pariwisata', 'Olahraga', 'Kepemudaan', 'Pengumuman', 'Event'];

  // Lock background body scroll when modal is active
  useEffect(() => {
    if (activeNewsDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeNewsDetail]);

  // Parse and sort news descending (latest first)
  const sortedNews = [...newsList].sort((a, b) => {
    return parseIndonesianDate(b.date).getTime() - parseIndonesianDate(a.date).getTime();
  });

  const filteredNews = sortedNews.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="berita-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">
      
      {/* Editorial Page Header */}
      <section className="relative py-20 sm:py-24 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-65">
          <Image
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=2000"
            alt="Koran Digital Kota Tegal"
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
            Media Publikasi & Pers Rilis Resmi
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Warta & Kabar Terbaru
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
              placeholder="Cari rilis berita atau berita terkini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 transition-all font-medium font-inter"
            />
          </div>

        </div>
      </section>

      {/* BERITA GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredNews.length > 0 ? (
          <div className="w-full max-h-[680px] overflow-y-auto pr-2 scrollbar-thin">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group"
                >
                  {/* Visual Card Image */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-50">
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      sizes="(max-w-711px) 100vw, 33vw"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-2.5 py-1 text-[9px] font-bold text-white bg-[#0E3B66]/90 tracking-widest uppercase rounded-lg shadow-sm backdrop-blur-md font-mono">
                        {news.category}
                      </span>
                    </div>
                  </div>

                  {/* Info Text detail panel */}
                  <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-[10px] sm:text-xs text-slate-400 mb-3.5 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{news.date}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 shrink-0" />
                          <span>{news.author}</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-base sm:text-lg text-[#0E3B66] font-sans tracking-tight group-hover:text-primary transition-colors leading-snug line-clamp-3">
                        {news.title}
                      </h3>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Humas Tegal Pers</span>
                      <button
                        type="button"
                        onClick={() => setActiveNewsDetail(news)}
                        className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1 uppercase tracking-wider font-mono bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl"
                      >
                        <span>Baca Rilis</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 max-w-md mx-auto shadow-sm">
            <Newspaper className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">Kabar Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-2 font-inter">
              Tidak ada berita atau rilis yang terdaftar saat ini berdasarkan filter atau pencarian Anda.
            </p>
          </div>
        )}
      </section>

      {/* ARTICLE POPUP DETAIL MODAL DIALOG */}
      <AnimatePresence>
        {activeNewsDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveNewsDetail(null)}
            className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-5xl md:max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] border border-slate-100 cursor-default"
            >
              {/* Sticky Close Button - Stays fixed on top top-right regardless of scroll */}
              <button
                type="button"
                onClick={() => setActiveNewsDetail(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-slate-950/70 border border-white/20 hover:border-white/40 flex items-center justify-center text-white hover:bg-slate-950 hover:text-accent transition-all duration-200 shadow-xl cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Scrollable Container covering both image and editorial content */}
              <div className="overflow-y-auto flex-grow scroll-smooth">
                {/* Image Banner Row */}
                <div className="relative aspect-16/9 md:aspect-21/9 w-full bg-slate-200">
                  <Image
                    src={activeNewsDetail.imageUrl}
                    alt={activeNewsDetail.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Editorial Content Block */}
                <div className="p-6 sm:p-10 space-y-6">
                  {/* Meta details */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{activeNewsDetail.date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>Humas - {activeNewsDetail.author}</span>
                    </div>
                  </div>

                  {/* Large responsive news title */}
                  <h2 className="text-xl sm:text-3.5xl font-extrabold text-[#0E3B66] tracking-tight leading-snug">
                    {activeNewsDetail.title}
                  </h2>

                  {/* Premium typography body text */}
                  <div className="text-slate-700 text-sm sm:text-[16px] leading-[1.8] space-y-6 font-sans antialiased border-[#0E3B66]/10 pt-4">
                    {activeNewsDetail.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-slate-700 font-normal">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fixed Modal footer status */}
              <div className="bg-slate-50 px-6 sm:px-10 py-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono font-bold uppercase shrink-0">
                <span className="hidden sm:inline">RILIS RESMI DISPORAPAR KOTA TEGAL</span>
                <span className="sm:hidden">RILIS RESMI DISPORAPAR</span>
                <button
                  type="button"
                  onClick={() => setActiveNewsDetail(null)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-sans normal-case text-xs sm:text-sm"
                >
                  Tutup Berita
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
