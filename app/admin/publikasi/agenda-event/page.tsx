'use client';

import React, { useState, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  X,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  Search,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { useEvents } from '@/lib/data-store';
import { parseIndonesianDate } from '@/lib/utils';

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

// Helper to convert image to WebP format
const convertImageToWebP = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type) && !/\.(webp|png|jpe?g)$/i.test(file.name)) {
      reject(new Error('Format gambar harus berupa WEBP, PNG, JPG, atau JPEG.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Gagal memproses gambar.'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        const webpBase64 = canvas.toDataURL('image/webp', 0.85);
        resolve(webpBase64);
      };
      img.onerror = () => {
        reject(new Error('Gagal memuat gambar untuk konversi.'));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Gagal membaca berkas gambar.'));
    };
    reader.readAsDataURL(file);
  });
};

export default function AgendaEventAdminPage() {
  const [events, setEvents] = useEvents();

  // Local CRUD states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>('');
  const [isDragOverModal, setIsDragOverModal] = useState<boolean>(false);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  };

  const openForm = (type: 'add' | 'edit', item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setUploadedImageBase64('');
    if (type === 'edit' && item) {
      setUploadedImageBase64(item.imageUrl || '');
    }
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (item: any) => {
    setModalType('delete');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotification('Ukuran gambar maksimal 2MB.', 'error');
        e.target.value = '';
        return;
      }
      showNotification('Sedang memproses gambar...', 'success');
      convertImageToWebP(file)
        .then(async (webpBase64) => {
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileBase64: webpBase64,
                fileName: file.name.substring(0, file.name.lastIndexOf('.')) + '.webp',
                menu: 'agenda'
              })
            });
            const result = await res.json();
            if (result.success) {
              setUploadedImageBase64(result.url);
              showNotification('Gambar berhasil diunggah.', 'success');
            } else {
              throw new Error(result.error || 'Gagal menyimpan gambar di server.');
            }
          } catch (err: any) {
            showNotification(err.message || 'Gagal mengunggah gambar ke server.', 'error');
            e.target.value = '';
          }
        })
        .catch((err) => {
          showNotification(err.message || 'Gagal memproses gambar.', 'error');
          e.target.value = '';
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (modalType === 'delete') {
      if (editingItem) {
        setEvents(events.filter(ev => ev.id !== editingItem.id));
        showNotification('Agenda berhasil dihapus.', 'success');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      return;
    }

    const title = formData.get('title') as string;
    const dateVal = formData.get('date') as string;
    const startTime = formData.get('startTime') as string || '08:00';
    const endTime = formData.get('endTime') as string || '12:00';
    const time = `${startTime} - ${endTime} WIB`;
    const location = formData.get('location') as string;
    const imageUrl = uploadedImageBase64 || formData.get('imageUrl') as string || '';

    if (!title.trim()) {
      showNotification('Judul agenda wajib diisi.', 'error');
      return;
    }

    let dateString = dateVal;
    if (dateVal) {
      const dateParts = dateVal.split('-');
      if (dateParts.length === 3) {
        const d = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        dateString = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    } else {
      dateString = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    if (modalType === 'add') {
      const newItem = {
        id: `e-${Date.now()}`,
        title,
        date: dateString,
        time,
        location,
        description: '',
        imageUrl
      };
      setEvents([newItem, ...events]);
      showNotification('Agenda berhasil ditambahkan.', 'success');
    } else if (modalType === 'edit' && editingItem) {
      const updatedItem = {
        ...editingItem,
        title,
        date: dateString,
        time,
        location,
        imageUrl
      };
      setEvents(events.map(ev => ev.id === editingItem.id ? updatedItem : ev));
      showNotification('Agenda berhasil diubah.', 'success');
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filteredEvents = events.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 text-left animate-fade-in relative font-inter">
      {/* Toast Notification */}
      {notification && (
        <div
          onClick={() => setNotification(null)}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-4 rounded-xl flex items-center gap-3 border text-xs font-bold transition-all animate-fade-in cursor-pointer select-none ${
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

      {/* Control Action Bar */}
      <div className="sticky top-0 z-20 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md transition-all duration-300">
        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari Agenda Event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66]"
          />
        </div>

        <button
          onClick={() => openForm('add')}
          className="w-full md:w-auto px-5 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda Event</span>
        </button>
      </div>

      {/* Agenda Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-inter">
            <thead>
              <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-200">
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Nama Event</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Jadwal & Lokasi</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-3 sm:py-5 sm:px-6 max-w-xs">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-150 shrink-0">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-extrabold text-[#0E3B66] leading-tight">{item.title}</h4>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-6 max-w-md">
                      <div className="space-y-1 font-inter text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openForm('edit', item)}
                          className="p-2 bg-slate-50 hover:bg-[#0E3B66] hover:text-white border border-slate-200 rounded-lg text-[#0E3B66] transition-colors cursor-pointer"
                          title="Ubah agenda"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(item)}
                          className="p-2 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg text-red-650 transition-colors cursor-pointer"
                          title="Hapus agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-16 text-center text-slate-400">
                    <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <h4 className="font-extrabold text-slate-800 text-sm">Tidak ada agenda ditemukan</h4>
                    <p className="text-xs text-slate-400 mt-1 font-light">Coba tambahkan agenda event baru.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-inter">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-150 overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-black text-[#0E3B66] uppercase tracking-wider font-mono">
                {modalType === 'add' ? 'Tambah Agenda Event' : modalType === 'edit' ? 'Ubah Agenda Event' : 'Konfirmasi Hapus'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              {modalType === 'delete' ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Apakah Anda yakin ingin menghapus agenda <span className="font-bold text-slate-850">"{editingItem?.title}"</span>? Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-650 hover:bg-red-750 text-white rounded-xl font-bold font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Ya, Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Judul Agenda</label>
                    <input
                      type="text"
                      required
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      placeholder="Contoh: Pembukaan Turnamen Walikota Cup"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Tanggal Publikasi</label>
                      <input
                        type="date"
                        required
                        name="date"
                        defaultValue={editingItem ? parseIndonesianDateToYYYYMMDD(editingItem.date) : ''}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Lokasi Event</label>
                      <input
                        type="text"
                        required
                        name="location"
                        defaultValue={editingItem?.location || ''}
                        placeholder="Contoh: GOR Wisanggeni Kota Tegal"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Jam Mulai</label>
                      <input
                        type="time"
                        name="startTime"
                        defaultValue={editingItem ? parseTimeRange(editingItem.time).start : '08:00'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Jam Selesai</label>
                      <input
                        type="time"
                        name="endTime"
                        defaultValue={editingItem ? parseTimeRange(editingItem.time).end : '12:00'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Foto Banner Event</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Local Upload */}
                      <div className={`p-4 border-2 border-dashed rounded-xl text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 relative ${isDragOverModal
                        ? 'border-accent bg-accent/5 scale-[1.02] shadow-md'
                        : 'border-slate-350 bg-slate-50/50 hover:bg-slate-50'
                        }`}>
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-extrabold text-[#0E3B66] uppercase tracking-wider font-mono">Unggah Foto</span>
                        <span className="text-[8px] text-slate-400 block font-light leading-none">Maksimal 2MB (WEBP/PNG/JPG)</span>
                        <input
                          type="file"
                          accept="image/webp, image/png, image/jpeg, image/jpg"
                          onChange={handleFileChange}
                          onDragEnter={() => setIsDragOverModal(true)}
                          onDragLeave={() => setIsDragOverModal(false)}
                          onDrop={() => setIsDragOverModal(false)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* URL input */}
                      <div className="space-y-1.5 flex flex-col justify-center">
                        <span className="text-[8.5px] font-bold text-slate-440 font-mono">Atau Masukkan URL Link Foto:</span>
                        <input
                          type="text"
                          name="imageUrl"
                          value={uploadedImageBase64.startsWith('data:') ? '' : uploadedImageBase64 || editingItem?.imageUrl || ''}
                          onChange={(e) => setUploadedImageBase64(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    {(uploadedImageBase64 || editingItem?.imageUrl) && (
                      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono">
                        <div className="flex items-center gap-2 min-w-0">
                          <ImageIcon className="w-4 h-4 text-accent shrink-0" />
                          <span className="text-slate-800 font-bold truncate max-w-[200px]">
                            {uploadedImageBase64.startsWith('data:') ? 'Gambar Terunggah (Local)' : uploadedImageBase64 || editingItem?.imageUrl}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedImageBase64('')}
                          className="text-red-500 hover:text-red-700 font-bold uppercase text-[10px] tracking-wider cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingItem(null);
                        setUploadedImageBase64('');
                      }}
                      className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer font-bold text-xs uppercase tracking-wider font-mono"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-mono text-xs uppercase tracking-wider"
                    >
                      Simpan
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
