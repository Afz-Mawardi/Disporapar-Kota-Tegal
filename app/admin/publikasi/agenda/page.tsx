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
  Calendar,
  MapPin,
  Clock,
  SquareDot,
  CheckSquare
} from 'lucide-react';
import { useEvents } from '@/lib/data-store';
import { sortItemsByDateTime } from '@/lib/utils';

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



export default function AgendaEventAdminPage() {
  const [events, setEvents] = useEvents();

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

  // Form states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const filteredEvents = [...events]
    .sort(sortItemsByDateTime)
    .filter(item => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q))
      );
    });

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
  const isAllSelected = filteredEvents.length > 0 && filteredEvents.every(item => selectedIds.includes(item.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      // Deselect all filtered
      const filteredIds = filteredEvents.map(item => item.id);
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      // Select all filtered
      const filteredIds = filteredEvents.map(item => item.id);
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
    const item = events.find(ev => ev.id === id);
    if (!item) return;
    setDeleteTargetId(id);
    setDeleteWarningMessage(`Apakah Anda yakin ingin menghapus agenda "${item.title}" secara permanen? Tindakan ini tidak dapat dibatalkan.`);
    setIsDeleteModalOpen(true);
  };

  const openBulkDeleteModal = () => {
    if (selectedIds.length === 0) return;
    setDeleteTargetId('bulk');
    setDeleteWarningMessage(`Apakah Anda yakin ingin menghapus ${selectedIds.length} agenda terpilih secara permanen? Tindakan ini tidak dapat dibatalkan.`);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    setIsSaving(true);
    let success = false;

    if (deleteTargetId === 'bulk') {
      const remainingEvents = events.filter(item => !selectedIds.includes(item.id));
      success = await setEvents(remainingEvents);
      if (success) {
        showNotification(`${selectedIds.length} agenda berhasil dihapus.`, 'success');
        setSelectedIds([]);
        setIsSelectMode(false);
      }
    } else {
      const remainingEvents = events.filter(item => item.id !== deleteTargetId);
      success = await setEvents(remainingEvents);
      if (success) {
        showNotification('Agenda berhasil dihapus.', 'success');
        setSelectedIds(prev => prev.filter(id => id !== deleteTargetId));
      }
    }

    setIsSaving(false);
    if (!success) {
      showNotification('Gagal menghapus data dari server.', 'error');
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const title = formData.get('title') as string;
    const dateVal = formData.get('date') as string;
    const startTime = formData.get('startTime') as string || '08:00';
    const endTime = formData.get('endTime') as string || '12:00';
    const time = `${startTime} - ${endTime} WIB`;
    const location = formData.get('location') as string;

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

    setIsSaving(true);
    let success = false;

    if (modalType === 'add') {
      const newItem = {
        id: `e-${Date.now()}`,
        title,
        date: dateString,
        time,
        location,
        description: '',
        imageUrl: ''
      };
      success = await setEvents([newItem, ...events]);
      if (success) {
        setIsModalOpen(false);
        setEditingItem(null);
        showNotification('Agenda berhasil ditambahkan.', 'success');
      }
    } else if (modalType === 'edit' && editingItem) {
      const updatedItem = {
        ...editingItem,
        title,
        date: dateString,
        time,
        location,
        imageUrl: ''
      };
      success = await setEvents(events.map(ev => ev.id === editingItem.id ? updatedItem : ev));
      if (success) {
        setIsModalOpen(false);
        setEditingItem(null);
        showNotification('Agenda berhasil diubah.', 'success');
      }
    }

    setIsSaving(false);
    if (!success) {
      showNotification('Gagal menyimpan perubahan ke server.', 'error');
    }
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
              placeholder="Cari Agenda Event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66]"
            />
          </div>
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
            Total: {events.length} Event
          </div>
        </div>
      </div>

      {/* Agenda Table */}
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
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Nama Event</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Jadwal & Lokasi</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((item) => (
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
                    <td className="py-4 px-3 sm:py-5 sm:px-6 max-w-xs">
                      <div className="flex items-center gap-3">
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
                          className="p-1.5 text-[#0E3B66] bg-transparent border border-transparent hover:!bg-[#0E3B66] hover:!text-white hover:!border-[#0E3B66] rounded-xl transition-all cursor-pointer"
                          title="Ubah agenda"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item.id)}
                          className="p-1.5 text-red-600 bg-transparent border border-transparent hover:!bg-red-600 hover:!text-white hover:!border-red-600 rounded-xl transition-all cursor-pointer"
                          title="Hapus agenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isSelectMode ? 4 : 3} className="py-16 text-center text-slate-400">
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
                {modalType === 'add' ? 'Tambah Agenda Event' : 'Ubah Agenda Event'}
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
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-accent hover:bg-orange-500 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-mono text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
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
                  disabled={isSaving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold font-mono text-[10px] uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                >
                  {isSaving ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
