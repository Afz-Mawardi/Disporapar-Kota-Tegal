'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ExternalLink, ChevronDown, ChevronRight, Compass, FileText, Phone, Radio, HelpCircle, ShieldAlert, CheckCircle } from 'lucide-react';

import Logo from './Logo';

interface DropdownItem {
  name: string;
  href: string;
  isExternal?: boolean;
  desc?: string;
}

interface MenuGroup {
  name: string;
  items?: DropdownItem[];
  href?: string;
  isExternal?: boolean;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isHubungiActive = pathname === '/hubungi-kami';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Structural groupings requested to make navbar compact
  const navigationMenu: MenuGroup[] = [
    {
      name: 'BERANDA',
      href: '/',
    },
    {
      name: 'PROFIL',
      items: [
        { name: 'Sambutan', href: '/profil', desc: 'Mengenal dinas secara umum' },
        { name: 'Struktur Organisasi', href: '/profil/struktur-organisasi', desc: 'Bagan pembagian unit kerja Disporapar' },
        { name: 'Tupoksi', href: '/profil/tupoksi', desc: 'Uraian tugas pokok & wewenang' },
      ],
    },
    {
      name: 'BIDANG',
      items: [
        { name: 'Kepemudaan', href: '/kepemudaan', desc: 'Pembinaan karakter dan inovasi pemuda' },
        { name: 'Olahraga', href: '/olahraga', desc: 'Sewa prasarana olahraga & pembinaan atlet' },
        { name: 'Pariwisata', href: '/pariwisata', desc: 'Potensi wisata dan atraksi Kota Bahari' },
      ],
    },
    {
      name: 'LAYANAN',
      items: [
        { name: 'Visi & Misi Pelayanan', href: '/pelayanan', desc: 'Komitmen mutu & visi pelayanan' },
        { name: 'Maklumat Pelayanan', href: '/pelayanan/maklumat', desc: 'Pernyataan kesanggupan pelayanan' },
        { name: 'Motto Pelayanan', href: '/pelayanan/motto', desc: 'Motto kerja pelayanan TEKAD' },
        { name: 'Berkas Layanan', href: '/pelayanan/standar', desc: 'SOP, maklumat & formulir resmi' },
        { name: 'Retribusi', href: '/pelayanan/retribusi', desc: 'Rujukan regulasi biaya pemanfaatan kekayaan daerah' },
      ],
    },
    {
      name: 'MEDIA',
      items: [
        { name: 'Berita', href: '/berita', desc: 'Kanal pers rilis & kabar dinas' },
        { name: 'Galeri', href: '/galeri', desc: 'Potret riil dinamika kegiatan' },
        { name: 'Agenda', href: '/agenda', desc: 'Kalender agenda & festival kota' },
      ],
    },
    {
      name: 'PENGADUAN',
      items: [
        { name: 'LaporGub!', href: 'https://laporgub.jatengprov.go.id/', isExternal: true, desc: 'Aduan warga ke Gubernur Jawa Tengah' },
        { name: 'SP4N LAPOR!', href: 'https://lapor.go.id/', isExternal: true, desc: 'Lembaga Aspirasi & Pengaduan Online Rakyat' },
      ],
    },
    {
      name: 'PPID',
      href: 'https://ppid.tegalkota.go.id/',
      isExternal: true,
    },
  ];

  const isWhiteNav = scrolled;

  const isGroupActive = (group: MenuGroup) => {
    if (group.href) return pathname === group.href;
    if (group.items) {
      return group.items.some(item => {
        return pathname === item.href;
      });
    }
    return false;
  };

  const toggleMobileMenuExpansion = (name: string) => {
    setExpandedMobileMenu(prev => (prev === name ? null : name));
  };

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-305 ${
      isWhiteNav
        ? 'bg-white/95 backdrop-blur-md shadow-md py-3 text-slate-850'
        : 'bg-gradient-to-b from-black/70 via-black/20 to-transparent py-4.5 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo Brand Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <Logo isWhiteNav={isWhiteNav} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigationMenu.map((group) => {
              const active = isGroupActive(group);
              const hasDropdown = !!group.items;
              const isOpen = openDropdown === group.name;
              const isHighlighted = active || isOpen;

              if (hasDropdown) {
                return (
                  <div
                    key={group.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(group.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      className={`flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl text-xs sm:text-[13px] font-bold tracking-wide transition-all duration-200 uppercase font-mono cursor-pointer focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                        isHighlighted
                          ? isWhiteNav
                            ? 'text-accent bg-[#0E3B66]/5 font-black border border-accent/15'
                            : 'text-accent bg-[#0E3B66]/60 font-black border border-accent/20'
                          : isWhiteNav
                            ? 'text-[#0E3B66] hover:text-accent hover:bg-[#0E3B66]/5 border border-transparent'
                            : 'text-white hover:text-accent hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <span>{group.name}</span>
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Smooth Animated Dropdown Container */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full pt-1.5 w-64 z-50 origin-top-left"
                        >
                          <div className="overflow-hidden rounded-2xl shadow-2xl border p-2 bg-[#0E3B66]/98 backdrop-blur-xl border-[#2D9CDB]/35 text-white">
                            <div className="flex flex-col gap-0.5">
                              {group.items?.map((item) => {
                                const isSubActive = pathname === item.href;
                                const LinkComponent = item.isExternal ? 'a' : Link;
                                const linkProps = item.isExternal
                                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                                  : { href: item.href };

                                return (
                                  <LinkComponent
                                    key={item.name}
                                    {...linkProps}
                                    className={`flex flex-col gap-0.5 px-4 py-2.5 rounded-xl transition-all border-l-2 border-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                                      isSubActive
                                        ? 'bg-accent/20 text-accent border-accent'
                                        : 'hover:bg-[#2D9CDB]/15 text-slate-200 hover:text-white'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between text-xs sm:text-[13px] font-bold">
                                      <span>{item.name}</span>
                                      {item.isExternal ? (
                                        <ExternalLink className="w-3.5 h-3.5 text-accent opacity-90 block" />
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5 text-secondary opacity-80" />
                                      )}
                                    </div>
                                  </LinkComponent>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // Normal single links like Beranda and Kontak
              const LinkComponent = group.isExternal ? 'a' : Link;
              const linkProps = group.isExternal
                ? { href: group.href || '/', target: "_blank", rel: "noopener noreferrer" }
                : { href: group.href || '/' };

              return (
                <LinkComponent
                  key={group.name}
                  id={`nav-link-${group.name.toLowerCase().replace(/\s+/g, '-')}`}
                  {...linkProps}
                  className={`px-3.5 rounded-xl text-xs sm:text-[13px] font-bold tracking-wide transition-all duration-200 uppercase font-mono flex items-center justify-center gap-1.5 h-10 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                    active
                      ? isWhiteNav
                        ? 'text-accent bg-[#0E3B66]/5 font-black border border-accent/15'
                        : 'text-accent bg-[#0E3B66]/60 font-black border border-accent/20'
                      : isWhiteNav
                        ? 'text-[#0E3B66] hover:text-accent hover:bg-[#0E3B66]/5 border border-transparent'
                        : 'text-white hover:text-accent hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <span>{group.name}</span>
                  {group.isExternal && <ExternalLink className="w-3 h-3 opacity-80" />}
                </LinkComponent>
              );
            })}
          </nav>

          {/* Right Action Hubungi Kami */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/hubungi-kami"
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold tracking-wide uppercase border font-mono transition-all duration-300 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                isHubungiActive
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                  : isWhiteNav
                    ? 'border-accent text-accent hover:bg-accent hover:text-white shadow-xs'
                    : 'border-accent text-accent hover:bg-accent hover:text-white drop-shadow-xs'
              }`}
            >
              HUBUNGI KAMI
            </Link>
          </div>

          {/* Mobile Menu Icon Toggle */}
          <div className="flex lg:hidden">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                isWhiteNav ? 'text-[#0E3B66] hover:bg-slate-50' : 'text-white hover:bg-white/5'
              }`}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation with collapsibles */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#051424] border-t border-white/5 shadow-2xl relative z-50 w-full"
          >
            <div className="px-5 pt-4 pb-8 space-y-1.5 max-h-[85vh] overflow-y-auto">
              <div className="flex flex-col gap-1 pb-4">
                {navigationMenu.map((group) => {
                  const active = isGroupActive(group);
                  const hasDropdown = !!group.items;
                  const isMobileExpanded = expandedMobileMenu === group.name;

                  if (hasDropdown) {
                    return (
                      <div key={group.name} className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => toggleMobileMenuExpansion(group.name)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-left transition-all focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                            active
                              ? 'bg-accent/15 text-accent font-bold'
                              : 'text-slate-200 hover:bg-white/5'
                          }`}
                        >
                          <span>{group.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileExpanded ? 'rotate-180 text-accent' : ''}`} />
                        </button>

                        {/* Collapsed sub-list */}
                        <AnimatePresence initial={false}>
                          {isMobileExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-4 mt-0.5 space-y-0.5 border-l border-white/10"
                            >
                              {group.items?.map((item) => {
                                const isSubActive = pathname === item.href;
                                const LinkComponent = item.isExternal ? 'a' : Link;
                                const linkProps = item.isExternal
                                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                                  : { href: item.href };

                                return (
                                  <LinkComponent
                                    key={item.name}
                                    {...linkProps}
                                    onClick={() => !item.isExternal && setIsOpen(false)}
                                    className={`flex flex-col px-4 py-2.5 rounded-xl transition-all focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                                      isSubActive
                                        ? 'text-accent font-bold'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase font-mono">
                                      <span>{item.name}</span>
                                      {item.isExternal && <ExternalLink className="w-3 h-3 text-slate-500" />}
                                    </div>
                                  </LinkComponent>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  // Non-dropdown link for mobile
                  const MobLinkComponent = group.isExternal ? 'a' : Link;
                  const mobLinkProps = group.isExternal
                    ? { href: group.href || '/', target: "_blank", rel: "noopener noreferrer" }
                    : { href: group.href || '/', onClick: () => setIsOpen(false) };

                  return (
                    <MobLinkComponent
                      key={group.name}
                      {...mobLinkProps}
                      className={`px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                        active
                          ? 'bg-accent/20 text-accent border-l-4 border-accent'
                          : 'text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span>{group.name}</span>
                      {group.isExternal && <ExternalLink className="w-3.5 h-3.5 text-slate-500" />}
                    </MobLinkComponent>
                  );
                })}

                {/* Direct Link to Kontak */}
                <Link
                  href="/hubungi-kami"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all mt-1 border focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                    isHubungiActive
                      ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                      : 'text-slate-200 hover:text-white hover:bg-white/5 border-white/10'
                  }`}
                >
                  <span>HUBUNGI KAMI</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isHubungiActive ? 'text-white' : 'text-slate-400'}`} />
                </Link>
              </div>

              <div className="border-t border-white/5 pt-4 text-center">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Official E-Government Portal</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
