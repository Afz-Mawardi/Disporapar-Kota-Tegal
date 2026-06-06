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
  FileText,
  Shield,
  MessageSquare,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Mail,
  X,
  Download,
  Star,
  Activity,
  Heart,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import {
  DESTINATIONS,
  YOUTH_PROGRAMS,
  SPORTS_VENUES
} from '@/lib/data';
import {
  useNews,
  useEvents,
  useGallery,
  usePublicServices,
  useOfficeInfo
} from '@/lib/data-store';
import { parseIndonesianDate } from '@/lib/utils';

export default function HomePage() {
  // Slideshow state
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=2000',
      tagline: 'WONDERFUL INDONESIA',
      title: 'Gerbang Pesona Maritim & Keindahan Pesisir Tegal',
      cta: 'Jelajahi Pariwisata',
      href: '/pariwisata'
    },
    {
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=2000',
      tagline: 'PRESTASI KEOLAHRAGAAN',
      title: 'Kobarkan Semangat Juara di Gelanggang Terbaik',
      cta: 'Sarana Olahraga',
      href: '/olahraga'
    },
    {
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000',
      tagline: 'PEMBERDAYAAN PEMUDA',
      title: 'Kolaborasi Pemuda Pelopor & Wirausaha Kreatif',
      cta: 'Program Kepemudaan',
      href: '/kepemudaan'
    },
    {
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000',
      tagline: 'PELAYANAN PUBLIK',
      title: 'Sistem Informasi & Berkas Layanan Transparan',
      cta: 'Layanan Publik',
      href: '/pelayanan'
    }
  ];

  const [newsList] = useNews();
  const [eventsList] = useEvents();
  const [galleryPhotos] = useGallery();
  const [publicServices] = usePublicServices();
  const [officeInfo] = useOfficeInfo();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [activeNewsDetail, setActiveNewsDetail] = useState<any>(null);

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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] selection:bg-primary selection:text-white font-sans overflow-x-hidden">

      {/* 1. CINEMATIC HERO BANNER - UNCHANGED */}
      <section className="relative h-[95vh] flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* Slide backgrounds */}
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.70, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[currentSlide].image}
              alt="Visual DISPORAPAR"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-slate-950/10 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-transparent to-transparent z-10" />

        {/* Main Hero Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col items-center justify-center text-center pt-14">
          <div className="flex flex-col items-center max-w-4xl">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-white font-mono">
                Portal Resmi DISPORAPAR Kota Tegal
              </span>
            </div>

            {/* Static Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-8">
              Membangun Pemuda Kreatif, Prestasi Olahraga & Pariwisata Bahari
            </h1>

            {/* Prominent CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
              <Link
                href="/kepemudaan"
                className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-white/10 hover:bg-[#7C3AED] hover:border-[#7C3AED] text-white rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all border border-white/20 backdrop-blur-md cursor-pointer w-full sm:w-auto justify-center hover:shadow-lg hover:shadow-violet-600/20 active:scale-95"
              >
                <Users className="w-4 h-4 shrink-0 text-white" />
                <span>Kepemudaan</span>
              </Link>
              <Link
                href="/olahraga"
                className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-white/10 hover:bg-[#0284C7] hover:border-[#0284C7] text-white rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all border border-white/20 backdrop-blur-md cursor-pointer w-full sm:w-auto justify-center hover:shadow-lg hover:shadow-sky-500/20 active:scale-95"
              >
                <Trophy className="w-4 h-4 shrink-0 text-white" />
                <span>Olahraga</span>
              </Link>
              <Link
                href="/pariwisata"
                className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-white/10 hover:bg-[#F2994A] hover:border-[#F2994A] text-white rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all border border-white/20 backdrop-blur-md cursor-pointer w-full sm:w-auto justify-center hover:shadow-lg hover:shadow-orange-500/20 active:scale-95"
              >
                <Compass className="w-4 h-4 shrink-0 text-white" />
                <span>Pariwisata</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Left & Right Navigation Buttons */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all backdrop-blur-md cursor-pointer group active:scale-95"
          aria-label="Slide Sebelumnya"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all backdrop-blur-md cursor-pointer group active:scale-95"
          aria-label="Slide Berikutnya"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Playful Bottom Fade Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 bg-accent' : 'w-2 bg-white/40'
                }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. QUICK ACCESS SERVICES */}
      <section className="relative z-30 -mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-slate-100/80">
          <div className="text-center md:text-left mb-6">
            <span className="text-[10px] font-bold tracking-widest text-[#F2994A] uppercase bg-orange-50 border border-orange-100/50 px-3 py-1 rounded-full inline-block font-mono mb-2">
              AKSES UTAMA LAYANAN
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E3B66] tracking-tight">
              Layanan & Informasi Cepat
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {/* PPID Card */}
            <Link
              href="/profil"
              className="group flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50 hover:bg-[#0E3B66] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-white/10 flex items-center justify-center text-primary group-hover:text-blue-300 mb-4 transition-colors duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-white tracking-tight leading-snug">
                Profil
              </h3>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-200 font-inter font-light hidden sm:block">
                Informasi Publik
              </p>
            </Link>

            {/* Layanan Publik */}
            <Link
              href="/pelayanan"
              className="group flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50 hover:bg-[#0E3B66] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-white/10 flex items-center justify-center text-emerald-600 group-hover:text-emerald-300 mb-4 transition-colors duration-300">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-white tracking-tight leading-snug">
                Layanan Publik
              </h3>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-200 font-inter font-light hidden sm:block">
                SOP & Regulasi
              </p>
            </Link>

            {/* Formulir & Unduhan */}
            <Link
              href="/pelayanan/standar"
              className="group flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50 hover:bg-[#0E3B66] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-white/10 flex items-center justify-center text-[#F2994A] group-hover:text-orange-350 mb-4 transition-colors duration-300">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-white tracking-tight leading-snug">
                Formulir & Unduhan
              </h3>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-200 font-inter font-light hidden sm:block">
                Dokumen Resmi
              </p>
            </Link>

            {/* Agenda Kegiatan */}
            <a
              href="#agenda-section"
              className="group flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50 hover:bg-[#0E3B66] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-white/10 flex items-center justify-center text-indigo-600 group-hover:text-indigo-300 mb-4 transition-colors duration-300">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-white tracking-tight leading-snug">
                Agenda Kegiatan
              </h3>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-200 font-inter font-light hidden sm:block">
                Event Disporapar
              </p>
            </a>

            {/* Destinasi Wisata */}
            <Link
              href="/pariwisata"
              className="group flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50 hover:bg-[#0E3B66] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 group-hover:bg-white/10 flex items-center justify-center text-teal-600 group-hover:text-teal-300 mb-4 transition-colors duration-300">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-white tracking-tight leading-snug">
                Destinasi Wisata
              </h3>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-200 font-inter font-light hidden sm:block">
                Bahari & Kuliner
              </p>
            </Link>

            {/* Kontak Disporapar */}
            <Link
              href="/hubungi-kami"
              className="group flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50 hover:bg-[#0E3B66] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 group-hover:bg-white/10 flex items-center justify-center text-rose-500 group-hover:text-rose-350 mb-4 transition-colors duration-300">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-white tracking-tight leading-snug">
                Kontak Dinas
              </h3>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-200 font-inter font-light hidden sm:block">
                Hubungi Kami
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ABOUT DISPORAPAR & STATISTICS */}
      <section className="py-24 bg-white bg-grid-dots relative z-20 overflow-hidden">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Intro on Left */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] uppercase bg-blue-50 border border-blue-105 px-3 py-1 rounded-full inline-block font-mono">
                TENTANG KAMI
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E3B66] tracking-tight leading-tight">
                Membangun Tegal Bersama DISPORAPAR
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-light leading-relaxed font-inter">
                DISPORAPAR Kota Tegal berkomitmen mengembangkan pemuda, meningkatkan prestasi olahraga, dan memajukan pariwisata untuk mendukung kesejahteraan masyarakat.
              </p>
              <div className="pt-2">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest font-mono transition-all group"
                >
                  <span>Selengkapnya Tentang Profil Kami</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Stats Dashboard on Right */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              {/* Stat 1 */}
              <div className="flex gap-4 p-5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-100/80 hover:shadow-md transition-all duration-300 text-left items-start">
                <div className="w-10 h-10 rounded-xl bg-orange-50/80 border border-orange-100 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-[#0E3B66] tracking-tight font-mono">
                    15+
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 leading-tight">
                    Destinasi Wisata
                  </h4>
                  <p className="text-[10px] text-slate-400 font-inter mt-1 leading-snug">
                    Potensi alam, budaya & sejarah
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex gap-4 p-5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-100/80 hover:shadow-md transition-all duration-300 text-left items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#2D9CDB] shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-[#0E3B66] tracking-tight font-mono">
                    40+
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 leading-tight">
                    Event Tahunan
                  </h4>
                  <p className="text-[10px] text-slate-400 font-inter mt-1 leading-snug">
                    Rangkaian festival & agenda daerah
                  </p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex gap-4 p-5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-100/80 hover:shadow-md transition-all duration-300 text-left items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-[#0E3B66] tracking-tight font-mono">
                    25+
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 leading-tight">
                    Komunitas Pemuda
                  </h4>
                  <p className="text-[10px] text-slate-400 font-inter mt-1 leading-snug">
                    Klub kreatif & mitra kepemudaan
                  </p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex gap-4 p-5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-100/80 hover:shadow-md transition-all duration-300 text-left items-start">
                <div className="w-10 h-10 rounded-xl bg-rose-50/80 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-[#0E3B66] tracking-tight font-mono">
                    10+
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 leading-tight">
                    Cabang Olahraga Binaan
                  </h4>
                  <p className="text-[10px] text-slate-400 font-inter mt-1 leading-snug">
                    Sentra atlet & prasarana olahraga
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED TOURISM DESTINATIONS */}
      <section className="py-24 bg-slate-50/60 bg-grid-lines relative overflow-hidden border-t border-slate-100">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl text-left">
              <span className="text-[10px] font-bold tracking-widest text-[#F2994A] uppercase bg-orange-50 border border-orange-100 px-3 py-1 rounded-full inline-block mb-3 font-mono">
                EKSPLORASI TEGAL
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E3B66] tracking-tight leading-tight">
                Destinasi Wisata Pilihan
              </h2>
              <p className="mt-3 text-slate-500 font-light text-sm sm:text-base leading-relaxed font-inter">
                Pesona keindahan pesisir pantai maritim, budaya kearifan lokal, serta sajian wisata kuliner autentik Kota Tegal.
              </p>
            </div>
            <Link
              href="/pariwisata"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest font-mono transition-colors group"
            >
              <span>Lihat Semua Destinasi</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DESTINATIONS.slice(0, 3).map((dest) => (
              <div
                key={dest.id}
                id={`dest-${dest.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Container with zoom */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <Image
                    src={dest.imageUrl}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    sizes="(max-w-768px) 100vw, 33vw"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 text-[9px] font-bold text-white bg-primary/95 tracking-widest uppercase rounded-lg shadow-sm backdrop-blur-md font-mono">
                      {dest.category}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors duration-200">
                      {dest.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-550 leading-relaxed font-inter line-clamp-2">
                      {dest.description}
                    </p>

                    {/* Stats Rows */}
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-inter">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">{dest.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-secondary shrink-0" />
                        <span>{dest.operationalHours}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/pariwisata"
                      className="w-full text-center py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all block font-mono"
                    >
                      Detail Wisata
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. UPCOMING EVENTS & AGENDA */}
      <section id="agenda-section" className="py-24 bg-white bg-grid-dots relative scroll-mt-20 border-t border-slate-100 overflow-hidden">
        {/* Ambient Decorative Glows */}
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/4 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/3 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl text-left">
              <span className="text-[10px] font-bold tracking-widest text-[#2D9CDB] uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block mb-3 font-mono">
                AGENDA UTAMA DINAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E3B66] tracking-tight leading-tight">
                Event & Agenda Mendatang
              </h2>
              <p className="mt-3 text-slate-500 font-light text-sm sm:text-base leading-relaxed font-inter">
                Agenda resmi, festival tahunan pemuda kreatif, kompetisi olahraga, serta forum rapat terbuka DISPORAPAR Kota Tegal.
              </p>
            </div>
            <Link
              href="/agenda"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest font-mono transition-colors group self-start md:self-end"
            >
              <span>Semua Agenda</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {eventsList.slice(0, 4).map((event) => (
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
      </section>

      {/* 6. PRIORITY PROGRAMS */}
      <section className="py-24 bg-slate-50/60 bg-grid-lines relative overflow-hidden border-t border-slate-100">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block font-mono">
              PROGRAM UNGGULAN DINAS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E3B66] tracking-tight mt-4">
              Pilar Program Prioritas
            </h2>
            <p className="mt-4 text-slate-500 text-sm sm:text-base font-light leading-relaxed font-inter">
              Fokus strategis pembangunan yang diimplementasikan secara akuntabel, transparan, dan berkelanjutan untuk Kota Tegal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pariwisata Card */}
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-accent transition-all duration-300 flex flex-col justify-between hover:shadow-lg text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-accent mb-6 border border-orange-100/50 mx-auto">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0E3B66] tracking-tight text-center">Pariwisata Bahari & Religi</h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-500 font-light leading-relaxed font-inter mb-6 text-center max-w-sm">
                  Revitalisasi pariwisata bahari PAI terpadu, pengembangan wisata religi cagar sejarah Alun-alun & Taman Pancasila serta sertifikasi pembinaan usaha kuliner legendaris Tegal.
                </p>
                <div className="w-full flex justify-center text-left">
                  <ul className="space-y-2.5 font-inter text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>Kampung Seni & Galeri Wisata PAI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>Lembaga Pengelola Usaha Pariwisata (TDUP)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>Festival Pesisir & Kuliner Tahunan</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-5 border-t border-slate-100 flex justify-center">
                <Link
                  href="/pariwisata"
                  className="inline-flex items-center gap-1.5 font-bold text-xs text-[#0E3B66] uppercase tracking-widest font-mono hover:text-accent transition-colors"
                >
                  <span>Selengkapnya</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Kepemudaan Card */}
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between hover:shadow-lg text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100/50 mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0E3B66] tracking-tight text-center">Pemberdayaan Pemuda Kreatif</h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-500 font-light leading-relaxed font-inter mb-6 text-center max-w-sm">
                  Menjaring ekosistem wirausaha muda terdidik dalam program Akselerator AWMT, pembinaan berkelanjutan KNPI/OK, pembekalan Paskibraka serta inkubasi Youth Creative Hub.
                </p>
                <div className="w-full flex justify-center text-left">
                  <ul className="space-y-2.5 font-inter text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Akselerator Wirausaha Muda (AWMT)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Seleksi & Pendidikan Paskibraka</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Tegal Youth Co-Working Space</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-5 border-t border-slate-100 flex justify-center">
                <Link
                  href="/kepemudaan"
                  className="inline-flex items-center gap-1.5 font-bold text-xs text-[#0E3B66] uppercase tracking-widest font-mono hover:text-accent transition-colors"
                >
                  <span>Selengkapnya</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Olahraga Card */}
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-secondary transition-all duration-300 flex flex-col justify-between hover:shadow-lg text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-secondary mb-6 border border-blue-100 mx-auto">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0E3B66] tracking-tight text-center">Prestasi Olahraga Berkelanjutan</h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-500 font-light leading-relaxed font-inter mb-6 text-center max-w-sm">
                  Pembinaan atlet andalan daerah persiapan PORPROV & PON, standardisasi prasarana Stadion Yos Sudarso & GOR Wisanggeni serta transparansi sewa venue olahraga digital.
                </p>
                <div className="w-full flex justify-center text-left">
                  <ul className="space-y-2.5 font-inter text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <span>Pembinaan Atlet Pelari & Cabor Unggulan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <span>Sewa Fasilitas Stadion & Kolam Olympic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <span>Fasilitasi Insentif Bonus Medali Atlet</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-5 border-t border-slate-100 flex justify-center">
                <Link
                  href="/olahraga"
                  className="inline-flex items-center gap-1.5 font-bold text-xs text-[#0E3B66] uppercase tracking-widest font-mono hover:text-accent transition-colors"
                >
                  <span>Selengkapnya</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LATEST NEWS & DOCUMENTATION */}
      <section className="py-24 bg-white bg-grid-dots relative overflow-hidden border-t border-slate-100">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-accent/4 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl text-left">
              <span className="text-[10px] font-bold tracking-widest text-[#0E3B66] uppercase bg-blue-50 border border-blue-105 px-3 py-1 rounded-full inline-block mb-3 font-mono">
                BERITA TERBARU & PENGUMUMAN
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E3B66] tracking-tight leading-tight">
                Kabar Kegiatan Terkini
              </h2>
              <p className="mt-3 text-slate-500 font-light text-sm sm:text-base leading-relaxed font-inter">
                Informasi berita resmi, liputan pers, pengumuman regulasi, pembangunan fasilitas di lingkungan DISPORAPAR Kota Tegal.
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...newsList]
              .sort((a, b) => parseIndonesianDate(b.date).getTime() - parseIndonesianDate(a.date).getTime())
              .slice(0, 3)
              .map((item) => (
                <div
                  key={item.id}
                  className="group bg-slate-55 rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-w-768px) 100vw, 33vw"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-2.5 py-1 text-[9px] font-bold text-white bg-[#0E3B66]/90 tracking-widest uppercase rounded-lg shadow-sm backdrop-blur-md font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* News Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <span className="text-[10px] font-bold text-[#F2994A] font-mono tracking-wider">{item.date}</span>
                      <h3 className="text-base font-bold text-[#0E3B66] group-hover:text-primary transition-colors leading-snug tracking-tight mt-2 line-clamp-3">
                        {item.title}
                      </h3>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 flex">
                      <button
                        type="button"
                        onClick={() => setActiveNewsDetail(item)}
                        className="inline-flex items-center gap-1.5 font-extrabold text-xs text-primary hover:text-secondary uppercase tracking-widest font-mono transition-colors cursor-pointer"
                      >
                        <span>Baca Selengkapnya</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Activity Gallery Inline */}
          <div className="mt-16 pt-16 border-t border-slate-200">
            <h3 className="text-xl font-bold text-[#0E3B66] text-center mb-8">
              Suasana & Dokumentasi Nyata
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {galleryPhotos.slice(0, 4).map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm cursor-pointer"
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                    sizes="(max-w-768px) 50vw, 25vw"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-slate-950/40 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between text-left">
                    <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold text-white bg-[#0E3B66] hover:bg-opacity-90 w-max uppercase tracking-widest font-mono">
                      {photo.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-white">
                      <ImageIcon className="w-3.5 h-3.5 shrink-0 text-white" />
                      <span className="text-[10px] font-bold truncate tracking-wider font-mono uppercase leading-none">Buka Detail</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/galeri"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all font-mono"
              >
                <span>Seluruh Galeri Foto</span>
                <ImageIcon className="w-4 h-4 text-slate-500" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 8. PUBLIC SERVICES & DOWNLOADS */}
      <section className="py-24 bg-slate-50/60 bg-grid-lines relative overflow-hidden border-t border-slate-100">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Intro */}
            <div className="lg:col-span-4 space-y-5 text-left">
              <span className="text-[10px] font-bold tracking-widest text-[#10B981] uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-block font-mono">
                DOKUMEN RESMI DINAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E3B66] tracking-tight leading-tight">
                Berkas & Formulir Layanan
              </h2>
              <p className="text-slate-500 text-sm font-light leading-relaxed font-inter">
                Silakan cari dan unduh berkas standar operasional prosedur (SOP) secara mandiri di bawah ini secara cuma-cuma, bebas biaya, transparan dan berlandaskan kepatuhan bebas pungutan liar.
              </p>
              <div className="pt-2">
                <Link
                  href="/pelayanan/standar"
                  className="px-5 py-3 rounded-xl bg-primary hover:bg-[#0c355c] text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center gap-2 justify-center w-max font-mono"
                >
                  <span>Seluruh Berkas Layanan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
                  {publicServices.slice(0, 3).map((service) => (
                    <div
                      key={service.id}
                      className="p-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-500/30 rounded-xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 min-w-0 flex-1 text-left">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100/60 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-[#0E3B66] text-sm sm:text-base leading-snug">
                            {service.title}
                          </h3>
                          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 font-mono mt-1">
                            Ukuran: {service.fileSize}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end shrink-0 w-full sm:w-auto">
                        <a
                          href={service.downloadUrl}
                          className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-[#0c355c] active:bg-[#0a2c4e] px-4 py-2 rounded-lg transition-colors font-mono uppercase tracking-wider shadow-sm"
                        >
                          <span>Unduh</span>
                          <Download className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CONTACT & LOCATION */}
      <section className="py-24 sm:py-32 bg-white bg-grid-dots relative border-t border-slate-100 overflow-hidden">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-accent/4 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Form & Info Section Card */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-100 text-left">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#F2994A] uppercase block font-mono mb-2">
                  KONTAK LAYANAN RESMI
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-8">
                  Pusat Informasi & Dinas Terpadu
                </h3>

                <div className="space-y-6 text-left">
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-orange-100/50 flex items-center justify-center shrink-0 text-accent border border-orange-200/30">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Kantor Utama</h4>
                      <p className="mt-1 text-xs sm:text-sm text-slate-700 font-semibold font-inter leading-relaxed">
                        {officeInfo.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center shrink-0 text-secondary border border-blue-200/30">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Telepon Resmi</h4>
                      <p className="mt-1 text-xs sm:text-sm text-slate-700 font-bold font-inter">
                        {officeInfo.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center shrink-0 text-emerald-600 border border-emerald-200/30">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Alamat E-Mail</h4>
                      <p className="mt-1 text-xs sm:text-sm text-slate-700 font-bold font-inter">
                        {officeInfo.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-violet-100/50 flex items-center justify-center shrink-0 text-violet-600 border border-violet-200/30">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Operasional Kerja</h4>
                      <p className="mt-1 text-xs sm:text-sm text-slate-650 leading-relaxed font-inter">
                        {officeInfo.operationalHours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200/70 mt-8">
                <Link
                  href="/hubungi-kami"
                  className="w-full text-center py-3.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary-900 shadow-md block transition-all font-mono"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>

            {/* Maps Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-100 flex flex-col justify-between">
              <div className="relative w-full h-64 sm:h-0 sm:flex-grow rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                <iframe
                  id="home-map-interactive"
                  title="Peta Lokasi Dinas"
                  src={officeInfo.gmapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              <p className="mt-4 text-[13px] text-[#4F5E74] leading-relaxed font-sans font-medium text-left">
                Kantor kami berlokasi di distrik Kejambon, Tegal Timur. Sangat strategis dan mudah dijangkau dengan kendaraan roda dua maupun roda empat.
              </p>

              {/* Maps Navigation buttons */}
              <div className="mt-8 pt-8 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  id="home-map-route-btn"
                  href="https://www.google.com/maps/dir/?api=1&destination=Jl.+Melati+No.30a,+Kejambon,+Kec.+Tegal+Tim.,+Kota+Tegal,+Jawa+Tengah+52124"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 rounded-xl bg-[#0E3B66] hover:bg-[#072440] text-white font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all hover:shadow-lg cursor-pointer font-mono"
                >
                  <Compass className="h-4 w-4 shrink-0 text-white" />
                  <span>PETUNJUK RUTE ARAH</span>
                </a>

                <a
                  id="home-map-open-btn"
                  href="https://maps.google.com/?q=Jl.+Melati+No.30a,+Kejambon,+Kec.+Tegal+Tim.,+Kota+Tegal,+Jawa+Tengah+52124"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all hover:shadow-sm cursor-pointer font-mono"
                >
                  <span>GOOGLE MAPS</span>
                  <ExternalLink className="h-4 w-4 text-slate-500 shrink-0" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

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

              <div className="relative w-full h-[50vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
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
                    <span>•</span>
                    <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold tracking-wider text-[9px] uppercase">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{Math.max(1, Math.round(activeNewsDetail.content.split(/\s+/).length / 150))} Min Baca</span>
                    </div>
                  </div>

                  {/* Large responsive news title */}
                  <h2 className="text-xl sm:text-3.5xl font-extrabold text-[#0E3B66] tracking-tight leading-snug">
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
