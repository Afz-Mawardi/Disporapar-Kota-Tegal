'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InteractiveImage from '@/components/ui/InteractiveImage';
import { usePathname } from 'next/navigation';
import { Target, Users, BookOpen, User, Award } from 'lucide-react';
import { useWelcomeMessage } from '@/lib/data-store';

export default function ProfilPageClient({
  initialWelcomeMessage
}: {
  initialWelcomeMessage: any;
}) {
  const pathname = usePathname();
  const [welcomeMessage] = useWelcomeMessage(initialWelcomeMessage);
  const paragraphs = welcomeMessage.content
    ? welcomeMessage.content.split(/\\n|\n/)
    : [];


  useEffect(() => {
    if (pathname === '/profil/struktur-organisasi') {
      setTimeout(() => {
        const element = document.getElementById('struktur-organisasi');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else if (pathname === '/profil/tupoksi') {
      setTimeout(() => {
        const element = document.getElementById('tupoksi-dan-fungsi');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else if (pathname === '/profil') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    }
  }, [pathname]);

  return (
    <div id="profil-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">

      {/* Immersive Page Header */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 pointer-events-none" aria-hidden="true">
            Mengenal Instansi
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Profil Resmi DISPORAPAR
          </h1>
        </div>
      </section>

      {/* Sambutan Kepala Dinas - Real Documentation Photo Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 lg:p-12 shadow-sm mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Foto Kepala Dinas */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-48 h-60 sm:w-60 sm:h-76 rounded-2xl overflow-hidden shadow-md border-4 border-slate-100 bg-slate-100 shrink-0 flex items-center justify-center">
                {welcomeMessage.imageUrl ? (
                  <Image
                    src={welcomeMessage.imageUrl}
                    alt={welcomeMessage.name}
                    fill
                    className="object-cover"
                    sizes="(max-w-711px) 100vw, 30vw"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                    <User className="w-16 h-16 opacity-60 text-primary" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-450 font-mono">Foto Tidak Tersedia</span>
                  </div>
                )}
              </div>
              <div className="text-center mt-6">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg lg:text-xl leading-tight">{welcomeMessage.name}</h3>
                <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-widest font-bold font-mono">Kepala DISPORAPAR Kota Tegal</p>
                {welcomeMessage.nip && <p className="text-[10px] text-slate-400 mt-0.5 font-mono">NIP. {welcomeMessage.nip}</p>}
              </div>
            </div>

            {/* Sambutan Text block */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] uppercase bg-blue-50 border border-blue-105 px-3 py-1 rounded-full inline-block font-mono mb-3">
                SAMBUTAN KEPALA DINAS
              </span>
              <div className="text-slate-650 text-sm sm:text-base leading-relaxed space-y-4 font-inter font-light">
                {paragraphs.map((p, index) => {
                  const trimmed = p.trim();
                  if (!trimmed) return null;
                  return (
                    <p key={index}>
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 1: Struktur Organisasi */}
      <section id="struktur-organisasi" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-[#F2994A] font-mono uppercase bg-orange-100/50 border border-orange-200/40 px-3 py-1 rounded-full inline-block">
                  Hierarki Resmi Dinas
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E3B66] tracking-tight">
                  Sistem Bagan Struktur Organisasi
                </h3>
              </div>
            </div>

            <InteractiveImage
              src="/assets/struktur-organisasi.webp"
              alt="Struktur Organisasi DISPORAPAR Kota Tegal"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Tugas Pokok & Fungsi */}
      <section id="tupoksi-dan-fungsi" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-8 lg:p-10 shadow-sm">
          <div className="space-y-6 w-full animate-fadeIn text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-[#0F5A9E] font-mono uppercase bg-blue-50 border border-blue-100/60 px-3 py-1 rounded-full inline-block">
                Regulasi & Mandat
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E3B66] tracking-tight">
                Tugas Pokok & Fungsi (Tupoksi)
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              {/* Tugas Pokok */}
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-50 p-2 rounded-lg shrink-0 text-[#0F5A9E]">
                    <Target className="h-5.5 w-5.5" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0E3B66]">Tugas Pokok Dinas</h4>
                </div>
                <div className="text-slate-650 text-sm sm:text-base font-inter leading-relaxed pl-1 sm:pl-10">
                  Membantu Wali Kota Tegal melaksanakan urusan pemerintahan yang menjadi kewenangan daerah bidang kepemudaan dan olahraga, dan bidang pariwisata.
                </div>
              </div>

              {/* Fungsi Dinas */}
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="bg-emerald-50 p-2 rounded-lg shrink-0 text-emerald-600">
                    <Award className="h-5.5 w-5.5" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0E3B66]">8 Fungsi Utama Dinas</h4>
                </div>

                <div className="pl-1 sm:pl-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Perumusan kebijakan teknis di bidang kepemudaan dan olahraga, dan bidang pariwisata.",
                      "Pengoordinasian pelaksanaan kebijakan teknis di bidang kepemudaan dan olahraga, dan bidang pariwisata.",
                      "Pengoordinasian pelaksanaan tugas dan fungsi di bidang kepemudaan, bidang keolahragaan, dan bidang pariwisata.",
                      "Pembinaan dan fasilitasi di bidang kepemudaan dan olahraga, dan bidang pariwisata.",
                      "Pemantauan, evaluasi dan pelaporan pelaksanaan tugas di bidang kepemudaan dan olahraga, dan bidang pariwisata.",
                      "Pengendalian administrasi kesekretariatan Dinas.",
                      "Pengendalian penyelenggaraan tugas UPTD.",
                      "Pelaksanaan tugas lain yang diberikan oleh Wali Kota sesuai dengan tugas dan fungsinya."
                    ].map((fungsiItem, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/50 rounded-lg border border-slate-100 p-3.5 flex items-start gap-3 hover:bg-white hover:shadow-xs hover:border-blue-100 transition-all duration-300 h-full"
                      >
                        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-blue-50 text-[#0F5A9E] font-mono text-xs font-bold shrink-0 shadow-xs">
                          {idx + 1}
                        </span>
                        <p className="text-slate-650 text-sm sm:text-base font-inter leading-relaxed pt-0.5">
                          {fungsiItem}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}