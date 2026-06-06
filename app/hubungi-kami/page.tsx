'use client';

import React from 'react';
import Image from 'next/image';
import { useOfficeInfo } from '@/lib/data-store';
import { Phone, Mail, Clock, ExternalLink, Compass, MapPin, Instagram, Youtube } from 'lucide-react';

export default function KontakPage() {
  const [officeInfo] = useOfficeInfo();

  return (
    <div id="kontak-page" className="w-full bg-slate-50 pb-24 font-sans text-slate-800">

      {/* Immersive Editorial Header */}
      <section className="relative py-20 sm:py-24 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-65">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600"
            alt="Kontak DISPORAPAR"
            fill
            priority
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Saluran Hubungan Kemasyarakatan
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Hubungi & Kunjungi Kami
          </h1>
        </div>
      </section>

      {/* CORE CONTACT & MAP TWO-COLUMN LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">

          {/* Card 1: Hubungi Kami */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-secondary tracking-widest uppercase font-mono bg-blue-100/50 border border-blue-200/40 px-3 py-1 rounded-full inline-block mb-4">
                Hubungi Kami
              </span>
              <h3 className="text-2xl font-extrabold text-primary tracking-tight mb-6">DISPORAPAR Kota Tegal</h3>

              <div id="contact-info-list" className="space-y-6 font-inter">
                {/* 1. Alamat Kantor */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-mono leading-none">Alamat Kantor</h4>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed block mt-1.5">{officeInfo.address}</span>
                  </div>
                </div>

                {/* 2. Nomor Telepon */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0F5A9E] flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-mono leading-none">Nomor Telepon</h4>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed block mt-1.5">{officeInfo.phone}</span>
                  </div>
                </div>

                {/* 3. Alamat Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-mono leading-none">Alamat Email</h4>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed block mt-1.5 break-all">{officeInfo.email}</span>
                  </div>
                </div>

                {/* 4. Jam Operasional */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-mono leading-none">Jam Operasional</h4>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed block mt-1.5">{officeInfo.operationalHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links Block */}
            <div className="pt-6 border-t border-slate-100 mt-8">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-3 font-mono">Tautan Media Sosial:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {officeInfo.socialMedia?.instagramResmi && (
                  <a
                    href={officeInfo.socialMedia.instagramResmi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-650 hover:text-white hover:bg-accent hover:border-accent transition-all duration-200 shadow-xs hover:shadow-sm"
                  >
                    <Instagram className="h-4 w-4 shrink-0 text-pink-500 group-hover:text-white transition-colors" />
                    <span className="text-[9px] font-bold tracking-wide uppercase font-mono">IG Resmi</span>
                  </a>
                )}
                {officeInfo.socialMedia?.instagramTourism && (
                  <a
                    href={officeInfo.socialMedia.instagramTourism}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-650 hover:text-white hover:bg-accent hover:border-accent transition-all duration-200 shadow-xs hover:shadow-sm"
                  >
                    <Instagram className="h-4 w-4 shrink-0 text-pink-500 group-hover:text-white transition-colors" />
                    <span className="text-[9px] font-bold tracking-wide uppercase font-mono">IG Wisata</span>
                  </a>
                )}
                {officeInfo.socialMedia?.instagramPemuda && (
                  <a
                    href={officeInfo.socialMedia.instagramPemuda}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-650 hover:text-white hover:bg-accent hover:border-accent transition-all duration-200 shadow-xs hover:shadow-sm"
                  >
                    <Instagram className="h-4 w-4 shrink-0 text-pink-500 group-hover:text-white transition-colors" />
                    <span className="text-[9px] font-bold tracking-wide uppercase font-mono">IG Pemuda</span>
                  </a>
                )}
                {officeInfo.socialMedia?.youtube && (
                  <a
                    href={officeInfo.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-650 hover:text-white hover:bg-accent hover:border-accent transition-all duration-200 shadow-xs hover:shadow-sm"
                  >
                    <Youtube className="h-4 w-4 shrink-0 text-red-500 group-hover:text-white transition-colors" />
                    <span className="text-[9px] font-bold tracking-wide uppercase font-mono">YouTube</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Layanan Digital */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-secondary tracking-widest uppercase font-mono bg-blue-100/50 border border-blue-200/40 px-3 py-1 rounded-full inline-block mb-4">
                Layanan Digital
              </span>
              <h3 className="text-2xl font-extrabold text-primary tracking-tight mb-3">Saluran Layanan Mandiri</h3>

              <div className="space-y-4 font-inter mt-6">
                {/* Gmail Card */}
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${officeInfo.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 hover:border-orange-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm group-hover:scale-105 transition-transform shrink-0 bg-white relative">
                    <svg className="w-full h-full p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="5" fill="none" />
                      <path d="M20 4H17.5V11L12 15L6.5 11V4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H6.5V11L12 15L17.5 11V20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" fill="none" />
                      <path d="M4 20H6.5V11L2 14.5V18C2 19.1 2.9 20 4 20Z" fill="#34A853" />
                      <path d="M22 18V14.5L17.5 11V20H20C21.1 20 22 19.1 22 18Z" fill="#4285F4" />
                      <path d="M17.5 4H20C21.1 4 22 4.9 22 6V14.5L17.5 11V4Z" fill="#EA4335" />
                      <path d="M2 6V14.5L6.5 11V4H4C2.9 4 2 4.9 2 6Z" fill="#EA4335" />
                      <path d="M6.5 4H17.5V11L12 15L6.5 11V4Z" fill="#FBBC05" />
                    </svg>
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Kirim Surel Gmail</h4>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block mt-0.5 group-hover:text-accent transition-colors">
                      {officeInfo.email}
                    </span>
                  </div>
                </a>

                {/* Instagram Resmi */}
                {officeInfo.socialMedia?.instagramResmi && (
                  <a
                    href={officeInfo.socialMedia.instagramResmi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 hover:border-pink-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm group-hover:scale-105 transition-transform shrink-0 relative">
                      <svg className="w-full h-full p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <radialGradient id="ig-gradient-layanan-resmi" cx="30%" cy="107%" r="130%" fx="30%" fy="107%">
                            <stop offset="0%" stopColor="#fdf497" />
                            <stop offset="5%" stopColor="#fdf497" />
                            <stop offset="45%" stopColor="#fd5949" />
                            <stop offset="60%" stopColor="#d6249f" />
                            <stop offset="90%" stopColor="#285AEB" />
                          </radialGradient>
                        </defs>
                        <rect width="24" height="24" rx="5" fill="url(#ig-gradient-layanan-resmi)" />
                        <path d="M12 6.861c-2.838 0-5.139 2.301-5.139 5.139s2.301 5.139 5.139 5.139 5.139-2.301 5.139-5.139-2.301-5.139-5.139-5.139zm0 8.441c-1.821 0-3.302-1.481-3.302-3.302s1.481-3.302 3.302-3.302 3.302 1.481 3.302 3.302-1.481 3.302-3.302 3.302zM17.34 5.46a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" fill="#FFF" />
                        <path d="M16.5 3H7.5C5.01 3 3 5.01 3 7.5v9c0 2.49 2.01 4.5 4.5 4.5h9c2.49 0 4.5-2.01 4.5-4.5v-9C21 5.01 18.99 3 16.5 3zm2.5 13.5c0 1.38-1.12 2.5-2.5 2.5h-9C6.12 19 5 17.88 5 16.5v-9C5 6.12 6.12 5 7.5 5h9C17.88 5 19 6.12 19 7.5v9z" fill="#FFF" />
                      </svg>
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Instagram Resmi</h4>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block mt-0.5 group-hover:text-accent transition-colors">
                        @{officeInfo.socialMedia?.instagramResmi?.replace(/\/$/, '').split('/').pop() || ''}
                      </span>
                    </div>
                  </a>
                )}

                {/* Instagram Pariwisata */}
                {officeInfo.socialMedia?.instagramTourism && (
                  <a
                    href={officeInfo.socialMedia.instagramTourism}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 hover:border-pink-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm group-hover:scale-105 transition-transform shrink-0 relative">
                      <svg className="w-full h-full p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <radialGradient id="ig-gradient-layanan-tourism" cx="30%" cy="107%" r="130%" fx="30%" fy="107%">
                            <stop offset="0%" stopColor="#fdf497" />
                            <stop offset="5%" stopColor="#fdf497" />
                            <stop offset="45%" stopColor="#fd5949" />
                            <stop offset="60%" stopColor="#d6249f" />
                            <stop offset="90%" stopColor="#285AEB" />
                          </radialGradient>
                        </defs>
                        <rect width="24" height="24" rx="5" fill="url(#ig-gradient-layanan-tourism)" />
                        <path d="M12 6.861c-2.838 0-5.139 2.301-5.139 5.139s2.301 5.139 5.139 5.139 5.139-2.301 5.139-5.139-2.301-5.139-5.139-5.139zm0 8.441c-1.821 0-3.302-1.481-3.302-3.302s1.481-3.302 3.302-3.302 3.302 1.481 3.302 3.302-1.481 3.302-3.302 3.302zM17.34 5.46a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" fill="#FFF" />
                        <path d="M16.5 3H7.5C5.01 3 3 5.01 3 7.5v9c0 2.49 2.01 4.5 4.5 4.5h9c2.49 0 4.5-2.01 4.5-4.5v-9C21 5.01 18.99 3 16.5 3zm2.5 13.5c0 1.38-1.12 2.5-2.5 2.5h-9C6.12 19 5 17.88 5 16.5v-9C5 6.12 6.12 5 7.5 5h9C17.88 5 19 6.12 19 7.5v9z" fill="#FFF" />
                      </svg>
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Instagram Pariwisata</h4>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block mt-0.5 group-hover:text-accent transition-colors">
                        @{officeInfo.socialMedia?.instagramTourism?.replace(/\/$/, '').split('/').pop() || ''}
                      </span>
                    </div>
                  </a>
                )}

                {/* Instagram Kepemudaan */}
                {officeInfo.socialMedia?.instagramPemuda && (
                  <a
                    href={officeInfo.socialMedia.instagramPemuda}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 hover:border-pink-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm group-hover:scale-105 transition-transform shrink-0 relative">
                      <svg className="w-full h-full p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <radialGradient id="ig-gradient-layanan-pemuda" cx="30%" cy="107%" r="130%" fx="30%" fy="107%">
                            <stop offset="0%" stopColor="#fdf497" />
                            <stop offset="5%" stopColor="#fdf497" />
                            <stop offset="45%" stopColor="#fd5949" />
                            <stop offset="60%" stopColor="#d6249f" />
                            <stop offset="90%" stopColor="#285AEB" />
                          </radialGradient>
                        </defs>
                        <rect width="24" height="24" rx="5" fill="url(#ig-gradient-layanan-pemuda)" />
                        <path d="M12 6.861c-2.838 0-5.139 2.301-5.139 5.139s2.301 5.139 5.139 5.139 5.139-2.301 5.139-5.139-2.301-5.139-5.139-5.139zm0 8.441c-1.821 0-3.302-1.481-3.302-3.302s1.481-3.302 3.302-3.302 3.302 1.481 3.302 3.302-1.481 3.302-3.302 3.302zM17.34 5.46a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" fill="#FFF" />
                        <path d="M16.5 3H7.5C5.01 3 3 5.01 3 7.5v9c0 2.49 2.01 4.5 4.5 4.5h9c2.49 0 4.5-2.01 4.5-4.5v-9C21 5.01 18.99 3 16.5 3zm2.5 13.5c0 1.38-1.12 2.5-2.5 2.5h-9C6.12 19 5 17.88 5 16.5v-9C5 6.12 6.12 5 7.5 5h9C17.88 5 19 6.12 19 7.5v9z" fill="#FFF" />
                      </svg>
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Instagram Kepemudaan</h4>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block mt-0.5 group-hover:text-accent transition-colors">
                        @{officeInfo.socialMedia?.instagramPemuda?.replace(/\/$/, '').split('/').pop() || ''}
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed font-sans font-medium text-left">
              * Jam operasional respons pesan digital disesuaikan dengan jam kerja resmi kantor dinas.
            </div>
          </div>

        </div>
      </section>

      {/* Embedded Maps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-[2rem] overflow-hidden p-6 sm:p-8 shadow-md border border-slate-100 flex flex-col justify-between">
          <div className="space-y-2 mb-6">
            <span className="text-xs font-bold text-primary tracking-widest uppercase font-mono bg-blue-50 border border-blue-105 px-3 py-1 rounded-full inline-block">
              Peta Lokasi Interaktif
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kunjungi Kantor Utama</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-inter font-light">
              Terletak strategis bersebelahan dengan kompleks olahraga Stadion Yos Sudarso, Tegal Timur, Jawa Tengah.
            </p>
          </div>

          <div className="relative w-full h-[280px] sm:h-[300px] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
            <iframe
              id="contact-map-interactive"
              title="Peta Navigasi Google Maps Kantor DISPORAPAR Kota Tegal"
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

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <a
              id="map-route-btn"
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(officeInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-900 text-white font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all hover:shadow-lg cursor-pointer"
            >
              <Compass className="h-4 w-4 shrink-0 text-white" />
              <span>Petunjuk Arah</span>
            </a>

            <a
              id="map-open-btn"
              href={`https://maps.google.com/?q=${encodeURIComponent(officeInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all hover:shadow-sm cursor-pointer"
            >
              <span>Google Maps</span>
              <ExternalLink className="h-4 w-4 text-slate-500 shrink-0" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
