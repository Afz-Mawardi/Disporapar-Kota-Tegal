'use client';

import React from 'react';
import { useOfficeInfo } from '@/lib/data-store';
import { Phone, Mail, Clock, ExternalLink, Compass, MapPin, Instagram, Youtube } from 'lucide-react';

export default function KontakPageClient({
  initialOfficeInfo
}: {
  initialOfficeInfo: any;
}) {
  const [officeInfo] = useOfficeInfo(initialOfficeInfo);

  return (
    <div id="Kontak-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">

      {/* Immersive Editorial Header */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Saluran Hubungan Kemasyarakatan
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Hubungi & Kunjungi Kami
          </h1>
        </div>
      </section>

      {/* CORE CONTACT & MAP TWO-COLUMN LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Left Column: Contact Card info */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#F2994A] tracking-widest uppercase font-mono bg-orange-50 border border-orange-100/50 px-3 py-1 rounded-full inline-block mb-4">
                info Kontak
              </span>
              <h3 className="text-2xl font-extrabold text-[#0E3B66] tracking-tight mb-8 leading-none">
                DISPORAPAR Kota Tegal
              </h3>

              <div id="contact-info-list" className="space-y-6 font-inter">
                {/* Alamat Kantor */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFF4E5] text-[#F2994A] flex items-center justify-center shrink-0 shadow-xs border border-orange-100/20">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-widest font-mono leading-none">ALAMAT KANTOR</h4>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed block mt-1.5">
                      {officeInfo.address}
                    </span>
                  </div>
                </div>

                {/* Nomor Telepon */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFF8E7] text-[#E2B93B] flex items-center justify-center shrink-0 shadow-xs border border-yellow-100/20">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-widest font-mono leading-none">NOMOR TELEPON</h4>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed block mt-1.5">
                      {officeInfo.phone}
                    </span>
                  </div>
                </div>

                {/* Alamat Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#EEFBF3] text-[#27AE60] flex items-center justify-center shrink-0 shadow-xs border border-emerald-100/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-widest font-mono leading-none">ALAMAT EMAIL</h4>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed block mt-1.5 break-all">
                      {officeInfo.email}
                    </span>
                  </div>
                </div>

                {/* Jam Operasional */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ECEBFF] text-[#6F57E3] flex items-center justify-center shrink-0 shadow-xs border border-indigo-100/20">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-widest font-mono leading-none">JAM OPERASIONAL</h4>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed block mt-1.5">
                      {officeInfo.operationalHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tautan Media Sosial Resmi */}
              <div className="pt-6 border-t border-slate-100 mt-6 text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-3 font-mono">
                  Media Sosial
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {((officeInfo.socialMediaList || []) as any[]).map((social, idx) => {
                    let brandColor = '#0E3B66';
                    let brandBg = 'rgba(14, 59, 102, 0.05)';
                    let brandBorder = 'rgba(14, 59, 102, 0.2)';
                    let iconSvg = null;

                    if (social.platform === 'instagram') {
                      brandColor = '#E1306C';
                      brandBg = 'rgba(225, 48, 108, 0.05)';
                      brandBorder = 'rgba(225, 48, 108, 0.2)';
                      iconSvg = (
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      );
                    } else if (social.platform === 'youtube') {
                      brandColor = '#FF0000';
                      brandBg = 'rgba(255, 0, 0, 0.05)';
                      brandBorder = 'rgba(255, 0, 0, 0.2)';
                      iconSvg = (
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#FF0000"></polygon>
                        </svg>
                      );
                    } else if (social.platform === 'facebook') {
                      brandColor = '#1877F2';
                      brandBg = 'rgba(24, 119, 242, 0.05)';
                      brandBorder = 'rgba(24, 119, 242, 0.2)';
                      iconSvg = (
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      );
                    } else if (social.platform === 'x') {
                      brandColor = '#000000';
                      brandBg = 'rgba(0, 0, 0, 0.05)';
                      brandBorder = 'rgba(0, 0, 0, 0.2)';
                      iconSvg = (
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="#000000">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      );
                    } else if (social.platform === 'tiktok') {
                      brandColor = '#000000';
                      brandBg = 'rgba(0, 0, 0, 0.05)';
                      brandBorder = 'rgba(0, 0, 0, 0.2)';
                      iconSvg = (
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                        </svg>
                      );
                    } else if (social.platform === 'whatsapp') {
                      brandColor = '#25D366';
                      brandBg = 'rgba(37, 211, 102, 0.05)';
                      brandBorder = 'rgba(37, 211, 102, 0.2)';
                      iconSvg = (
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                      );
                    } else if (social.platform === 'telegram') {
                      brandColor = '#0088cc';
                      brandBg = 'rgba(0, 136, 204, 0.05)';
                      brandBorder = 'rgba(0, 136, 204, 0.2)';
                      iconSvg = (
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="#0088cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                      );
                    } else if (social.platform === 'linkedin') {
                      brandColor = '#0077b5';
                      brandBg = 'rgba(0, 119, 181, 0.05)';
                      brandBorder = 'rgba(0, 119, 181, 0.2)';
                      iconSvg = (
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="#0077b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      );
                    }

                    return (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl transition-all duration-200 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = brandBg;
                          e.currentTarget.style.borderColor = brandBorder;
                          e.currentTarget.style.color = brandColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.borderColor = '';
                          e.currentTarget.style.color = '';
                        }}
                      >
                        {iconSvg}
                        <span>{social.platform === 'instagram' ? `${social.label}` : social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Map Interactive Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col justify-between items-stretch">
            <div className="relative w-full flex-1 min-h-[240px] sm:min-h-[320px] rounded-2xl overflow-hidden border border-slate-150 bg-slate-50 shadow-inner mt-2">
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

            <div className="mt-6 grid grid-cols-2 gap-4">
              <a
                id="map-route-btn"
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(officeInfo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-[#0E3B66] hover:bg-[#0c355c] active:bg-[#0a2c4e] text-white font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-1.5 transition-all hover:shadow-md cursor-pointer"
              >
                <Compass className="h-4 w-4 shrink-0 text-white" />
                <span>PETUNJUK ARAH</span>
              </a>

              <a
                id="map-open-btn"
                href={`https://maps.google.com/?q=${encodeURIComponent(officeInfo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-1.5 transition-all hover:shadow-xs cursor-pointer"
              >
                <span>GOOGLE MAPS</span>
                <ExternalLink className="h-4 w-4 text-slate-500 shrink-0" />
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
