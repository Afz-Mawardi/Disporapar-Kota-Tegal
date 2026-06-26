'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useOfficeInfo } from '@/lib/data-store';
import { Phone, Mail, Clock, MapPin, Instagram, Youtube } from 'lucide-react';

import Logo from './Logo';

export default function Footer() {
  const pathname = usePathname();
  const [officeInfo] = useOfficeInfo();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer id="footer" className="bg-gradient-to-b from-[#051424] to-[#030c16] text-slate-400 pt-16 border-t border-white/5 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-8">
          {/* Brand Profile & Description - Col Span 5 */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-4">
              <Logo variant="dark" />
              <div className="w-[1px] h-7 sm:h-8 bg-white/15 shrink-0" />
              <Image
                src="/aset/amazing-tegal.svg"
                alt="Amazing Tegal Logo"
                width={375}
                height={98}
                className="object-contain w-auto h-8 sm:h-9 select-none shrink-0"
                priority
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Portal pelayanan informasi publik resmi Dinas Pemuda, Olahraga, dan Pariwisata Kota Tegal. Mewujudkan pelayanan prima yang sinergis, transparan, dan akuntabel.
            </p>

            {/* Social Media Links with minimalist badges */}
            <div className="flex flex-col gap-2.5 pt-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">Media Sosial</span>
              <div className="flex flex-wrap gap-2">
                {((officeInfo.socialMediaList || []) as any[]).map((social, idx) => {
                  let colorClass = 'text-slate-400 group-hover:text-white';
                  let iconSvg = null;

                  if (social.platform === 'instagram') {
                    colorClass = 'text-pink-500/80 group-hover:text-pink-500';
                    iconSvg = (
                      <svg className="h-3.5 w-3.5 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    );
                  } else if (social.platform === 'youtube') {
                    colorClass = 'text-red-500/80 group-hover:text-red-550';
                    iconSvg = (
                      <svg className="h-3.5 w-3.5 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                      </svg>
                    );
                  } else if (social.platform === 'facebook') {
                    colorClass = 'text-blue-500/80 group-hover:text-blue-550';
                    iconSvg = (
                      <svg className="h-3.5 w-3.5 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    );
                  } else if (social.platform === 'x') {
                    colorClass = 'text-slate-400 group-hover:text-white';
                    iconSvg = (
                      <svg className="h-3.5 w-3.5 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    );
                  } else if (social.platform === 'tiktok') {
                    colorClass = 'text-cyan-400/80 group-hover:text-cyan-400';
                    iconSvg = (
                      <svg className="h-3.5 w-3.5 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                      </svg>
                    );
                  } else if (social.platform === 'whatsapp') {
                    colorClass = 'text-emerald-450/90 group-hover:text-emerald-400';
                    iconSvg = (
                      <svg className="h-3.5 w-3.5 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    );
                  } else if (social.platform === 'telegram') {
                    colorClass = 'text-sky-400/90 group-hover:text-sky-400';
                    iconSvg = (
                      <svg className="h-3.5 w-3.5 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    );
                  } else if (social.platform === 'linkedin') {
                    colorClass = 'text-[#0A66C2]/90 group-hover:text-[#0A66C2]';
                    iconSvg = (
                      <svg className="h-3.5 w-3.5 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white border border-white/[0.04] hover:border-white/[0.08] transition-all duration-250 group"
                      aria-label={`${social.platform} ${social.label}`}
                    >
                      <span className={colorClass}>{iconSvg}</span>
                      <span className="text-[10px] font-medium tracking-wide font-mono">{social.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links Navigation - Col Span 3 */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/profil" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-secondary/50 group-hover:bg-secondary transition-colors" />
                  <span>Profil Dinas</span>
                </Link>
              </li>
              <li>
                <Link href="/kepemudaan" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-secondary/50 group-hover:bg-secondary transition-colors" />
                  <span>Bidang Kepemudaan</span>
                </Link>
              </li>
              <li>
                <Link href="/olahraga" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-secondary/50 group-hover:bg-secondary transition-colors" />
                  <span>Bidang Olahraga</span>
                </Link>
              </li>
              <li>
                <Link href="/pariwisata" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-secondary/50 group-hover:bg-secondary transition-colors" />
                  <span>Bidang Pariwisata</span>
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-secondary/50 group-hover:bg-secondary transition-colors" />
                  <span>Kabar & Berita</span>
                </Link>
              </li>
              <li>
                <Link href="/pelayanan" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-secondary/50 group-hover:bg-secondary transition-colors" />
                  <span>Informasi Layanan</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details - Col Span 4 */}
          <div className="md:col-span-4 space-y-4 text-xs">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
              Kontak
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-400">{officeInfo.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <span className="text-slate-400">{officeInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 overflow-hidden">
                <Mail className="h-4 w-4 text-primary-200 shrink-0" />
                <span className="text-slate-400 truncate">{officeInfo.email}</span>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-white/[0.04]">
                <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-400 font-medium">{officeInfo.operationalHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright segment */}
      <div className="w-full bg-black border-t border-white/15 py-6 mt-6 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-slate-400 gap-4">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} DISPORAPAR Kota Tegal. Seluruh Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/kontak" className="hover:text-white transition-colors">
              Kontak Kami
            </Link>
            <span className="text-white/20 font-light">|</span>
            <span className="text-slate-500 font-mono text-[9px] uppercase tracking-widest">Official Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
