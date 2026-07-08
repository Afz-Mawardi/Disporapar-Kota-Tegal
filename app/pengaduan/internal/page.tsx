'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  X,
  Send,
  Loader2
} from 'lucide-react';

const convertImageToWebP = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type) && !/\.(png|jpe?g|webp)$/i.test(file.name)) {
      reject(new Error('Format berkas harus berupa JPG, JPEG, PNG, atau WEBP.'));
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
        // Convert to WebP base64 with 0.80 quality
        const webpBase64 = canvas.toDataURL('image/webp', 0.80);
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

export default function PengaduanInternalPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 4000);
  };

  // Listen for keyboard events to close success modal
  useEffect(() => {
    if (!showSuccessModal) return;

    const handleKeyDown = () => {
      setShowSuccessModal(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSuccessModal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;

    // Check size limit: 3MB
    if (file.size > 3 * 1024 * 1024) {
      showNotification('Ukuran berkas melebihi batas maksimal 3MB.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    showNotification('Sedang mengompresi dan menyiapkan berkas...', 'success');

    convertImageToWebP(file)
      .then((webpBase64) => {
        setImagePreview(webpBase64);
        setImageB64(webpBase64);
        const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setImageName(`${originalName}.webp`);
      })
      .catch((err) => {
        showNotification(err.message || 'Gagal memproses gambar.', 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageB64(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showNotification('Judul pengaduan wajib diisi.', 'error');
      return;
    }
    if (!content.trim()) {
      showNotification('Isi pengaduan wajib diisi.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImageUrl = '';

      // Upload image first if exists
      if (imageB64) {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: imageB64,
            fileName: imageName,
            menu: 'pengaduan'
          })
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || 'Gagal mengunggah gambar lampiran.');
        }
        uploadedImageUrl = uploadData.url;
      }

      // Submit complaint data
      const complaintRes = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          contact,
          imageUrl: uploadedImageUrl
        })
      });

      const complaintData = await complaintRes.json();
      if (!complaintRes.ok || !complaintData.success) {
        throw new Error(complaintData.error || 'Gagal mengirim pengaduan.');
      }

      setShowSuccessModal(true);

      // Reset form fields
      setTitle('');
      setContent('');
      setContact('');
      removeImage();
    } catch (error: any) {
      console.error(error);
      showNotification(error.message || 'Terjadi kesalahan sistem saat mengirim pengaduan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="pengaduan-internal-page" className="w-full bg-[#F8FAFC] pb-12 font-sans text-slate-800">
      {/* Page Hero Header */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 pointer-events-none" aria-hidden="true">
            Layanan Pengaduan
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Pengaduan Internal
          </h1>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {/* Notification Toast */}
        {notification && (
          <div
            onClick={() => setNotification(null)}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-4 rounded-xl flex items-center gap-3 border text-xs sm:text-sm font-bold font-inter shadow-xl transition-all duration-300 animate-fade-in cursor-pointer ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
              }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 animate-bounce" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div
            onClick={() => setShowSuccessModal(false)}
            className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-5 animate-scale-in"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider font-mono">Pengaduan Terkirim</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  Terima kasih atas laporan Anda. Pengaduan Anda telah berhasil kami terima untuk segera diproses lebih lanjut.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-accent hover:bg-orange-500 text-white text-xs font-mono font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-md"
              >
                Tutup Halaman
              </button>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 lg:p-12 shadow-sm mb-6 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* Judul Pengaduan */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                Judul Pengaduan <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul pengaduan"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 transition-all font-medium"
              />
            </div>

            {/* Isi Pengaduan */}
            <div className="space-y-2">
              <label htmlFor="content" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                Isi Pengaduan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                required
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Jelaskan pengaduan Anda secara singkat dan jelas."
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 transition-all font-medium leading-relaxed"
              />
            </div>

            {/* Lampiran Gambar */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                Tambahkan Gambar <span className="text-slate-400 font-light font-sans text-[10px]">(Opsional)</span>
              </label>

              {!imagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 relative ${isDragOver
                    ? 'border-accent bg-accent/5 scale-[1.01] shadow-inner'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-400'
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-slate-400 animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">Tarik gambar ke sini, atau klik untuk memilih</p>
                    <p className="text-[10px] text-slate-400 font-mono">Format: WEBP, PNG, JPG, JPEG • Maksimal 3MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img src={imagePreview} alt="Preview lampiran" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[320px]">{imageName}</p>
                      <p className="text-[9px] text-emerald-600 font-mono font-bold flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" /> WebP Compressed
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isSubmitting}
                    className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-mono font-bold rounded-lg border border-red-150 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              )}
            </div>

            {/* Kontak Email/HP */}
            <div className="space-y-2">
              <label htmlFor="contact" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                Kontak Pengirim <span className="text-slate-400 font-light font-sans text-[10px]">(Opsional)</span>
              </label>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Masukkan email atau nomor HP untuk dihubungi (opsional)"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 transition-all font-medium"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-orange-600 text-white font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pengaduan</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
