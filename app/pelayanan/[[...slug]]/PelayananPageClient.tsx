'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePublicServices, useCategories, useRetribusi } from '@/lib/data-store';

import {
  FileText,
  Search,
  Download,
  ShieldCheck,
  CheckCircle,
  Info,
  Target,
  Landmark,
  Shield,
  Quote,
  HeartHandshake
} from 'lucide-react';

const getFileFormat = (downloadUrl?: string, title?: string): 'pdf' | 'zip' | 'word' | 'unknown' => {
  if (!downloadUrl || downloadUrl === '#' || downloadUrl === '') return 'unknown';
  const urlLower = downloadUrl.toLowerCase();
  const titleLower = title ? title.toLowerCase() : '';

  if (urlLower.includes('.pdf') || titleLower.includes('pdf')) return 'pdf';
  if (urlLower.includes('.zip') || urlLower.includes('.rar') || titleLower.includes('zip') || titleLower.includes('rar')) return 'zip';
  if (urlLower.includes('.doc') || urlLower.includes('.docx') || titleLower.includes('word') || titleLower.includes('doc') || titleLower.includes('docx')) return 'word';

  if (urlLower.startsWith('data:application/pdf')) return 'pdf';
  if (urlLower.startsWith('data:application/zip') || urlLower.startsWith('data:application/x-zip-compressed')) return 'zip';
  if (urlLower.startsWith('data:application/msword') || urlLower.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'word';

  return 'unknown';
};

interface FileFormatIconProps {
  className?: string;
  downloadUrl?: string;
  title?: string;
  colorClasses?: string;
}

const FileFormatIcon: React.FC<FileFormatIconProps> = ({ className = "w-5 h-5", downloadUrl, title, colorClasses }) => {
  const format = getFileFormat(downloadUrl, title);
  const color = colorClasses !== undefined ? colorClasses : (
    format === 'pdf' ? 'text-red-500' :
      format === 'word' ? 'text-blue-650' :
        format === 'zip' ? 'text-amber-500' :
          'text-slate-400'
  );

  switch (format) {
    case 'pdf':
      return (
        <svg
          className={`${className} ${color} shrink-0`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15H7v-4h2" />
          <path d="M9 13H7" />
          <path d="M12 11v4h1a1.5 1.5 0 0 0 1.5-1.5v-1A1.5 1.5 0 0 0 13 11h-1z" />
          <path d="M17 11h2" />
          <path d="M17 13h1.5" />
        </svg>
      );
    case 'zip':
      return (
        <svg
          className={`${className} ${color} shrink-0`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M10 6v2" />
          <path d="M10 10v2" />
          <path d="M10 14v2" />
          <path d="M10 18h2" />
        </svg>
      );
    case 'word':
      return (
        <svg
          className={`${className} ${color} shrink-0`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 11.5l1.5 4 1.5-4 1.5 4 1.5-4.5" />
        </svg>
      );
    default:
      return (
        <svg
          className={`${className} ${color} shrink-0`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
  }
};

export default function PelayananPageClient({
  initialServices,
  initialCategories,
  initialRetribusi
}: {
  initialServices: any[];
  initialCategories: any;
  initialRetribusi: any[];
}) {
  const [publicServices] = usePublicServices(initialServices);
  const [categoriesStore] = useCategories(initialCategories);
  const [retribusi] = useRetribusi(initialRetribusi);

  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Determine activeTab primarily from the URL route path
  let activeTab: 'berkas' | 'maklumat' | 'motto' | 'retribusi' = 'maklumat';
  if (pathname === '/pelayanan/berkas') {
    activeTab = 'berkas';
  } else if (pathname === '/pelayanan/maklumat') {
    activeTab = 'maklumat';
  } else if (pathname === '/pelayanan/motto') {
    activeTab = 'motto';
  } else if (pathname === '/pelayanan/retribusi') {
    activeTab = 'retribusi';
  }

  const categories = ['Semua', ...categoriesStore.services];

  const filteredServices = publicServices
    .filter((item) => {
      const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'id', { sensitivity: 'base' }));

  // Handle automatic scroll to the tabs section if a subpath is accessed directly
  useEffect(() => {
    if (pathname !== '/pelayanan') {
      setTimeout(() => {
        const element = document.getElementById('pelayanan-tabs-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    }
  }, [pathname]);

  const tabs = [
    { id: 'maklumat', name: 'Maklumat Pelayanan', icon: <ShieldCheck className="h-4 w-4" />, href: '/pelayanan/maklumat' },
    { id: 'motto', name: 'Motto Pelayanan', icon: <CheckCircle className="h-4 w-4" />, href: '/pelayanan/motto' },
    { id: 'retribusi', name: 'Retribusi', icon: <Landmark className="h-4 w-4" />, href: '/pelayanan/retribusi' },
    { id: 'berkas', name: 'Berkas Layanan', icon: <FileText className="h-4 w-4" />, href: '/pelayanan/berkas' },
  ] as const;

  return (
    <div id="pelayanan-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">

      {/* 1. HERO SECTION */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            PELAYANAN PUBLIK
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Pelayanan Publik Terpadu
          </h1>
        </div>
      </section>

      {/* 2. MAIN INFORMATION CARD (Visi & Misi Pelayanan Disporapar) */}
      <section id="visi-misi-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-14 shadow-lg mb-16">
          <div className="space-y-8 w-full text-left">
            <div className="space-y-2">
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#0E3B66] font-mono uppercase bg-blue-50 border border-blue-100/50 px-3.5 py-1.5 rounded-full inline-block w-fit">
                AMANAH PELAYANAN
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0E3B66] tracking-tight leading-tight">
                Visi & Misi Pelayanan Disporapar
              </h2>
            </div>

            {/* Visi Pelayanan Box */}
            <div className="bg-slate-50/80 p-6 sm:p-10 rounded-2xl border border-slate-100 border-l-4 border-accent relative overflow-hidden">
              <span className="text-[10px] font-bold text-accent font-mono uppercase tracking-widest block mb-3">Visi Pelayanan</span>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-relaxed italic relative z-10">
                &ldquo;Mewujudkan Dinas Kepemudaan dan Olahraga dan Pariwisata Kota Tegal dengan Kerja Ikhlas dalam Memberikan Pelayanan Prima.&rdquo;
              </p>
            </div>

            {/* Misi Pelayanan Box and Grid */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#0E3B66] font-mono uppercase tracking-wider block">Misi Pelayanan</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { idx: '01', title: "Pelayanan Prima & Regulatif", text: "Memberikan pelayanan prima yang berorientasi pada kesesuaian peraturan perundangan yang berlaku." },
                  { idx: '02', title: "Peningkatan Mutu SDM", text: "Meningkatkan kualitas SDM Aparatur secara periodik dan berkelanjutan." },
                  { idx: '03', title: "Modernisasi Sarana & IT", text: "Mengembangkan sarana dan prasarana serta memutakhirkan teknologi informasi." }
                ].map((misi) => (
                  <div key={misi.idx} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-blue-105/80 hover:shadow-xs transition-all flex items-start gap-4 h-full">
                    <span className="text-xl font-black text-[#0F5A9E] font-mono shrink-0">{misi.idx}</span>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug tracking-tight">{misi.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-inter font-light">{misi.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. NAVIGATION TABS AND CONTENT SECTION */}
      <section id="pelayanan-tabs-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tab Controls headers (identical to Profile styled tabs) */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-1.5 pb-4 border-b border-slate-200 mb-12">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`${tab.href}#pelayanan-tabs-section`}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold font-mono tracking-wide shrink-0 transition-colors w-full sm:w-auto ${isActive
                  ? 'bg-primary text-white shadow-sm font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
              >
                {tab.icon}
                <span className="uppercase">{tab.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Dynamic content area following Sejarah layout */}
        {activeTab === 'berkas' ? (
          <div className="space-y-6 w-full">
            {/* FILTER & SEARCH INTERACTIVE BAR */}
            <div className="sticky top-[68px] lg:top-[76px] z-30 w-full bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-slate-100/80 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between transition-all duration-300">

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
                  placeholder="Cari SOP, formulir, berkas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 transition-all font-medium font-inter"
                />
              </div>

            </div>

            {/* List Content inside its own card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm text-left space-y-8 w-full">
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-[#F2994A] font-mono uppercase bg-orange-50 border border-orange-100/50 px-3 py-1.5 rounded-full inline-block">UNDUH BERKAS</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E3B66] tracking-tight">Berkas Layanan & Dokumen Resmi</h3>
              </div>

              {/* LIST ELEMENTS STACK - NO SCROLLBAR */}
              <div className="w-full flex flex-col justify-start">
                {filteredServices.length > 0 ? (
                  <div className="space-y-3.5 w-full pr-0.5">
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        className="bg-slate-50/40 rounded-xl p-4 sm:p-5 border border-slate-100 hover:border-emerald-500/45 hover:bg-white hover:shadow-xs transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1 text-left">
                          {(() => {
                            const format = getFileFormat(service.downloadUrl, service.title);
                            let bgBorderText = 'bg-slate-50 border border-slate-200/60 text-slate-400';
                            if (format === 'pdf') bgBorderText = 'bg-red-50 border border-red-100/60 text-red-650';
                            else if (format === 'word') bgBorderText = 'bg-blue-50 border border-blue-100/60 text-blue-600';
                            else if (format === 'zip') bgBorderText = 'bg-amber-50 border border-amber-100/60 text-amber-600';

                            return (
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bgBorderText}`}>
                                <FileFormatIcon downloadUrl={service.downloadUrl} title={service.title} className="w-5 h-5" colorClasses="text-current" />
                              </div>
                            );
                          })()}
                          <h4 className="font-bold text-[#0E3B66] text-sm sm:text-base leading-snug tracking-tight min-w-0 flex-1">
                            {service.title}
                          </h4>
                        </div>

                        {!service.downloadUrl || service.downloadUrl === '#' || service.downloadUrl === '' ? (
                          <button
                            disabled
                            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-lg font-mono uppercase tracking-wider cursor-not-allowed border border-slate-200 shrink-0 w-full sm:w-auto"
                          >
                            <span>Tidak Tersedia</span>
                            <Download className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        ) : (
                          <a
                            href={service.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-primary hover:bg-[#0c355c] active:bg-[#0a2c4e] px-4 py-2 rounded-lg transition-colors font-mono uppercase tracking-wider shadow-xs shrink-0 w-full sm:w-auto"
                          >
                            <span>Unduh</span>
                            <Download className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50/50 p-12 text-center rounded-2xl border border-slate-100 max-w-sm mx-auto my-auto flex flex-col justify-center items-center">
                    <FileText className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                    <h4 className="font-extrabold text-slate-950 tracking-tight text-sm">Berkas Tidak Ditemukan</h4>
                    <p className="text-xs text-slate-500 mt-2 font-inter max-w-[280px]">
                      Tidak ada dokumen penetapan atau formulir yang terdaftar saat ini berdasarkan filter atau pencarian Anda.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm">
            {/* TAB 2: MAKLUMAT PELAYANAN */}
            {activeTab === 'maklumat' && (
              <div className="space-y-8 w-full text-left animate-fade-in">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] font-mono uppercase bg-blue-50 border border-blue-100/50 px-3 py-1.5 rounded-full inline-block">
                    KOMITMEN RESMI
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E3B66] tracking-tight">
                    Maklumat Kesanggupan Pelayanan
                  </h3>
                </div>

                {/* NEAT MODERN WEBSITE STYLE SECTION - NO DOCUMENT STYLE */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">

                  {/* LEFT: MAKLUMAT PELAYANAN STATEMENT (PROMINENT CALLOUT CARD) */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-[#0E3B66] to-[#0A2E50] text-white p-8 sm:p-10 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden group">
                    {/* Subtle Background Pattern Accent */}
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500 pointer-events-none" />

                    <div className="space-y-6 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                        <Quote className="h-6 w-6 text-sky-300" />
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-sky-300">Pernyataan Maklumat</span>
                        <blockquote className="text-sm sm:text-base font-semibold font-inter leading-relaxed text-slate-100 italic">
                          &ldquo;Dengan ini Kami Dinas Kepemudaan dan Olahraga dan Pariwisata Kota Tegal (Disporapar) Menyatakan Sanggup Menyelenggarakan Pelayanan Yang Telah ditetapkan dan Apabila Tidak Menepati Janji Ini, Kami Siap Menerima Sanksi Sesuai Peraturan Perundang-Undangan.&rdquo;
                        </blockquote>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 mt-8 relative z-10 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm text-sky-200 shrink-0 select-none">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Kepala DISPORAPAR KOTA TEGAL</h5>
                        <span className="text-xs font-extrabold block text-white leading-tight truncate">Dr. Drs. IRKAR YUSWAN APENDI. M.M</span>
                        <span className="text-[9px] text-sky-305 font-mono block">NIP. 19660213.199003.1.001</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: TIGA JANJI PELAYANAN (PLEDGE CARDS GRID) */}
                  <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                      <span className="text-[9px] font-black uppercase text-[#F3702A] bg-[#FFF7ED] border border-[#FEE8DD] px-2.5 py-1 rounded-md tracking-wider font-mono">Janji Pelayanan</span>
                      <h4 className="text-base font-extrabold text-[#0E3B66] mt-2 tracking-tight">Janji Pelayanan Publik</h4>
                      <p className="text-xs sm:text-sm text-slate-700 font-semibold font-inter mt-3 leading-relaxed border-l-2 border-[#F3702A] pl-3">
                        Kami DISPORAPAR Kota Tegal berjanji:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 flex-1">
                      {[
                        {
                          num: "1",
                          title: "Pelayanan Prima & Sepenuh Hati",
                          text: "Akan melaksanakan pelayanan prima dengan sepenuh hati kepada masyarakat sesuai ketentuan perundang-undangan yang berlaku.",
                          icon: ShieldCheck,
                          bg: "border-l-4 border-l-[#0E3B66] bg-white hover:bg-slate-50/45",
                          iconColor: "text-[#0E3B66]",
                          iconBg: "bg-blue-50 border-blue-100/50"
                        },
                        {
                          num: "2",
                          title: "Orientasi Kepuasan Masyarakat",
                          text: "Akan melaksanakan pelayanan dengan mengutamakan kepuasan masyarakat.",
                          icon: HeartHandshake,
                          bg: "border-l-4 border-l-sky-500 bg-white hover:bg-slate-50/45",
                          iconColor: "text-sky-600",
                          iconBg: "bg-sky-50 border-sky-100/50"
                        },
                        {
                          num: "3",
                          title: "Profesional Tanpa Gratifikasi & Pungli",
                          text: "Akan Melaksanakan pelayanan secara profesional tanpa gratifikasi dan pungli dalam bentuk apapun.",
                          icon: CheckCircle,
                          bg: "border-l-4 border-l-emerald-500 bg-white hover:bg-slate-50/45",
                          iconColor: "text-emerald-600",
                          iconBg: "bg-emerald-50 border-emerald-100/50"
                        }
                      ].map((promise, idx) => {
                        const IconComp = promise.icon;
                        return (
                          <div
                            key={idx}
                            className={`p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex gap-4 items-center ${promise.bg}`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${promise.iconBg}`}>
                              <IconComp className={`h-5 w-5 ${promise.iconColor}`} />
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-inter font-medium">
                              {promise.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: MOTTO PELAYANAN */}
            {activeTab === 'motto' && (
              <div className="space-y-8 w-full text-left animate-fade-in">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] font-mono uppercase bg-blue-50 border border-blue-100/50 px-3 py-1.5 rounded-full inline-block">
                    MOTTO LAYANAN
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E3B66] tracking-tight">
                    Motto Layanan PORAPAR
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      acronym: 'PO',
                      title: 'PROFESIONAL',
                      desc: 'Memberikan pelayanan dengan standar kualitas tinggi, mengutamakan kompetensi and integritas dalam setiap proses penanganan.',
                      textColor: 'text-[#0E3B66]'
                    },
                    {
                      acronym: 'RA',
                      title: 'RAMAH',
                      desc: 'Menyambut setiap pemohon dengan sikap ramah, sapaan hangat, and respon positif terhadap setiap pertanyaan and kebutuhan.',
                      textColor: 'text-[#2D9CDB]'
                    },
                    {
                      acronym: 'PAR',
                      title: 'PELAYANAN RESPONSIF',
                      desc: 'Merespons dengan cepat, tepat, and sesuai dengan kebutuhan masyarakat serta memberikan solusi terbaik dalam setiap permasalahan.',
                      textColor: 'text-[#219653]'
                    }
                  ].map((mottoItem, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-100/80 rounded-3xl p-8 sm:p-10 hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col items-center text-center shadow-xs"
                    >
                      <span className={`text-2xl font-black mb-4 tracking-tight shrink-0 ${mottoItem.textColor}`}>
                        {mottoItem.acronym}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wider mb-4 uppercase">
                        {mottoItem.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 font-inter font-light leading-relaxed max-w-xs md:max-w-none">
                        {mottoItem.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: RETRIBUSI */}
            {activeTab === 'retribusi' && (
              <div className="space-y-8 w-full text-left animate-fade-in">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-[#0F5A9E] font-mono uppercase bg-indigo-50 border border-indigo-100/50 px-3 py-1.5 rounded-full inline-block">TARIF RETRIBUSI RESMI</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E3B66] tracking-tight">Legalitas Tarif & Biaya Administrasi</h3>
                </div>

                <div className="space-y-6">
                  {/* Legal base card */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 flex items-start gap-5 border-l-4 border-emerald-500 shadow-xs">
                    <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 shrink-0">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-950 text-base leading-none mb-2">Peraturan Daerah Tentang Retribusi</h4>
                      <p className="text-slate-500 text-sm leading-relaxed font-inter font-light">
                        Penetapan tarif penggunaan retribusi pemanfaatan sewa fasilitas gedung olahraga daerah serta retribusi tanda masuk tempat rekreasi pariwisata bahari didasarkan pada draf regulasi <span className="font-bold text-slate-900">Peraturan Daerah Kota Tegal No. 5 Tahun 2021</span>. Biaya retribusi disetor langsung menuju kas daerah secara sah.
                      </p>
                    </div>
                  </div>

                  {/* Table containing all retribusis */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm font-inter">
                        <thead>
                          <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-200">
                            <th className="py-3.5 px-4 sm:py-4.5 sm:px-6 w-16 text-center">No</th>
                            <th className="py-3.5 px-4 sm:py-4.5 sm:px-6">Fasilitas / Layanan</th>
                            <th className="py-3.5 px-4 sm:py-4.5 sm:px-6 w-36">Kategori</th>
                            <th className="py-3.5 px-4 sm:py-4.5 sm:px-6 w-56 text-right">Tarif / Biaya</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {retribusi && retribusi.length > 0 ? (
                            retribusi.map((item, idx) => (
                              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4 sm:py-4 sm:px-6 text-center font-mono text-slate-400">{idx + 1}</td>
                                <td className="py-3 px-4 sm:py-4 sm:px-6 font-bold text-[#0E3B66]">{item.name}</td>
                                <td className="py-3 px-4 sm:py-4 sm:px-6">
                                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase font-mono tracking-wider ${item.category === 'Olahraga' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                    item.category === 'Kepemudaan' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                      'bg-amber-50 text-amber-700 border border-amber-100'
                                    }`}>
                                    {item.category}
                                  </span>
                                </td>
                                <td className="py-3 px-4 sm:py-4 sm:px-6 text-right font-mono text-slate-900 font-bold">{item.fee}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                                Belum ada data tarif retribusi terdaftar.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* General info cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-extrabold text-slate-900 text-sm leading-tight">Biaya SOP Administrasi/Rekomendasi</h5>
                        <p className="text-xs text-slate-500 mt-1 font-inter">Seluruh pendaftaran komunitas pemuda atau rekomendasi dinas berbiaya Rp 0 (GRATIS).</p>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-extrabold text-slate-900 text-sm leading-tight">Penyetoran Kas Daerah Langsung</h5>
                        <p className="text-xs text-slate-500 mt-1 font-inter">Segala sewa prasarana lapangan wajib terlampir kuintansi billing resmi perbankan daerah (Bank Jateng).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </section>

    </div>
  );
}
