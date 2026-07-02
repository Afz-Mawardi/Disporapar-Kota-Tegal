'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useOfficeInfo } from '@/lib/data-store';
import { Phone, Mail, Clock, MapPin, Instagram, Youtube } from 'lucide-react';

import Logo from '../ui/Logo';

export default function Footer() {
  const pathname = usePathname();
  const [officeInfo] = useOfficeInfo();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const renderSocialItem = (social: any, idx: number) => {
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
      colorClass = 'text-red-500/80 group-hover:text-red-500';
      iconSvg = (
        <svg className="h-3.5 w-3.5 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
        </svg>
      );
    } else if (social.platform === 'facebook') {
      colorClass = 'text-blue-500/80 group-hover:text-blue-600';
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
      colorClass = 'text-emerald-500/90 group-hover:text-emerald-400';
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
  };

  return (
    <footer id="footer" className="bg-gradient-to-b from-[#051424] to-[#030c16] text-slate-400 pt-16 border-t border-white/5 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Brand Profile & Description - Col Span 7 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4">
              <Logo variant="dark" />
              <div className="w-[1px] h-7 sm:h-8 bg-white/15 shrink-0" />
              <Image
                src="/assets/amazing-tegal.svg"
                alt="Amazing Tegal Logo"
                width={375}
                height={98}
                className="object-contain w-auto h-8 sm:h-9 select-none shrink-0"
                priority
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Portal resmi Dinas Kepemudaan, Olahraga, dan Pariwisata Kota Tegal.<br />Mewujudkan pelayanan publik prima, transparan, dan akuntabel.
            </p>

            {/* Social Media Links with minimalist badges */}
            <div className="flex flex-col gap-2.5 pt-2">
              <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase font-mono">Media Sosial</span>
              {(() => {
                const socials = (officeInfo.socialMediaList || []) as any[];
                const ytIndex = socials.findIndex(s => s.platform === 'youtube');
                const splitIndex = ytIndex !== -1 ? ytIndex + 1 : 5;
                const firstRow = socials.slice(0, splitIndex);
                const secondRow = socials.slice(splitIndex);

                return (
                  <>
                    <div className="flex flex-wrap gap-2.5">
                      {firstRow.map((social, idx) => renderSocialItem(social, idx))}
                    </div>
                    {secondRow.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 mt-0.5">
                        {secondRow.map((social, idx) => renderSocialItem(social, idx + splitIndex))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Contact Details - Col Span 5 */}
          <div className="lg:col-span-5 space-y-3.5">
            <h3 className="text-[10px] font-bold text-slate-300 tracking-wider uppercase font-mono">
              Info Kontak Resmi
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent mt-[3px]">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="leading-relaxed text-slate-400">{officeInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0 text-secondary">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-slate-400">{officeInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-primary-200/10 border border-primary-200/20 flex items-center justify-center shrink-0 text-primary-200">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-slate-400 truncate">{officeInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent mt-[3px]">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="leading-relaxed text-slate-400">{officeInfo.operationalHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright segment */}
      <div className="font-mono w-full bg-black border-t border-white/10 py-6 mt-12 relative z-10">
        <div className="text-center leading-relaxed max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-center text-[12px] uppercase font-bold  text-slate-300 tracking-wider">
          Copyright @ 2026 <br />
          Dinas Kepemudaan dan Olahraga dan Pariwisata Kota Tegal
        </div>
      </div>
    </footer>
  );
}
