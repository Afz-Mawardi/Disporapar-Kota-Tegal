'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { News } from '@/lib/types';
import { useNews, useCategories } from '@/lib/data-store';
import { Search, Calendar, User, ChevronRight, Newspaper, X, Clock, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parseIndonesianDate } from '@/lib/utils';

export default function BeritaPageClient({
  initialNews,
  initialCategories
}: {
  initialNews: any[];
  initialCategories: any;
}) {
  const [newsList] = useNews(initialNews);
  const [categoriesStore] = useCategories(initialCategories);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNewsDetail, setActiveNewsDetail] = useState<News | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', ...categoriesStore.news];

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
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 pointer-events-none" aria-hidden="true">
            Media Publikasi & Pers Rilis Resmi
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Warta & Kabar Terbaru
          </h1>
        </div>
      </section>

      {/* FILTER & SEARCH INTERACTIVE BAR */}
      <section className="sticky top-[68px] lg:top-[76px] z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-4">
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-slate-100/80 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between transition-all duration-300">

          {/* Category Chips Tab Panel */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase font-mono transition-all cursor-pointer ${selectedCategory === cat
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
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 transition-all font-medium font-inter"
            />
          </div>

        </div>
      </section>

      {/* BERITA GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group"
              >
                {/* Visual Card Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  {news.imageUrl ? (
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      sizes="(max-w-711px) 100vw, 33vw"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
                      <ImageIcon className="w-8 h-8 opacity-60 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 font-mono">Gambar Tidak Tersedia</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-2.5 py-1 text-[9px] font-bold font-mono uppercase tracking-widest rounded-lg shadow-sm border ${news.category === 'Olahraga' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 backdrop-blur-xs' :
                        news.category === 'Kepemudaan' ? 'bg-blue-950/80 text-blue-400 border-blue-500/40 backdrop-blur-xs' :
                          'bg-amber-950/80 text-amber-400 border-amber-500/40 backdrop-blur-xs'
                      }`}>
                      {news.category}
                    </span>
                  </div>
                </div>

                {/* Info Text detail panel */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[10px] sm:text-xs text-slate-400 mb-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>{news.date}</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-[#0E3B66] font-sans tracking-tight group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {news.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveNewsDetail(news)}
                      className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1 uppercase tracking-wider font-mono bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl cursor-pointer"
                    >
                      <span>Baca Rilis</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
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
            className="fixed inset-0 z-[100] bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer"
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
                <div className="relative aspect-16/9 md:aspect-21/9 w-full bg-slate-100 flex items-center justify-center">
                  {activeNewsDetail.imageUrl ? (
                    <Image
                      src={activeNewsDetail.imageUrl}
                      alt={activeNewsDetail.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                      <ImageIcon className="w-10 h-10 opacity-60 text-[#0E3B66]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-450 font-mono">Gambar Tidak Tersedia</span>
                    </div>
                  )}
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
                  <h2 className="text-lg sm:text-2xl md:text-3.5xl font-extrabold text-[#0E3B66] tracking-tight leading-snug">
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
