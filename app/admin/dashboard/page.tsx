'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Newspaper,
  Image as ImageIcon,
  Calendar,
  FileText,
  TrendingUp,
  Sliders,
  ShieldAlert,
  ExternalLink,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  useNews,
  useEvents,
  useGallery,
  usePublicServices,
  useHeroSlides,
  usePriorityPrograms
} from '@/lib/data-store';

export default function AdminDashboard() {
  const [news] = useNews();
  const [events] = useEvents();
  const [gallery] = useGallery();
  const [services] = usePublicServices();
  const [heroSlides] = useHeroSlides();
  const [priorityPrograms] = usePriorityPrograms();

  // Dynamic state for complaints and external links
  const [complaints, setComplaints] = useState<any[]>([]);
  const [externalLinks, setExternalLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);

  // Fetch dynamic statistics
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [complaintsRes, externalLinksRes] = await Promise.all([
        fetch('/api/complaints'),
        fetch('/api/external-links')
      ]);
      if (complaintsRes.ok) {
        const data = await complaintsRes.json();
        if (data.success && Array.isArray(data.complaints)) {
          setComplaints(data.complaints);
        }
      }
      if (externalLinksRes.ok) {
        const data = await externalLinksRes.json();
        if (Array.isArray(data)) {
          setExternalLinks(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -------------------------------------------------------------
  // Complaints Breakdown
  // -------------------------------------------------------------
  const totalComplaints = complaints.length;
  const baruCount = complaints.filter(c => c.status === 'Baru').length;
  const diprosesCount = complaints.filter(c => c.status === 'Diproses').length;
  const selesaiCount = complaints.filter(c => c.status === 'Selesai').length;
  const ditolakCount = complaints.filter(c => c.status === 'Ditolak').length;

  const pctBaru = totalComplaints > 0 ? Math.round((baruCount / totalComplaints) * 100) : 0;
  const pctProses = totalComplaints > 0 ? Math.round((diprosesCount / totalComplaints) * 100) : 0;
  const pctSelesai = totalComplaints > 0 ? Math.round((selesaiCount / totalComplaints) * 100) : 0;
  const pctDitolak = totalComplaints > 0 ? Math.round((ditolakCount / totalComplaints) * 100) : 0;

  // Donut Ring calculations (Radius = 40, Circumference = 251.3)
  const c1 = 251.3;
  const lenBaru = (pctBaru / 100) * c1;
  const lenProses = (pctProses / 100) * c1;
  const lenSelesai = (pctSelesai / 100) * c1;
  const lenDitolak = (pctDitolak / 100) * c1;

  // -------------------------------------------------------------
  // Month Calculations & Multi Line Chart Data
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

  const getNewsCountForMonth = (monthIdx: number): number => {
    return news.filter((item) => {
      const part = item.id.split('-')[1];
      const timestamp = part ? Number(part) : NaN;
      if (!isNaN(timestamp) && timestamp > 1000000000000) {
        return new Date(timestamp).getMonth() === monthIdx;
      }
      return getMonthIndex(item.date) === monthIdx;
    }).length;
  };

  const getEventsCountForMonth = (monthIdx: number): number => {
    return events.filter((item) => {
      const part = item.id.split('-')[1];
      const timestamp = part ? Number(part) : NaN;
      if (!isNaN(timestamp) && timestamp > 1000000000000) {
        return new Date(timestamp).getMonth() === monthIdx;
      }
      return getMonthIndex(item.date) === monthIdx;
    }).length;
  };

  const getGalleryCountForMonth = (monthIdx: number): number => {
    return gallery.filter((item) => {
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
  };

  const getComplaintsCountForMonth = (monthIdx: number): number => {
    return complaints.filter((item) => {
      if (item.createdAt) {
        return new Date(item.createdAt).getMonth() === monthIdx;
      }
      return false;
    }).length;
  };

  // Compile monthly values
  const monthlyNews = lineChartMonths.map(m => getNewsCountForMonth(m.index));
  const monthlyEvents = lineChartMonths.map(m => getEventsCountForMonth(m.index));
  const monthlyGallery = lineChartMonths.map(m => getGalleryCountForMonth(m.index));
  const monthlyComplaints = lineChartMonths.map(m => getComplaintsCountForMonth(m.index));

  const maxCountVal = Math.max(
    10,
    ...monthlyNews,
    ...monthlyEvents,
    ...monthlyGallery,
    ...monthlyComplaints
  );

  // SVG Coordinates mapping: viewBox = 0 0 500 200
  // Y-axis spans from y=20 (max) to y=180 (0 value). Height = 160.
  // X-axis spans from x=45 (Jan) to x=470 (Jun). Gap = 85.
  const getX = (idx: number) => 45 + idx * 85;
  const getY = (val: number) => 180 - (val / maxCountVal) * 160;

  const buildPath = (dataArr: number[]) => {
    return "M " + dataArr.map((val, idx) => `${getX(idx)},${getY(val)}`).join(" L ");
  };

  const newsPath = buildPath(monthlyNews);
  const eventsPath = buildPath(monthlyEvents);
  const galleryPath = buildPath(monthlyGallery);
  const complaintsPath = buildPath(monthlyComplaints);

  // -------------------------------------------------------------
  // Horizontal Bar Chart (Konten per Modul)
  // -------------------------------------------------------------
  const barData = [
    { label: 'Hero Slider', val: heroSlides.length, color: '#25517a' },
    { label: 'Publikasi Beranda', val: news.filter(n => n.showOnHomepage).length, color: '#0D3357' },
    { label: 'Pilar Program', val: priorityPrograms.length, color: '#FF7A00' },
    { label: 'Berita', val: news.length, color: '#0E3B66' },
    { label: 'Agenda Event', val: events.length, color: '#FF9433' },
    { label: 'Galeri Foto', val: gallery.length, color: '#3B6C9C' },
    { label: 'Berkas Layanan', val: services.length, color: '#5283B3' }
  ];
  const maxBarVal = Math.max(10, ...barData.map(b => b.val));

  // -------------------------------------------------------------
  // Recent Complaints Log (5 items)
  // -------------------------------------------------------------
  const recentComplaints = [...complaints]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const getStatusTextBadge = (status: string) => {
    switch (status) {
      case 'Baru':
        return <span className="text-[10px] font-extrabold text-blue-600 tracking-wider uppercase">[BARU]</span>;
      case 'Diproses':
        return <span className="text-[10px] font-extrabold text-amber-500 tracking-wider uppercase">[DIPROSES]</span>;
      case 'Selesai':
        return <span className="text-[10px] font-extrabold text-emerald-600 tracking-wider uppercase">[SELESAI]</span>;
      case 'Ditolak':
        return <span className="text-[10px] font-extrabold text-red-650 tracking-wider uppercase">[DITOLAK]</span>;
      default:
        return <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase">[{status.toUpperCase()}]</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Baru':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold font-mono uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
            <Clock className="w-2.5 h-2.5 shrink-0" />
            <span>BARU</span>
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <Clock className="w-2.5 h-2.5 shrink-0" />
            <span>DIPROSES</span>
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle className="w-2.5 h-2.5 shrink-0" />
            <span>SELESAI</span>
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold font-mono uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-2.5 h-2.5 shrink-0" />
            <span>DITOLAK</span>
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="pt-4 md:pt-6 space-y-6 animate-fade-in text-left font-inter">
      {/* Grid Summary Cards (5 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {[
          { title: 'Berita', count: news.length, icon: <Newspaper className="w-5 h-5 text-[#0E3B66]" /> },
          { title: 'Agenda', count: events.length, icon: <Calendar className="w-5 h-5 text-[#FF7A00]" /> },
          { title: 'Galeri', count: gallery.length, icon: <ImageIcon className="w-5 h-5 text-[#0E3B66]" /> },
          { title: 'Berkas', count: services.length, icon: <FileText className="w-5 h-5 text-emerald-600" /> },
          { title: 'Aduan', count: totalComplaints, icon: <ShieldAlert className="w-5 h-5 text-rose-600" /> }
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-[20px] border border-slate-200/60 shadow-sm bg-white flex items-center justify-between transition-all hover:scale-[1.02] hover:shadow-md h-full"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block leading-none">
                {stat.title}
              </span>
              <span className="text-2xl font-black text-[#0E3B66] font-mono block leading-none">
                {stat.count}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Row 1: Line Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Multi-Line Chart (Aktivitas Bulanan) */}
        <div className="lg:col-span-8 bg-white rounded-[20px] border border-slate-200/60 p-6 shadow-sm flex flex-col justify-between relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FF7A00]" />
                <span>Aktivitas Bulanan</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Perbandingan tren unggahan berita, event, galeri, dan laporan aduan</p>
            </div>
            <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold font-mono px-2.5 py-1 rounded-md uppercase self-start sm:self-auto">Multi Line Chart</span>
          </div>

          {/* Legend Horizontal */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-[10px] font-bold font-mono uppercase tracking-wider select-none border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0E3B66]" />
              <span className="text-slate-600">Berita</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00]" />
              <span className="text-slate-600">Agenda Event</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
              <span className="text-slate-650 font-medium">Galeri Foto</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
              <span className="text-slate-650 font-medium">Pengaduan</span>
            </div>
          </div>

          {/* SVG Multi Line Chart Area */}
          <div className="relative w-full h-72 border border-slate-100/50 bg-slate-50/50 rounded-[20px] p-4 flex items-center justify-center select-none">
            <svg viewBox="0 0 500 210" className="w-full h-full overflow-visible">
              {/* Horizontal Grid Lines */}
              <line x1="35" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="35" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="35" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="35" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="35" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="25" y="24" textAnchor="end" className="font-semibold fill-slate-400 font-mono text-[9px]">{maxCountVal}</text>
              <text x="25" y="64" textAnchor="end" className="font-semibold fill-slate-400 font-mono text-[9px]">{Math.round(maxCountVal * 0.75)}</text>
              <text x="25" y="104" textAnchor="end" className="font-semibold fill-slate-400 font-mono text-[9px]">{Math.round(maxCountVal * 0.5)}</text>
              <text x="25" y="144" textAnchor="end" className="font-semibold fill-slate-400 font-mono text-[9px]">{Math.round(maxCountVal * 0.25)}</text>
              <text x="25" y="184" textAnchor="end" className="font-semibold fill-slate-400 font-mono text-[9px]">0</text>

              {/* X Axis Labels */}
              {lineChartMonths.map((m, idx) => (
                <text key={idx} x={getX(idx)} y="198" textAnchor="middle" className="font-extrabold fill-slate-500 font-mono text-[9px]">{m.short}</text>
              ))}

              {/* Dotted Vertical Hover Line */}
              {hoveredMonthIdx !== null && (
                <line
                  x1={getX(hoveredMonthIdx)}
                  y1="20"
                  x2={getX(hoveredMonthIdx)}
                  y2="180"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}

              {/* SVG paths representing lines */}
              <path d={newsPath} fill="none" stroke="#0E3B66" strokeWidth="3" strokeLinecap="round" className="transition-all duration-300" />
              <path d={eventsPath} fill="none" stroke="#FF7A00" strokeWidth="3" strokeLinecap="round" className="transition-all duration-300" />
              <path d={galleryPath} fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" className="transition-all duration-300" />
              <path d={complaintsPath} fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" className="transition-all duration-300" />

              {/* Anchor Node Circles */}
              {lineChartMonths.map((_, idx) => (
                <g key={idx}>
                  {/* News node */}
                  <circle cx={getX(idx)} cy={getY(monthlyNews[idx])} r={hoveredMonthIdx === idx ? 6 : 4} className="fill-white stroke-[#0E3B66] stroke-[2.5] transition-all" />
                  {/* Events node */}
                  <circle cx={getX(idx)} cy={getY(monthlyEvents[idx])} r={hoveredMonthIdx === idx ? 6 : 4} className="fill-white stroke-[#FF7A00] stroke-[2.5] transition-all" />
                  {/* Gallery node */}
                  <circle cx={getX(idx)} cy={getY(monthlyGallery[idx])} r={hoveredMonthIdx === idx ? 6 : 4} className="fill-white stroke-[#8B5CF6] stroke-[2.5] transition-all" />
                  {/* Complaints node */}
                  <circle cx={getX(idx)} cy={getY(monthlyComplaints[idx])} r={hoveredMonthIdx === idx ? 6 : 4} className="fill-white stroke-[#F43F5E] stroke-[2.5] transition-all" />
                </g>
              ))}

              {/* Invisible interactive vertical columns for hover tooltip triggering */}
              {lineChartMonths.map((_, idx) => (
                <rect
                  key={idx}
                  x={getX(idx) - 25}
                  y="15"
                  width="50"
                  height="170"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredMonthIdx(idx)}
                  onMouseLeave={() => setHoveredMonthIdx(null)}
                />
              ))}
            </svg>

            {/* Hover Tooltip Overlay Card */}
            {hoveredMonthIdx !== null && (
              <div
                className="absolute z-10 bg-[#051424]/95 text-white p-3.5 rounded-2xl shadow-xl space-y-2 pointer-events-none transition-all font-inter text-left min-w-[170px] border border-white/10"
                style={{
                  top: '25px',
                  left: `${hoveredMonthIdx >= 3 ? getX(hoveredMonthIdx) * 1.05 - 195 : getX(hoveredMonthIdx) * 1.05 + 15}px`
                }}
              >
                <div className="font-mono text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-white/10 pb-1.5">
                  {lineChartMonths[hoveredMonthIdx].full}
                </div>
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                    <span className="text-slate-300 font-medium">Berita:</span>
                    <span className="font-mono font-bold ml-auto">{monthlyNews[hoveredMonthIdx]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                    <span className="text-slate-300 font-medium">Agenda:</span>
                    <span className="font-mono font-bold ml-auto">{monthlyEvents[hoveredMonthIdx]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                    <span className="text-slate-300 font-medium">Galeri:</span>
                    <span className="font-mono font-bold ml-auto">{monthlyGallery[hoveredMonthIdx]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
                    <span className="text-slate-300 font-medium">Pengaduan:</span>
                    <span className="font-mono font-bold ml-auto">{monthlyComplaints[hoveredMonthIdx]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart (Status Pengaduan) */}
        <div className="lg:col-span-4 bg-white rounded-[20px] border border-slate-200/60 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Status Pengaduan</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Daftar resolusi aduan masyarakat</p>
            </div>
            <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold font-mono px-2.5 py-1 rounded-md uppercase">Donut Chart</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 border border-slate-150/40 bg-slate-50/50 rounded-2xl">
            {/* Donut Ring visualization */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle cx="60" cy="60" r="40" stroke="#E2E8F0" strokeWidth="9" fill="none" />

                {totalComplaints > 0 ? (
                  <>
                    {/* Selesai Arc */}
                    {pctSelesai > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r="40"
                        stroke="#10B981"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${lenSelesai} ${c1}`}
                        strokeDashoffset={0}
                        transform="rotate(-90 60 60)"
                        className="transition-all duration-500"
                      />
                    )}
                    {/* Diproses Arc */}
                    {pctProses > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r="40"
                        stroke="#FF7A00"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${lenProses} ${c1}`}
                        strokeDashoffset={-lenSelesai}
                        transform="rotate(-90 60 60)"
                        className="transition-all duration-500"
                      />
                    )}
                    {/* Baru Arc */}
                    {pctBaru > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r="40"
                        stroke="#3B82F6"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${lenBaru} ${c1}`}
                        strokeDashoffset={-(lenSelesai + lenProses)}
                        transform="rotate(-90 60 60)"
                        className="transition-all duration-500"
                      />
                    )}
                    {/* Ditolak Arc */}
                    {pctDitolak > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r="40"
                        stroke="#EF4444"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${lenDitolak} ${c1}`}
                        strokeDashoffset={-(lenSelesai + lenProses + lenBaru)}
                        transform="rotate(-90 60 60)"
                        className="transition-all duration-500"
                      />
                    )}
                  </>
                ) : (
                  <circle cx="60" cy="60" r="40" stroke="#CBD5E1" strokeWidth="10" fill="none" />
                )}
              </svg>

              {/* Total label at center */}
              <div className="absolute text-center">
                <span className="text-2xl font-black text-[#0E3B66] font-mono leading-none block">{totalComplaints}</span>
                <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block mt-1 font-mono">Total Aduan</span>
              </div>
            </div>

            {/* Labels and Percentages */}
            <div className="w-full space-y-2 mt-5 text-[10px] font-mono">
              <div className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-500 font-bold uppercase">Selesai:</span>
                </div>
                <span className="font-extrabold text-slate-800">{selesaiCount} ({pctSelesai}%)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00] shrink-0" />
                  <span className="text-slate-500 font-bold uppercase">Diproses:</span>
                </div>
                <span className="font-extrabold text-slate-800">{diprosesCount} ({pctProses}%)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-slate-500 font-bold uppercase">Baru:</span>
                </div>
                <span className="font-extrabold text-slate-800">{baruCount} ({pctBaru}%)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="text-slate-500 font-bold uppercase">Ditolak:</span>
                </div>
                <span className="font-extrabold text-slate-800">{ditolakCount} ({pctDitolak}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Horizontal Bar & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Horizontal Bar Chart (Konten per Modul) */}
        <div className="lg:col-span-6 bg-white rounded-[20px] border border-slate-200/60 p-6 shadow-sm flex flex-col justify-between h-[420px]">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#FF7A00]" />
              <span>Konten per Modul</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Distribusi jumlah konten aktif per modul sistem</p>
          </div>

          <div className="flex-grow flex flex-col justify-center h-[320px] mt-4">
            <div className="flex flex-col gap-[18px]">
              {barData.map((bar, idx) => {
                const pct = maxBarVal > 0 ? (bar.val / maxBarVal) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center text-xs">
                    <span className="w-[160px] text-slate-600 pr-4 text-left font-semibold truncate">
                      {bar.label}
                    </span>
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <div className="flex-1 bg-slate-100 rounded-full h-[18px] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: bar.color || '#0E3B66'
                          }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-700 w-8 text-right shrink-0">
                        {bar.val}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-time recent complaints (Aduan Masuk Terbaru) */}
        <div className="lg:col-span-6 bg-white rounded-[20px] border border-slate-200/60 p-6 shadow-sm flex flex-col justify-between h-[420px]">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#FF7A00]" />
                <span>Aduan Masuk Terbaru</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Daftar laporan pengaduan internal terakhir dari warga</p>
            </div>

            <div className="flex-grow flex flex-col justify-center my-4 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {recentComplaints.map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                        {getStatusTextBadge(item.status)}
                        <span>•</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                ))}
                {recentComplaints.length === 0 && (
                  <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center">
                    <ShieldAlert className="w-8 h-8 opacity-20 mb-2" />
                    <span className="font-mono text-[9px] font-black uppercase tracking-wider">Belum ada aduan masuk</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-start">
              <a
                href="/admin/pengaduan/internal"
                className="text-xs font-bold tracking-[0.2em] text-[#0E3B66] hover:text-[#FF7A00] flex items-center gap-1.5 active:translate-x-0.5 transition-all uppercase"
              >
                <span>Lihat Semua Pengaduan →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
