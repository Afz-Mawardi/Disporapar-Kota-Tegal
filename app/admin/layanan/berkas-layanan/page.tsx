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
  Search,
  FolderOpen,
  FileText
} from 'lucide-react';
import { usePublicServices, useCategories } from '@/lib/data-store';

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

export default function BerkasLayananAdminPage() {
  const [services, setServices] = usePublicServices();
  const [categoriesStore, setCategoriesStore] = useCategories();

  // Local CRUD states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Categories manager modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>('');

  // Form states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Semua');
  
  const [uploadedFileBase64, setUploadedFileBase64] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
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
    setUploadedFileBase64('');
    setUploadedFileName('');
    setUploadedFileSize('');
    if (type === 'edit' && item) {
      setUploadedFileSize(item.fileSize || '');
      if (item.downloadUrl && item.downloadUrl.startsWith('data:')) {
        setUploadedFileBase64(item.downloadUrl);
        setUploadedFileName('Berkas Terunggah');
      } else if (item.downloadUrl) {
        setUploadedFileName(item.downloadUrl.substring(item.downloadUrl.lastIndexOf('/') + 1));
      }
    }
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (item: any) => {
    setModalType('delete');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validDocExtensions = ['.pdf', '.zip', '.doc', '.docx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!validDocExtensions.includes(fileExtension)) {
        showNotification('Format berkas harus berupa PDF, ZIP, DOC, atau DOCX.', 'error');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Ukuran berkas maksimal 5MB.', 'error');
        e.target.value = '';
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
      showNotification('Sedang mengunggah berkas...', 'success');

      const reader = new FileReader();
      reader.onloadend = async () => {
        const docBase64 = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileBase64: docBase64,
              fileName: file.name,
              menu: 'berkas'
            })
          });
          const result = await res.json();
          if (result.success) {
            setUploadedFileBase64(result.url);
            showNotification('Berkas berhasil diunggah.', 'success');
          } else {
            throw new Error(result.error || 'Gagal menyimpan berkas di server.');
          }
        } catch (err: any) {
          showNotification(err.message || 'Gagal mengunggah berkas ke server.', 'error');
          e.target.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (modalType === 'delete') {
      if (editingItem) {
        setServices(services.filter(s => s.id !== editingItem.id));
        showNotification('Berkas berhasil dihapus.', 'success');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      return;
    }

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const urlInput = formData.get('downloadUrl') as string;
    const downloadUrl = uploadedFileBase64 || urlInput || '';
    
    if (!title.trim()) {
      showNotification('Nama berkas wajib diisi.', 'error');
      return;
    }

    if (modalType === 'add') {
      const newItem = {
        id: `s-${Date.now()}`,
        title,
        description: '',
        category,
        downloadUrl,
        fileSize: uploadedFileSize || '1.2 MB',
        showOnHomepage: true
      };
      setServices([newItem, ...services]);
      showNotification('Berkas berhasil ditambahkan.', 'success');
    } else if (modalType === 'edit' && editingItem) {
      const updatedItem = {
        ...editingItem,
        title,
        category,
        downloadUrl,
        fileSize: uploadedFileSize || editingItem.fileSize || '1.2 MB'
      };
      setServices(services.map(s => s.id === editingItem.id ? updatedItem : s));
      showNotification('Berkas berhasil diubah.', 'success');
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Category Manager Methods
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    const name = newCategoryName.trim();
    const currentList = categoriesStore.services || [];
    if (currentList.includes(name)) {
      showNotification('Kategori sudah ada.', 'error');
      return;
    }
    const updated = {
      ...categoriesStore,
      services: [...currentList, name]
    };
    setCategoriesStore(updated);
    setNewCategoryName('');
    showNotification('Kategori berhasil ditambahkan.', 'success');
  };

  const handleSaveCategoryRename = (oldName: string, index: number) => {
    if (!editingCategoryName.trim()) return;
    const newName = editingCategoryName.trim();
    if (oldName === newName) {
      setEditingCategoryIndex(null);
      return;
    }
    const currentList = categoriesStore.services || [];
    if (currentList.includes(newName)) {
      showNotification('Nama kategori sudah digunakan.', 'error');
      return;
    }
    const updatedList = currentList.map((c, i) => i === index ? newName : c);
    const updated = {
      ...categoriesStore,
      services: updatedList
    };
    setCategoriesStore(updated);
    setEditingCategoryIndex(null);
    // Cascade to existing services items
    setServices(services.map(item => item.category === oldName ? { ...item, category: newName } : item));
    showNotification('Kategori berhasil diubah.', 'success');
  };

  const handleDeleteCategory = (catName: string) => {
    const currentList = categoriesStore.services || [];
    if (currentList.length <= 1) {
      showNotification('Minimal harus ada 1 kategori tersisa.', 'error');
      return;
    }
    const updatedList = currentList.filter(c => c !== catName);
    const updated = {
      ...categoriesStore,
      services: updatedList
    };
    setCategoriesStore(updated);
    // Cascade items to the first remaining category
    setServices(services.map(item => item.category === catName ? { ...item, category: updatedList[0] } : item));
    showNotification('Kategori berhasil dihapus.', 'success');
  };

  const filteredServices = services
    .filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || item.title.toLowerCase().includes(q);
      const matchCategory = selectedCategoryFilter === 'Semua' || item.category === selectedCategoryFilter;
      return matchQuery && matchCategory;
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'id', { sensitivity: 'base' }));

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
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari berkas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-[#0E3B66] cursor-pointer bg-white"
          >
            <option value="Semua">Semua Kategori</option>
            {categoriesStore.services?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Manage Categories btn */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-[#0E3B66]/10 text-slate-700 hover:text-[#0E3B66] border border-slate-200 rounded-xl transition-all cursor-pointer font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center whitespace-nowrap"
          >
            EDIT KATEGORI
          </button>
        </div>

        <button
          onClick={() => openForm('add')}
          className="w-full md:w-auto px-5 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berkas Baru</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-inter">
            <thead>
              <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-200">
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Berkas Dokumen</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Kategori</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredServices.length > 0 ? (
                filteredServices.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-3 sm:py-5 sm:px-6 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-3">
                        <FileFormatIcon downloadUrl={item.downloadUrl} title={item.title} className="w-5 h-5 shrink-0" />
                        <div>
                          <h4 className="font-extrabold text-[#0E3B66] leading-snug line-clamp-2">{item.title}</h4>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-6 uppercase font-mono text-[10px] tracking-wider text-slate-500">
                      {item.category}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openForm('edit', item)}
                          className="p-2 bg-slate-50 hover:bg-[#0E3B66] hover:text-white border border-slate-200 rounded-lg text-[#0E3B66] transition-colors cursor-pointer"
                          title="Ubah berkas"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(item)}
                          className="p-2 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg text-red-650 transition-colors cursor-pointer"
                          title="Hapus berkas"
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
                    <h4 className="font-extrabold text-slate-800 text-sm">Tidak ada berkas ditemukan</h4>
                    <p className="text-xs text-slate-400 mt-1 font-light">Coba ubah kata kunci pencarian atau kategori filter.</p>
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
                {modalType === 'add' ? 'Tambah Berkas' : modalType === 'edit' ? 'Ubah Berkas' : 'Konfirmasi Hapus'}
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
                    Apakah Anda yakin ingin menghapus berkas <span className="font-bold text-slate-850">"{editingItem?.title}"</span>? Tindakan ini tidak dapat dibatalkan.
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
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Nama / Judul Berkas</label>
                    <input
                      type="text"
                      required
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      placeholder="Masukkan nama dokumen berkas"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Kategori Berkas</label>
                    <select
                      name="category"
                      defaultValue={editingItem?.category || (categoriesStore.services?.[0] || 'Formulir')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800 cursor-pointer"
                    >
                      {categoriesStore.services?.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">File Dokumen</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Local Upload */}
                      <div className={`p-4 border-2 border-dashed rounded-xl text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 relative ${isDragOverModal
                        ? 'border-accent bg-accent/5 scale-[1.02] shadow-md'
                        : 'border-slate-350 bg-slate-50/50 hover:bg-slate-50'
                        }`}>
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-extrabold text-[#0E3B66] uppercase tracking-wider font-mono">Unggah Berkas</span>
                        <span className="text-[8px] text-slate-400 block font-light leading-none">Maksimal 5MB (PDF/ZIP/DOC/DOCX)</span>
                        <input
                          type="file"
                          accept=".pdf,.zip,.doc,.docx"
                          onChange={handleDocFileChange}
                          onDragEnter={() => setIsDragOverModal(true)}
                          onDragLeave={() => setIsDragOverModal(false)}
                          onDrop={() => setIsDragOverModal(false)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* URL input */}
                      <div className="space-y-1.5 flex flex-col justify-center">
                        <span className="text-[8.5px] font-bold text-slate-440 font-mono">Atau Masukkan URL Link Berkas:</span>
                        <input
                          type="text"
                          name="downloadUrl"
                          value={uploadedFileBase64.startsWith('data:') ? '' : uploadedFileBase64 || editingItem?.downloadUrl || ''}
                          onChange={(e) => setUploadedFileBase64(e.target.value)}
                          placeholder="https://example.com/file.pdf"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    {uploadedFileName && (
                      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-accent shrink-0" />
                          <span className="text-slate-800 font-bold truncate max-w-[200px]">
                            {uploadedFileName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFileBase64('');
                            setUploadedFileName('');
                            setUploadedFileSize('');
                          }}
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
                        setUploadedFileBase64('');
                        setUploadedFileName('');
                        setUploadedFileSize('');
                      }}
                      className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer font-bold text-xs uppercase tracking-wider font-mono"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-mono text-xs uppercase tracking-wider"
                    >
                      Simpan Berkas
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MANAGEMENT MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in font-inter text-slate-700">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
            <div className="bg-[#051424] px-6 py-4 flex items-center justify-between text-white shrink-0">
              <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-tight">Kelola Kategori Berkas</h3>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setNewCategoryName('');
                  setEditingCategoryIndex(null);
                  setEditingCategoryName('');
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-650 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6 text-left flex-grow">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">Daftar Kategori</span>
                <div className="space-y-1.5 max-h-[35vh] overflow-y-auto pr-1">
                  {categoriesStore.services?.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-100 transition-colors">
                      {editingCategoryIndex === idx ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="flex-grow px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveCategoryRename(cat, idx)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg uppercase transition-colors cursor-pointer"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategoryIndex(null)}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-350 text-slate-700 text-[10px] font-bold rounded-lg uppercase transition-colors cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-[#0E3B66]">{cat}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategoryIndex(idx);
                                setEditingCategoryName(cat);
                              }}
                              className="p-1.5 text-slate-400 hover:text-[#0E3B66] transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 text-slate-400 hover:text-red-650 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">Tambah Kategori Baru</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nama kategori baru..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-grow px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-4 py-2 bg-[#0E3B66] hover:bg-sky-900 text-white text-[11px] font-bold uppercase tracking-wider font-mono rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
