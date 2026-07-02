'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signIn, signOut, SessionProvider } from 'next-auth/react';
import {
  ShieldAlert,
  LayoutDashboard,
  Sliders,
  User,
  Users,
  Trophy,
  Compass,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  FileText,
  Phone,
  LogOut,
  KeyRound,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  CheckCircle,
  Menu,
  X,
  Eye,
  EyeOff,
  Landmark,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function AdminLayoutClient({
  children,
  isLoggedIn: initialIsLoggedIn,
  username: initialUsername,
  role: initialRole
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
  username: string;
  role: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Authentication State
  const isLoggedIn = initialIsLoggedIn;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [currentAdminUsername, setCurrentAdminUsername] = useState<string>(initialUsername || '');
  const [showAccountPassword, setShowAccountPassword] = useState<boolean>(false);
  const [accountSuccess, setAccountSuccess] = useState<string>('');
  const [accountError, setAccountError] = useState<string>('');
  const [role, setRole] = useState<string>(initialRole || 'ADMIN');

  useEffect(() => {
    setCurrentAdminUsername(initialUsername || '');
  }, [initialUsername]);

  useEffect(() => {
    setRole(initialRole || 'ADMIN');
  }, [initialRole]);

  // Profile Dropdown & Password Modals
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [showAccountConfirmPassword, setShowAccountConfirmPassword] = useState<boolean>(false);

  // Notification States
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Accordion Menu State (which categories are expanded)
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({
    beranda: pathname.includes('/admin/beranda'),
    bidang: pathname.includes('/admin/bidang'),
    publikasi: pathname.includes('/admin/publikasi'),
    layanan: pathname.includes('/admin/layanan'),
    pengaduan: pathname.includes('/admin/pengaduan'),
    manajerAdmin: pathname.includes('/admin/manajer-admin')
  });

  const toggleMenu = (key: string) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Keep parent category open if pathname belongs to it
  useEffect(() => {
    if (pathname.includes('/admin/beranda')) setExpandedMenus((prev) => ({ ...prev, beranda: true }));
    if (pathname.includes('/admin/bidang')) setExpandedMenus((prev) => ({ ...prev, bidang: true }));
    if (pathname.includes('/admin/publikasi')) setExpandedMenus((prev) => ({ ...prev, publikasi: true }));
    if (pathname.includes('/admin/layanan')) setExpandedMenus((prev) => ({ ...prev, layanan: true }));
    if (pathname.includes('/admin/pengaduan')) setExpandedMenus((prev) => ({ ...prev, pengaduan: true }));
    if (pathname.includes('/admin/manajer-admin')) setExpandedMenus((prev) => ({ ...prev, manajerAdmin: true }));
  }, [pathname]);

  // Global click listener to close notification when active
  useEffect(() => {
    if (!notification) return;
    const handleGlobalClick = () => setNotification(null);
    const timer = setTimeout(() => {
      window.addEventListener('click', handleGlobalClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [notification]);

  // Global session check for 20-minute idle auto-logout
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem('disporapar_admin_login_time');
      localStorage.removeItem('disporapar_admin_last_activity');
      return;
    }

    let lastActivityStr = localStorage.getItem('disporapar_admin_last_activity');
    if (!lastActivityStr) {
      lastActivityStr = Date.now().toString();
      localStorage.setItem('disporapar_admin_last_activity', lastActivityStr);
    }

    const checkSession = () => {
      const lastActivity = parseInt(localStorage.getItem('disporapar_admin_last_activity') || Date.now().toString(), 10);
      const elapsed = Date.now() - lastActivity;
      const TWENTY_MINUTES = 20 * 60 * 1000;

      if (elapsed >= TWENTY_MINUTES) {
        handleLogoutRef.current(true);
        showNotificationRef.current('Sesi Anda telah berakhir karena tidak ada aktivitas selama 20 menit. Silakan masuk kembali.', 'error');
      }
    };

    const handleActivity = () => {
      localStorage.setItem('disporapar_admin_last_activity', Date.now().toString());
    };

    const activityEvents = ['mousedown', 'click', 'keypress', 'scroll', 'touchstart', 'mousemove'];
    
    // Throttle activity updates to avoid excessive localStorage writes (once per second max)
    let lastUpdate = 0;
    const throttledActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 1000) {
        handleActivity();
        lastUpdate = now;
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, throttledActivity);
    });

    checkSession();
    const intervalId = setInterval(checkSession, 5000);

    return () => {
      clearInterval(intervalId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, throttledActivity);
      });
    };
  }, [isLoggedIn]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn('credentials', {
        redirect: false,
        username,
        password
      });

      if (res?.error) {
        showNotification('Username atau password salah.', 'error');
      } else {
        localStorage.setItem('disporapar_admin_login_time', Date.now().toString());
        localStorage.setItem('disporapar_admin_last_activity', Date.now().toString());
        showNotification('Berhasil masuk ke panel admin!', 'success');
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      showNotification('Terjadi kesalahan sistem.', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const showNotificationRef = React.useRef(showNotification);
  showNotificationRef.current = showNotification;

  // Handle Logout
  const handleLogout = async (skipNotification = false) => {
    try {
      setIsAccountModalOpen(false);
      setIsProfileDropdownOpen(false);
      localStorage.removeItem('disporapar_admin_login_time');
      localStorage.removeItem('disporapar_admin_last_activity');
      await signOut({ redirect: false });
      if (!skipNotification) {
        showNotificationRef.current('Berhasil keluar.', 'success');
      }
      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error(err);
      if (!skipNotification) {
        showNotificationRef.current('Gagal keluar dari sesi.', 'error');
      }
    }
  };

  const handleLogoutRef = React.useRef(handleLogout);
  handleLogoutRef.current = handleLogout;

  // Update account information (password/username)
  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError('');
    setAccountSuccess('');
    const formData = new FormData(e.target as HTMLFormElement);
    const newUsername = formData.get('adminUsername') as string;
    const newPassword = formData.get('adminPassword') as string;
    const confirmPassword = formData.get('adminConfirmPassword') as string;

    if (!newUsername.trim()) {
      setAccountError('Username tidak boleh kosong.');
      return;
    }

    if (newPassword) {
      if (newPassword.trim().length < 6) {
        setAccountError('Password baru harus minimal 6 karakter.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setAccountError('Konfirmasi password tidak cocok.');
        return;
      }
    }

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'adminAccount',
          data: {
            username: currentAdminUsername,
            newUsername: newUsername.trim(),
            newPassword: newPassword ? newPassword.trim() : undefined
          }
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentAdminUsername(newUsername);
        setAccountSuccess('Akun admin berhasil diperbarui!');
        showNotification('Akun admin berhasil diperbarui!', 'success');
        setTimeout(() => setIsAccountModalOpen(false), 1500);
      } else {
        setAccountError(data.error || 'Gagal memperbarui akun.');
      }
    } catch (err) {
      console.error(err);
      setAccountError('Terjadi kesalahan koneksi.');
    }
  };

  // Render Login Panel if not logged in
  if (!isLoggedIn) {
    return (
      <SessionProvider>
        <div className="fixed inset-0 bg-gradient-to-tr from-[#051424] via-[#0E3B66] to-[#124b82] flex items-center justify-center p-4 selection:bg-accent selection:text-white font-sans text-slate-800 overflow-y-auto z-50">
          {notification && (
            <div
              onClick={() => setNotification(null)}
              className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-4 rounded-xl flex items-center gap-3 border text-xs font-bold font-inter transition-all animate-fade-in cursor-pointer select-none ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-10 rounded-3xl shadow-2xl relative z-10 text-white flex flex-col justify-between">
            <div className="text-center space-y-3.5">
              <div className="flex justify-center mb-6">
                <Logo variant="dark" className="scale-110" />
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-inter max-w-[280px] mx-auto">
                Portal Keamanan Administrasi Dinas. Masukkan kredensial admin untuk mengakses panel kendali
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-5 text-left font-inter text-slate-700">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-200 tracking-wider uppercase font-mono">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-slate-400 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-200 tracking-wider uppercase font-mono">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-slate-400 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-lg active:scale-98 font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  MASUK PANEL ADMIN
                </button>
              </div>
            </form>

            <div className="mt-8 border-t border-white/10 pt-4 text-center">
              <Link
                href="/"
                className="text-[10px] font-bold text-sky-300 hover:text-white uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Kembali Ke website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </SessionProvider>
    );
  }

  // Sidebar navigation mapping helper
  const renderSidebarLink = (id: string, name: string, href: string, icon: React.ReactNode) => {
    const isActive = pathname === href;
    return (
      <Link
        key={id}
        href={href}
        onClick={() => setIsSidebarOpen(false)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-left text-xs uppercase tracking-wider font-mono ${isActive ? 'bg-accent text-white shadow-md shadow-accent/15' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  return (
    <SessionProvider>
      <div className="fixed inset-0 overflow-hidden bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Toast Notification */}
      {notification && (
        <div
          onClick={() => setNotification(null)}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-4 rounded-xl flex items-center gap-3 border text-xs font-bold font-inter transition-all animate-fade-in cursor-pointer select-none ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sidebar backdrop overlay for mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* 1. SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-45 w-64 bg-[#051424] text-white flex flex-col justify-between shrink-0 shadow-lg border-r border-white/5 transition-transform duration-300 md:translate-x-0 md:static md:h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex-grow h-full flex flex-col overflow-hidden">
          {/* Brand header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#051424] z-10">
            <div className="flex flex-col gap-2 w-full">
              <Logo variant="dark" className="scale-90 origin-left pointer-events-none" />
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 md:hidden transition-colors cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-grow overflow-y-auto select-none pr-1 admin-sidebar-scrollbar">
            <nav className="p-4 space-y-2.5">
              {/* Dashboard Link */}
              {renderSidebarLink('dashboard', 'Dashboard', '/admin/dashboard', <LayoutDashboard className="w-4 h-4" />)}

              {/* Beranda Category Accordion */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleMenu('beranda')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-mono font-black uppercase tracking-wider`}
                >
                  <span>Beranda & PROFIL</span>
                  {expandedMenus.beranda ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {expandedMenus.beranda && (
                  <div className="pl-4 border-l border-white/10 space-y-1 mt-1">
                    {renderSidebarLink('hero-slider', 'Hero Slider', '/admin/beranda/hero-slider', <Sliders className="w-3.5 h-3.5" />)}
                    {renderSidebarLink('publikasi-beranda', 'Publikasi Beranda', '/admin/beranda/publikasi-beranda', <FileText className="w-3.5 h-3.5" />)}
                    {renderSidebarLink('pilar-program', 'Pilar Program', '/admin/beranda/pilar-program', <Sliders className="w-3.5 h-3.5" />)}
                    {renderSidebarLink('sambutan', 'Sambutan', '/admin/beranda/sambutan', <User className="w-3.5 h-3.5" />)}
                  </div>
                )}
              </div>

              {/* Bidang Category Accordion */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleMenu('bidang')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-mono font-black uppercase tracking-wider`}
                >
                  <span>Bidang</span>
                  {expandedMenus.bidang ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {expandedMenus.bidang && (
                  <div className="pl-4 border-l border-white/10 space-y-1 mt-1">
                    {renderSidebarLink('kepemudaan', 'Kepemudaan', '/admin/bidang/kepemudaan', <Users className="w-3.5 h-3.5" />)}
                    {renderSidebarLink('olahraga', 'Olahraga', '/admin/bidang/olahraga', <Trophy className="w-3.5 h-3.5" />)}
                    {renderSidebarLink('pariwisata', 'Pariwisata', '/admin/bidang/pariwisata', <Compass className="w-3.5 h-3.5" />)}
                  </div>
                )}
              </div>

              {/* Publikasi Category Accordion */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleMenu('publikasi')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-mono font-black uppercase tracking-wider`}
                >
                  <span>Publikasi</span>
                  {expandedMenus.publikasi ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {expandedMenus.publikasi && (
                  <div className="pl-4 border-l border-white/10 space-y-1 mt-1">
                    {renderSidebarLink('agenda-event', 'Agenda Event', '/admin/publikasi/agenda-event', <Calendar className="w-3.5 h-3.5" />)}
                    {renderSidebarLink('berita', 'Berita', '/admin/publikasi/berita', <Newspaper className="w-3.5 h-3.5" />)}
                    {renderSidebarLink('galeri-foto', 'Galeri Foto', '/admin/publikasi/galeri-foto', <ImageIcon className="w-3.5 h-3.5" />)}
                  </div>
                )}
              </div>

              {/* Layanan Category Accordion */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleMenu('layanan')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-mono font-black uppercase tracking-wider`}
                >
                  <span>Layanan</span>
                  {expandedMenus.layanan ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {expandedMenus.layanan && (
                  <div className="pl-4 border-l border-white/10 space-y-1 mt-1">
                    {renderSidebarLink('retribusi', 'Retribusi', '/admin/layanan/retribusi', <Landmark className="w-3.5 h-3.5" />)}
                    {renderSidebarLink('berkas-layanan', 'Berkas Layanan', '/admin/layanan/berkas-layanan', <FileText className="w-3.5 h-3.5" />)}
                  </div>
                )}
              </div>

              {/* Pengaduan Category Accordion */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleMenu('pengaduan')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-mono font-black uppercase tracking-wider`}
                >
                  <span>Pengaduan</span>
                  {expandedMenus.pengaduan ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {expandedMenus.pengaduan && (
                  <div className="pl-4 border-l border-white/10 space-y-1 mt-1">
                    {renderSidebarLink('pengaduan-internal', 'Pengaduan Internal', '/admin/pengaduan/internal', <ShieldAlert className="w-3.5 h-3.5" />)}
                    {renderSidebarLink('external-link', 'External Link', '/admin/pengaduan/external', <ExternalLink className="w-3.5 h-3.5" />)}
                  </div>
                )}
              </div>

              {/* Manajer Admin Category Accordion (Only for SUPER_ADMIN) */}
              {role === 'SUPER_ADMIN' && (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu('manajerAdmin')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-mono font-black uppercase tracking-wider`}
                  >
                    <span>Manajer Admin</span>
                    {expandedMenus.manajerAdmin ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  {expandedMenus.manajerAdmin && (
                    <div className="pl-4 border-l border-white/10 space-y-1 mt-1">
                      {renderSidebarLink('daftar-admin', 'Kelola Admin', '/admin/manajer-admin', <Users className="w-3.5 h-3.5" />)}
                      {renderSidebarLink('riwayat-admin', 'Riwayat Perubahan', '/admin/manajer-admin/riwayat', <Clock className="w-3.5 h-3.5" />)}
                    </div>
                  )}
                </div>
              )}

              {/* Info Kontak Link */}
              {renderSidebarLink('info-kontak', 'Info Kontak', '/admin/info-kontak', <Phone className="w-4 h-4" />)}
            </nav>
          </div>
        </div>

        {/* User logout section */}
        <div className="p-4 border-t border-white/5 space-y-3 sticky bottom-0 bg-[#051424]">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/20 bg-slate-700 hover:bg-slate-600 text-white transition-all text-[10px] font-mono font-bold uppercase tracking-widest cursor-pointer"
          >
            <span>Buka Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => handleLogout(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/20 bg-red-600 hover:bg-red-700 text-white transition-all text-[10px] font-mono font-bold uppercase tracking-widest cursor-pointer"
          >
            <span>Keluar Sesi</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN PANEL WORKSPACE */}
      <main className="flex-grow h-full flex flex-col min-w-0 relative z-10 overflow-hidden">
        {/* Top Header section - STICKY TOP ON MOBILE */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Menu toggle button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-1 text-[#0E3B66] hover:bg-slate-100 rounded-xl md:hidden transition-colors cursor-pointer shrink-0"
              title="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold text-[#0E3B66] uppercase tracking-tight flex items-center gap-1.5 sm:gap-2 leading-none truncate">
                <span>Panel Admin</span>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 capitalize truncate">
                  {pathname.split('/').slice(-1)[0].replace('-', ' ')}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer select-none"
            >
              <div className="w-7 h-7 rounded-full bg-[#0E3B66] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {(currentAdminUsername || 'A')[0].toUpperCase()}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#0E3B66]">{currentAdminUsername || 'Admin'}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180 text-[#0E3B66]' : ''
                  }`}
              />
            </button>

            {isProfileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 z-40 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden py-1.5 animate-fade-in text-left">
                  <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                    <p className="text-xs font-bold text-[#0E3B66] truncate">{currentAdminUsername || 'Admin'}</p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Administrator</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsAccountModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-slate-450" />
                    <span>Edit Akun</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-700 transition-colors text-xs font-bold text-red-600 flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* View Component Switch */}
        <section className="flex-1 min-h-0 p-4 sm:p-8 overflow-y-auto flex flex-col justify-between relative">
          <div className="flex-grow">{children}</div>

          {/* Admin Footer */}
          <footer className="mt-8 pt-6 border-t border-slate-200 text-center shrink-0">
            <p className="text-[10px] font-mono text-slate-400 select-none">
              Copyright &copy; {new Date().getFullYear()} DISPORAPAR Kota Tegal &bull; Developed by Afz-ysx
            </p>
          </footer>
        </section>
      </main>

      {/* ACCOUNT SETTINGS MODAL */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-inter">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-150 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-black text-[#0E3B66] uppercase tracking-wider font-mono">Pengaturan Akun Admin</h3>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="p-1.5 text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <form onSubmit={handleUpdateAccount} className="space-y-4">
                {accountSuccess && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100">{accountSuccess}</div>}
                {accountError && <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-100">{accountError}</div>}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Username Admin</label>
                  <input
                    type="text"
                    name="adminUsername"
                    required
                    defaultValue={currentAdminUsername}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Password Baru (Kosongkan jika tidak diubah)</label>
                  <div className="relative">
                    <input
                      type={showAccountPassword ? 'text' : 'password'}
                      name="adminPassword"
                      //placeholder="masukkan pasword"
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountPassword(!showAccountPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showAccountPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <input
                      type={showAccountConfirmPassword ? 'text' : 'password'}
                      name="adminConfirmPassword"
                      //placeholder="••••••••"
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountConfirmPassword(!showAccountConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showAccountConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0E3B66] hover:bg-[#0a2c4e] text-white font-extrabold rounded-xl transition-all shadow-md text-xs uppercase tracking-wider font-mono cursor-pointer"
                  >
                    SIMPAN PERUBAHAN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </SessionProvider>
  );
}
