'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  X,
  CheckCircle
} from 'lucide-react';
import { usePriorityPrograms } from '@/lib/data-store';
import { PriorityProgram } from '@/lib/types';

export default function PilarProgramPage() {
  const [priorityPrograms, setPriorityPrograms] = usePriorityPrograms();

  // Local CRUD states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [editingItem, setEditingItem] = useState<PriorityProgram | null>(null);
  const [formPoints, setFormPoints] = useState<string[]>(['']);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  };

  const handleAddPointField = () => {
    setFormPoints([...formPoints, '']);
  };

  const handleRemovePointField = (index: number) => {
    setFormPoints(formPoints.filter((_, idx) => idx !== index));
  };

  const handlePointChange = (index: number, val: string) => {
    setFormPoints(formPoints.map((item, idx) => idx === index ? val : item));
  };

  const openForm = (type: 'add' | 'edit', item: PriorityProgram | null = null) => {
    setModalType(type);
    setEditingItem(item);
    if (type === 'add') {
      setFormPoints(['']);
    } else if (type === 'edit' && item) {
      setFormPoints(item.points ? [...item.points] : ['']);
    }
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (item: PriorityProgram) => {
    setModalType('delete');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleMoveProgram = (index: number, direction: 'up' | 'down') => {
    const isFirst = index === 0;
    const isLast = index === priorityPrograms.length - 1;
    if (direction === 'up' && isFirst) return;
    if (direction === 'down' && isLast) return;

    const newList = [...priorityPrograms];
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[swapWith];
    newList[swapWith] = temp;

    setPriorityPrograms(newList);
    showNotification(`Urutan berhasil dipindahkan ke ${direction === 'up' ? 'atas' : 'bawah'}.`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (modalType === 'delete') {
      if (editingItem) {
        setPriorityPrograms(priorityPrograms.filter(p => p.id !== editingItem.id));
        showNotification('Data berhasil dihapus.', 'success');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      return;
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const points = formPoints.filter((pt) => pt.trim() !== '');

    if (!title.trim()) {
      showNotification('Judul wajib diisi.', 'error');
      return;
    }
    if (!description.trim()) {
      showNotification('Deskripsi wajib diisi.', 'error');
      return;
    }
    if (points.length < 1 || points.length > 3) {
      showNotification('Jumlah poin program harus antara 1 sampai 3.', 'error');
      return;
    }

    if (modalType === 'add') {
      if (priorityPrograms.length >= 3) {
        showNotification('Maksimal hanya 3 pilar program prioritas yang diperbolehkan.', 'error');
        return;
      }
      const newItem: PriorityProgram = {
        id: `prog-${Date.now()}`,
        title,
        description,
        points
      };
      setPriorityPrograms([...priorityPrograms, newItem]);
      showNotification('Pilar Program Prioritas berhasil ditambahkan.', 'success');
    } else if (modalType === 'edit' && editingItem) {
      setPriorityPrograms(priorityPrograms.map((item) => item.id === editingItem.id ? {
        ...item,
        title,
        description,
        points
      } : item));
      showNotification('Pilar Program Prioritas berhasil diubah.', 'success');
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
          <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight">Kelola Pilar Program Prioritas</h3>
        </div>
        <button
          onClick={() => {
            if (priorityPrograms.length >= 3) {
              showNotification('Maksimal hanya 3 pilar program prioritas yang diperbolehkan.', 'error');
              return;
            }
            openForm('add');
          }}
          disabled={priorityPrograms.length >= 3}
          className={`w-full sm:w-auto px-5 py-2.5 font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer ${
            priorityPrograms.length >= 3 ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' : 'bg-accent hover:bg-orange-500 text-white'
          }`}
          title={priorityPrograms.length >= 3 ? 'Maksimal 3 item program' : 'Tambah pilar program'}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pilar Program</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-inter">
            <thead>
              <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-200">
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Judul Program</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6">Deskripsi & Poin</th>
                <th className="py-3 px-3 sm:py-4.5 sm:px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {priorityPrograms.length > 0 ? (
                priorityPrograms.map((program, index) => {
                  const isFirst = index === 0;
                  const isLast = index === priorityPrograms.length - 1;

                  return (
                    <tr key={program.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-3 sm:py-5 sm:px-6 max-w-xs">
                        <h4 className="font-extrabold text-[#0E3B66] leading-tight">{program.title}</h4>
                      </td>
                      <td className="py-4 px-3 sm:py-5 sm:px-6 max-w-md">
                        <p className="text-slate-500 text-xs font-light leading-relaxed mb-3 line-clamp-2">{program.description}</p>
                        <ul className="space-y-1.5 border-t border-slate-100 pt-2.5">
                          {program.points?.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-center gap-2 text-xs text-slate-650">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                              <span className="truncate">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-3 sm:py-5 sm:px-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleMoveProgram(index, 'up')}
                            disabled={isFirst}
                            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-[#0E3B66] disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer transition-colors"
                            title="Pindahkan ke atas"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveProgram(index, 'down')}
                            disabled={isLast}
                            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-[#0E3B66] disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer transition-colors"
                            title="Pindahkan ke bawah"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openForm('edit', program)}
                            className="p-2 bg-slate-50 hover:bg-[#0E3B66] hover:text-white border border-slate-200 rounded-lg text-[#0E3B66] transition-colors cursor-pointer"
                            title="Ubah program"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(program)}
                            className="p-2 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg text-red-600 transition-colors cursor-pointer"
                            title="Hapus program"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
                    <h4 className="font-extrabold text-slate-800 text-sm">Tidak ada pilar program</h4>
                    <p className="text-xs text-slate-400 mt-1 font-light">Tambahkan pilar program prioritas untuk ditampilkan di Beranda.</p>
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
                {modalType === 'add' ? 'Tambah Pilar Program' : modalType === 'edit' ? 'Ubah Pilar Program' : 'Konfirmasi Hapus'}
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
                    Apakah Anda yakin ingin menghapus pilar program prioritas <span className="font-bold text-slate-850">"{editingItem?.title}"</span>? Tindakan ini tidak dapat dibatalkan.
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
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Judul Program</label>
                    <input
                      type="text"
                      required
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      placeholder="Contoh: Pemberdayaan Pemuda Kreatif"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Deskripsi Lengkap</label>
                    <textarea
                      required
                      name="description"
                      rows={3}
                      defaultValue={editingItem?.description || ''}
                      placeholder="Masukkan penjelasan singkat tentang program ini..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                    />
                  </div>

                  {/* Poin-poin Program */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">
                        Poin Program (Minimal 1, Maksimal 3)
                      </label>
                      {formPoints.length < 3 && (
                        <button
                          type="button"
                          onClick={handleAddPointField}
                          className="text-[10px] font-black text-[#0E3B66] hover:text-[#0a2c4e] uppercase font-mono tracking-wider cursor-pointer"
                        >
                          + Tambah Poin
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {formPoints.map((pt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-mono text-[10px] font-bold text-slate-450 shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Seleksi & Pendidikan Paskibraka"
                            value={pt}
                            onChange={(e) => handlePointChange(idx, e.target.value)}
                            className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0E3B66]"
                          />
                          {formPoints.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePointField(idx)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
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
