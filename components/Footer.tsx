'use client';

import React from 'react';
import Link from 'next/link';
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
            <Logo variant="dark" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Portal pelayanan informasi publik resmi Dinas Pemuda, Olahraga, dan Pariwisata Kota Tegal. Mewujudkan pelayanan prima yang sinergis, transparan, dan akuntabel.
            </p>

            {/* Social Media Links with minimalist badges */}
            <div className="flex flex-col gap-2.5 pt-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">Media Sosial</span>
              <div className="flex flex-wrap gap-2">
                {officeInfo.socialMedia?.instagramResmi && (
                  <a
                    href={officeInfo.socialMedia.instagramResmi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white border border-white/[0.04] hover:border-white/[0.08] transition-all duration-250 group"
                    aria-label="Instagram Resmi DISPORAPAR"
                  >
                    <Instagram className="h-3.5 w-3.5 text-pink-500/80 group-hover:text-pink-500 transition-colors" />
                    <span className="text-[10px] font-medium tracking-wide font-mono">Resmi</span>
                  </a>
                )}
                {officeInfo.socialMedia?.instagramTourism && (
                  <a
                    href={officeInfo.socialMedia.instagramTourism}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white border border-white/[0.04] hover:border-white/[0.08] transition-all duration-250 group"
                    aria-label="Instagram Pariwisata & Event Kota Tegal"
                  >
                    <Instagram className="h-3.5 w-3.5 text-pink-500/80 group-hover:text-pink-500 transition-colors" />
                    <span className="text-[10px] font-medium tracking-wide font-mono">Wisata</span>
                  </a>
                )}
                {officeInfo.socialMedia?.instagramPemuda && (
                  <a
                    href={officeInfo.socialMedia.instagramPemuda}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white border border-white/[0.04] hover:border-white/[0.08] transition-all duration-250 group"
                    aria-label="Instagram Bidang Kepemudaan DISPORAPAR"
                  >
                    <Instagram className="h-3.5 w-3.5 text-pink-500/80 group-hover:text-pink-500 transition-colors" />
                    <span className="text-[10px] font-medium tracking-wide font-mono">Pemuda</span>
                  </a>
                )}
                {officeInfo.socialMedia?.youtube && (
                  <a
                    href={officeInfo.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white border border-white/[0.04] hover:border-white/[0.08] transition-all duration-250 group"
                    aria-label="YouTube Resmi DISPORAPAR"
                  >
                    <Youtube className="h-3.5 w-3.5 text-red-500/80 group-hover:text-red-550 transition-colors" />
                    <span className="text-[10px] font-medium tracking-wide font-mono">YouTube</span>
                  </a>
                )}
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
              Hubungi Kami
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
            <Link href="/hubungi-kami" className="hover:text-white transition-colors">
              Kontak & Layanan
            </Link>
            <span className="text-white/20 font-light">|</span>
            <span className="text-slate-500 font-mono text-[9px] uppercase tracking-widest">Official Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
