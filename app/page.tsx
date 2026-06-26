'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  ExternalLink,
  Trophy,
  Users,
  User,
  Eye,
  FileText,
  Shield,
  MessageSquare,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  X,
  Download,
  Star,
  Activity,
  Heart,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';
import {
  YOUTH_PROGRAMS,
  SPORTS_VENUES
} from '@/lib/data';
import {
  useNews,
  useEvents,
  useGallery,
  usePublicServices,
  useOfficeInfo,
  useHeroSlides,
  useHomepageSettings,
  usePriorityPrograms
} from '@/lib/data-store';
import { parseIndonesianDate } from '@/lib/utils';

// Get today's date in WIB (UTC+7) as a plain date (no time)
function getTodayWIB(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wibDate = new Date(utc + 7 * 60 * 60000);
  return new Date(wibDate.getFullYear(), wibDate.getMonth(), wibDate.getDate());
}

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

export default function HomePage() {
  const [newsList] = useNews();
  const [eventsList] = useEvents();
  const [galleryPhotos] = useGallery();
  const [publicServices] = usePublicServices();
  const [officeInfo] = useOfficeInfo();
  const [heroSlides] = useHeroSlides();
  const [homepageSettings] = useHomepageSettings();
  const [priorityPrograms] = usePriorityPrograms();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [activeNewsDetail, setActiveNewsDetail] = useState<any>(null);
  const [isGalleryPaused, setIsGalleryPaused] = useState(false);

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



  // Lock background body scroll when modal is active
  useEffect(() => {
    if (selectedPhoto || activeNewsDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPhoto, activeNewsDetail]);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handlePrevSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // Sort homepage events from newest to oldest and limit to max 4
  const homepageEvents = [...eventsList]
    .filter(event => event.showOnHomepage !== false)
    .sort((a, b) => {
      try {
        return parseIndonesianDate(b.date).getTime() - parseIndonesianDate(a.date).getTime();
      } catch {
        return 0;
      }
    })
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] selection:bg-primary selection:text-white font-sans overflow-x-hidden">

      {/* 1. CINEMATIC HERO BANNER - DYNAMIC */}
      <section className="relative h-[78vh] sm:h-[80vh] lg:h-[82vh] min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* Slide backgrounds */}
        {heroSlides.length > 0 && heroSlides[currentSlide] && (
          <AnimatePresence>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.70, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              {heroSlides[currentSlide].image ? (
                <Image
                  src={heroSlides[currentSlide].image}
                  alt="Visual DISPORAPAR"
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c2c4e] via-[#0E3B66] to-[#1e4e7e]" />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Ambient Overlays */}
        <div className="absolute inset-0 bg-slate-950/45 z-10" />

        {/* Main Hero Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col items-center justify-center text-center pt-20 sm:pt-24 pb-16">
          {heroSlides.length > 0 && heroSlides[currentSlide] ? (
            <div className="flex flex-col items-center max-w-4xl">
              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
                {heroSlides[currentSlide].title}
              </h1>

              {/* Value Proposition Description */}
              <p className="text-slate-200 text-xs sm:text-sm md:text-base font-inter max-w-2xl mb-8 leading-relaxed font-light">
                {/*Dinas Kepemudaan, Olahraga, dan Pariwisata Kota Tegal berkomitmen membangun kepemudaan kreatif, membina keolahragaan prestasi, serta memajukan destinasi wisata maritim yang unggul dan berdaya saing.*/}
              </p>

              {/* Redesigned CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 w-full sm:w-auto">
                <Link
                  href={heroSlides[currentSlide].href}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6.5 py-3.5 bg-accent hover:bg-orange-500 text-white rounded-xl font-extrabold font-mono text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer"
                >
                  <span>{heroSlides[currentSlide].cta}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
                <a
                  href="#agenda-section"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6.5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md rounded-xl font-extrabold font-mono text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                >
                  <span>Agenda Terdekat</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
                DISPORAPAR Kota Tegal
              </h1>
            </div>
          )}
        </div>

        {/* Left & Right Navigation Buttons */}
        {heroSlides.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hidden sm:flex items-center justify-center transition-all backdrop-blur-md cursor-pointer group active:scale-95"
              aria-label="Slide Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hidden sm:flex items-center justify-center transition-all backdrop-blur-md cursor-pointer group active:scale-95"
              aria-label="Slide Berikutnya"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* Playful Bottom Fade Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />

        {/* Slide Indicators */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30 px-3.5 py-2 rounded-full bg-slate-950/35 border border-white/10 backdrop-blur-md shadow-lg">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${currentSlide === idx ? 'w-6 bg-accent' : 'w-1.5 bg-white/55 hover:bg-white/80'
                  }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. QUICK ACCESS SERVICES */}
      <section className="relative z-30 -mt-12 sm:-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl border border-slate-100">
          <div className="text-center md:text-left mb-8">
            <span className="text-[10px] font-bold tracking-widest text-[#F2994A] uppercase bg-orange-50 border border-orange-100/50 px-3 py-1 rounded-full inline-block font-mono mb-2">
              AKSES UTAMA LAYANAN
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#0E3B66] tracking-tight">
              Layanan & Informasi Cepat
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {/* Profil */}
            <Link
              href="/profil"
              className="group flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#2F80ED] mb-3.5 transition-all duration-300 group-hover:scale-105">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0E3B66] tracking-tight leading-snug font-sans">
                Profil
              </h3>
            </Link>

            {/* Layanan Publik */}
            <Link
              href="/pelayanan"
              className="group flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EEFBF3] flex items-center justify-center text-[#27AE60] mb-3.5 transition-all duration-300 group-hover:scale-105">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0E3B66] tracking-tight leading-snug font-sans">
                Layanan Publik
              </h3>
            </Link>

            {/* Formulir & Unduhan */}
            <Link
              href="/pelayanan/berkas"
              className="group flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF4E5] flex items-center justify-center text-[#F2994A] mb-3.5 transition-all duration-300 group-hover:scale-105">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0E3B66] tracking-tight leading-snug font-sans">
                Formulir & Unduhan
              </h3>
            </Link>

            {/* Agenda Kegiatan */}
            <a
              href="#agenda-section"
              className="group flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#ECEBFF] flex items-center justify-center text-[#6F57E3] mb-3.5 transition-all duration-300 group-hover:scale-105">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0E3B66] tracking-tight leading-snug font-sans">
                Agenda Kegiatan
              </h3>
            </a>

            {/* Destinasi Wisata */}
            <Link
              href="/pariwisata"
              className="group flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E6F9F5] flex items-center justify-center text-[#00A389] mb-3.5 transition-all duration-300 group-hover:scale-105">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0E3B66] tracking-tight leading-snug font-sans">
                Destinasi Wisata
              </h3>
            </Link>

            {/* Kontak Dinas */}
            <Link
              href="/kontak"
              className="group flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFEBF0] flex items-center justify-center text-[#EB5757] mb-3.5 transition-all duration-300 group-hover:scale-105">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0E3B66] tracking-tight leading-snug font-sans">
                Kontak Dinas
              </h3>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ABOUT DISPORAPAR & STATISTICS */}
      {homepageSettings.about.show && (
        <section className="py-16 bg-white bg-grid-dots relative z-20 overflow-hidden">
          {/* Ambient Decorative Glows */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Intro on Left */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] uppercase bg-blue-50 border border-blue-105 px-3 py-1 rounded-full inline-block font-mono">
                  {homepageSettings.about.subtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E3B66] tracking-tight leading-tight">
                  {homepageSettings.about.title}
                </h2>
                <p className="text-slate-500 text-sm sm:text-base font-light leading-relaxed font-inter">
                  {homepageSettings.about.desc}
                </p>
                <div className="pt-2">
                  <Link
                    href="/profil"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest font-mono transition-all group"
                  >
                    <span>Selengkapnya Profil Kami</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Stats Dashboard on Right */}
              <div className="lg:col-span-7 bg-[#F8FAFC] border border-slate-100 rounded-[2rem] p-6 sm:p-7 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {homepageSettings.about.stats?.map((stat, idx) => {
                    const icons = [
                      <Compass className="w-5 h-5" key="stat-0" />,
                      <Calendar className="w-5 h-5" key="stat-1" />,
                      <Users className="w-5 h-5" key="stat-2" />,
                      <Trophy className="w-5 h-5" key="stat-3" />
                    ];
                    const styles = [
                      { bg: 'bg-orange-50/80 border border-orange-100', text: 'text-accent' },
                      { bg: 'bg-blue-50/80 border border-blue-100', text: 'text-[#2D9CDB]' },
                      { bg: 'bg-emerald-50/80 border border-emerald-100', text: 'text-emerald-600' },
                      { bg: 'bg-rose-50/80 border border-rose-100', text: 'text-rose-500' }
                    ];
                    const icon = icons[idx % icons.length];
                    const style = styles[idx % styles.length];

                    return (
                      <div key={idx} className="flex gap-4 p-5 bg-white rounded-[1rem] border border-slate-100 text-left items-center h-full">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
                          {icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xl sm:text-2xl font-black text-[#0E3B66] tracking-tight font-mono">
                            {stat.value}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 leading-tight">
                            {stat.label}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. UPCOMING EVENTS & AGENDA */}
      {homepageSettings.agenda.show && (
        <section id="agenda-section" className="py-16 bg-[#F5F7FA] relative scroll-mt-20 border-t border-slate-100 overflow-hidden">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-primary/3 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/4 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
              <div className="max-w-xl text-left">
                <span className="text-[10px] font-bold tracking-widest text-[#F2994A] uppercase bg-orange-50 border border-orange-100 px-3 py-1 rounded-full inline-block mb-3 font-mono">
                  {homepageSettings.agenda.subtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E3B66] tracking-tight leading-tight">
                  {homepageSettings.agenda.title}
                </h2>
                <p className="mt-3 text-slate-500 font-light text-sm sm:text-base leading-relaxed font-inter">
                  {homepageSettings.agenda.desc}
                </p>
              </div>
              <Link
                href="/agenda"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest font-mono transition-colors group shrink-0"
              >
                <span>Semua Agenda</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>

            {/* Responsive 2-column Card Grid */}
            <div className="flex flex-wrap justify-center gap-8 py-2">
              {homepageEvents.map((event) => {
                let parsedDate: Date | null = null;
                try { parsedDate = parseIndonesianDate(event.date); } catch { }
                const dayNum = parsedDate ? parsedDate.getDate().toString().padStart(2, '0') : '--';

                const getIndoMonthShort = (date: Date) => {
                  const list = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
                  return list[date.getMonth()] || 'JUN';
                };
                const monthShort = parsedDate ? getIndoMonthShort(parsedDate) : '';
                const yearNum = parsedDate ? parsedDate.getFullYear() : '2026';

                // All cards have navy dark title by default and transition to orange on hover to be consistent
                const titleColorClass = 'text-[#0E3B66] group-hover:text-[#F3702A]';

                return (
                  <div
                    key={event.id}
                    className="group relative flex flex-row bg-white rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out w-full lg:w-[calc(50%-16px)] max-w-2xl font-sans"
                  >
                    {/* Status Badge in Top-Right Corner */}
                    {(() => {
                      let isPast = false;
                      try {
                        if (parsedDate) {
                          isPast = parsedDate.getTime() < todayWIB.getTime();
                        }
                      } catch { }
                      return isPast ? (
                        <span className="absolute top-4 right-4 inline-flex items-center text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full z-10 shadow-sm">
                          Selesai
                        </span>
                      ) : (
                        <span className="absolute top-4 right-4 inline-flex items-center text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full z-10 shadow-sm">
                          Mendatang
                        </span>
                      );
                    })()}

                    {/* Left Date Panel */}
                    <div className="shrink-0 w-[88px] sm:w-[96px] bg-[#0F3D6E] flex flex-col items-center justify-center select-none text-center px-3">
                      <div className="text-3xl sm:text-[34px] font-extrabold text-white leading-none tracking-tight font-sans">
                        {dayNum}
                      </div>
                      <div className="text-[#F2994A] font-extrabold text-[11px] sm:text-[12px] tracking-widest uppercase mt-2 leading-none font-sans">
                        {monthShort}
                      </div>
                      <div className="text-white/60 text-[9px] sm:text-[10px] mt-2 font-medium leading-none font-sans">
                        {yearNum}
                      </div>
                    </div>

                    {/* Right Content Panel */}
                    <div className="flex-grow px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col justify-between text-left">
                      {/* Top row: time pill */}
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] text-[#0F3D6E] text-[10px] sm:text-xs font-bold tracking-wide font-mono uppercase border border-[#E2E8F0]">
                          <Clock className="w-3.5 h-3.5 text-[#F3702A] shrink-0" />
                          <span>{event.time}</span>
                        </span>
                      </div>

                      {/* Middle row: event title */}
                      <h3 className={`font-bold text-[16px] sm:text-[18px] md:text-[19px] leading-snug tracking-tight font-sans line-clamp-2 transition-colors duration-300 ${titleColorClass} mt-2 mb-2 pr-16`}>
                        {event.title}
                      </h3>

                      {/* Bottom row: location details */}
                      {event.location && (
                        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 font-medium font-sans border-t border-slate-100 pt-2">
                          <MapPin className="w-4 h-4 text-[#F3702A] shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* 6. PRIORITY PROGRAMS */}
      {homepageSettings.programs.show && (
        <section className="py-16 bg-slate-50/60 bg-grid-lines relative overflow-hidden border-t border-slate-100">
          {/* Ambient Decorative Glows */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block font-mono">
                {homepageSettings.programs.subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E3B66] tracking-tight mt-4">
                {homepageSettings.programs.title}
              </h2>
              <p className="mt-4 text-slate-500 text-sm sm:text-base font-light leading-relaxed font-inter">
                {homepageSettings.programs.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[...priorityPrograms]
                .sort((a, b) => a.id.localeCompare(b.id))
                .map((prog, idx) => {
                  const getIconComponent = (i: number) => {
                    switch (i % 3) {
                      case 0: return <Compass className="h-6 w-6" />;
                      case 1: return <Users className="h-6 w-6" />;
                      case 2: return <Trophy className="h-6 w-6" />;
                      default: return <Compass className="h-6 w-6" />;
                    }
                  };

                  const styles = [
                    {
                      borderHover: 'hover:border-accent',
                      iconContainer: 'bg-orange-50 text-accent border border-orange-100/50',
                      bullet: 'bg-accent',
                      href: '/pariwisata'
                    },
                    {
                      borderHover: 'hover:border-emerald-500',
                      iconContainer: 'bg-emerald-50 text-emerald-600 border border-emerald-100/50',
                      bullet: 'bg-emerald-500',
                      href: '/kepemudaan'
                    },
                    {
                      borderHover: 'hover:border-[#0E3B66]',
                      iconContainer: 'bg-blue-50 text-[#0E3B66] border border-blue-100',
                      bullet: 'bg-[#0E3B66]',
                      href: '/olahraga'
                    }
                  ];
                  const style = styles[idx % styles.length];
                  const icon = getIconComponent(idx);

                  return (
                    <div
                      key={prog.id}
                      className={`group bg-white rounded-2xl p-8 border border-slate-100 transition-all duration-300 flex flex-col justify-between hover:shadow-lg text-center ${style.borderHover}`}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 mx-auto ${style.iconContainer}`}>
                          {icon}
                        </div>
                        <h3 className="text-xl font-bold text-[#0E3B66] tracking-tight text-center">
                          {prog.title}
                        </h3>
                        <p className="mt-3 text-xs sm:text-sm text-slate-550 font-light leading-relaxed font-inter mb-6 text-center max-w-sm">
                          {prog.description}
                        </p>
                        <div className="w-full flex justify-center text-left">
                          <ul className="space-y-2.5 font-inter text-xs text-slate-650">
                            {prog.points?.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${style.bullet}`} />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-8 pt-5 border-t border-slate-100 flex justify-center">
                        <Link
                          href={style.href}
                          className="inline-flex items-center gap-1.5 font-bold text-xs text-[#0E3B66] uppercase tracking-widest font-mono hover:text-accent transition-colors"
                        >
                          <span>Selengkapnya</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* 7. LATEST NEWS & DOCUMENTATION */}
      {homepageSettings.news.show && (
        <section className="py-16 bg-white bg-grid-dots relative overflow-hidden border-t border-slate-100">
          {/* Ambient Decorative Glows */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-accent/4 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
              <div className="max-w-xl text-left">
                <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] uppercase bg-blue-50 border border-blue-105 px-3 py-1 rounded-full inline-block mb-3 font-mono">
                  {homepageSettings.news.subtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E3B66] tracking-tight leading-tight">
                  {homepageSettings.news.title}
                </h2>
                <p className="mt-3 text-slate-500 font-light text-sm sm:text-base leading-relaxed font-inter">
                  {homepageSettings.news.desc}
                </p>
              </div>
              <Link
                href="/berita"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest font-mono transition-colors group"
              >
                <span>Semua Berita</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {[...newsList]
                .filter(item => item.showOnHomepage !== false)
                .sort((a, b) => parseIndonesianDate(b.date).getTime() - parseIndonesianDate(a.date).getTime())
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group w-full max-w-sm mx-auto"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4">
                          <ImageIcon className="w-8 h-8 opacity-60 text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 font-mono">Gambar Tidak Tersedia</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-2.5 py-1 text-[9px] font-bold text-white bg-[#0E3B66]/90 tracking-widest uppercase rounded-lg shadow-sm backdrop-blur-md font-mono">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* News Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center gap-3 text-[10px] sm:text-xs text-slate-400 mb-2 font-mono">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                        <h3 className="font-extrabold text-base sm:text-lg text-[#0E3B66] font-sans tracking-tight group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => setActiveNewsDetail(item)}
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
          </div>
        </section>
      )}

      {/* 7b. GALLERY VISUAL KEGIATAN */}
      {homepageSettings.gallery.show && (
        <section className="py-16 bg-white bg-grid-dots relative overflow-hidden border-t border-slate-100">
          {/* Ambient Decorative Glows */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-accent/4 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] uppercase bg-blue-50 border border-blue-105 px-3 py-1 rounded-full inline-block font-mono">
                {homepageSettings.gallery.subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E3B66] tracking-tight mt-4">
                {homepageSettings.gallery.title}
              </h2>
              <p className="mt-4 text-slate-500 text-sm font-light leading-relaxed font-inter">
                {homepageSettings.gallery.desc}
              </p>
            </div>
          </div>

          {/* Full-width Gallery Marquee Container (Edge to Edge) */}
          <div className="w-full overflow-hidden py-4 select-none">
            <div
              className="flex overflow-hidden"
              onMouseEnter={() => setIsGalleryPaused(true)}
              onMouseLeave={() => setIsGalleryPaused(false)}
              onTouchStart={() => setIsGalleryPaused(true)}
              onTouchEnd={() => setIsGalleryPaused(false)}
            >
              <div
                className={`flex gap-4 w-max animate-marquee ${isGalleryPaused || selectedPhoto ? 'animate-marquee-paused' : 'hover:animate-marquee-paused'
                  }`}
              >
                {/* Duplicated list of gallery photos for infinite loop */}
                {(() => {
                  const visiblePhotos = galleryPhotos.filter(photo => photo.showOnHomepage !== false).slice(0, 5);
                  if (visiblePhotos.length === 0) return null;

                  // If fewer than 5 photos, repeat them until we have at least 5
                  let list = [...visiblePhotos];
                  while (list.length < 5) {
                    list = [...list, ...visiblePhotos];
                  }

                  return [...list, ...list].map((photo, idx) => (
                    <div
                      key={`${photo.id}-${idx}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling the marquee state
                        setSelectedPhoto(photo);
                      }}
                      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 aspect-square w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 flex-shrink-0"
                    >
                      {/* Visual Image container with Next.js Image component */}
                      <div className="relative w-full h-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        {photo.imageUrl ? (
                          <Image
                            src={photo.imageUrl}
                            alt={photo.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
                            <ImageIcon className="w-8 h-8 opacity-60 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 font-mono">Gambar Tidak Tersedia</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between text-left">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold text-white bg-primary hover:bg-opacity-90 w-max uppercase tracking-widest font-mono">
                              {photo.category}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <h4 className="font-bold text-xs sm:text-sm text-white leading-snug tracking-tight line-clamp-2">
                              {photo.title}
                            </h4>
                            <div className="flex items-center gap-1 text-white self-end mt-1">
                              <Eye className="w-3.5 h-3.5 shrink-0 text-white" />
                              <span className="text-[10px] font-bold tracking-wider font-mono uppercase leading-none">Buka Detail</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* Start a new max-w-7xl container for the "Seluruh Galeri Foto" button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="text-center">
              <Link
                href="/galeri"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all font-mono"
              >
                <span>Seluruh Galeri Foto</span>
                <ImageIcon className="w-4 h-4 text-slate-500" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 8. PUBLIC SERVICES & DOWNLOADS */}
      {homepageSettings.documents.show && (
        <section className="py-16 bg-slate-50/60 bg-grid-lines relative overflow-hidden border-t border-slate-100">
          {/* Ambient Decorative Glows */}
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column Intro */}
              <div className="lg:col-span-4 space-y-5 text-left">
                <span className="text-[10px] font-bold tracking-widest text-[#10B981] uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-block font-mono">
                  {homepageSettings.documents.subtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E3B66] tracking-tight leading-tight">
                  {homepageSettings.documents.title}
                </h2>
                <p className="text-slate-500 text-sm font-light leading-relaxed font-inter">
                  {homepageSettings.documents.desc}
                </p>
                <div className="pt-2">
                  <Link
                    href="/pelayanan/berkas"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest font-mono transition-colors group"
                  >
                    <span>Seluruh Berkas Layanan</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column Grid/Container - Simplified list with 3 samples */}
              <div className="lg:col-span-8">
                <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-100 shadow-md">
                  <div className="flex items-center pb-4 mb-4 border-b border-slate-100 font-mono">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Berkas Pilihan Utama</span>
                  </div>

                  {/* Simplified list with exactly 3 items, no scrollbar */}
                  <div className="space-y-3.5">
                    {publicServices.filter(service => service.showOnHomepage !== false).slice(0, 3).map((service) => (
                      <div
                        key={service.id}
                        className="p-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-500/30 rounded-xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5 min-w-0 flex-1 text-left">
                          {(() => {
                            const format = getFileFormat(service.downloadUrl, service.title);
                            let bgBorderText = 'bg-slate-50 border border-slate-200/60 text-slate-400';
                            if (format === 'pdf') bgBorderText = 'bg-red-50 border border-red-100/60 text-red-650';
                            else if (format === 'word') bgBorderText = 'bg-blue-50 border border-blue-100/60 text-blue-600';
                            else if (format === 'zip') bgBorderText = 'bg-amber-50 border border-amber-100/60 text-amber-600';

                            return (
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${bgBorderText}`}>
                                <FileFormatIcon downloadUrl={service.downloadUrl} title={service.title} className="w-5 h-5" colorClasses="text-current" />
                              </div>
                            );
                          })()}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-[#0E3B66] text-sm sm:text-base leading-snug">
                              {service.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center justify-end shrink-0 w-full sm:w-auto">
                          {!service.downloadUrl || service.downloadUrl === '#' || service.downloadUrl === '' ? (
                            <button
                              disabled
                              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-lg font-mono uppercase tracking-wider cursor-not-allowed border border-slate-200"
                            >
                              <span>Tidak Tersedia</span>
                              <Download className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          ) : (
                            <a
                              href={service.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-[#0c355c] active:bg-[#0a2c4e] px-4 py-2 rounded-lg transition-colors font-mono uppercase tracking-wider shadow-sm"
                            >
                              <span>Unduh</span>
                              <Download className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* PHOTO PREVIEW LIGHTBOX */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center cursor-default"
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black hover:text-accent transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative w-full h-[50vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center">
                {selectedPhoto.imageUrl ? (
                  <Image
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.title}
                    fill
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                    <ImageIcon className="w-12 h-12 opacity-60 text-[#F2994A]" />
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Gambar Tidak Tersedia</span>
                  </div>
                )}
              </div>
              <div className="text-center mt-6 max-w-xl">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold text-[#F2994A] uppercase tracking-widest bg-orange-100/10 border border-orange-200/10 font-mono inline-block">
                  {selectedPhoto.category}
                </span>
                <p className="text-white font-bold text-sm sm:text-base tracking-tight leading-snug mt-2 select-none">
                  {selectedPhoto.title}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    {activeNewsDetail.content.split('\n\n').map((paragraph: string, index: number) => (
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
