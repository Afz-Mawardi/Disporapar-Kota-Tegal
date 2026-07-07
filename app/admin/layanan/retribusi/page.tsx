'use client';

import React, { useState, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  X,
  CheckCircle,
  Search,
  SquareDot,
  CheckSquare
} from 'lucide-react';
import { useRetribusi, useCategories, useHomepageSettings } from '@/lib/data-store';

export default function RetribusiAdminPage() {
  const [retribusi, setRetribusi] = useRetribusi();
  const [categoriesStore, setCategoriesStore] = useCategories();
  const [homepageSettings, setHomepageSettings] = useHomepageSettings();

  // Legal base states
  const [legalTitle, setLegalTitle] = useState<string>('');
  const [legalContent, setLegalContent] = useState<string>('');
  const [isEditingLegal, setIsEditingLegal] = useState<boolean>(false);

  React.useEffect(() => {
    if (homepageSettings.retribusiLegal) {
      setLegalTitle(homepageSettings.retribusiLegal.title);
      setLegalContent(homepageSettings.retribusiLegal.content);
    }
  }, [homepageSettings]);

  // Clean up on component unmount
  React.useEffect(() => {
    return () => {
      setIsEditingLegal(false);
    };
  }, []);

  const getRetribusiCategories = (): string[] => {
    return (categoriesStore.retribusi && categoriesStore.retribusi.length > 0)
      ? categoriesStore.retribusi
      : ['Olahraga', 'Pariwisata', 'Kepemudaan'];
  };

  // Local CRUD states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Checkbox Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | 'bulk' | null>(null);
  const [deleteWarningMessage, setDeleteWarningMessage] = useState('');

  // Category management states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>('');

  // Form states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Semua');

  // Filtered Retribusi data
  const filteredRetribusi = retribusi
    .filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || item.name.toLowerCase().includes(q) || item.fee.toLowerCase().includes(q);
      const matchCategory = selectedCategoryFilter === 'Semua' || item.category === selectedCategoryFilter;
      return matchQuery && matchCategory;
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' }));

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
    setIsModalOpen(true);
  };

  const handleToggleSelectMode = () => {
    if (isSelectMode) {
      setIsSelectMode(false);
      setSelectedIds([]);
    } else {
      setIsSelectMode(true);
    }
  };

  // Bulk select helpers
  const isAllSelected = filteredRetribusi.length > 0 && filteredRetribusi.every(item => selectedIds.includes(item.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      // Deselect all filtered
      const filteredIds = filteredRetribusi.map(item => item.id);
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      // Select all filtered
      const filteredIds = filteredRetribusi.map(item => item.id);
      setSelectedIds(prev => {
        const newSelection = [...prev];
        filteredIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const handleSelectToggle = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const openDeleteModal = (id: string) => {
    const item = retribusi.find(r => r.id === id);
    if (!item) return;
    setDeleteTargetId(id);
    setDeleteWarningMessage(`Apakah Anda yakin ingin menghapus tarif retribusi "${item.name}" secara permanen? Tindakan ini tidak dapat dibatalkan.`);
    setIsDeleteModalOpen(true);
  };

  const openBulkDeleteModal = () => {
    if (selectedIds.length === 0) return;
    setDeleteTargetId('bulk');
    setDeleteWarningMessage(`Apakah Anda yakin ingin menghapus ${selectedIds.length} tarif retribusi terpilih secara permanen? Tindakan ini tidak dapat dibatalkan.`);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;

    if (deleteTargetId === 'bulk') {
      const remainingRetribusi = retribusi.filter(item => !selectedIds.includes(item.id));
      setRetribusi(remainingRetribusi);
      showNotification(`${selectedIds.length} tarif retribusi berhasil dihapus.`, 'success');
      setSelectedIds([]);
      setIsSelectMode(false);
    } else {
      const remainingRetribusi = retribusi.filter(item => item.id !== deleteTargetId);
      setRetribusi(remainingRetribusi);
      showNotification('Tarif Retribusi berhasil dihapus.', 'success');
      setSelectedIds(prev => prev.filter(id => id !== deleteTargetId));
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    const name = newCategoryName.trim();
    const currentList = getRetribusiCategories();
    if (currentList.includes(name)) {
      showNotification('Kategori sudah ada.', 'error');
      return;
    }
    const updated = {
      ...categoriesStore,
      retribusi: [...currentList, name]
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
    const currentList = getRetribusiCategories();
    if (currentList.includes(newName)) {
      showNotification('Nama kategori sudah digunakan.', 'error');
      return;
    }
    const updatedList = currentList.map((c, i) => i === index ? newName : c);
    const updated = {
      ...categoriesStore,
      retribusi: updatedList
    };
    setCategoriesStore(updated);
    setEditingCategoryIndex(null);
    // Cascade to existing retribusi items
    setRetribusi(retribusi.map(item => item.category === oldName ? { ...item, category: newName } : item));
    showNotification('Kategori berhasil diubah.', 'success');
  };

  const handleDeleteCategory = (catName: string) => {
    const currentList = getRetribusiCategories();
    if (currentList.length <= 1) {
      showNotification('Minimal harus ada 1 kategori tersisa.', 'error');
      return;
    }
    const updatedList = currentList.filter(c => c !== catName);
    const updated = {
      ...categoriesStore,
      retribusi: updatedList
    };
    setCategoriesStore(updated);
    // Cascade items to the first remaining category
    setRetribusi(retribusi.map(item => item.category === catName ? { ...item, category: updatedList[0] } : item));
    showNotification('Kategori berhasil dihapus.', 'success');
  };

  const handleCancelLegal = () => {
    if (homepageSettings.retribusiLegal) {
      setLegalTitle(homepageSettings.retribusiLegal.title);
      setLegalContent(homepageSettings.retribusiLegal.content);
    }
    setIsEditingLegal(false);
  };

  const handleSaveLegal = () => {
    const updated = {
      ...homepageSettings,
      retribusiLegal: {
        title: legalTitle,
        content: legalContent
      }
    };
    setHomepageSettings(updated);
    setIsEditingLegal(false);
    showNotification('Legalitas Retribusi berhasil diperbarui.', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const fee = formData.get('fee') as string;

    if (!name.trim()) {
      showNotification('Nama Fasilitas / Layanan wajib diisi.', 'error');
      return;
    }
    if (!fee.trim()) {
      showNotification('Tarif / Biaya wajib diisi.', 'error');
      return;
    }

    if (modalType === 'add') {
      const newItem = {
        id: `ret-${Date.now()}`,
        name,
        category,
        fee
      };
      setRetribusi([...retribusi, newItem]);
      showNotification('Tarif Retribusi berhasil ditambahkan.', 'success');
    } else if (modalType === 'edit' && editingItem) {
      const updatedItem = {
        ...editingItem,
        name,
        category,
        fee
      };
      setRetribusi(retribusi.map(r => r.id === editingItem.id ? updatedItem : r));
      showNotification('Tarif Retribusi berhasil diubah.', 'success');
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };



  return (
    <div className="space-y-8 text-left animate-fade-in relative font-inter">
      {/* Toast Notification */}
      {notification && (
        <div
          onClick={() => setNotification(null)}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-4 rounded-xl flex items-center gap-3 border text-xs font-bold transition-all animate-fade-in cursor-pointer ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
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
      <div className="sticky top-0 z-20 flex flex-col xl:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari tarif retribusi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full sm:w-40 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-[#0E3B66] cursor-pointer bg-white"
          >
            <option value="Semua">Semua Kategori</option>
            {getRetribusiCategories().map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Manage Categories btn */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-[#0E3B66]/10 text-slate-700 hover:text-[#0E3B66] border border-slate-200 rounded-xl transition-all cursor-pointer font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center whitespace-nowrap"
          >
            EDIT KATEGORI
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end w-full xl:w-auto self-stretch xl:self-auto">
          <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end w-full sm:w-auto">
            <button
              onClick={handleToggleSelectMode}
              className={`px-5 py-2.5 text-xs font-mono font-extrabold uppercase tracking-wider rounded-full transition-all shadow-md active:scale-98 flex items-center gap-2 cursor-pointer ${isSelectMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-[#0E3B66] hover:bg-[#0c3359] text-white'
                }`}
            >
              {isSelectMode ? <CheckSquare className="w-4 h-4" /> : <SquareDot className="w-4 h-4" />}
              <span>{isSelectMode ? 'BATAL' : 'PILIH'}</span>
            </button>
            {isSelectMode && selectedIds.length > 0 && (
              <button
                onClick={openBulkDeleteModal}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-extrabold uppercase tracking-wider rounded-full transition-all shadow-md active:scale-98 flex items-center gap-2 cursor-pointer animate-fade-in"
              >
                <Trash2 className="w-4 h-4" />
                <span>HAPUS ({selectedIds.length})</span>
              </button>
            )}
            <button
              onClick={() => openForm('add')}
              className="px-5 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider shrink-0 ml-auto sm:ml-0">
            Total: {retribusi.length} Retribusi
          </div>
        </div>
      </div>

      {/* Pengaturan Legalitas Retribusi */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-0">
          <h3 className="text-sm font-black text-[#0E3B66] uppercase tracking-wider font-mono">
            Pengaturan Legalitas Retribusi (Perda)
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Judul Regulasi</label>
            <input
              type="text"
              value={legalTitle}
              onChange={(e) => setLegalTitle(e.target.value)}
              disabled={!isEditingLegal}
              className={`w-full px-4 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800 ${isEditingLegal ? 'bg-white border-slate-350' : 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-550'
                }`}
              placeholder="Contoh: Peraturan Daerah Tentang Retribusi"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Deskripsi / Landasan Hukum</label>
            <textarea
              value={legalContent}
              onChange={(e) => setLegalContent(e.target.value)}
              disabled={!isEditingLegal}
              rows={3}
              className={`w-full px-4 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800 font-inter ${isEditingLegal ? 'bg-white border-slate-350' : 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-550'
                }`}
              placeholder="Penjelasan draf regulasi landasan hukum retribusi..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            {!isEditingLegal ? (
              <button
                type="button"
                onClick={() => setIsEditingLegal(true)}
                className="px-5 py-2.5 bg-[#0E3B66] hover:bg-sky-900 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer font-mono text-xs uppercase tracking-wider"
              >
                Edit Legalitas
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancelLegal}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer font-bold text-xs uppercase tracking-wider font-mono"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveLegal}
                  className="px-5 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer font-mono text-xs uppercase tracking-wider"
                >
                  Simpan Legalitas
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Retribusi Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-inter">
            <thead>
              <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-200">
                {isSelectMode && (
                  <th className="py-4 px-3 text-center w-12 animate-fade-in">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAllToggle}
                      className="w-4 h-4 rounded border-slate-350 text-[#0E3B66] focus:ring-[#0E3B66] cursor-pointer accent-[#0E3B66]"
                    />
                  </th>
                )}
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Fasilitas / Layanan</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Kategori</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Tarif Resmi</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRetribusi.length > 0 ? (
                filteredRetribusi.map((item) => (
                  <tr key={item.id} className={`group hover:bg-slate-50/50 transition-colors ${selectedIds.includes(item.id) ? 'bg-slate-50/80' : ''}`}>
                    {isSelectMode && (
                      <td className="py-4 px-3 text-center animate-fade-in">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectToggle(item.id)}
                          className="w-4 h-4 rounded border-slate-350 text-[#0E3B66] focus:ring-[#0E3B66] cursor-pointer accent-[#0E3B66]"
                        />
                      </td>
                    )}
                    <td className="py-4 px-3 sm:py-5 sm:px-6 max-w-xs sm:max-w-md">
                      <h4 className="font-extrabold text-[#0E3B66] leading-snug">{item.name}</h4>
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-6 uppercase font-mono text-[10px] tracking-wider text-slate-500">
                      {item.category}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-6 font-bold text-slate-800">
                      {item.fee}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openForm('edit', item)}
                          className="p-1.5 text-[#0E3B66] bg-transparent border border-transparent hover:!bg-[#0E3B66] hover:!text-white hover:!border-[#0E3B66] rounded-xl transition-all cursor-pointer"
                          title="Ubah tarif"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item.id)}
                          className="p-1.5 text-red-600 bg-transparent border border-transparent hover:!bg-red-600 hover:!text-white hover:!border-red-600 rounded-xl transition-all cursor-pointer"
                          title="Hapus tarif"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isSelectMode ? 5 : 4} className="py-16 text-center text-slate-400">
                    <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <h4 className="font-extrabold text-slate-800 text-sm">Tidak ada data ditemukan</h4>
                    <p className="text-xs text-slate-400 mt-1 font-light">Coba ubah kata kunci pencarian atau filter kategori.</p>
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
                {modalType === 'add' ? 'Tambah Tarif Retribusi' : 'Ubah Tarif Retribusi'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Nama Fasilitas / Layanan</label>
                  <input
                    type="text"
                    required
                    name="name"
                    defaultValue={editingItem?.name || ''}
                    placeholder="Contoh: Lapangan Tenis GOR Wisanggeni"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Kategori Bidang</label>
                  <select
                    name="category"
                    defaultValue={editingItem?.category || (getRetribusiCategories()[0] || 'Olahraga')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800 cursor-pointer"
                  >
                    {getRetribusiCategories().map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Biaya / Tarif Resmi</label>
                  <input
                    type="text"
                    required
                    name="fee"
                    defaultValue={editingItem?.fee || ''}
                    placeholder="Contoh: Rp 50.000 / Jam"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-800"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                    }}
                    className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer font-bold text-xs uppercase tracking-wider font-mono"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-mono text-xs uppercase tracking-wider"
                  >
                    Simpan Tarif
                  </button>
                </div>
              </>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-inter">
          <div className="absolute inset-0" onClick={handleCancelDelete} />
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-150 overflow-hidden flex flex-col relative z-10 animate-scale-in text-left">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-black text-[#0E3B66] uppercase tracking-wider font-mono">
                Konfirmasi Hapus
              </h3>
              <button
                onClick={handleCancelDelete}
                className="p-1.5 text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                {deleteWarningMessage}
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold font-mono text-[10px] uppercase cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold font-mono text-[10px] uppercase cursor-pointer"
                  style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MANAGEMENT MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in font-inter text-slate-700">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
            <div className="bg-[#051424] px-6 py-4 flex items-center justify-between text-white shrink-0">
              <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-tight">Kelola Kategori Retribusi</h3>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setNewCategoryName('');
                  setEditingCategoryIndex(null);
                  setEditingCategoryName('');
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6 text-left flex-grow">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">Daftar Kategori</span>
                <div className="space-y-1.5 max-h-[35vh] overflow-y-auto pr-1">
                  {getRetribusiCategories().map((cat, idx) => (
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
                              className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
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
