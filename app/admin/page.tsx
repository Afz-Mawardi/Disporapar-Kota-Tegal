'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useNews,
  useEvents,
  useGallery,
  usePublicServices,
  useOfficeInfo
} from '@/lib/data-store';
import {
  ShieldAlert,
  Newspaper,
  Image as ImageIcon,
  Calendar,
  FileText,
  Phone,
  LogOut,
  LayoutDashboard,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  CheckCircle,
  X,
  Upload,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Mail,
  Menu
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/Logo';

// Helper to parse Indonesian date format (e.g. "24 Mei 2026") to YYYY-MM-DD
const parseIndonesianDateToYYYYMMDD = (dateStr: string): string => {
  if (!dateStr) return '';
  const months: { [key: string]: string } = {
    'januari': '01', 'februari': '02', 'maret': '03', 'april': '04', 'mei': '05', 'juni': '06',
    'juli': '07', 'agustus': '08', 'september': '09', 'oktober': '10', 'november': '11', 'desember': '12',
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'jun': '06', 'jul': '07', 'agu': '08',
    'sep': '09', 'okt': '10', 'nov': '11', 'des': '12'
  };
  const parts = dateStr.toLowerCase().trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const monthName = parts[1];
    const year = parts[2];
    const month = months[monthName] || '01';
    return `${year}-${month}-${day}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  return '';
};

// Helper to parse Time range (e.g. "08:00 - 12:00 WIB") into start and end times
const parseTimeRange = (timeStr?: string) => {
  if (!timeStr) return { start: '08:00', end: '12:00' };
  const cleaned = timeStr.replace(/wib/i, '').trim();
  const parts = cleaned.split('-');
  const start = parts[0] ? parts[0].trim() : '08:00';
  const end = parts[1] ? parts[1].trim() : '12:00';
  return { start, end };
};

export default function AdminPage() {
  const router = useRouter();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'berita' | 'galeri' | 'agenda' | 'berkas' | 'kontak'>('dashboard');

  // Dynamic Data States
  const [news, setNews] = useNews();
  const [events, setEvents] = useEvents();
  const [gallery, setGallery] = useGallery();
  const [services, setServices] = usePublicServices();
  const [officeInfo, setOfficeInfo] = useOfficeInfo();

  // CRUD Editing States
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');

  // Search Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Notification States
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // File Upload Helper State
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>('');

  // Document Upload Helper States
  const [uploadedFileBase64, setUploadedFileBase64] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');

  // Check login on mount
  useEffect(() => {
    const session = localStorage.getItem('disporapar_admin_session');
    if (session === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin123' && password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('disporapar_admin_session', 'true');
      showNotification('Berhasil masuk ke panel admin!', 'success');
    } else {
      setLoginError('Username atau password salah.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('disporapar_admin_session');
    showNotification('Berhasil keluar.', 'success');
  };

  // Notification Trigger
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Convert File to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotification('Ukuran gambar maksimal 2MB untuk penyimpanan lokal.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert Document File and calculate its size
  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Ukuran berkas maksimal 5MB.', 'error');
        return;
      }
      
      let sizeStr = '';
      if (file.size >= 1024 * 1024) {
        sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      } else {
        sizeStr = Math.round(file.size / 1024) + ' KB';
      }
      
      setUploadedFileSize(sizeStr);
      setUploadedFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // CRUD Actions
  // ==========================================

  // Open Form Modal
  const openForm = (type: 'add' | 'edit', item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setUploadedImageBase64('');
    setUploadedFileBase64('');
    setUploadedFileName('');
    setUploadedFileSize('');
    if (type === 'edit') {
      setUploadedImageBase64(item.imageUrl || '');
      if (activeTab === 'berkas' && item) {
        setUploadedFileSize(item.fileSize || '');
        if (item.downloadUrl && item.downloadUrl.startsWith('data:')) {
          setUploadedFileBase64(item.downloadUrl);
          setUploadedFileName('Berkas Terunggah');
        }
      }
    }
    setIsModalOpen(true);
  };

  // Open Delete Confirmation
  const openDeleteConfirm = (item: any) => {
    setModalType('delete');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Handle Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (modalType === 'delete') {
      // Execute Delete
      if (activeTab === 'berita') {
        setNews(news.filter((n) => n.id !== editingItem.id));
      } else if (activeTab === 'galeri') {
        setGallery(gallery.filter((g) => g.id !== editingItem.id));
      } else if (activeTab === 'agenda') {
        setEvents(events.filter((ev) => ev.id !== editingItem.id));
      } else if (activeTab === 'berkas') {
        setServices(services.filter((s) => s.id !== editingItem.id));
      }
      showNotification('Data berhasil dihapus.', 'success');
      setIsModalOpen(false);
      setEditingItem(null);
      return;
    }

    // Save Create / Update
    if (activeTab === 'berita') {
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;
      // Auto-generate excerpt from content: take first 150 characters
      const cleanContent = content ? content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';
      const excerpt = cleanContent.length > 150
        ? cleanContent.substring(0, 150) + '...'
        : cleanContent;
      const category = formData.get('category') as any;
      const author = formData.get('author') as string;
      const dateVal = formData.get('date') as string;
      let date = dateVal;
      if (dateVal) {
        const dateParts = dateVal.split('-');
        if (dateParts.length === 3) {
          const d = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
          date = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
      } else {
        date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      const imageUrl = uploadedImageBase64 || formData.get('imageUrl') as string || 'https://picsum.photos/seed/default/800/600';

      if (modalType === 'add') {
        const newItem = {
          id: `news-${Date.now()}`,
          title,
          excerpt,
          content,
          category,
          date,
          imageUrl,
          author,
          featured: formData.get('featured') === 'on'
        };
        setNews([newItem, ...news]);
        showNotification('Berita berhasil ditambahkan.', 'success');
      } else {
        setNews(news.map((item) => item.id === editingItem.id ? {
          ...item,
          title,
          excerpt,
          content,
          category,
          author,
          date,
          imageUrl,
          featured: formData.get('featured') === 'on'
        } : item));
        showNotification('Berita berhasil diubah.', 'success');
      }
    } else if (activeTab === 'galeri') {
      const title = formData.get('title') as string;
      const category = formData.get('category') as string;
      const imageUrl = uploadedImageBase64 || formData.get('imageUrl') as string || 'https://picsum.photos/seed/default_galeri/800/600';

      if (modalType === 'add') {
        const newItem = {
          id: `g-${Date.now()}`,
          title,
          category,
          imageUrl
        };
        setGallery([newItem, ...gallery]);
        showNotification('Foto galeri berhasil ditambahkan.', 'success');
      } else {
        setGallery(gallery.map((item) => item.id === editingItem.id ? {
          ...item,
          title,
          category,
          imageUrl
        } : item));
        showNotification('Foto galeri berhasil diubah.', 'success');
      }
    } else if (activeTab === 'agenda') {
      const title = formData.get('title') as string;
      const dateVal = formData.get('date') as string; // in YYYY-MM-DD
      const startTime = formData.get('startTime') as string || '08:00';
      const endTime = formData.get('endTime') as string || '12:00';
      const time = `${startTime} - ${endTime} WIB`;
      const location = formData.get('location') as string;
      const category = formData.get('category') as any;
      const description = formData.get('description') as string;

      // Format YYYY-MM-DD to Indonesian "DD Bulan YYYY"
      let dateString = dateVal;
      if (dateVal) {
        const dateParts = dateVal.split('-');
        if (dateParts.length === 3) {
          const d = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
          dateString = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
      }

      if (modalType === 'add') {
        const newItem = {
          id: `e-${Date.now()}`,
          title,
          date: dateString,
          time,
          location,
          category,
          description,
          imageUrl: 'https://picsum.photos/seed/agenda_def/800/600'
        };
        setEvents([newItem, ...events]);
        showNotification('Agenda berhasil ditambahkan.', 'success');
      } else {
        setEvents(events.map((item) => item.id === editingItem.id ? {
          ...item,
          title,
          date: dateString,
          time,
          location,
          category,
          description
        } : item));
        showNotification('Agenda berhasil diubah.', 'success');
      }
    } else if (activeTab === 'berkas') {
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as any;
      const urlInput = formData.get('downloadUrl') as string;
      const downloadUrl = uploadedFileBase64 || urlInput || '#';
      let fileSize = uploadedFileSize;
      if (!fileSize) {
        if (urlInput && urlInput !== '#') {
          fileSize = 'Tautan';
        } else {
          fileSize = editingItem?.fileSize || '1.0 MB';
        }
      }

      if (modalType === 'add') {
        const newItem = {
          id: `s-${Date.now()}`,
          title,
          description,
          category,
          downloadUrl,
          fileSize
        };
        setServices([newItem, ...services]);
        showNotification('Berkas berhasil ditambahkan.', 'success');
      } else {
        setServices(services.map((item) => item.id === editingItem.id ? {
          ...item,
          title,
          description,
          category,
          downloadUrl,
          fileSize
        } : item));
        showNotification('Berkas berhasil diubah.', 'success');
      }
    }

    setIsModalOpen(false);
    setEditingItem(null);
    setUploadedImageBase64('');
  };

  // Handle Contact Office Update
  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const operationalHours = formData.get('operationalHours') as string;
    const instagramResmi = formData.get('instagramResmi') as string;
    const instagramTourism = formData.get('instagramTourism') as string;
    const instagramPemuda = formData.get('instagramPemuda') as string;
    const youtube = formData.get('youtube') as string;
    const gmapsEmbedUrl = formData.get('gmapsEmbedUrl') as string;

    setOfficeInfo({
      address,
      phone,
      email,
      operationalHours,
      socialMedia: {
        instagramResmi,
        instagramTourism,
        instagramPemuda,
        youtube
      },
      gmapsEmbedUrl
    });

    showNotification('Informasi kontak dinas berhasil diperbarui!', 'success');
  };

  // Filter lists based on search query
  const getFilteredData = () => {
    if (activeTab === 'berita') {
      return news.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === 'galeri') {
      return gallery.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === 'agenda') {
      return events.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === 'berkas') {
      return services.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  };

  // ==========================================
  // Render Login Panel
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-tr from-[#051424] via-[#0E3B66] to-[#124b82] flex items-center justify-center p-4 selection:bg-accent selection:text-white font-sans text-slate-800">

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative z-10 text-white flex flex-col justify-between">
          <div className="text-center space-y-3.5">
            <div className="flex justify-center mb-6">
              <Logo variant="dark" className="scale-110" />
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-inter max-w-[280px] mx-auto">
              Portal Keamanan Administrasi Dinas. Masukkan kredensial admin untuk mengakses panel kendali.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5 text-left font-inter text-slate-700">
            {loginError && (
              <div className="bg-red-500/25 border border-red-500/50 p-4 rounded-xl text-red-100 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-200" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-200 tracking-wider uppercase font-mono">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin123"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-slate-400 transition-all font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-200 tracking-wider uppercase font-mono">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin123"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-slate-400 transition-all font-medium"
              />
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
              <span>Kembali Ke Beranda</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Render Authenticated Admin Panel Layout
  // ==========================================
  return (
    <div className="w-full min-h-screen md:h-screen md:overflow-hidden bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800 relative">

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-[100] px-5 py-4 rounded-xl shadow-xl flex items-center gap-3 border text-xs font-bold font-inter transition-all animate-fade-in ${notification.type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
          }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sidebar backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#051424] text-white flex flex-col justify-between shrink-0 shadow-lg border-r border-white/5 transition-transform duration-300 md:translate-x-0 md:static md:h-full ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex flex-col gap-2 w-full select-none">
              <Logo variant="dark" className="scale-90 origin-left pointer-events-none" />
              <span className="font-mono font-bold text-[9.5px] tracking-widest uppercase text-slate-400 border border-slate-700/60 rounded px-2 py-0.5 self-start ml-[50px] leading-none bg-slate-900/50 select-none">
                ADMIN PANEL
              </span>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 md:hidden transition-colors cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1 font-mono text-xs uppercase tracking-wider">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'berita', name: 'Berita', icon: <Newspaper className="w-4 h-4" /> },
              { id: 'galeri', name: 'Galeri Foto', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'agenda', name: 'Agenda Event', icon: <Calendar className="w-4 h-4" /> },
              { id: 'berkas', name: 'Berkas Layanan', icon: <FileText className="w-4 h-4" /> },
              { id: 'kontak', name: 'Info Kontak', icon: <Phone className="w-4 h-4" /> }
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSearchQuery('');
                    setIsSidebarOpen(false); // Close sidebar on mobile after selecting tab
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-bold text-left ${active
                    ? 'bg-accent text-white shadow-md shadow-accent/15'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User logout section */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-[10px] font-mono font-bold uppercase tracking-widest"
          >
            <span>Buka Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-650/15 hover:bg-red-600 border border-red-500/20 text-red-200 hover:text-white transition-all text-[10px] font-mono font-bold uppercase tracking-widest cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN PANEL WORKSPACE */}
      <main className="flex-grow md:h-full flex flex-col min-w-0 relative z-10 overflow-hidden">

        {/* Top Header section */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between shrink-0">
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
                <span>Panel Kendali</span>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 capitalize truncate">{activeTab}</span>
              </h2>
              <p className="text-[10px] text-slate-450 font-inter mt-1.5 truncate">Manajemen integrasi data visual dinas DISPORAPAR Kota Tegal</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline bg-blue-50 text-[#0E3B66] border border-blue-100 text-[10px] font-extrabold px-3 py-1.5 rounded-lg font-mono uppercase">
              STATUS ADMIN: AKTIF
            </span>
          </div>
        </header>

        {/* View Component Switch */}
        <section className="flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div className="flex-grow">

          {/* A. DASHBOARD VIEW WITH GRAPHS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in text-left">

              {/* Stat summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Berita', count: news.length, desc: 'Rilis pers & berita', icon: <Newspaper className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50/50 border-blue-100' },
                  { title: 'Dokumentasi Galeri', count: gallery.length, desc: 'Foto publikasi', icon: <ImageIcon className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50/50 border-purple-100' },
                  { title: 'Agenda Terdaftar', count: events.length, desc: 'Event dinas mendatanng', icon: <Calendar className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50/50 border-amber-100' },
                  { title: 'Berkas Unduhan', count: services.length, desc: 'Formulir & SOP layanan', icon: <FileText className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50/50 border-emerald-100' }
                ].map((stat, i) => (
                  <div key={i} className={`p-5 rounded-2xl bg-white border shadow-xs flex items-start justify-between ${stat.bg}`}>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block leading-none">{stat.title}</span>
                      <span className="text-3xl font-black text-[#0E3B66] font-mono block mt-2.5">{stat.count}</span>
                      <p className="text-[9px] text-slate-400 font-inter mt-1.5 font-light">{stat.desc}</p>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-xs shrink-0">
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* ========================================================================= */}
              {/* VISUAL CHARTS (GRAPH) ROW - PREMIUM CUSTOM SVG CHARTS */}
              {/* ========================================================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* 1. Monthly Activity Line Chart (7 columns) */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <span>Tren Aktivitas Bulanan (2026)</span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-inter mt-1">Akumulasi posting berita & agenda per bulan</p>
                    </div>
                    <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold font-mono px-2.5 py-1 rounded-md uppercase">LINE CHART</span>
                  </div>

                  {/* Line Chart Draw Area */}
                  <div className="relative w-full h-64 border border-slate-100/50 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-center select-none font-inter text-[9px] font-medium text-slate-400">
                    <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="65" x2="480" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="155" x2="480" y2="155" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="40" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* Y-Axis Labels */}
                      <text x="30" y="24" textAnchor="end">12</text>
                      <text x="30" y="69" textAnchor="end">9</text>
                      <text x="30" y="114" textAnchor="end">6</text>
                      <text x="30" y="159" textAnchor="end">3</text>
                      <text x="30" y="184" textAnchor="end">0</text>

                      {/* X-Axis Labels (Months Jan-Jun) */}
                      {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'].map((month, idx) => {
                        const x = 40 + idx * 80;
                        return (
                          <text key={idx} x={x} y="202" textAnchor="middle" className="font-bold text-slate-500 fill-current">{month}</text>
                        );
                      })}

                      {/* SVG Gradient definition */}
                      <defs>
                        <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F2994A" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#F2994A" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Area under line */}
                      <path
                        d="M 40,165 C 80,150 80,120 120,120 C 160,120 160,150 200,135 C 240,120 280,45 320,50 C 360,55 360,95 400,80 C 440,65 440,30 480,30 L 480,180 L 40,180 Z"
                        fill="url(#line-gradient)"
                        className="transition-all duration-1000 ease-out"
                      />

                      {/* Glowing Line */}
                      <path
                        d="M 40,165 C 80,150 80,120 120,120 C 160,120 160,150 200,135 C 240,120 280,45 320,50 C 360,55 360,95 400,80 C 440,65 440,30 480,30"
                        fill="none"
                        stroke="#F2994A"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: 'drop-shadow(0px 3px 6px rgba(242,153,74,0.3))' }}
                      />

                      {/* Interactive Data Dots */}
                      {[
                        { x: 40, y: 165, val: 2 },
                        { x: 120, y: 120, val: 5 },
                        { x: 200, y: 135, val: 4 },
                        { x: 320, y: 50, val: 10 },
                        { x: 400, y: 80, val: 8 },
                        { x: 480, y: 30, val: 12 }
                      ].map((pt, idx) => (
                        <g key={idx} className="group cursor-pointer">
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="7"
                            className="fill-white stroke-accent stroke-[3] group-hover:r-[9] transition-all"
                          />
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="14"
                            className="fill-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                          {/* Tooltip on top */}
                          <text
                            x={pt.x}
                            y={pt.y - 14}
                            textAnchor="middle"
                            className="opacity-0 group-hover:opacity-100 fill-[#0E3B66] font-bold text-[10px] transition-opacity"
                          >
                            {pt.val} Kegiatan
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* 2. Category Distribution Bar Chart (5 columns) */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <span>Kategori Distribusi</span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-inter mt-1">Komparasi data berdasarkan rumpun bidang</p>
                    </div>
                    <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold font-mono px-2.5 py-1 rounded-md uppercase">BAR CHART</span>
                  </div>

                  {/* Bar Chart Draw Area */}
                  <div className="relative w-full h-64 border border-slate-100/50 bg-slate-50/50 rounded-2xl p-5 flex items-center justify-center select-none font-inter text-[9px] font-medium text-slate-400">
                    <svg viewBox="0 0 350 200" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="30" y1="20" x2="330" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="70" x2="330" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="120" x2="330" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="160" x2="330" y2="160" stroke="#cbd5e1" strokeWidth="1" />

                      {/* X-Axis Labels */}
                      {[
                        { name: 'Wisata', x: 75, val: news.filter(n => n.category === 'Pariwisata').length + gallery.filter(g => g.category === 'Pariwisata').length, color: '#F2994A' },
                        { name: 'Olahraga', x: 155, val: news.filter(n => n.category === 'Olahraga').length + gallery.filter(g => g.category === 'Olahraga').length, color: '#2D9CDB' },
                        { name: 'Pemuda', x: 235, val: news.filter(n => n.category === 'Kepemudaan').length + gallery.filter(g => g.category === 'Kepemudaan').length, color: '#27AE60' },
                        { name: 'Dinas', x: 300, val: events.filter(e => e.category === 'Dinas').length, color: '#9B51E0' }
                      ].map((bar, idx) => {
                        // Calculate bar height dynamically
                        const maxVal = Math.max(10, ...[
                          news.filter(n => n.category === 'Pariwisata').length + gallery.filter(g => g.category === 'Pariwisata').length,
                          news.filter(n => n.category === 'Olahraga').length + gallery.filter(g => g.category === 'Olahraga').length,
                          news.filter(n => n.category === 'Kepemudaan').length + gallery.filter(g => g.category === 'Kepemudaan').length,
                          events.filter(e => e.category === 'Dinas').length
                        ]);
                        const barHeight = Math.max(15, (bar.val / maxVal) * 125);
                        const y = 160 - barHeight;

                        return (
                          <g key={idx} className="group cursor-pointer">
                            {/* Bar gradient definitions inside group is fine */}
                            <defs>
                              <linearGradient id={`bar-gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={bar.color} />
                                <stop offset="100%" stopColor={bar.color} stopOpacity="0.3" />
                              </linearGradient>
                            </defs>

                            {/* Bar Graphic */}
                            <rect
                              x={bar.x - 18}
                              y={y}
                              width="36"
                              height={barHeight}
                              rx="6"
                              fill={`url(#bar-gradient-${idx})`}
                              className="transition-all duration-1000 group-hover:fill-opacity-90"
                            />

                            {/* Count on top of bar */}
                            <text
                              x={bar.x}
                              y={y - 8}
                              textAnchor="middle"
                              className="font-bold fill-slate-800 font-mono text-[10px]"
                            >
                              {bar.val}
                            </text>

                            {/* Label */}
                            <text
                              x={bar.x}
                              y="180"
                              textAnchor="middle"
                              className="font-bold text-slate-500 fill-current"
                            >
                              {bar.name}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

              </div>

              {/* Recent Activity List */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight">Kabar Rilis Berita Terbaru</h3>
                    <p className="text-[10px] text-slate-400 font-inter mt-1">Data sinkronisasi portal publik</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('berita')}
                    className="text-xs font-bold text-primary hover:text-accent font-mono uppercase tracking-wider transition-colors flex items-center gap-1"
                  >
                    <span>Kelola Berita</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {news.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="text-left min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-[#0E3B66] leading-snug tracking-tight truncate max-w-md sm:max-w-xl">{item.title}</h4>
                          <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider block mt-1 uppercase">KATEGORI: {item.category} • {item.date}</span>
                        </div>
                      </div>
                      <span className="hidden sm:inline-block bg-emerald-50 text-emerald-700 text-[9px] font-bold font-mono px-2.5 py-1 rounded-md uppercase">Terbit</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* B. CRUD TABVIEWS (BERITA, GALERI, AGENDA, BERKAS) */}
          {['berita', 'galeri', 'agenda', 'berkas'].includes(activeTab) && (
            <div className="space-y-6 animate-fade-in">
              {/* Control Action bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">

                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder={`Cari ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 transition-all font-medium font-inter"
                  />
                </div>

                {/* Add Button */}
                <button
                  onClick={() => openForm('add')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Tambah {activeTab}</span>
                </button>
              </div>

              {/* Data Table / List */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm font-inter">
                    <thead>
                      <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-200">
                        {activeTab === 'berita' && (
                          <>
                            <th className="py-4.5 px-6">Berita</th>
                            <th className="py-4.5 px-6">Kategori</th>
                            <th className="py-4.5 px-6">Tanggal</th>
                            <th className="py-4.5 px-6">Penulis</th>
                            <th className="py-4.5 px-6 text-center">Aksi</th>
                          </>
                        )}
                        {activeTab === 'galeri' && (
                          <>
                            <th className="py-4.5 px-6">Media</th>
                            <th className="py-4.5 px-6">Judul Foto</th>
                            <th className="py-4.5 px-6">Kategori</th>
                            <th className="py-4.5 px-6 text-center">Aksi</th>
                          </>
                        )}
                        {activeTab === 'agenda' && (
                          <>
                            <th className="py-4.5 px-6">Agenda</th>
                            <th className="py-4.5 px-6">Waktu &amp; Tanggal</th>
                            <th className="py-4.5 px-6">Lokasi</th>
                            <th className="py-4.5 px-6">Kategori</th>
                            <th className="py-4.5 px-6 text-center">Aksi</th>
                          </>
                        )}
                        {activeTab === 'berkas' && (
                          <>
                            <th className="py-4.5 px-6">Nama Berkas</th>
                            <th className="py-4.5 px-6">Kategori</th>
                            <th className="py-4.5 px-6">Ukuran</th>
                            <th className="py-4.5 px-6 text-center">Aksi</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {getFilteredData().length > 0 ? (
                        (getFilteredData() as any[]).map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            {/* Berita Row rendering */}
                            {activeTab === 'berita' && (
                              <>
                                <td className="py-4.5 px-6 max-w-xs">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="font-bold text-[#0E3B66] truncate leading-tight">{item.title}</h4>
                                      <p className="text-[10px] text-slate-400 truncate mt-1">{item.excerpt}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4.5 px-6 uppercase font-mono text-[10px] tracking-wider text-slate-550">{item.category}</td>
                                <td className="py-4.5 px-6 text-slate-550 font-mono text-[11px] whitespace-nowrap">{item.date}</td>
                                <td className="py-4.5 px-6 text-[#0E3B66] font-bold">{item.author}</td>
                              </>
                            )}

                            {/* Galeri Row rendering */}
                            {activeTab === 'galeri' && (
                              <>
                                <td className="py-4.5 px-6 whitespace-nowrap">
                                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shadow-xs border border-slate-100">
                                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                  </div>
                                </td>
                                <td className="py-4.5 px-6 max-w-xs font-bold text-[#0E3B66]">{item.title}</td>
                                <td className="py-4.5 px-6 uppercase font-mono text-[10px] tracking-wider text-slate-550">{item.category}</td>
                              </>
                            )}

                            {/* Agenda Row rendering */}
                            {activeTab === 'agenda' && (
                              <>
                                <td className="py-4.5 px-6 max-w-xs">
                                  <h4 className="font-bold text-[#0E3B66] leading-tight">{item.title}</h4>
                                  <p className="text-[10px] text-slate-400 truncate mt-1">{item.description}</p>
                                </td>
                                <td className="py-4.5 px-6 text-slate-550 whitespace-nowrap">
                                  <div className="font-bold text-[11px]">{item.date}</div>
                                  <div className="text-[10px] mt-0.5 font-mono text-slate-400">{item.time}</div>
                                </td>
                                <td className="py-4.5 px-6 text-slate-600 font-inter">{item.location}</td>
                                <td className="py-4.5 px-6 uppercase font-mono text-[10px] tracking-wider text-slate-550">{item.category}</td>
                              </>
                            )}

                            {/* Berkas Row rendering */}
                            {activeTab === 'berkas' && (
                              <>
                                <td className="py-4.5 px-6 max-w-xs">
                                  <h4 className="font-bold text-[#0E3B66] leading-tight">{item.title}</h4>
                                  <p className="text-[10px] text-slate-400 truncate mt-1">{item.description}</p>
                                </td>
                                <td className="py-4.5 px-6 uppercase font-mono text-[10px] tracking-wider text-slate-550">{item.category}</td>
                                <td className="py-4.5 px-6 font-mono text-[11px] text-slate-500 whitespace-nowrap">{item.fileSize}</td>
                              </>
                            )}

                            {/* Actions Column */}
                            <td className="py-4.5 px-6 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openForm('edit', item)}
                                  className="p-2 bg-slate-50 hover:bg-[#0E3B66] hover:text-white border border-slate-200 rounded-lg text-[#0E3B66] transition-colors cursor-pointer"
                                  title="Ubah data"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => openDeleteConfirm(item)}
                                  className="p-2 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg text-red-650 transition-colors cursor-pointer"
                                  title="Hapus data"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10} className="py-16 text-center text-slate-400">
                            <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <h4 className="font-extrabold text-slate-800 text-sm">Tidak ada data ditemukan</h4>
                            <p className="text-xs text-slate-400 mt-1 font-light">Coba ubah kata kunci pencarian Anda.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* C. INFO KONTAK EDIT VIEW */}
          {activeTab === 'kontak' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 animate-fade-in text-left">
              <span className="text-xs font-bold text-secondary tracking-widest uppercase font-mono bg-blue-150/15 border border-blue-200/40 px-3 py-1 rounded-full inline-block mb-4">
                Ubah Detail Kantor Dinas
              </span>
              <h3 className="text-2xl font-black text-primary tracking-tight mb-8">Informasi Kontak & Operasional</h3>

              <form onSubmit={handleUpdateContact} className="space-y-6 font-inter">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Alamat Lengkap Kantor</label>
                  <textarea
                    required
                    rows={3}
                    name="address"
                    defaultValue={officeInfo.address}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">No. Telepon Resmi</label>
                    <input
                      type="text"
                      required
                      name="phone"
                      defaultValue={officeInfo.phone}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Alamat Email Resmi</label>
                    <input
                      type="email"
                      required
                      name="email"
                      defaultValue={officeInfo.email}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Jam Kerja Operasional</label>
                  <input
                    type="text"
                    required
                    name="operationalHours"
                    defaultValue={officeInfo.operationalHours}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Instagram Resmi</label>
                    <input
                      type="url"
                      name="instagramResmi"
                      defaultValue={officeInfo.socialMedia?.instagramResmi || ''}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Instagram Pariwisata & Event</label>
                    <input
                      type="url"
                      name="instagramTourism"
                      defaultValue={officeInfo.socialMedia?.instagramTourism || ''}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Instagram Bidang Kepemudaan</label>
                    <input
                      type="url"
                      name="instagramPemuda"
                      defaultValue={officeInfo.socialMedia?.instagramPemuda || ''}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Youtube Link</label>
                    <input
                      type="url"
                      name="youtube"
                      defaultValue={officeInfo.socialMedia?.youtube || ''}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Google Maps Embed URL</label>
                  <input
                    type="url"
                    required
                    name="gmapsEmbedUrl"
                    defaultValue={officeInfo.gmapsEmbedUrl}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md font-mono text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Simpan Perubahan Kontak
                  </button>
                </div>
              </form>
            </div>
          )}
          </div>

          {/* Footer info in workspace */}
          <footer className="mt-8 border-t border-slate-200 pt-5 pb-2 text-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            © 2026 DISPORAPAR KOTA TEGAL. PANEL INTERNAL ADMINISTRATOR.
          </footer>
        </section>
      </main>

      {/* ==========================================
          DYNAMIC FORM MODAL (ADD / EDIT / DELETE)
      ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in font-inter text-slate-700">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="bg-[#051424] px-6 sm:px-8 py-4.5 flex items-center justify-between text-white shrink-0">
              <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-tight font-sans">
                {modalType === 'delete' ? 'Konfirmasi Hapus' : modalType === 'add' ? `Tambah ${activeTab}` : `Ubah ${activeTab}`}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                  setUploadedImageBase64('');
                }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-5 text-left flex-grow">

              {/* DELETE CONFIRMATION SCREEN */}
              {modalType === 'delete' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-red-50 border border-red-150 rounded-2xl flex items-center justify-center text-red-650 mx-auto">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-extrabold text-slate-900 text-base">Hapus Data Ini?</h4>
                    <p className="text-xs text-slate-500 mt-2 font-inter leading-relaxed max-w-sm mx-auto">
                      Apakah Anda yakin ingin menghapus data dengan judul <span className="font-bold text-[#0E3B66]">{editingItem?.title}</span>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingItem(null);
                      }}
                      className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Hapus Permanen
                    </button>
                  </div>
                </div>
              )}

              {/* BERITA FORM */}
              {activeTab === 'berita' && modalType !== 'delete' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Judul Berita</label>
                    <input
                      type="text"
                      required
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      placeholder="Masukkan judul berita"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    />
                  </div>


                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Konten Lengkap Berita</label>
                    <textarea
                      required
                      rows={5}
                      name="content"
                      defaultValue={editingItem?.content || ''}
                      placeholder="Tulis seluruh paragraf berita di sini..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Kategori</label>
                      <select
                        name="category"
                        defaultValue={editingItem?.category || 'Pariwisata'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      >
                        <option value="Pariwisata">Pariwisata</option>
                        <option value="Olahraga">Olahraga</option>
                        <option value="Kepemudaan">Kepemudaan</option>
                        <option value="Pengumuman">Pengumuman</option>
                        <option value="Event">Event</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Penulis / Author</label>
                      <input
                        type="text"
                        required
                        name="author"
                        defaultValue={editingItem?.author || 'Humas DISPORAPAR'}
                        placeholder="Nama kontributor"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Tanggal Publikasi</label>
                      <input
                        type="date"
                        required
                        name="date"
                        defaultValue={editingItem ? parseIndonesianDateToYYYYMMDD(editingItem.date) : ''}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      />
                      {editingItem?.date && (
                        <span className="text-[9px] text-slate-400 font-inter">Nilai saat ini: {editingItem.date}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 pt-6 text-xs font-bold">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        defaultChecked={editingItem?.featured || false}
                        className="w-4 h-4 rounded text-accent border-slate-300 focus:ring-accent accent-accent"
                      />
                      <label htmlFor="featured" className="text-slate-600 select-none cursor-pointer">Sematkan sebagai Berita Utama</label>
                    </div>
                  </div>

                  {/* Image input: support local file and url link */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Visual Gambar Berita</label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Local Upload */}
                      <div className="p-4 border border-dashed border-slate-350 bg-slate-50/50 hover:bg-slate-50 rounded-xl text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors relative">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-extrabold text-[#0E3B66] uppercase tracking-wider font-mono">Unggah Berkas</span>
                        <span className="text-[8px] text-slate-400 block font-light leading-none">Maksimal 2MB (jpg/png)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* URL input */}
                      <div className="space-y-1.5 flex flex-col justify-center">
                        <span className="text-[8.5px] font-bold text-slate-400 font-mono">Atau Masukkan URL Link:</span>
                        <input
                          type="url"
                          name="imageUrl"
                          defaultValue={editingItem?.imageUrl && !editingItem.imageUrl.startsWith('data:') ? editingItem.imageUrl : ''}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    {uploadedImageBase64 && (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden mt-3 border border-slate-100 shadow-xs">
                        <Image src={uploadedImageBase64} alt="Pratinjau" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedImageBase64('')}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* GALERI FORM */}
              {activeTab === 'galeri' && modalType !== 'delete' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Judul Foto</label>
                    <input
                      type="text"
                      required
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      placeholder="Masukkan deskripsi singkat foto"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Kategori Kegiatan</label>
                    <select
                      name="category"
                      defaultValue={editingItem?.category || 'Pariwisata'}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    >
                      <option value="Pariwisata">Pariwisata</option>
                      <option value="Olahraga">Olahraga</option>
                      <option value="Kepemudaan">Kepemudaan</option>
                    </select>
                  </div>

                  {/* Image input: support local file and url link */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Gambar Galeri</label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Local Upload */}
                      <div className="p-4 border border-dashed border-slate-350 bg-slate-50/50 hover:bg-slate-50 rounded-xl text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors relative">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-extrabold text-[#0E3B66] uppercase tracking-wider font-mono">Unggah Berkas</span>
                        <span className="text-[8px] text-slate-400 block font-light leading-none">Maksimal 2MB (jpg/png)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* URL input */}
                      <div className="space-y-1.5 flex flex-col justify-center">
                        <span className="text-[8.5px] font-bold text-slate-400 font-mono">Atau Masukkan URL Link:</span>
                        <input
                          type="url"
                          name="imageUrl"
                          defaultValue={editingItem?.imageUrl && !editingItem.imageUrl.startsWith('data:') ? editingItem.imageUrl : ''}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    {uploadedImageBase64 && (
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden mt-3 border border-slate-100 shadow-xs max-w-[200px] mx-auto">
                        <Image src={uploadedImageBase64} alt="Pratinjau" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedImageBase64('')}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* AGENDA FORM */}
              {activeTab === 'agenda' && modalType !== 'delete' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Judul Kegiatan</label>
                    <input
                      type="text"
                      required
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      placeholder="Masukkan nama acara dinas"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Deskripsi Acara</label>
                    <textarea
                      required
                      rows={3}
                      name="description"
                      defaultValue={editingItem?.description || ''}
                      placeholder="Tulis rincian singkat agenda..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Tanggal Acara</label>
                      <input
                        type="date"
                        required
                        name="date"
                        defaultValue={editingItem ? parseIndonesianDateToYYYYMMDD(editingItem.date) : ''}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      />
                      {editingItem?.date && (
                        <span className="text-[9px] text-slate-400 font-inter">Nilai saat ini: {editingItem.date}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Waktu (Jam)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          required
                          name="startTime"
                          defaultValue={parseTimeRange(editingItem?.time).start}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                        />
                        <span className="text-slate-400 text-xs font-semibold select-none">s/d</span>
                        <input
                          type="time"
                          required
                          name="endTime"
                          defaultValue={parseTimeRange(editingItem?.time).end}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                        />
                        <span className="text-slate-550 font-bold font-mono text-xs select-none shrink-0">WIB</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Lokasi Penyelenggaraan</label>
                      <input
                        type="text"
                        required
                        name="location"
                        defaultValue={editingItem?.location || ''}
                        placeholder="Nama gedung / lapangan"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Kategori Agenda</label>
                      <select
                        name="category"
                        defaultValue={editingItem?.category || 'Pariwisata'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      >
                        <option value="Pariwisata">Pariwisata</option>
                        <option value="Olahraga">Olahraga</option>
                        <option value="Kepemudaan">Kepemudaan</option>
                        <option value="Dinas">Dinas</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* BERKAS FORM */}
              {activeTab === 'berkas' && modalType !== 'delete' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Nama Berkas / Dokumen</label>
                    <input
                      type="text"
                      required
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      placeholder="Masukkan judul berkas resmi"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Deskripsi</label>
                    <input
                      type="text"
                      required
                      name="description"
                      defaultValue={editingItem?.description || ''}
                      placeholder="Deskripsi singkat isi dokumen"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Kategori Layanan</label>
                    <select
                      name="category"
                      defaultValue={editingItem?.category || 'SOP'}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    >
                      <option value="SOP">SOP</option>
                      <option value="Formulir">Formulir</option>
                      <option value="Berkas Layanan">Berkas Layanan</option>
                      <option value="Izin Usaha">Izin Usaha</option>
                    </select>
                  </div>
                  {/* File input: support local file and url link */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Download / Berkas Dokumen</label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Local Upload */}
                      <div className="p-4 border border-dashed border-slate-350 bg-slate-50/50 hover:bg-slate-50 rounded-xl text-center flex flex-col items-center justify-center gap-2 cursor-pointer relative">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-extrabold text-[#0E3B66] uppercase tracking-wider font-mono">Unggah Berkas</span>
                        <span className="text-[8px] text-slate-400 block font-light leading-none">Maksimal 5MB (PDF/Docx/Zip)</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                          onChange={handleDocFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* URL input */}
                      <div className="space-y-1.5 flex flex-col justify-center">
                        <span className="text-[8.5px] font-bold text-slate-400 font-mono">Atau Masukkan URL Link:</span>
                        <input
                          type="url"
                          name="downloadUrl"
                          defaultValue={editingItem?.downloadUrl && !editingItem.downloadUrl.startsWith('data:') ? editingItem.downloadUrl : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && val !== '#') {
                              setUploadedFileSize('Tautan');
                            } else if (!uploadedFileBase64) {
                              setUploadedFileSize(editingItem?.fileSize || '0 KB');
                            }
                          }}
                          placeholder="https://drive.google.com/..."
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    {(uploadedFileBase64 || uploadedFileName) && (
                      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-accent shrink-0" />
                          <span className="text-slate-800 font-bold truncate max-w-[200px]">
                            {uploadedFileName || 'Berkas Terunggah'}
                          </span>
                          <span className="text-slate-400 text-[10px]">({uploadedFileSize})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFileBase64('');
                            setUploadedFileName('');
                            setUploadedFileSize(editingItem?.fileSize || '0 KB');
                          }}
                          className="text-red-500 hover:text-red-700 font-bold uppercase text-[10px] tracking-wider cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Form Submission Buttons */}
              {modalType !== 'delete' && (
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                      setUploadedImageBase64('');
                      setUploadedFileBase64('');
                      setUploadedFileName('');
                      setUploadedFileSize('');
                    }}
                    className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-55 rounded-xl transition-all cursor-pointer font-bold text-xs uppercase tracking-wider font-mono"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-mono text-xs uppercase tracking-wider"
                  >
                    Simpan Data
                  </button>
                </div>
              )}

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
