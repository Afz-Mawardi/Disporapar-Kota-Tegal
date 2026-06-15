'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { DESTINATIONS, Destination } from '@/lib/data';
import { Compass, MapPin, Clock, Ticket, Search, Filter, HelpCircle, ArrowRight } from 'lucide-react';

export default function PariwisataPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua', 'Bahari', 'Religi/Sejarah', 'Kuliner', 'Alam'];

  const filteredDestinations = DESTINATIONS.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="pariwisata-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">
      
      {/* Immersive Editorial Hero Header */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Wonderful Tegal Bahari
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-tight">
            Pesona Wisata Bahari & Pesisiran
          </h1>
        </div>
      </section>

      {/* FILTER & SEARCH PANEL (Apple-style sleek row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-5">
          
          {/* Category pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono tracking-wide shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Cari destinasi atau kuliner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-slate-800 transition-all font-medium font-inter"
            />
          </div>

        </div>
      </section>

      {/* DESTINATION CARDS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full"
              >
                {/* Visual Image Frame */}
                <div className="relative aspect-[21/9] md:aspect-16/10 w-full overflow-hidden bg-slate-50">
                  <Image
                    src={destination.imageUrl}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    sizes="(max-w-711px) 100vw, 33vw"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 text-[9px] font-bold text-white bg-primary-900/90 tracking-widest uppercase rounded-lg shadow-sm font-mono">
                      {destination.category}
                    </span>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-primary transition-colors leading-snug">
                      {destination.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-inter line-clamp-3">
                      {destination.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-slate-100/60 space-y-2.5 text-xs text-slate-600 font-inter">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">{destination.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-secondary shrink-0" />
                        <span>{destination.operationalHours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-slate-700">{destination.ticketPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Facilities details */}
                  <div className="mt-5 pt-4 border-t border-slate-100/60">
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Fasilitas Area:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {destination.facilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-200 font-mono"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="px-6 py-4 border-t border-slate-100/80 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-500 font-inter">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Wonderful Indonesia Binaan</span>
                  <a
                    href="https://disporapar.tegalkota.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-accent transition-all uppercase tracking-wider font-mono"
                  >
                    <span>Kunjungi</span>
                    <Compass className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 max-w-md mx-auto shadow-sm">
            <Compass className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">Destinasi Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-2 font-inter">
              Tidak ada destinasi pariwisata yang cocok dengan kata kunci pencarian Anda. Silakan coba kata kunci lain.
            </p>
          </div>
        )}
      </section>

      {/* PROMOTION / PARTNERSHIP CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-[#0E3B66] rounded-3xl text-white p-8 sm:p-14 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-bold text-accent tracking-widest uppercase bg-accent/20 border border-accent/25 px-3.5 py-1.5 rounded-full inline-block font-mono">
              Mitra Pelaku Usaha Wisata
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Kembangkan Usaha Pariwisata & Kuliner Kreatif Anda Bersama Kami
            </h2>
            <p className="text-sm sm:text-base text-slate-350 leading-relaxed font-light font-inter">
              DISPORAPAR mendukung penuh pelaku industri penginapan, restoran Sate Tegal legendaris, agen perjalanan, serta pemandu wisata bahari untuk mengajukan data usaha resmi agar terdaftar secara luas di bawah rekomendasi katalog pariwisata terpadu.
            </p>
            <div className="pt-2">
              <Link
                href="/pelayanan"
                className="px-6 py-3.5 bg-accent text-white font-bold text-xs uppercase tracking-widest font-mono rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25 inline-block"
              >
                Urus Izin Usaha & TDUP
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
