'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession, SessionProvider } from 'next-auth/react';
import {
  ShieldAlert,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const { data: session, status } = useSession();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Notification States
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, type: 'success' | 'error', duration: number | null = 3000) => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    if (duration !== null) {
      notificationTimerRef.current = setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  };

  useEffect(() => {
    const hasLoginRecord = localStorage.getItem('disporapar_admin_login_time');

    if (reason === 'db_error') {
      showNotification('Gagal menghubungkan database MySQL', 'error', null);

      localStorage.removeItem('disporapar_admin_login_time');
      localStorage.removeItem('disporapar_admin_last_activity');

      const newUrl = window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    } else if (status === 'unauthenticated' && (reason === 'expired' || hasLoginRecord)) {
      showNotification('Sesi Anda telah berakhir karena tidak ada aktivitas selama 20 menit.', 'error', null);

      // Clean up localStorage records immediately so it doesn't show again on manual refresh
      localStorage.removeItem('disporapar_admin_login_time');
      localStorage.removeItem('disporapar_admin_last_activity');

      // Clean up search parameters immediately so refreshing the page doesn't show it again
      const newUrl = window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [status, reason]);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard');
    }
  }, [status, router]);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Periksa koneksi database terlebih dahulu
      const dbCheck = await fetch('/api/data', { cache: 'no-store' })
        .then((r) => r.json())
        .catch(() => null);

      if (dbCheck && dbCheck.isFallback) {
        showNotification('Gagal menghubungkan database MySQL', 'error');
        setIsLoading(false);
        return;
      }

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
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 bg-gradient-to-tr from-[#051424] via-[#0E3B66] to-[#124b82] flex items-center justify-center p-4 selection:bg-accent selection:text-white font-sans text-slate-800 overflow-y-auto z-50">
      {notification && (
        <div
          onClick={() => setNotification(null)}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-4 rounded-xl flex items-center gap-3 border text-xs font-bold font-inter transition-all animate-fade-in cursor-pointer ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
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
              disabled={isLoading}
              className="w-full py-3.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-lg active:scale-98 font-mono text-xs uppercase tracking-wider cursor-pointer disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>MEMPROSES...</span>
                </>
              ) : (
                <span>MASUK PANEL ADMIN</span>
              )}
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
  );
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <Suspense fallback={
        <div className="fixed inset-0 bg-gradient-to-tr from-[#051424] via-[#0E3B66] to-[#124b82] flex items-center justify-center text-white" />
      }>
        <LoginPageContent />
      </Suspense>
    </SessionProvider>
  );
}
