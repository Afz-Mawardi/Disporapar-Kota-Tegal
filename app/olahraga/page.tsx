'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SPORTS_VENUES, SportsVenue } from '@/lib/data';
import { Trophy, Dumbbell, MapPin, Users, DollarSign, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function OlahragaPage() {
  return (
    <div id="olahraga-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">
      
      {/* Immersive Editorial Header */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Membina Juara & Semangat Hidup Sehat
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-tight">
            Olahraga Prestasi & Rekreasi
          </h1>
        </div>
      </section>

      {/* CORE SPORTS VENUES SHOWCASE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="space-y-8 text-left mb-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-secondary tracking-widest uppercase font-mono bg-blue-100/50 border border-blue-200/40 px-3 py-1 rounded-full inline-block">
              Sarana Prasarana Daerah
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Sewa Lapangan & Gelanggang Olahraga
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-500 font-inter font-light">
            Daftar sarana prasarana olahraga milik Pemerintah Daerah Kota Tegal yang beroperasi secara resmi di bawah pengelolaan terpadu DISPORAPAR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SPORTS_VENUES.map((venue) => {
            const isAvailable = venue.status === 'Tersedia';
            const isMaintenance = venue.status === 'Pemeliharaan';

            return (
              <div
                key={venue.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Layout */}
                <div className="relative aspect-[21/9] md:aspect-16/10 w-full overflow-hidden bg-slate-50">
                  <Image
                    src={venue.imageUrl}
                    alt={venue.name}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    sizes="(max-w-711px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Status Badges Overlay */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-2.5 py-1 rounded text-[8px] font-bold text-white shadow-xs uppercase tracking-widest inline-block font-mono ${
                      isAvailable ? 'bg-emerald-600' : isMaintenance ? 'bg-amber-500' : 'bg-rose-650'
                    }`}>
                      ● {venue.status}
                    </span>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">{venue.type}</span>
                    <h3 className="font-bold text-lg sm:text-xl font-sans text-slate-900 tracking-tight mt-1 group-hover:text-primary transition-colors leading-snug">
                      {venue.name}
                    </h3>
                    
                    <div className="mt-5 space-y-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-4 font-inter">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">{venue.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-secondary shrink-0" />
                        <span>Kapasitas Penonton: {venue.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="font-bold text-emerald-600">Tarif Retribusi: {venue.priceHour} / Jam</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[10px] text-slate-400 leading-normal font-sans italic">
                      *Tunduk pada ketentuan tarif peraturan daerah No. 5/2021.
                    </span>
                    <Link
                      href="/pelayanan"
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-[10px] text-center uppercase tracking-wider font-mono border transition-all ${
                        isAvailable
                          ? 'bg-primary text-white hover:bg-primary-900 shadow-sm border-transparent'
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      {isAvailable ? 'Ajukan Izin Sewa' : 'Sewa Ditutup'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STRATEGIC COACHING / ATHLETES PRESTASI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-14 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Coach Details Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-2">
                <span className="text-xs font-bold text-accent tracking-widest uppercase bg-orange-100/50 border border-orange-200/40 px-3.5 py-1.5 rounded-full inline-block font-mono">
                  Pemberdayaan Atlet Daerah
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Pemusatan Latihan & Pembinaan Olahraga Berkelanjutan
                </h2>
              </div>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-inter font-light">
                DISPORAPAR bersinergi erat bersama KONI (Komite Olahraga Nasional Indonesia) Kota Tegal secara terpadu mengelola pemusatan latihan atlet usia dini berkala, peningkatan kualifikasi lisensi pelatih nasional, serta penyelenggaraan bonus apresiasi kejuaraan PORPROV & PON.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs sm:text-sm font-semibold text-slate-700">
                {[
                  'Pemantauan Rutrisi & Medis Fisik Atlet Berkala',
                  'Sertifikasi Pelatih Berlisensi Nasional Resmi',
                  'Pemberian Jaminan Beasiswa Atlet Berprestasi',
                  'Pemberangkatan Kontingen PORPROV & PON Daerah'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-video lg:aspect-square w-full rounded-2.5xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
                <Image
                  src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800"
                  alt="Latihan Kejuaraan Atlet Tegal"
                  fill
                  className="object-cover"
                  sizes="(max-w-711px) 100vw, 40vw"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
