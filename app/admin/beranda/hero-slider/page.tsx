'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  ShieldAlert,
  X,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import Image from 'next/image';
import { useHeroSlides } from '@/lib/data-store';
import { HeroSlide } from '@/lib/types';

// Helper to convert image and upload to server
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

const isValidUrlOrPath = (url?: string): boolean => {
  if (!url || url === '#' || url === '') return true;
  if (/^(https?:\/\/)/i.test(url)) return true;
  if (/^(\/|\.\/|\.\.\/)/.test(url)) return true;
  if (/^[a-zA-Z0-9_\-\.\/?=#%&]+$/.test(url)) return true;
  return false;
};

export default function HeroSliderPage() {
  const [heroSlides, setHeroSlides] = useHeroSlides();

  // Local CRUD states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [editingItem, setEditingItem] = useState<HeroSlide | null>(null);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>('');
  const [isDragOverModal, setIsDragOverModal] = useState<boolean>(false);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotification('Ukuran gambar maksimal 2MB.', 'error');
        e.target.value = '';
        return;
      }
      showNotification('Sedang mengompresi dan mengunggah gambar...', 'success');
      convertImageToWebP(file)
        .then(async (webpBase64) => {
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileBase64: webpBase64,
                fileName: file.name.substring(0, file.name.lastIndexOf('.')) + '.webp',
                menu: 'beranda'
              })
            });
            const result = await res.json();
            if (result.success) {
              setUploadedImageBase64(result.url);
              showNotification('Gambar berhasil diunggah dan disimpan ke server.', 'success');
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

  const openForm = (type: 'add' | 'edit', item: HeroSlide | null = null) => {
    setModalType(type);
    setEditingItem(item);
    setUploadedImageBase64(item ? item.image : '');
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (item: HeroSlide) => {
    setModalType('delete');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (modalType === 'delete') {
      if (editingItem) {
        setHeroSlides(heroSlides.filter(s => s.id !== editingItem.id));
        showNotification('Data berhasil dihapus.', 'success');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      return;
    }

    const title = formData.get('title') as string;
    const cta = formData.get('cta') as string;
    const href = formData.get('href') as string;
    const image = uploadedImageBase64 || formData.get('imageUrl') as string || '';

    if (image && !isValidUrlOrPath(image)) {
      showNotification('Tautan URL gambar tidak valid.', 'error');
      return;
    }

    if (!title.trim() || !cta.trim() || !href.trim()) {
      showNotification('Semua bidang wajib diisi.', 'error');
      return;
    }

    if (modalType === 'add') {
      const newItem: HeroSlide = {
        id: `slide-${Date.now()}`,
        tagline: '',
        title,
        cta,
        href,
        image
      };
      setHeroSlides([...heroSlides, newItem]);
      showNotification('Slide Beranda berhasil ditambahkan.', 'success');
    } else if (modalType === 'edit' && editingItem) {
      setHeroSlides(heroSlides.map(item => item.id === editingItem.id ? {
        ...item,
        title,
        cta,
        href,
        image
      } : item));
      showNotification('Slide Beranda berhasil diubah.', 'success');
    }

    setIsModalOpen(false);
    setEditingItem(null);
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
          <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight">Kelola Slide Hero Beranda</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={() => openForm('add')}
            className="w-full sm:w-auto px-5 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Tambah Slide</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-inter">
            <thead>
              <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-200">
                <th className="py-3 px-3 sm:py-4.5 sm:px-6 w-24">Gambar</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Judul</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6 w-40">Tombol CTA</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Tautan (Link)</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {heroSlides.length > 0 ? (
                heroSlides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 sm:py-4.5 sm:px-6 whitespace-nowrap">
                      <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-slate-100 shadow-xs border border-slate-100">
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-3 sm:py-4.5 sm:px-6 max-w-xs">
                      <h4 className="font-bold text-[#0E3B66] leading-tight">{slide.title}</h4>
                    </td>
                    <td className="py-3 px-3 sm:py-4.5 sm:px-6 text-slate-650 font-bold">{slide.cta}</td>
                    <td className="py-3 px-3 sm:py-4.5 sm:px-6 font-mono text-[11px] text-slate-500 truncate max-w-[150px]" title={slide.href}>
                      {slide.href}
                    </td>
                    <td className="py-3 px-3 sm:py-4.5 sm:px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openForm('edit', slide)}
                          className="p-2 bg-slate-50 hover:bg-[#0E3B66] hover:text-white border border-slate-200 rounded-lg text-[#0E3B66] transition-colors cursor-pointer"
                          title="Ubah slide"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(slide)}
                          className="p-2 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg text-red-600 transition-colors cursor-pointer"
                          title="Hapus slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <h4 className="font-extrabold text-slate-800 text-sm">Tidak ada slide hero</h4>
                    <p className="text-xs text-slate-400 mt-1 font-light">Tambahkan slide untuk menampilkan banner di Beranda.</p>
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
                {modalType === 'add' ? 'Tambah Slide Hero' : modalType === 'edit' ? 'Ubah Slide Hero' : 'Konfirmasi Hapus'}
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
                  <p className="text-xs text-slate-500 leading-relaxed font-inter">
                    Apakah Anda yakin ingin menghapus slide hero dengan judul <span className="font-bold text-slate-850">"{editingItem?.title}"</span>? Tindakan ini tidak dapat dibatalkan.
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
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold font-mono text-[10px] uppercase cursor-pointer"
                      style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                    >
                      Ya, Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Judul Banner (Title)</label>
                    <input
                      type="text"
                      required
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      placeholder="Contoh: Gerbang Pesona Maritim & Keindahan Pesisir Tegal"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Teks Tombol CTA</label>
                      <input
                        type="text"
                        required
                        name="cta"
                        defaultValue={editingItem?.cta || ''}
                        placeholder="Contoh: Jelajahi Pariwisata"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Tautan Tombol (href)</label>
                      <input
                        type="text"
                        required
                        name="href"
                        defaultValue={editingItem?.href || ''}
                        placeholder="Contoh: /pariwisata"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Gambar Background Hero</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Local Upload */}
                      <div className={`p-4 border-2 border-dashed rounded-xl text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 relative ${
                        isDragOverModal ? 'border-accent bg-accent/5 scale-[1.02] shadow-md' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                      }`}>
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-extrabold text-[#0E3B66] uppercase tracking-wider font-mono">Unggah Gambar</span>
                        <span className="text-[8px] text-slate-400 block font-light leading-none">Maksimal 2MB (WEBP/PNG/JPG/JPEG)</span>
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
                        <span className="text-[8.5px] font-bold text-slate-400 font-mono">Atau Masukkan URL Link:</span>
                        <input
                          type="url"
                          name="imageUrl"
                          value={uploadedImageBase64 && !uploadedImageBase64.startsWith('data:') ? uploadedImageBase64 : ''}
                          onChange={(e) => setUploadedImageBase64(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    {(uploadedImageBase64 || editingItem?.image) && (
                      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono mt-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <ImageIcon className="w-4 h-4 text-accent shrink-0" />
                          <span className="text-slate-800 font-bold truncate max-w-[200px]">
                            {uploadedImageBase64.startsWith('data:') ? 'Gambar Terunggah (Local)' : uploadedImageBase64 || editingItem?.image}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedImageBase64('')}
                          className="p-1 text-slate-450 hover:text-red-600 rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#0E3B66] hover:bg-[#0a2c4e] text-white rounded-xl font-bold font-mono text-[10px] uppercase cursor-pointer"
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
