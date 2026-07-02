'use client';

import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Image as ImageIcon,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  X,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';
import {
  useNews,
  useEvents,
  useGallery,
  usePublicServices
} from '@/lib/data-store';
import { parseIndonesianDate } from '@/lib/utils';

const getFileFormat = (downloadUrl?: string, title?: string): 'pdf' | 'zip' | 'word' | 'unknown' => {
  if (!downloadUrl || downloadUrl === '#' || downloadUrl === '') return 'unknown';
  const urlLower = downloadUrl.toLowerCase();
  const titleLower = title ? title.toLowerCase() : '';

  if (urlLower.includes('.pdf') || titleLower.includes('pdf')) return 'pdf';
  if (urlLower.includes('.zip') || urlLower.includes('.rar') || titleLower.includes('zip') || titleLower.includes('rar')) return 'zip';
  if (urlLower.includes('.doc') || urlLower.includes('.docx') || titleLower.includes('word') || titleLower.includes('doc') || titleLower.includes('docx')) return 'word';

  if (urlLower.startsWith('data:application/pdf')) return 'pdf';
  if (urlLower.startsWith('data:application/zip') || urlLower.startsWith('data:application/x-zip-compressed')) return 'zip';
  if (urlLower.startsWith('data:application/msword') || urlLower.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'word';

  return 'unknown';
};

interface FileFormatIconProps {
  className?: string;
  downloadUrl?: string;
  title?: string;
  colorClasses?: string;
}

const FileFormatIcon: React.FC<FileFormatIconProps> = ({ className = "w-5 h-5", downloadUrl, title, colorClasses }) => {
  const format = getFileFormat(downloadUrl, title);
  const color = colorClasses !== undefined ? colorClasses : (
    format === 'pdf' ? 'text-red-500' :
      format === 'word' ? 'text-blue-650' :
        format === 'zip' ? 'text-amber-500' :
          'text-slate-400'
  );

  switch (format) {
    case 'pdf':
      return (
        <svg
          className={`${className} ${color} shrink-0`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15H7v-4h2" />
          <path d="M9 13H7" />
          <path d="M12 11v4h1a1.5 1.5 0 0 0 1.5-1.5v-1A1.5 1.5 0 0 0 13 11h-1z" />
          <path d="M17 11h2" />
          <path d="M17 13h1.5" />
        </svg>
      );
    case 'zip':
      return (
        <svg
          className={`${className} ${color} shrink-0`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M10 6v2" />
          <path d="M10 10v2" />
          <path d="M10 14v2" />
          <path d="M10 18h2" />
        </svg>
      );
    case 'word':
      return (
        <svg
          className={`${className} ${color} shrink-0`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 11.5l1.5 4 1.5-4 1.5 4 1.5-4.5" />
        </svg>
      );
    default:
      return (
        <svg
          className={`${className} ${color} shrink-0`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
  }
};

const getItemTimestamp = (item: any): number => {
  if (item.createdAt) {
    const t = new Date(item.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  if (item.id && typeof item.id === 'string') {
    const match = item.id.match(/\d+/);
    if (match) {
      const val = parseInt(match[0], 10);
      if (val > 946684800000) return val;
    }
  }
  try {
    return parseIndonesianDate(item.date).getTime();
  } catch {
    return 0;
  }
};

export default function PublikasiBerandaPage() {
  const [news, setNews] = useNews();
  const [events, setEvents] = useEvents();
  const [gallery, setGallery] = useGallery();
  const [services, setServices] = usePublicServices();

  const [dashboardTab, setDashboardTab] = useState<'agenda' | 'berita' | 'galeri' | 'berkas'>('agenda');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  };

  // Toggle Visibility Handlers
  const toggleNewsHomepage = (id: string) => {
    setNews(news.map(item => item.id === id ? { ...item, showOnHomepage: !(item.showOnHomepage !== false) } : item));
    showNotification('Status tampilan berita di beranda berhasil diubah.', 'success');
  };

  const toggleGalleryHomepage = (id: string) => {
    setGallery(gallery.map(item => item.id === id ? { ...item, showOnHomepage: !(item.showOnHomepage !== false) } : item));
    showNotification('Status tampilan galeri di beranda berhasil diubah.', 'success');
  };

  const toggleEventsHomepage = (id: string) => {
    setEvents(events.map(item => item.id === id ? { ...item, showOnHomepage: !(item.showOnHomepage !== false) } : item));
    showNotification('Status tampilan agenda di beranda berhasil diubah.', 'success');
  };

  const toggleServicesHomepage = (id: string) => {
    setServices(services.map(item => item.id === id ? { ...item, showOnHomepage: !(item.showOnHomepage !== false) } : item));
    showNotification('Status tampilan berkas di beranda berhasil diubah.', 'success');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in relative">
      {/* Toast Notification */}
      {notification && (
        <div
          onClick={() => setNotification(null)}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-4 rounded-xl flex items-center gap-3 border text-xs font-bold font-inter transition-all animate-fade-in cursor-pointer select-none ${
            notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
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

      {/* Control Action bar */}
      <div className="sticky top-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md transition-all duration-300">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight">Manajer Publikasi Beranda</h3>
        </div>

        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'agenda', name: 'Agenda' },
            { id: 'berita', name: 'Berita' },
            { id: 'galeri', name: 'Galeri' },
            { id: 'berkas', name: 'Berkas' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDashboardTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono transition-colors text-center cursor-pointer select-none ${
                dashboardTab === tab.id ? 'bg-[#0E3B66] text-white shadow-xs' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm text-left">
        <div className="space-y-6 max-h-[450px] overflow-y-auto pr-1">
          {/* 1. Berita Tab */}
          {dashboardTab === 'berita' && (() => {
            const sortedNews = [...news].sort((a, b) => {
              return getItemTimestamp(b) - getItemTimestamp(a);
            });
            const activeItems = sortedNews.filter(item => item.showOnHomepage !== false);
            const inactiveItems = sortedNews.filter(item => item.showOnHomepage === false);
            return (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-mono">Aktif di Beranda ({activeItems.length}/3)</span>
                  {activeItems.length > 0 ? (
                    activeItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-emerald-50/15 border border-emerald-100 rounded-2xl">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#0E3B66] leading-snug tracking-tight truncate max-w-md sm:max-w-xl">{item.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider block mt-1 uppercase">KATEGORI: {item.category} • {item.date}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleNewsHomepage(item.id)}
                          className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>TAMPIL</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-left pl-2 text-xs text-slate-400 font-inter font-light">Belum ada berita yang ditampilkan di beranda.</p>
                  )}
                </div>

                <div className="space-y-2 pt-5 mt-4 border-t border-slate-300">
                  {inactiveItems.length > 0 ? (
                    inactiveItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/30 border border-slate-100 rounded-2xl">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#0E3B66] leading-snug tracking-tight truncate max-w-md sm:max-w-xl">{item.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider block mt-1 uppercase">KATEGORI: {item.category} • {item.date}</span>
                          </div>
                        </div>
                        {activeItems.length < 3 ? (
                          <button
                            type="button"
                            onClick={() => toggleNewsHomepage(item.id)}
                            className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>SEMBUNYI</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider bg-slate-100 border border-slate-200 text-slate-350 flex items-center gap-1.5 cursor-not-allowed shrink-0 select-none"
                            title="Limit 3 berita tercapai. Sembunyikan berita lain terlebih dahulu."
                          >
                            <X className="w-3.5 h-3.5 text-slate-350" />
                            <span>LIMIT</span>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-left pl-2 text-xs text-slate-400 font-inter font-light">Semua berita sudah ditampilkan di beranda.</p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 2. Galeri Tab */}
          {dashboardTab === 'galeri' && (() => {
            const activeItems = gallery.filter(item => item.showOnHomepage !== false);
            const inactiveItems = gallery.filter(item => item.showOnHomepage === false);
            return (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-mono block">Aktif di Beranda ({activeItems.length}/5)</span>
                  {activeItems.length > 0 ? (
                    activeItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-emerald-50/15 border border-emerald-100 rounded-2xl">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#0E3B66] leading-snug tracking-tight truncate max-w-md sm:max-w-xl">{item.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider block mt-1 uppercase">KATEGORI: {item.category}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleGalleryHomepage(item.id)}
                          className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>TAMPIL</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-left pl-2 text-xs text-slate-400 font-inter font-light">Belum ada foto yang ditampilkan di beranda.</p>
                  )}
                </div>

                <div className="space-y-2 pt-5 mt-4 border-t border-slate-300">
                  {inactiveItems.length > 0 ? (
                    inactiveItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/30 border border-slate-100 rounded-2xl">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#0E3B66] leading-snug tracking-tight truncate max-w-md sm:max-w-xl">{item.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider block mt-1 uppercase">KATEGORI: {item.category}</span>
                          </div>
                        </div>
                        {activeItems.length < 5 ? (
                          <button
                            type="button"
                            onClick={() => toggleGalleryHomepage(item.id)}
                            className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>SEMBUNYI</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider bg-slate-100 border border-slate-200 text-slate-350 flex items-center gap-1.5 cursor-not-allowed shrink-0 select-none"
                            title="Limit 5 foto galeri tercapai. Sembunyikan foto lain terlebih dahulu."
                          >
                            <X className="w-3.5 h-3.5 text-slate-350" />
                            <span>LIMIT</span>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-left pl-2 text-xs text-slate-400 font-inter font-light">Semua foto sudah ditampilkan di beranda.</p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 3. Agenda Tab */}
          {dashboardTab === 'agenda' && (() => {
            const sortedEvents = [...events].sort((a, b) => {
              return getItemTimestamp(b) - getItemTimestamp(a);
            });
            const activeItems = sortedEvents.filter(item => item.showOnHomepage !== false);
            const inactiveItems = sortedEvents.filter(item => item.showOnHomepage === false);
            return (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-mono block">Aktif di Beranda ({activeItems.length}/4)</span>
                  {activeItems.length > 0 ? (
                    activeItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-emerald-50/15 border border-emerald-100 rounded-2xl">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-left min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#0E3B66] leading-snug tracking-tight truncate max-w-md sm:max-w-xl">{item.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider block mt-1 uppercase">WAKTU: {item.time} • {item.date} • {item.location}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleEventsHomepage(item.id)}
                          className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>TAMPIL</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-left pl-2 text-xs text-slate-400 font-inter font-light">Belum ada agenda yang ditampilkan di beranda.</p>
                  )}
                </div>

                <div className="space-y-2 pt-5 mt-4 border-t border-slate-300">
                  {inactiveItems.length > 0 ? (
                    inactiveItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/30 border border-slate-100 rounded-2xl">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-left min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#0E3B66] leading-snug tracking-tight truncate max-w-md sm:max-w-xl">{item.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider block mt-1 uppercase">WAKTU: {item.time} • {item.date} • {item.location}</span>
                          </div>
                        </div>
                        {activeItems.length < 4 ? (
                          <button
                            type="button"
                            onClick={() => toggleEventsHomepage(item.id)}
                            className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>SEMBUNYI</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider bg-slate-100 border border-slate-200 text-slate-350 flex items-center gap-1.5 cursor-not-allowed shrink-0 select-none"
                            title="Limit 4 agenda tercapai. Sembunyikan agenda lain terlebih dahulu."
                          >
                            <X className="w-3.5 h-3.5 text-slate-350" />
                            <span>LIMIT</span>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-left pl-2 text-xs text-slate-400 font-inter font-light">Semua agenda sudah ditampilkan di beranda.</p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 4. Berkas Tab */}
          {dashboardTab === 'berkas' && (() => {
            const activeItems = services
              .filter(item => item.showOnHomepage !== false)
              .sort((a, b) => a.title.localeCompare(b.title, 'id', { sensitivity: 'base' }));
            const inactiveItems = services
              .filter(item => item.showOnHomepage === false)
              .sort((a, b) => a.title.localeCompare(b.title, 'id', { sensitivity: 'base' }));
            return (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-mono block">Aktif di Beranda ({activeItems.length}/3)</span>
                  {activeItems.length > 0 ? (
                    activeItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-emerald-50/15 border border-emerald-100 rounded-2xl">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                            <FileFormatIcon downloadUrl={item.downloadUrl} title={item.title} className="w-5 h-5 shrink-0" />
                          </div>
                          <div className="text-left min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#0E3B66] leading-snug tracking-tight truncate max-w-md sm:max-w-xl">{item.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider block mt-1 uppercase">KATEGORI: {item.category}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleServicesHomepage(item.id)}
                          className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>TAMPIL</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-left pl-2 text-xs text-slate-400 font-inter font-light">Belum ada berkas yang ditampilkan di beranda.</p>
                  )}
                </div>

                <div className="space-y-2 pt-5 mt-4 border-t border-slate-300">
                  {inactiveItems.length > 0 ? (
                    inactiveItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/30 border border-slate-100 rounded-2xl">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                            <FileFormatIcon downloadUrl={item.downloadUrl} title={item.title} className="w-5 h-5 shrink-0" />
                          </div>
                          <div className="text-left min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#0E3B66] leading-snug tracking-tight truncate max-w-md sm:max-w-xl">{item.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider block mt-1 uppercase">KATEGORI: {item.category}</span>
                          </div>
                        </div>
                        {activeItems.length < 3 ? (
                          <button
                            type="button"
                            onClick={() => toggleServicesHomepage(item.id)}
                            className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>SEMBUNYI</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider bg-slate-100 border border-slate-200 text-slate-350 flex items-center gap-1.5 cursor-not-allowed shrink-0 select-none"
                            title="Limit 3 berkas tercapai. Sembunyikan berkas lain terlebih dahulu."
                          >
                            <X className="w-3.5 h-3.5 text-slate-350" />
                            <span>LIMIT</span>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-left pl-2 text-xs text-slate-400 font-inter font-light">Semua berkas sudah ditampilkan di beranda.</p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
