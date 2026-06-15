'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { YOUTH_PROGRAMS, YouthProgram } from '@/lib/data';
import { Sparkles, Users, Award, Calendar, CheckSquare, GraduationCap, ChevronRight, Compass } from 'lucide-react';

export default function KepemudaanPage() {
  return (
    <div id="kepemudaan-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">
      
      {/* Immersive Editorial Header */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Generasi Pelopor, Karya Inspiratif, Tegal Unggul
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-tight">
            Pemberdayaan & Kepemudaan
          </h1>
        </div>
      </section>

      {/* CORE PROGRAMS GRID LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="space-y-8 text-left mb-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-secondary tracking-widest uppercase font-mono bg-blue-100/50 border border-blue-200/40 px-3 py-1 rounded-full inline-block w-fit">
              Program Kerja Strategis
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Inkubasi Inovasi & Agenda Kepemudaan
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-500 font-inter font-light">
            Daftar program resmi pembinaan karakter kepemimpinan, kepeloporan, wirausaha, serta pendelegasian pemuda yang dijalankan secara berskala tahunan oleh DISPORAPAR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {YOUTH_PROGRAMS.map((program) => {
            const isActive = program.status === 'Aktif';
            const isFinished = program.status === 'Selesai';

            return (
              <div
                key={program.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                {/* Photo frame */}
                <div className="relative aspect-[21/9] md:aspect-16/10 w-full overflow-hidden bg-slate-50">
                  <Image
                    src={program.imageUrl}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                    sizes="(max-w-711px) 100vw, 33vw"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Status Overlay label */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold text-white shadow-sm uppercase tracking-widest inline-block font-mono ${
                      isActive ? 'bg-emerald-600' : isFinished ? 'bg-slate-500' : 'bg-primary'
                    }`}>
                      {program.status}
                    </span>
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-lg sm:text-xl font-sans text-slate-950 tracking-tight group-hover:text-primary transition-colors leading-snug">
                      {program.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-inter line-clamp-3">
                      {program.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-inter">
                      <Users className="h-4 w-4 text-accent shrink-0" />
                      <span className="font-medium">Kuota Peserta Lolos: {program.participants} Kader</span>
                    </div>

                    {/* Achievements indicators list */}
                    <div className="border-t border-slate-100/85 pt-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5 font-mono">
                        <Award className="h-3.5 w-3.5 text-secondary" />
                        <span>Keluaran Berhasil Terverifikasi:</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 font-inter">
                        {program.achievements.map((ach, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-emerald-500 font-bold shrink-0">✓</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-200">
                    <Link
                      href="/pelayanan"
                      className="w-full text-center py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider font-mono hover:bg-slate-100 hover:text-primary transition-all block"
                    >
                      Ajukan Minat Pendaftaran
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE STRUCTURES & CIVIC ORGANIZATIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-14 shadow-md">
          <div className="text-center max-w-2xl mx-auto space-y-8 mb-8">
            <div className="space-y-2">
              <span className="text-xs font-bold text-accent tracking-widest uppercase bg-orange-100/50 border border-orange-200/40 px-3.5 py-1.5 rounded-full inline-block font-mono">
                Ekosistem Kemitraan Pemuda
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Kemitraan Organisasi Kepemudaan (OK)
              </h2>
            </div>
            <p className="text-sm text-slate-500 font-inter font-light">
              DISPORAPAR memandu, mendata, memonitor, dan membina legalitas ormas dan wadah kreativitas karang taruna serta himpunan pemuda di Kota Tegal demi sinergi kemajuan daerah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            { [
              {
                title: 'KNPI (Komite Nasional Pemuda Indonesia) Kota Tegal',
                desc: 'Komite pengelola and konsolidator persekutuan seluruh himpunan, ikatan, dan organisasi kepemudaan resmi daerah guna membantu agenda pembangunan sosial kemasyarakatan.',
                badge: 'Wadah Induk Organisasi'
              },
              {
                title: 'Karang Taruna Kota Tegal',
                desc: 'Organisasi kepemudaan berskala kelurahan & rukun warga yang berfokus membina kesejahteraan sosial, pemberdayaan ekonomi kreatif, aksi kemanusaiaan terpadu.',
                badge: 'Aksi Pengabdian Sosial'
              },
              {
                title: 'Forum Anak Tegal (FAT)',
                desc: 'Wadah pemenuhan aspirasi pelopor dan partisipasi anak di bawah 18 tahun untuk menjamin tumbuh kembang, hak perlindungan anak terpadu berkolaborasi sejajar.',
                badge: 'Pemenuhan Hak Anak'
              }
            ].map((ok, idx) => (
              <div key={idx} className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between hover:border-secondary transition-all hover:bg-white hover:shadow-md duration-300">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-secondary/10 text-secondary text-[9px] font-bold uppercase tracking-widest inline-block mb-4 font-mono">
                    {ok.badge}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight">
                    {ok.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-inter mt-3 font-light">
                    {ok.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-200/50 flex justify-between items-center text-xs font-bold text-slate-400 font-mono">
                  <span>DISPORAPAR BINAAN</span>
                  <span className="text-secondary">AKTIF</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
