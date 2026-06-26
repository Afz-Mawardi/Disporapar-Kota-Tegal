'use client';

import React from 'react';
import {
  Newspaper,
  Image as ImageIcon,
  Calendar,
  FileText,
  TrendingUp,
  Sliders
} from 'lucide-react';
import {
  useNews,
  useEvents,
  useGallery,
  usePublicServices,
  useHeroSlides
} from '@/lib/data-store';

export default function AdminDashboard() {
  const [news] = useNews();
  const [events] = useEvents();
  const [gallery] = useGallery();
  const [services] = usePublicServices();
  const [heroSlides] = useHeroSlides();

  // -------------------------------------------------------------
  // Chart Calculations
  // -------------------------------------------------------------
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const fullMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const getMonthIndex = (dateStr?: string): number => {
    if (!dateStr) return -1;
    const lower = dateStr.toLowerCase();
    if (lower.includes('januari') || lower.includes('jan')) return 0;
    if (lower.includes('februari') || lower.includes('feb')) return 1;
    if (lower.includes('maret') || lower.includes('mar')) return 2;
    if (lower.includes('april') || lower.includes('apr')) return 3;
    if (lower.includes('mei')) return 4;
    if (lower.includes('juni') || lower.includes('jun')) return 5;
    if (lower.includes('juli') || lower.includes('jul')) return 6;
    if (lower.includes('agustus') || lower.includes('agu')) return 7;
    if (lower.includes('september') || lower.includes('sep')) return 8;
    if (lower.includes('oktober') || lower.includes('okt')) return 9;
    if (lower.includes('november') || lower.includes('nov')) return 10;
    if (lower.includes('desember') || lower.includes('des')) return 11;
    return -1;
  };

  const currentMonthIdx = new Date().getMonth();
  const lineChartMonths = Array.from({ length: 6 }).map((_, i) => {
    const idx = (currentMonthIdx - (5 - i) + 12) % 12;
    return {
      short: shortMonths[idx],
      full: fullMonths[idx],
      index: idx
    };
  });

  const getMonthlyActivityCount = (monthIdx: number): number => {
    const newsCount = news.filter((item) => {
      const part = item.id.split('-')[1];
      const timestamp = part ? Number(part) : NaN;
      if (!isNaN(timestamp) && timestamp > 1000000000000) {
        return new Date(timestamp).getMonth() === monthIdx;
      }
      return getMonthIndex(item.date) === monthIdx;
    }).length;

    const eventsCount = events.filter((item) => {
      const part = item.id.split('-')[1];
      const timestamp = part ? Number(part) : NaN;
      if (!isNaN(timestamp) && timestamp > 1000000000000) {
        return new Date(timestamp).getMonth() === monthIdx;
      }
      return getMonthIndex(item.date) === monthIdx;
    }).length;

    const galleryCount = gallery.filter((item) => {
      const part = item.id.split('-')[1];
      const timestamp = part ? Number(part) : NaN;
      if (!isNaN(timestamp) && timestamp > 1000000000000) {
        return new Date(timestamp).getMonth() === monthIdx;
      }
      const num = Number(item.id.replace('g-', ''));
      if (!isNaN(num)) {
        if (num <= 2) return monthIdx === 1;
        if (num <= 4) return monthIdx === 2;
        if (num <= 6) return monthIdx === 3;
        return monthIdx === 4;
      }
      return false;
    }).length;

    const servicesCount = services.filter((item) => {
      const part = item.id.split('-')[1];
      const timestamp = part ? Number(part) : NaN;
      if (!isNaN(timestamp) && timestamp > 1000000000000) {
        return new Date(timestamp).getMonth() === monthIdx;
      }
      const num = Number(item.id.replace('s-', ''));
      if (!isNaN(num)) {
        if (num <= 2) return monthIdx === 0;
        if (num <= 4) return monthIdx === 1;
        if (num <= 6) return monthIdx === 2;
        if (num <= 8) return monthIdx === 3;
        return monthIdx === 4;
      }
      return false;
    }).length;

    const slidesCount = heroSlides.filter((item) => {
      const part = item.id.split('-')[1];
      const timestamp = part ? Number(part) : NaN;
      if (!isNaN(timestamp) && timestamp > 1000000000000) {
        return new Date(timestamp).getMonth() === monthIdx;
      }
      return monthIdx === 0;
    }).length;

    return newsCount + eventsCount + galleryCount + servicesCount + slidesCount;
  };

  const activityCounts = lineChartMonths.map(m => getMonthlyActivityCount(m.index));
  const maxActivityVal = Math.max(10, ...activityCounts);

  const lineChartPoints = lineChartMonths.map((m, idx) => {
    const x = 45 + idx * 87;
    const count = activityCounts[idx];
    const y = 180 - (count / maxActivityVal) * 150;
    return { x, y, count, label: m.short };
  });

  const linePathD = "M " + lineChartPoints.map(p => `${p.x},${p.y}`).join(" L ");
  const areaPathD = `M ${lineChartPoints[0].x},180 L ` + lineChartPoints.map(p => `${p.x},${p.y}`).join(" L ") + ` L ${lineChartPoints[lineChartPoints.length - 1].x},180 Z`;

  const barChartData = [
    { name: 'Berita', x: 55, val: news.length, color: '#2D9CDB' },
    { name: 'Galeri', x: 135, val: gallery.length, color: '#9B51E0' },
    { name: 'Agenda', x: 215, val: events.length, color: '#F2994A' },
    { name: 'Berkas', x: 295, val: services.length, color: '#27AE60' }
  ];

  const maxBarVal = Math.max(10, ...barChartData.map(b => b.val));

  return (
    <div className="space-y-8 animate-fade-in text-left">

      {/* Stat summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Berita', count: news.length, icon: <Newspaper className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50/50 border-blue-100' },
          { title: 'Dokumentasi Galeri', count: gallery.length, icon: <ImageIcon className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50/50 border-purple-100' },
          { title: 'Agenda Terdaftar', count: events.length, icon: <Calendar className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50/50 border-amber-100' },
          { title: 'Berkas Unduhan', count: services.length, icon: <FileText className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50/50 border-emerald-100' }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl bg-white border shadow-xs flex items-center justify-between ${stat.bg}`}>
            <div className="min-w-0 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block leading-none truncate">{stat.title}</span>
              <span className="text-2xl sm:text-3xl font-black text-[#0E3B66] font-mono block mt-1.5 leading-none">{stat.count}</span>
            </div>
            <div className="p-2 bg-white border border-slate-100 rounded-xl shadow-xs shrink-0 ml-3">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* line chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span>Tren Aktivitas Bulanan</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-inter mt-1">Total unggahan berita & agenda bulanan</p>
            </div>
            <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold font-mono px-2.5 py-1 rounded-md uppercase">LINE CHART</span>
          </div>

          <div className="relative w-full h-64 border border-slate-100/50 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-center select-none font-inter text-[9px] font-medium text-slate-400">
            <svg viewBox="0 0 500 230" className="w-full h-full overflow-visible">
              <line x1="45" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="65" x2="480" y2="65" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="155" x2="480" y2="155" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="45" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

              <text x="35" y="24" textAnchor="end" className="font-semibold fill-slate-400 text-[10px]">{maxActivityVal}</text>
              <text x="35" y="69" textAnchor="end" className="font-semibold fill-slate-400 text-[10px]">{Math.round(maxActivityVal * 0.75)}</text>
              <text x="35" y="114" textAnchor="end" className="font-semibold fill-slate-400 text-[10px]">{Math.round(maxActivityVal * 0.5)}</text>
              <text x="35" y="159" textAnchor="end" className="font-semibold fill-slate-400 text-[10px]">{Math.round(maxActivityVal * 0.25)}</text>
              <text x="35" y="184" textAnchor="end" className="font-semibold fill-slate-400 text-[10px]">0</text>

              {lineChartPoints.map((pt, idx) => (
                <text key={idx} x={pt.x} y="208" textAnchor="middle" className="font-bold fill-slate-500 text-[10px]">{pt.label}</text>
              ))}

              <defs>
                <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F2994A" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#F2994A" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d={areaPathD} fill="url(#line-gradient)" className="transition-all duration-500 ease-out" />
              <path
                d={linePathD}
                fill="none"
                stroke="#F2994A"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
                style={{ filter: 'drop-shadow(0px 3px 6px rgba(242,153,74,0.3))' }}
              />

              {lineChartPoints.map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle cx={pt.x} cy={pt.y} r="7" className="fill-white stroke-accent stroke-[3] group-hover:r-[9] transition-all" />
                  <circle cx={pt.x} cy={pt.y} r="14" className="fill-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <text x={pt.x} y={pt.y - 14} textAnchor="middle" className="opacity-0 group-hover:opacity-100 fill-[#0E3B66] font-bold text-[10px] transition-opacity">
                    {pt.count} Aktivitas
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* bar chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-650" />
                <span>Distribusi Data Modul</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-inter mt-1">Jumlah data aktif per kategori konten</p>
            </div>
            <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold font-mono px-2.5 py-1 rounded-md uppercase">BAR CHART</span>
          </div>

          <div className="relative w-full h-64 border border-slate-100/50 bg-slate-50/50 rounded-2xl p-5 flex items-center justify-center select-none font-inter text-[9px] font-medium text-slate-400">
            <svg viewBox="0 0 350 210" className="w-full h-full overflow-visible">
              <line x1="30" y1="20" x2="330" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="70" x2="330" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="120" x2="330" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="160" x2="330" y2="160" stroke="#cbd5e1" strokeWidth="1" />

              {barChartData.map((bar, idx) => {
                const barHeight = Math.max(15, (bar.val / maxBarVal) * 125);
                const y = 160 - barHeight;

                return (
                  <g key={idx} className="group cursor-pointer">
                    <defs>
                      <linearGradient id={`bar-gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={bar.color} />
                        <stop offset="100%" stopColor={bar.color} stopOpacity="0.3" />
                      </linearGradient>
                    </defs>

                    <rect
                      x={bar.x - 18}
                      y={y}
                      width="36"
                      height={barHeight}
                      rx="6"
                      fill={`url(#bar-gradient-${idx})`}
                      className="transition-all duration-550 group-hover:fill-opacity-90"
                    />
                    <text x={bar.x} y={y - 8} textAnchor="middle" className="font-bold fill-slate-800 font-mono text-[10px]">{bar.val}</text>
                    <text x={bar.x} y="185" textAnchor="middle" className="font-bold fill-slate-550 text-[10px]">{bar.name}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
