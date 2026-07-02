'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Compass,
  FileText,
  Phone,
  Radio,
  HelpCircle,
  ShieldAlert,
  CheckCircle,
  Home,
  User,
  Users,
  Trophy,
  Landmark,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  ShieldCheck,
  Target,
  FileSignature
} from 'lucide-react';

import Logo from '../ui/Logo';

interface DropdownItem {
  name: string;
  href: string;
  isExternal?: boolean;
}

interface MenuGroup {
  name: string;
  items?: DropdownItem[];
  href?: string;
  isExternal?: boolean;
}

const getGroupIcon = (name: string) => {
  const normalized = name.toLowerCase().trim();
  switch (normalized) {
    case 'beranda':
      return <Home className="w-4 h-4 shrink-0" />;
    case 'profil':
      return <User className="w-4 h-4 shrink-0" />;
    case 'bidang':
      return <Trophy className="w-4 h-4 shrink-0" />;
    case 'layanan':
      return <Landmark className="w-4 h-4 shrink-0" />;
    case 'publikasi':
      return <Newspaper className="w-4 h-4 shrink-0" />;
    case 'pengaduan':
      return <ShieldAlert className="w-4 h-4 shrink-0" />;
    case 'ppid':
      return <ShieldCheck className="w-4 h-4 shrink-0" />;
    case 'kontak':
    case 'info kontak':
      return <Phone className="w-4 h-4 shrink-0" />;
    default:
      return <HelpCircle className="w-4 h-4 shrink-0" />;
  }
};

const getItemIcon = (name: string) => {
  const normalized = name.toLowerCase().trim();
  if (normalized.includes('sambutan')) {
    return <User className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('struktur')) {
    return <Users className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('tupoksi')) {
    return <FileSignature className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('kepemudaan')) {
    return <Users className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('olahraga')) {
    return <Trophy className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('pariwisata')) {
    return <Compass className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('visi')) {
    return <Target className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('maklumat')) {
    return <ShieldCheck className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('motto') || normalized.includes('moto')) {
    return <CheckCircle className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('retribusi')) {
    return <Landmark className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('berkas') || normalized.includes('sop') || normalized.includes('formulir') || normalized.includes('dokumen')) {
    return <FileText className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('agenda') || normalized.includes('event')) {
    return <Calendar className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('berita') || normalized.includes('artikel')) {
    return <Newspaper className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('galeri') || normalized.includes('foto') || normalized.includes('dokumentasi')) {
    return <ImageIcon className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('laporgub')) {
    return <Radio className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('lapor!')) {
    return <ShieldAlert className="w-3.5 h-3.5 shrink-0" />;
  }
  if (normalized.includes('internal') || normalized.includes('pengaduan internal')) {
    return <ShieldAlert className="w-3.5 h-3.5 shrink-0" />;
  }
  return <HelpCircle className="w-3.5 h-3.5 shrink-0" />;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const pathname = usePathname();
  
  // Dynamic external links state
  const [externalLinks, setExternalLinks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/external-links')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExternalLinks(data);
        }
      })
      .catch(err => console.error('Failed to load external links:', err));
  }, []);

  const ppidLink = externalLinks.find(l => l.id === 'ppid') || { title: 'PPID', url: 'https://ppid.tegalkota.go.id/' };
  const laporGubLink = externalLinks.find(l => l.id === 'laporgub') || { title: 'LaporGub!', url: 'https://laporgub.jatengprov.go.id/' };
  const laporLink = externalLinks.find(l => l.id === 'lapor') || { title: 'SP4N-LAPOR!', url: 'https://lapor.go.id/' };

  const navigationMenu: MenuGroup[] = [
    {
      name: 'BERANDA',
      href: '/',
    },
    {
      name: 'PROFIL',
      items: [
        { name: 'Sambutan', href: '/profil' },
        { name: 'Struktur', href: '/profil/struktur-organisasi' },
        { name: 'Tupoksi', href: '/profil/tupoksi' },
      ],
    },
    {
      name: 'BIDANG',
      items: [
        { name: 'Kepemudaan', href: '/kepemudaan' },
        { name: 'Olahraga', href: '/olahraga' },
        { name: 'Pariwisata', href: '/pariwisata' },
      ],
    },
    {
      name: 'LAYANAN',
      items: [
        { name: 'Visi & Misi', href: '/pelayanan' },
        { name: 'Maklumat Pelayanan', href: '/pelayanan/maklumat' },
        { name: 'Motto Pelayanan', href: '/pelayanan/motto' },
        { name: 'Retribusi', href: '/pelayanan/retribusi' },
        { name: 'Berkas Layanan', href: '/pelayanan/berkas' },
      ],
    },
    {
      name: 'PUBLIKASI',
      items: [
        { name: 'Agenda', href: '/agenda' },
        { name: 'Berita', href: '/berita' },
        { name: 'Galeri', href: '/galeri' },
      ],
    },
    {
      name: 'PENGADUAN',
      items: [
        { name: laporGubLink.title, href: laporGubLink.url, isExternal: true },
        { name: laporLink.title, href: laporLink.url, isExternal: true },
        { name: 'Pengaduan Internal', href: '/pengaduan/internal' }
      ],
    },
    {
      name: ppidLink.title.toUpperCase(),
      href: ppidLink.url,
      isExternal: true,
    },
  ];

  const isHome = pathname === '/';
  const isHubungiActive = pathname === '/kontak';

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setOpenDropdown(null);
    setIsOpen(false);
  }, [pathname]);



  const isWhiteNav = scrolled || !isHome;

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isWhiteNav
      ? 'bg-white/95 backdrop-blur-md shadow-md py-2 lg:py-1.5 text-slate-850'
      : 'bg-gradient-to-b from-black/75 via-black/20 to-transparent py-2 lg:py-2.5 text-white'
      }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-4 xl:px-8">
        <div className="flex items-center justify-between h-12">

          {/* Logo Brand Title */}
          <Link href="/" className="flex items-center gap-3.5">
            <Logo isWhiteNav={isWhiteNav} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
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
                      className={`flex items-center justify-center gap-1 lg:gap-1.5 h-9 px-2 lg:px-2.5 xl:px-3.5 rounded-xl text-[11px] lg:text-[11.5px] xl:text-[13px] font-bold tracking-wide transition-all duration-200 uppercase font-mono cursor-pointer focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${isHighlighted
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
                          className="absolute left-0 top-full pt-2.5 w-56 z-50 origin-top-left"
                        >
                          <div className="overflow-hidden rounded-2xl shadow-2xl border p-1.5 bg-[#0E3B66]/98 backdrop-blur-xl border-[#2D9CDB]/35 text-white">
                            <div className="flex flex-col gap-0.5">
                              {group.items?.map((item) => {
                                const isSubActive = pathname === item.href;
                                const LinkComponent = item.isExternal ? 'a' : Link;
                                const isInternalProfilOrPelayanan = !item.isExternal && (item.href.startsWith('/profil') || item.href.startsWith('/pelayanan'));
                                const linkProps: any = item.isExternal
                                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                                  : { href: item.href, scroll: !isInternalProfilOrPelayanan };

                                return (
                                  <LinkComponent
                                    key={item.name}
                                    {...linkProps}
                                    onClick={() => {
                                      if (pathname === item.href) {
                                        setOpenDropdown(null);
                                        if (item.href === '/profil' || item.href === '/pelayanan') {
                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                                        } else if (item.href === '/profil/struktur-organisasi') {
                                          const element = document.getElementById('struktur-organisasi');
                                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                                        } else if (item.href === '/profil/tupoksi') {
                                          const element = document.getElementById('tupoksi-dan-fungsi');
                                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                                        } else if (item.href.startsWith('/pelayanan/')) {
                                          const element = document.getElementById('pelayanan-tabs-section');
                                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                                        }
                                      }
                                    }}
                                    className={`flex flex-col gap-0.5 px-4 py-2 rounded-xl transition-all border-l-2 border-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${isSubActive
                                      ? 'bg-accent/20 text-accent border-accent'
                                      : 'hover:bg-[#2D9CDB]/15 text-slate-200 hover:text-white'
                                      }`}
                                  >
                                    <div className="flex items-center justify-between text-xs sm:text-[13px] font-bold">
                                      <span>{item.name}</span>
                                      {item.isExternal && (
                                        <ExternalLink className="w-3.5 h-3.5 text-accent opacity-90 block" />
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
                : {
                  href: group.href || '/',
                  onClick: () => {
                    if (pathname === group.href) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                };

              return (
                <LinkComponent
                  key={group.name}
                  id={`nav-link-${group.name.toLowerCase().replace(/\s+/g, '-')}`}
                  {...linkProps}
                  className={`px-2 lg:px-2.5 xl:px-3.5 rounded-xl text-[11px] lg:text-[11.5px] xl:text-[13px] font-bold tracking-wide transition-all duration-200 uppercase font-mono flex items-center justify-center gap-1 lg:gap-1.5 h-9 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${active
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

          {/* Right Action Kontak */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/kontak"
              onClick={() => {
                if (pathname === '/kontak') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`px-3 lg:px-3.5 xl:px-4 py-2 rounded-xl text-[11px] lg:text-[11.5px] xl:text-[13px] font-bold tracking-wide uppercase border font-mono transition-all duration-300 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${isHubungiActive
                ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                : isWhiteNav
                  ? 'border-accent text-accent hover:bg-accent hover:text-white shadow-xs'
                  : 'border-accent text-accent hover:bg-accent hover:text-white drop-shadow-xs'
                }`}
            >
              Info Kontak
            </Link>
          </div>

          {/* Mobile Menu Icon Toggle */}
          <div className="flex lg:hidden">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${isWhiteNav ? 'text-[#0E3B66] hover:bg-slate-50' : 'text-white hover:bg-white/5'
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
                          className={`flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-left transition-all focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${active
                            ? 'bg-accent/15 text-accent font-bold'
                            : 'text-slate-200 hover:bg-white/5'
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {getGroupIcon(group.name)}
                            <span>{group.name}</span>
                          </div>
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
                                const isInternalProfilOrPelayanan = !item.isExternal && (item.href.startsWith('/profil') || item.href.startsWith('/pelayanan'));
                                const linkProps: any = item.isExternal
                                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                                  : { href: item.href, scroll: !isInternalProfilOrPelayanan };

                                return (
                                  <LinkComponent
                                    key={item.name}
                                    {...linkProps}
                                    onClick={() => {
                                      if (item.isExternal) return;
                                      if (pathname === item.href) {
                                        setIsOpen(false);
                                        if (item.href === '/profil' || item.href === '/pelayanan') {
                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                                        } else if (item.href === '/profil/struktur-organisasi') {
                                          const element = document.getElementById('struktur-organisasi');
                                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                                        } else if (item.href === '/profil/tupoksi') {
                                          const element = document.getElementById('tupoksi-dan-fungsi');
                                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                                        } else if (item.href.startsWith('/pelayanan/')) {
                                          const element = document.getElementById('pelayanan-tabs-section');
                                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                                        }
                                      }
                                    }}
                                    className={`flex flex-col px-4 py-2.5 rounded-xl transition-all focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${isSubActive
                                      ? 'text-accent font-bold'
                                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                                      }`}
                                  >
                                    <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase font-mono">
                                      {getItemIcon(item.name)}
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
                    : {
                      href: group.href || '/',
                      onClick: () => {
                        if (pathname === group.href) {
                          setIsOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }
                    };

                  return (
                    <MobLinkComponent
                      key={group.name}
                      {...mobLinkProps}
                      className={`px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${active
                        ? 'bg-accent/20 text-accent border-l-4 border-accent'
                        : 'text-slate-200 hover:bg-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {getGroupIcon(group.name)}
                        <span>{group.name}</span>
                      </div>
                      {group.isExternal && <ExternalLink className="w-3.5 h-3.5 text-slate-500" />}
                    </MobLinkComponent>
                  );
                })}

                {/* Direct Link to Kontak */}
                <Link
                  href="/kontak"
                  onClick={() => {
                    if (pathname === '/kontak') {
                      setIsOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all mt-1 border focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${isHubungiActive
                    ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                    : 'text-slate-200 hover:text-white hover:bg-white/5 border-white/10'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    {getGroupIcon('kontak')}
                    <span>Kontak</span>
                  </div>
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
