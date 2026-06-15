'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Target, Users, BookOpen, User, Award } from 'lucide-react';
import { useWelcomeMessage } from '@/lib/data-store';

export default function ProfilPage() {
  const pathname = usePathname();
  const [welcomeMessage] = useWelcomeMessage();
  const paragraphs = welcomeMessage.content
    ? welcomeMessage.content.split(/\\n|\n/)
    : [];

  const [activeAccordion, setActiveAccordion] = useState<'tugas' | 'fungsi' | null>('tugas');

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
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Mengenal Instansi
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Profil Resmi DISPORAPAR
          </h1>
        </div>
      </section>

      {/* Sambutan Kepala Dinas - Real Documentation Photo Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-14 shadow-lg mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Foto Kepala Dinas */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-48 h-60 sm:w-60 sm:h-76 rounded-2xl overflow-hidden shadow-md border-4 border-slate-100 bg-slate-50 shrink-0">
                <Image
                  src={welcomeMessage.imageUrl || '/images/kabid Image 5 Jun 2026, 14.29.31.webp'}
                  alt={welcomeMessage.name}
                  fill
                  className="object-cover"
                  sizes="(max-w-711px) 100vw, 30vw"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center mt-6">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg lg:text-xl leading-tight">{welcomeMessage.name}</h3>
                <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-widest font-bold font-mono">Kepala DISPORAPAR Kota Tegal</p>
                {welcomeMessage.nip && <p className="text-[10px] text-slate-400 mt-0.5 font-mono">NIP. {welcomeMessage.nip}</p>}
              </div>
            </div>

            {/* Sambutan Text block */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] uppercase bg-blue-50 border border-blue-105 px-3 py-1 rounded-full inline-block font-mono mb-2">
                SAMBUTAN KEPALA DINAS
              </span>
              <div className="text-slate-500 text-sm sm:text-base leading-relaxed space-y-4 font-inter font-light">
                {paragraphs.map((p, index) => {
                  const trimmed = p.trim();
                  if (!trimmed) return null;
                  const isWassalam = trimmed.toLowerCase().includes("wassalamualaikum");
                  return (
                    <p
                      key={index}
                      className={isWassalam ? "font-bold text-[#0E3B66] pt-3 italic font-sans" : ""}
                    >
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
          {(() => {
            const rolesDetails: Record<string, {
              title: string;
              bgClass: string;
              icon: React.ReactNode;
            }> = {
              kepala: {
                title: "KEPALA DISPORAPAR",
                bgClass: "bg-[#0E3B66]",
                icon: <User className="h-5 w-5" />
              },
              sekretaris: {
                title: "SEKRETARIS",
                bgClass: "bg-sky-600",
                icon: <User className="h-5 w-5" />
              },
              subbag_umum: {
                title: "KEPALA SUB BAGIAN UMUM DAN KEPEGAWAIAN",
                bgClass: "bg-slate-650",
                icon: <User className="h-4 w-4" />
              },
              subbag_perencanaan: {
                title: "KEPALA SUB BAGIAN PERENCANAAN EVALUASI DAN KEUANGAN",
                bgClass: "bg-slate-650",
                icon: <User className="h-4 w-4" />
              },
              kabid_kepemudaan: {
                title: "KEPALA BIDANG KEPEMUDAAN",
                bgClass: "bg-violet-600",
                icon: <User className="h-5 w-5" />
              },
              kabid_keolahragaan: {
                title: "KEPALA BIDANG KEOLAHRAGAAN",
                bgClass: "bg-emerald-600",
                icon: <User className="h-5 w-5" />
              },
              kabid_pariwisata: {
                title: "KEPALA BIDANG PARIWISATA",
                bgClass: "bg-amber-600",
                icon: <User className="h-5 w-5" />
              },
              fungsional_kepala: {
                title: "KELOMPOK JABATAN FUNGSIONAL",
                bgClass: "bg-slate-600",
                icon: <User className="h-5 w-5" />
              },
              fungsional_pemuda: {
                title: "KELOMPOK JABATAN FUNGSIONAL",
                bgClass: "bg-slate-600",
                icon: <User className="h-4 w-4" />
              },
              fungsional_olahraga: {
                title: "KELOMPOK JABATAN FUNGSIONAL",
                bgClass: "bg-slate-600",
                icon: <User className="h-4 w-4" />
              },
              fungsional_parwis: {
                title: "KELOMPOK JABATAN FUNGSIONAL",
                bgClass: "bg-slate-600",
                icon: <User className="h-4 w-4" />
              }
            };

            const roleStyling: Record<string, {
              primaryColor: string;
              borderColor: string;
              hoverBorder: string;
              badgeBg: string;
              badgeText: string;
              avatarBg: string;
            }> = {
              kepala: {
                primaryColor: "border-[#0E3B66]",
                borderColor: "border-[#0E3B66]/30",
                hoverBorder: "hover:border-[#0E3B66] hover:shadow-[#0E3B66]/10",
                badgeBg: "bg-blue-100 text-[#0E3B66]",
                badgeText: "text-[#0E3B66]",
                avatarBg: "bg-[#0E3B66]"
              },
              sekretaris: {
                primaryColor: "border-sky-600",
                borderColor: "border-sky-200",
                hoverBorder: "hover:border-sky-500 hover:shadow-sky-500/10",
                badgeBg: "bg-sky-50 text-sky-700",
                badgeText: "text-[#0E3B66]",
                avatarBg: "bg-sky-600"
              },
              subbag_umum: {
                primaryColor: "border-slate-500",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-500 hover:shadow-slate-500/10",
                badgeBg: "bg-slate-50 text-slate-700",
                badgeText: "text-slate-650",
                avatarBg: "bg-slate-500"
              },
              subbag_perencanaan: {
                primaryColor: "border-slate-500",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-500 hover:shadow-slate-500/10",
                badgeBg: "bg-slate-50 text-slate-700",
                badgeText: "text-slate-650",
                avatarBg: "bg-slate-500"
              },
              kabid_kepemudaan: {
                primaryColor: "border-violet-600",
                borderColor: "border-violet-200",
                hoverBorder: "hover:border-violet-500 hover:shadow-violet-500/10",
                badgeBg: "bg-violet-50 text-violet-700",
                badgeText: "text-violet-700",
                avatarBg: "bg-violet-600"
              },
              kabid_keolahragaan: {
                primaryColor: "border-emerald-600",
                borderColor: "border-emerald-200",
                hoverBorder: "hover:border-emerald-500 hover:shadow-emerald-500/10",
                badgeBg: "bg-emerald-50 text-emerald-700",
                badgeText: "text-emerald-700",
                avatarBg: "bg-emerald-600"
              },
              kabid_pariwisata: {
                primaryColor: "border-amber-600",
                borderColor: "border-amber-200",
                hoverBorder: "hover:border-amber-500 hover:shadow-amber-500/10",
                badgeBg: "bg-amber-50 text-amber-700",
                badgeText: "text-amber-700",
                avatarBg: "bg-amber-600"
              },
              fungsional_kepala: {
                primaryColor: "border-slate-400",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-400 hover:shadow-slate-400/5",
                badgeBg: "bg-slate-100 text-slate-600",
                badgeText: "text-slate-660",
                avatarBg: "bg-slate-400"
              },
              fungsional_pemuda: {
                primaryColor: "border-slate-400",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-400 hover:shadow-slate-400/5",
                badgeBg: "bg-slate-100 text-slate-600",
                badgeText: "text-slate-660",
                avatarBg: "bg-slate-400"
              },
              fungsional_olahraga: {
                primaryColor: "border-slate-400",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-400 hover:shadow-slate-400/5",
                badgeBg: "bg-slate-100 text-slate-600",
                badgeText: "text-slate-660",
                avatarBg: "bg-slate-400"
              },
              fungsional_parwis: {
                primaryColor: "border-slate-400",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-400 hover:shadow-slate-400/5",
                badgeBg: "bg-slate-100 text-slate-600",
                badgeText: "text-slate-660",
                avatarBg: "bg-slate-400"
              }
            };

            const renderCardObj = (roleKey: string) => {
              const role = rolesDetails[roleKey];
              if (!role) return null;
              const style = roleStyling[roleKey] || roleStyling.fungsional_kepala;

              return (
                <div
                  key={roleKey}
                  id={`card-${roleKey}`}
                  className={`w-full text-left p-3 sm:p-3.5 xl:p-4 rounded-xl border bg-white ${style.borderColor} relative overflow-hidden select-none`}
                >
                  {/* Absolute left subtle accent color strip */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.avatarBg}`} />

                  <div className="flex items-center gap-2 xl:gap-3 pl-1 xl:pl-2">
                    <div className={`w-7.5 h-7.5 xl:w-8.5 xl:h-8.5 rounded-full flex items-center justify-center text-white ${style.avatarBg} shrink-0 shadow-xs border border-white/10`}>
                      <User className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1 font-sans">
                      <h4 className="text-[9.5px] sm:text-[10px] xl:text-[11.5px] font-black text-slate-800 tracking-wide uppercase leading-tight">
                        {role.title}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-10">
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

                {/* DESKTOP BAGAN DIAGRAM (Scrollable horizontally if screen gets tiny) */}
                <div className="hidden lg:block w-full overflow-x-auto bg-[#F8FAFC] border border-slate-150 rounded-3xl p-4 sm:p-6 lg:p-8 scrollbar-thin">
                  <div className="w-full min-w-[950px] lg:min-w-0 relative">
                    <div className="flex justify-center select-none pb-0">
                      <div className="w-[230px]">
                        {renderCardObj('kepala')}
                      </div>
                    </div>
                    <div className="relative h-12 w-full select-none">
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-[26px] w-[2px] bg-slate-300" />
                      <div className="absolute top-[23px] left-[10%] right-[10%] h-[2px] bg-slate-300" />
                      <div className="absolute top-[23px] bottom-0 left-0 right-0 grid grid-cols-5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="relative h-full">
                            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-300" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2.5 xl:gap-4 items-start pt-0">
                      <div className="flex flex-col items-stretch">
                        <div className="w-full">{renderCardObj('sekretaris')}</div>
                        <div className="relative h-6 w-full select-none">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-[2px] bg-slate-300" />
                          <div className="absolute top-3 left-4 right-1/2 h-[2px] bg-slate-300" />
                          <div className="absolute top-3 bottom-0 left-4 w-[2px] bg-slate-300" />
                        </div>
                        <div className="w-full flex flex-col select-none">
                          <div className="flex items-center min-h-[58px]">
                            <div className="relative w-8 self-stretch select-none shrink-0">
                              <div className="absolute top-0 bottom-0 left-4 w-[2px] bg-slate-300" />
                              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-0 h-[2px] bg-slate-300" />
                              <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-[1px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-slate-300" />
                            </div>
                            <div className="flex-1">{renderCardObj('subbag_umum')}</div>
                          </div>
                          <div className="flex h-3 select-none">
                            <div className="relative w-8 shrink-0 self-stretch"><div className="absolute top-0 bottom-0 left-4 w-[2px] bg-slate-300" /></div>
                            <div className="flex-1" />
                          </div>
                          <div className="flex items-center min-h-[58px]">
                            <div className="relative w-8 self-stretch select-none shrink-0">
                              <div className="absolute top-0 h-1/2 left-4 w-[2px] bg-slate-300" />
                              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-0 h-[2px] bg-slate-300" />
                              <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-[1px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-slate-300" />
                            </div>
                            <div className="flex-1">{renderCardObj('subbag_perencanaan')}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full">{renderCardObj('kabid_kepemudaan')}</div>
                        <div className="relative h-6 w-full select-none">
                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                        <div className="w-full">{renderCardObj('fungsional_pemuda')}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full">{renderCardObj('kabid_keolahragaan')}</div>
                        <div className="relative h-6 w-full select-none">
                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                        <div className="w-full">{renderCardObj('fungsional_olahraga')}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full">{renderCardObj('kabid_pariwisata')}</div>
                        <div className="relative h-6 w-full select-none">
                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                        <div className="w-full">{renderCardObj('fungsional_parwis')}</div>
                      </div>
                      <div className="w-full">{renderCardObj('fungsional_kepala')}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Section 2: Tugas Pokok & Fungsi */}
      <section id="tupoksi-dan-fungsi" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="space-y-8 w-full animate-fadeIn text-left">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#0F5A9E] font-mono uppercase bg-blue-50 border border-blue-100/60 px-3 py-1 rounded-full inline-block">
                Regulasi & Mandat
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0E3B66] tracking-tight mt-3">
                Tugas Pokok & Fungsi (Tupoksi)
              </h3>
            </div>

            <div className="space-y-4 pt-2">
              {/* Accordion 1: Tugas Pokok */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'tugas' ? null : 'tugas')}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl shrink-0 text-[#0F5A9E]">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Mandat Utama</span>
                      <h4 className="text-base sm:text-lg font-bold text-[#0E3B66]">Tugas Pokok Dinas</h4>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-[#0E3B66] font-mono pr-2">{activeAccordion === 'tugas' ? '−' : '+'}</span>
                </button>

                {activeAccordion === 'tugas' && (
                  <div className="px-6 pb-6 pt-4 border-t border-slate-50/80 animate-fadeIn text-slate-650 text-sm sm:text-base font-inter leading-relaxed pl-6 sm:pl-20">
                    Membantu Wali Kota Tegal melaksanakan urusan pemerintahan yang menjadi kewenangan daerah bidang kepemudaan dan olahraga, dan bidang pariwisata.
                  </div>
                )}
              </div>

              {/* Accordion 2: Fungsi Dinas */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'fungsi' ? null : 'fungsi')}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl shrink-0 text-emerald-600">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Uraian Kewenangan</span>
                      <h4 className="text-base sm:text-lg font-bold text-[#0E3B66]">8 Fungsi Utama Dinas</h4>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-[#0E3B66] font-mono pr-2">{activeAccordion === 'fungsi' ? '−' : '+'}</span>
                </button>

                {activeAccordion === 'fungsi' && (
                  <div className="px-6 pb-6 pt-6 border-t border-slate-50/80 animate-fadeIn pl-6 sm:pl-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="bg-slate-50/50 rounded-xl border border-slate-100 p-4.5 flex items-start gap-4 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all duration-300 h-full"
                        >
                          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-50 text-[#0F5A9E] font-mono text-sm font-bold shrink-0 shadow-sm">
                            {idx + 1}
                          </span>
                          <p className="text-slate-650 text-xs sm:text-sm font-inter leading-relaxed pt-0.5">
                            {fungsiItem}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}