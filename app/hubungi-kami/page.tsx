'use client';

import React from 'react';
import { useOfficeInfo } from '@/lib/data-store';
import { Phone, Mail, Clock, ExternalLink, Compass, MapPin, Instagram, Youtube } from 'lucide-react';

export default function KontakPage() {
  const [officeInfo] = useOfficeInfo();

  return (
    <div id="kontak-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">

      {/* Immersive Editorial Header */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-[#0E3B66] via-[#0b2f52] to-[#0E3B66] text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F2994A]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0E3B66]/20 rounded-full blur-[100px] pointer-events-none" />
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
                HUBUNGI KAMI
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
                      {officeInfo.address || "Jl. Melati No.30a, Kejambon, Kec. Tegal Timur, Kota Tegal, Jawa Tengah 52124, Indonesia"}
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
                      {officeInfo.phone || "(0283) 321253"}
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
                      {officeInfo.email || "disporapar@tegalkota.go.id"}
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
                      {officeInfo.operationalHours || "Senin - Kamis: 07:30 - 16.00 WIB | Jumat: 07:30 - 11:00 WIB"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tautan Media Sosial Resmi */}
              <div className="pt-6 border-t border-slate-100 mt-6 text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-3 font-mono">
                  Tautan Media Sosial
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {officeInfo.socialMedia?.instagramResmi && (
                    <a
                      href={officeInfo.socialMedia.instagramResmi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#0E3B66]/5 border border-slate-200/60 hover:border-[#0E3B66]/30 text-slate-700 hover:text-[#0E3B66] rounded-xl transition-all duration-200 font-mono text-[10px] font-bold uppercase tracking-wider"
                    >
                      <Instagram className="h-3.5 w-3.5 text-pink-500 transition-transform group-hover:scale-110" />
                      <span>IG Resmi</span>
                    </a>
                  )}
                  {officeInfo.socialMedia?.instagramTourism && (
                    <a
                      href={officeInfo.socialMedia.instagramTourism}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#0E3B66]/5 border border-slate-200/60 hover:border-[#0E3B66]/30 text-slate-700 hover:text-[#0E3B66] rounded-xl transition-all duration-200 font-mono text-[10px] font-bold uppercase tracking-wider"
                    >
                      <Instagram className="h-3.5 w-3.5 text-pink-500 transition-transform group-hover:scale-110" />
                      <span>IG Wisata</span>
                    </a>
                  )}
                  {officeInfo.socialMedia?.instagramPemuda && (
                    <a
                      href={officeInfo.socialMedia.instagramPemuda}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#0E3B66]/5 border border-slate-200/60 hover:border-[#0E3B66]/30 text-slate-700 hover:text-[#0E3B66] rounded-xl transition-all duration-200 font-mono text-[10px] font-bold uppercase tracking-wider"
                    >
                      <Instagram className="h-3.5 w-3.5 text-pink-500 transition-transform group-hover:scale-110" />
                      <span>IG Pemuda</span>
                    </a>
                  )}
                  {officeInfo.socialMedia?.youtube && (
                    <a
                      href={officeInfo.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#0E3B66]/5 border border-slate-200/60 hover:border-[#0E3B66]/30 text-slate-700 hover:text-[#0E3B66] rounded-xl transition-all duration-200 font-mono text-[10px] font-bold uppercase tracking-wider"
                    >
                      <Youtube className="h-3.5 w-3.5 text-red-600 transition-transform group-hover:scale-110" />
                      <span>Youtube</span>
                    </a>
                  )}
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
                src={officeInfo.gmapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.2182512634426!2d109.1384074!3d-6.8644485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9ded578d06b%3A0xc47f0d061fa03407!2sJl.%20Melati%20No.30a%2C%20Kejambon%2C%20Kec.%20Tegal%20Tim.%2C%20Kota%20Tegal%2C%20Jawa%20Tengah%2052124!5e0!3m2!1sid!2sid!4v1717838500000!5m2!1sid!2sid"}
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
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(officeInfo.address || "Jl. Melati No.30a, Kejambon, Kec. Tegal Timur, Kota Tegal, Jawa Tengah 52124")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-[#0E3B66] hover:bg-[#0c355c] active:bg-[#0a2c4e] text-white font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-1.5 transition-all hover:shadow-md cursor-pointer"
              >
                <Compass className="h-4 w-4 shrink-0 text-white" />
                <span>PETUNJUK ARAH</span>
              </a>

              <a
                id="map-open-btn"
                href={`https://maps.google.com/?q=${encodeURIComponent(officeInfo.address || "Jl. Melati No.30a, Kejambon, Kec. Tegal Timur, Kota Tegal, Jawa Tengah 52124")}`}
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
