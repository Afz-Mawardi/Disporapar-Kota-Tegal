'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Edit2,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';
import { useWelcomeMessage } from '@/lib/data-store';

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

export default function SambutanPage() {
  const [welcomeMessage, setWelcomeMessage] = useWelcomeMessage();

  // Local state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [welcomeImage, setWelcomeImage] = useState<string>('');
  const [isDragOverWelcome, setIsDragOverWelcome] = useState<boolean>(false);

  // Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (welcomeMessage) {
      setWelcomeImage(welcomeMessage.imageUrl || '');
    }
  }, [welcomeMessage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotification('Ukuran gambar maksimal 2MB.', 'error');
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
                menu: 'sambutan'
              })
            });
            const result = await res.json();
            if (result.success) {
              setWelcomeImage(result.url);
              showNotification('Gambar berhasil diunggah dan disimpan.', 'success');
            } else {
              throw new Error(result.error || 'Gagal menyimpan gambar di server.');
            }
          } catch (err: any) {
            showNotification(err.message || 'Gagal mengunggah gambar ke server.', 'error');
          }
        })
        .catch((err) => {
          showNotification(err.message || 'Gagal memproses gambar.', 'error');
        });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('welcomeName') as string;
    const nip = formData.get('welcomeNip') as string;
    const content = formData.get('welcomeContent') as string;
    const imageUrl = welcomeImage || formData.get('welcomeImageUrl') as string || '';

    if (imageUrl && !isValidUrlOrPath(imageUrl)) {
      showNotification('Tautan URL gambar tidak valid.', 'error');
      return;
    }

    if (!name.trim() || !content.trim()) {
      showNotification('Nama dan Isi Sambutan wajib diisi.', 'error');
      return;
    }

    setWelcomeMessage({
      name,
      nip: nip ? nip.trim() : '',
      content,
      imageUrl
    });

    setIsEditing(false);
    showNotification('Sambutan Kepala Dinas berhasil disimpan!', 'success');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in relative">
      {/* Toast Notification */}
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

      {/* Control Action bar */}
      <div className="sticky top-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md transition-all duration-300">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight">Kelola Sambutan Kepala Dinas</h3>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer"
          >
            <Edit2 className="w-4 h-4 text-white" />
            <span>Edit Sambutan</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditing(false);
              setWelcomeImage(welcomeMessage.imageUrl || '');
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-250 text-slate-650 font-extrabold rounded-xl transition-all shadow-sm border border-slate-200 flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Batal</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm text-left">
        {!isEditing ? (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Foto Kepala Dinas */}
            {welcomeMessage.imageUrl ? (
              <div className="relative w-44 h-56 rounded-2xl overflow-hidden bg-slate-100 shadow-md border border-slate-200 shrink-0 mx-auto md:mx-0">
                <img src={welcomeMessage.imageUrl} alt={welcomeMessage.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-44 h-56 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-350 shrink-0 mx-auto md:mx-0">
                <User className="w-12 h-12 opacity-30" />
                <span className="text-[10px] font-mono font-bold mt-2">TANPA FOTO</span>
              </div>
            )}

            {/* Profil & Konten */}
            <div className="space-y-4 flex-grow min-w-0">
              <div className="space-y-1">
                <h4 className="text-lg font-black text-[#0E3B66] leading-snug tracking-tight">{welcomeMessage.name}</h4>
                {welcomeMessage.nip && <p className="text-xs text-slate-400 font-mono tracking-widest leading-none">NIP. {welcomeMessage.nip}</p>}
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-inter font-light">
                  {welcomeMessage.content}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Nama Kepala Dinas</label>
                <input
                  type="text"
                  name="welcomeName"
                  required
                  defaultValue={welcomeMessage.name}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">NIP (Optional)</label>
                <input
                  type="text"
                  name="welcomeNip"
                  defaultValue={welcomeMessage.nip || ''}
                  placeholder="Contoh: 197508122002122003"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Isi Sambutan</label>
              <textarea
                name="welcomeContent"
                required
                rows={10}
                defaultValue={welcomeMessage.content}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800 font-inter leading-relaxed"
              />
            </div>

            {/* Foto Upload */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Foto Kepala Dinas</label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Local Upload */}
                <div className="sm:col-span-4">
                  <div className={`p-4 border-2 border-dashed rounded-xl text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 relative ${isDragOverWelcome ? 'border-accent bg-accent/5 scale-[1.02] shadow-md' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                    }`}>
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-[9px] font-extrabold text-[#0E3B66] uppercase tracking-wider font-mono">Pilih Foto</span>
                    <input
                      type="file"
                      accept="image/webp, image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      onDragEnter={() => setIsDragOverWelcome(true)}
                      onDragLeave={() => setIsDragOverWelcome(false)}
                      onDrop={() => setIsDragOverWelcome(false)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Link input */}
                <div className="sm:col-span-8 space-y-1.5">
                  <span className="text-[8.5px] font-bold text-slate-400 font-mono block">Atau Masukkan URL Link Foto:</span>
                  <input
                    type="url"
                    name="welcomeImageUrl"
                    value={welcomeImage && !welcomeImage.startsWith('data:') ? welcomeImage : ''}
                    onChange={(e) => setWelcomeImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                  />
                </div>
              </div>

              {welcomeImage && (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono mt-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <ImageIcon className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-slate-800 font-bold truncate max-w-[280px]">
                      {welcomeImage.startsWith('data:') ? 'Gambar Terunggah (Local)' : welcomeImage}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWelcomeImage('')}
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
                onClick={() => {
                  setIsEditing(false);
                  setWelcomeImage(welcomeMessage.imageUrl || '');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl font-bold font-mono text-[10px] uppercase cursor-pointer"
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
          </form>
        )}
      </div>
    </div>
  );
}
