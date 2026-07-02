'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Users as UsersIcon,
  MapPin,
  Clock,
  Ticket
} from 'lucide-react';
import { usePariwisataCards, useBidangBottomCards } from '@/lib/data-store';
import { BidangCard } from '@/lib/types';

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

export default function PariwisataAdminPage() {
  const [pariwisataCards, setPariwisataCards] = usePariwisataCards();
  const [bidangBottomCards, setBidangBottomCards] = useBidangBottomCards();

  // Local CRUD states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>('');
  const [isDragOverModal, setIsDragOverModal] = useState<boolean>(false);
  const [modalDetails, setModalDetails] = useState<{ value: string; icon: string }[]>([]);

  // Banner states
  const [sectionTitle, setSectionTitle] = useState<string>('');
  const [bannerTitle, setBannerTitle] = useState<string>('');
  const [bannerDescription, setBannerDescription] = useState<string>('');
  const [buttonText, setButtonText] = useState<string>('');
  const [buttonLink, setButtonLink] = useState<string>('');
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('');
  const [isEditingBanner, setIsEditingBanner] = useState<boolean>(false);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  };

  const handleAddDetail = () => {
    setModalDetails([...modalDetails, { value: '', icon: 'MapPin' }]);
  };

  const handleRemoveDetail = (index: number) => {
    setModalDetails(modalDetails.filter((_, i) => i !== index));
  };

  const handleUpdateDetailField = (index: number, field: 'value' | 'icon', val: string) => {
    setModalDetails(modalDetails.map((item, i) => i === index ? { ...item, [field]: val } : item));
  };

  const handleMoveDetail = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modalDetails.length - 1) return;
    const newDetails = [...modalDetails];
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    const temp = newDetails[index];
    newDetails[index] = newDetails[swapWith];
    newDetails[swapWith] = temp;
    setModalDetails(newDetails);
  };

  const openForm = (type: 'add' | 'edit', item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setUploadedImageBase64('');
    if (type === 'add') {
      setModalDetails([
        { value: '', icon: 'MapPin' },
        { value: '', icon: 'Clock' },
        { value: '', icon: 'Ticket' }
      ]);
    } else if (type === 'edit' && item) {
      setUploadedImageBase64(item.imageUrl || '');
      setModalDetails(item.details ? [...item.details] : [
        { value: item.location || '', icon: item.locationIcon || 'MapPin' },
        { value: item.capacity || '', icon: item.capacityIcon || 'Clock' },
        { value: item.price || '', icon: item.priceIcon || 'Ticket' }
      ]);
    }
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (item: any) => {
    setModalType('delete');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const isFirst = index === 0;
    const isLast = index === pariwisataCards.length - 1;
    if (direction === 'up' && isFirst) return;
    if (direction === 'down' && isLast) return;

    const newList = [...pariwisataCards];
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[swapWith];
    newList[swapWith] = temp;

    setPariwisataCards(newList);
    showNotification(`Urutan berhasil dipindahkan ke ${direction === 'up' ? 'atas' : 'bawah'}.`, 'success');
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
                menu: 'pariwisata'
              })
            });
            const result = await res.json();
            if (result.success) {
              setUploadedImageBase64(result.url);
              showNotification('Gambar berhasil diunggah dan disimpan.', 'success');
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
        setPariwisataCards(pariwisataCards.filter(c => c.id !== editingItem.id));
        showNotification('Data berhasil dihapus.', 'success');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      return;
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const facilitiesRaw = formData.get('facilities') as string;
    const facilities = facilitiesRaw ? facilitiesRaw.split(',').map((f: string) => f.trim()).filter(Boolean) : [];
    const imageUrl = uploadedImageBase64 || formData.get('imageUrl') as string || '';
    const facilitiesTitle = formData.get('facilitiesTitle') as string || 'Fasilitas Area';

    if (!title.trim()) {
      showNotification('Nama / judul wajib diisi.', 'error');
      return;
    }

    const details = modalDetails.filter(d => d.value.trim() !== '');
    const location = details[0]?.value || '';
    const capacity = details[1]?.value || '';
    const price = details[2]?.value || '';
    const locationIcon = details[0]?.icon || 'MapPin';
    const capacityIcon = details[1]?.icon || 'Clock';
    const priceIcon = details[2]?.icon || 'Ticket';

    if (modalType === 'add') {
      const newItem = {
        id: `pc-${Date.now()}`,
        title,
        description,
        location,
        capacity,
        price,
        facilities,
        imageUrl,
        locationIcon,
        capacityIcon,
        priceIcon,
        facilitiesTitle,
        details
      };
      setPariwisataCards([newItem, ...pariwisataCards]);
      showNotification('Data berhasil ditambahkan.', 'success');
    } else if (modalType === 'edit' && editingItem) {
      const updatedItem = {
        ...editingItem,
        title,
        description,
        location,
        capacity,
        price,
        facilities,
        imageUrl,
        locationIcon,
        capacityIcon,
        priceIcon,
        facilitiesTitle,
        details
      };
      setPariwisataCards(pariwisataCards.map(c => c.id === editingItem.id ? updatedItem : c));
      showNotification('Data berhasil diubah.', 'success');
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleUpdateBottomCard = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bannerTitle.trim() || !bannerDescription.trim() || !buttonText.trim() || !sectionTitle.trim()) {
      showNotification('Semua kolom wajib diisi.', 'error');
      return;
    }

    let exists = false;
    const updated = bidangBottomCards.map(c => {
      if (c.id === 'pariwisata') {
        exists = true;
        return {
          id: c.id,
          tag: '',
          title: bannerTitle,
          description: bannerDescription,
          buttonText,
          buttonLink: buttonLink || '/pelayanan',
          imageUrl: bannerImageUrl,
          sectionTag: '',
          sectionTitle
        };
      }
      return c;
    });

    if (!exists) {
      updated.push({
        id: 'pariwisata',
        tag: '',
        title: bannerTitle,
        description: bannerDescription,
        buttonText,
        buttonLink: buttonLink || '/pelayanan',
        imageUrl: bannerImageUrl,
        sectionTag: '',
        sectionTitle
      });
    }

    setBidangBottomCards(updated);
    setIsEditingBanner(false);
    showNotification('Banner informasi bawah berhasil diperbarui!', 'success');
  };

  const bottomCard = useMemo(() => bidangBottomCards.find(c => c.id === 'pariwisata') || {
    id: 'pariwisata',
    tag: 'Mitra Pelaku Usaha Wisata',
    title: 'Kembangkan Usaha Pariwisata & Kuliner Kreatif Anda Bersama Kami',
    description: 'DISPORAPAR mendukung penuh pelaku industri penginapan, restoran Sate Tegal legendaris, agen perjalanan, serta pemandu wisata bahari untuk mengajukan data usaha resmi agar terdaftar secara luas di bawah rekomendasi katalog pariwisata terpadu.',
    buttonText: 'Urus Izin Usaha & TDUP',
    buttonLink: '/pelayanan',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    sectionTag: 'Destinasi Wisata',
    sectionTitle: 'Destinasi Wisata Terpopuler & Unggulan'
  }, [bidangBottomCards]);

  useEffect(() => {
    if (bottomCard) {
      setSectionTitle(bottomCard.sectionTitle || '');
      setBannerTitle(bottomCard.title || '');
      setBannerDescription(bottomCard.description || '');
      setButtonText(bottomCard.buttonText || '');
      setButtonLink(bottomCard.buttonLink || '/pelayanan');
      setBannerImageUrl(bottomCard.imageUrl || '');
    }
  }, [bottomCard]);

  useEffect(() => {
    return () => {
      setIsEditingBanner(false);
    };
  }, []);

  const handleCancelBanner = () => {
    if (bottomCard) {
      setSectionTitle(bottomCard.sectionTitle || '');
      setBannerTitle(bottomCard.title || '');
      setBannerDescription(bottomCard.description || '');
      setButtonText(bottomCard.buttonText || '');
      setButtonLink(bottomCard.buttonLink || '/pelayanan');
      setBannerImageUrl(bottomCard.imageUrl || '');
    }
    setIsEditingBanner(false);
  };

  const filteredCards = pariwisataCards.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 text-left animate-fade-in relative font-inter">
      {/* Toast Notification */}
      {notification && (
        <div
          onClick={() => setNotification(null)}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-4 rounded-xl flex items-center gap-3 border text-xs font-bold transition-all animate-fade-in cursor-pointer select-none ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
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
            placeholder="Cari Destinasi Wisata..."
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
          <span>Tambah</span>
        </button>
      </div>

      {/* Cards Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-inter">
            <thead>
              <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-200">
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Nama / Judul</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Deskripsi & Fasilitas</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCards.length > 0 ? (
                filteredCards.map((item, index) => {
                  const isFirst = index === 0;
                  const isLast = index === filteredCards.length - 1;

                  return (
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
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {item.details?.slice(0, 3).map((d: any, idx: number) => (
                                <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                                  <span>{d.value}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 sm:py-5 sm:px-6 max-w-md">
                        <p className="text-slate-500 text-xs font-light leading-relaxed mb-3 line-clamp-2">{item.description}</p>
                        {item.facilities && item.facilities.length > 0 && (
                          <div className="flex flex-wrap gap-1 border-t border-slate-100 pt-2.5">
                            {item.facilities.map((fac: string, fIdx: number) => (
                              <span key={fIdx} className="bg-[#0E3B66]/5 border border-[#0E3B66]/10 text-[#0E3B66] px-2 py-0.5 rounded-md text-[9px] font-bold">
                                {fac}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-3 sm:py-5 sm:px-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleMoveCard(index, 'up')}
                            disabled={isFirst}
                            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-[#0E3B66] disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer transition-colors"
                            title="Pindahkan ke atas"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveCard(index, 'down')}
                            disabled={isLast}
                            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-[#0E3B66] disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer transition-colors"
                            title="Pindahkan ke bawah"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => openForm('edit', item)}
                            className="p-1.5 text-[#0E3B66] bg-transparent border border-transparent hover:!bg-[#0E3B66] hover:!text-white hover:!border-[#0E3B66] rounded-xl transition-all cursor-pointer"
                            title="Ubah data"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(item)}
                            className="p-1.5 text-red-600 bg-transparent border border-transparent hover:!bg-red-600 hover:!text-white hover:!border-red-600 rounded-xl transition-all cursor-pointer"
                            title="Hapus data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="py-16 text-center text-slate-400">
                    <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <h4 className="font-extrabold text-slate-800 text-sm">Tidak ada data ditemukan</h4>
                    <p className="text-xs text-slate-400 mt-1 font-light">Coba tambahkan destinasi wisata baru.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Banner Bottom Card Editor */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm text-left">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight">Judul Card dan Banner Pariwisata</h3>
        </div>

        <form onSubmit={handleUpdateBottomCard} className="space-y-5 font-inter">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 tracking-wider uppercase font-mono">Judul Section Halaman Utama (Daftar Card)</label>
              <input
                type="text"
                name="sectionTitle"
                required
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                disabled={!isEditingBanner}
                className={`w-full px-4 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 transition-all font-medium ${isEditingBanner ? 'bg-white border-slate-350' : 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-550'
                  }`}
                placeholder="Contoh: Destinasi Wisata Terpopuler & Unggulan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 tracking-wider uppercase font-mono">Judul Banner Bawah</label>
              <input
                type="text"
                name="title"
                required
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                disabled={!isEditingBanner}
                className={`w-full px-4 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 transition-all font-medium ${isEditingBanner ? 'bg-white border-slate-350' : 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-550'
                  }`}
                placeholder="Masukkan judul banner..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">Deskripsi Banner</label>
            <textarea
              name="description"
              required
              rows={3}
              value={bannerDescription}
              onChange={(e) => setBannerDescription(e.target.value)}
              disabled={!isEditingBanner}
              className={`w-full px-4 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800 transition-all resize-none ${isEditingBanner ? 'bg-white border-slate-350' : 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-550'
                }`}
              placeholder="Masukkan deskripsi banner..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">Teks Tombol (CTA)</label>
              <input
                type="text"
                name="buttonText"
                required
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                disabled={!isEditingBanner}
                className={`w-full px-4 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800 transition-all ${isEditingBanner ? 'bg-white border-slate-350' : 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-550'
                  }`}
                placeholder="Contoh: Urus Izin Wisata"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#0E3B66] tracking-wider uppercase font-mono font-extrabold">Tautan / Link Tombol (CTA)</label>
              <input
                type="text"
                name="buttonLink"
                required
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                disabled={!isEditingBanner}
                className={`w-full px-4 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800 transition-all ${isEditingBanner ? 'bg-white border-slate-350' : 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-550'
                  }`}
                placeholder="Contoh: /pelayanan atau https://wa.me/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">URL / Tautan Foto Banner</label>
              <input
                type="text"
                name="imageUrl"
                value={bannerImageUrl}
                onChange={(e) => setBannerImageUrl(e.target.value)}
                disabled={!isEditingBanner}
                className={`w-full px-4 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800 transition-all ${isEditingBanner ? 'bg-white border-slate-350' : 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-550'
                  }`}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {!isEditingBanner ? (
              <button
                type="button"
                onClick={() => setIsEditingBanner(true)}
                className="px-5 py-2.5 bg-[#0E3B66] hover:bg-sky-900 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer font-mono text-xs uppercase tracking-wider"
              >
                Edit Banner
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancelBanner}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer font-bold text-xs uppercase tracking-wider font-mono"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer font-mono text-xs uppercase tracking-wider"
                >
                  Simpan Banner
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-inter animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-150 overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-[#0E3B66] uppercase tracking-wider font-mono">
                {modalType === 'add' ? 'Tambah' : modalType === 'edit' ? 'Ubah Destinasi Wisata' : 'Konfirmasi Hapus'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden flex-1 text-left">
              {modalType === 'delete' ? (
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Apakah Anda yakin ingin menghapus data destinasi wisata <span className="font-bold text-slate-850">&quot;{editingItem?.title}&quot;</span>? Tindakan ini tidak dapat dibatalkan.
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
                  <div className="p-6 overflow-y-auto flex-1 space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Nama / Judul Sarana</label>
                      <input
                        type="text"
                        required
                        name="title"
                        defaultValue={editingItem?.title || ''}
                        placeholder="Masukkan nama sarana..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Deskripsi Lengkap</label>
                      <textarea
                        required
                        name="description"
                        rows={3}
                        defaultValue={editingItem?.description || ''}
                        placeholder="Masukkan deskripsi sarana..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800 resize-none"
                      />
                    </div>

                    {/* Details List Config */}
                    <div className="space-y-2.5 border-t border-slate-150/60 pt-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono block">
                          Detail Keterangan &amp; Icon (Urutan Fleksibel)
                        </label>
                        <button
                          type="button"
                          onClick={handleAddDetail}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-250 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono transition-colors cursor-pointer"
                        >
                          + Tambah Detail
                        </button>
                      </div>

                      {modalDetails.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                          <table className="w-full text-left border-collapse min-w-[400px]">
                            <thead>
                              <tr className="border-b border-slate-100 text-[9px] uppercase font-mono text-slate-400">
                                <th className="pb-2 font-bold w-[15%] text-center">Urutan</th>
                                <th className="pb-2 font-bold w-[50%]">Isi Nilai</th>
                                <th className="pb-2 font-bold w-[25%]">Pilih Icon</th>
                                <th className="pb-2 font-bold w-[10%] text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50">
                              {modalDetails.map((item, idx) => (
                                <tr key={idx} className="align-middle">
                                  <td className="py-2 px-1">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => handleMoveDetail(idx, 'up')}
                                        className="p-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer text-slate-500 font-bold text-xs"
                                      >
                                        ▲
                                      </button>
                                      <button
                                        type="button"
                                        disabled={idx === modalDetails.length - 1}
                                        onClick={() => handleMoveDetail(idx, 'down')}
                                        className="p-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer text-slate-500 font-bold text-xs"
                                      >
                                        ▼
                                      </button>
                                    </div>
                                  </td>
                                  <td className="py-2 px-1">
                                    <input
                                      type="text"
                                      required
                                      value={item.value}
                                      onChange={(e) => handleUpdateDetailField(idx, 'value', e.target.value)}
                                      placeholder="Masukkan detail..."
                                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-accent font-medium text-slate-800"
                                    />
                                  </td>
                                  <td className="py-2 px-1">
                                    <select
                                      value={item.icon}
                                      onChange={(e) => handleUpdateDetailField(idx, 'icon', e.target.value)}
                                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-accent text-slate-700 font-medium"
                                    >
                                      <option value="MapPin">📍 MapPin</option>
                                      <option value="Clock">🕒 Clock</option>
                                      <option value="Users">👥 Users</option>
                                      <option value="Ticket">🎫 Ticket</option>
                                      <option value="Calendar">📅 Calendar</option>
                                      <option value="Circle">⚫ Poin Titik</option>
                                    </select>
                                  </td>
                                  <td className="py-2 px-1 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveDetail(idx)}
                                      className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg text-red-600 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-xs">Tidak ada detail keterangan. Silakan klik &quot;+ Tambah Detail&quot;</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 border-t border-slate-150/60 pt-4">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Teks Judul Fasilitas</label>
                      <input
                        type="text"
                        name="facilitiesTitle"
                        defaultValue={editingItem?.facilitiesTitle || 'Fasilitas Area'}
                        placeholder="Contoh: Fasilitas Area"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Isi Fasilitas (Pisahkan Koma)</label>
                      <input
                        type="text"
                        name="facilities"
                        defaultValue={editingItem?.facilities ? editingItem.facilities.join(', ') : ''}
                        placeholder="Contoh: Kios Teh Poci, Area Parkir Luas"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                      />
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-150/60">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Foto Sarana</label>
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
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                          />
                        </div>
                      </div>

                      {(uploadedImageBase64 || editingItem?.imageUrl) && (
                        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono mt-3">
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
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
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
                      Simpan Data
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
