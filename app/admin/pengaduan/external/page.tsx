'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Link2,
  Save,
  CheckCircle,
  ShieldAlert,
  Loader2,
  HelpCircle
} from 'lucide-react';

export default function AdminExternalLinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states mapping
  const [laporGubTitle, setLaporGubTitle] = useState('LaporGub!');
  const [laporGubUrl, setLaporGubUrl] = useState('https://laporgub.jatengprov.go.id/');
  const [laporTitle, setLaporTitle] = useState('SP4N-LAPOR!');
  const [laporUrl, setLaporUrl] = useState('https://lapor.go.id/');
  const [ppidTitle, setPpidTitle] = useState('PPID');
  const [ppidUrl, setPpidUrl] = useState('https://ppid.tegalkota.go.id/');

  // Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  }, [setNotification]);

  const fetchLinks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/external-links');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLinks(data);

          // Map to local states
          const lg = data.find(l => l.id === 'laporgub');
          if (lg) {
            setLaporGubTitle(lg.title);
            setLaporGubUrl(lg.url);
          }
          const lp = data.find(l => l.id === 'lapor');
          if (lp) {
            setLaporTitle(lp.title);
            setLaporUrl(lp.url);
          }
          const pd = data.find(l => l.id === 'ppid');
          if (pd) {
            setPpidTitle(pd.title);
            setPpidUrl(pd.url);
          }
        }
      } else {
        showNotification('Gagal memuat link eksternal.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Gagal terhubung dengan server.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      links: [
        { id: 'laporgub', title: laporGubTitle, url: laporGubUrl },
        { id: 'lapor', title: laporTitle, url: laporUrl },
        { id: 'ppid', title: ppidTitle, url: ppidUrl }
      ]
    };

    try {
      const res = await fetch('/api/external-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Link eksternal berhasil disimpan!', 'success');
      } else {
        showNotification(data.error || 'Gagal menyimpan perubahan.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Gagal menyimpan perubahan. Koneksi error.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in relative">
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

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSave} className="space-y-6 p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase text-[9px] sm:text-[10px] tracking-wider font-mono font-black select-none">
                  <th className="py-4 px-6 w-1/4">Menu Tautan</th>
                  <th className="py-4 px-4 w-1/3">Nama Menu Navbar</th>
                  <th className="py-4 px-4">URL Tujuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {/* LaporGub! */}
                <tr>
                  <td className="py-4 px-6 font-mono text-xs font-bold text-[#0E3B66]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />
                      <span>LaporGub!</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      required
                      value={laporGubTitle}
                      onChange={(e) => setLaporGubTitle(e.target.value)}
                      placeholder="Nama Navbar (LaporGub!)"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="url"
                      required
                      value={laporGubUrl}
                      onChange={(e) => setLaporGubUrl(e.target.value)}
                      placeholder="https://laporgub.jatengprov.go.id/"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                    />
                  </td>
                </tr>

                {/* SP4N-LAPOR! */}
                <tr>
                  <td className="py-4 px-6 font-mono text-xs font-bold text-[#0E3B66]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />
                      <span>SP4N-LAPOR!</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      required
                      value={laporTitle}
                      onChange={(e) => setLaporTitle(e.target.value)}
                      placeholder="Nama Navbar (SP4N-LAPOR!)"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="url"
                      required
                      value={laporUrl}
                      onChange={(e) => setLaporUrl(e.target.value)}
                      placeholder="https://lapor.go.id/"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                    />
                  </td>
                </tr>

                {/* PPID */}
                <tr>
                  <td className="py-4 px-6 font-mono text-xs font-bold text-[#0E3B66]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />
                      <span>PPID</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      required
                      value={ppidTitle}
                      onChange={(e) => setPpidTitle(e.target.value)}
                      placeholder="Nama Navbar (PPID)"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="url"
                      required
                      value={ppidUrl}
                      onChange={(e) => setPpidUrl(e.target.value)}
                      placeholder="https://ppid.tegalkota.go.id/"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0E3B66] hover:bg-[#0a2c4e] text-white font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
