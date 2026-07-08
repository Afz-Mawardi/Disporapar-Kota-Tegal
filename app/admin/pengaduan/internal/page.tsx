'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldAlert,
  Eye,
  Trash2,
  Search,
  X,
  Calendar,
  User,
  Image as ImageIcon,
  CheckCircle,
  Loader2,
  ZoomIn,
  FileText,
  AlertCircle,
  FileSpreadsheet,
  SquareDot,
  CheckSquare,
  ChevronDown
} from 'lucide-react';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isLoading, setIsLoading] = useState(false);

  // Modal Detail State
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [modalStatus, setModalStatus] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | 'bulk' | null>(null);
  const [deleteWarningMessage, setDeleteWarningMessage] = useState('');

  // Filter complaints
  const filteredComplaints = complaints.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contact.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Checkbox Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const handleToggleSelectMode = () => {
    if (isSelectMode) {
      setIsSelectMode(false);
      setSelectedIds([]);
    } else {
      setIsSelectMode(true);
    }
  };

  // Zoom Modal State
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  }, [setNotification]);

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.complaints)) {
          setComplaints(data.complaints);
        }
      } else {
        showNotification('Gagal mengambil data pengaduan.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Gagal terhubung dengan server.', 'error');
    }
  }, [showNotification]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleOpenDetail = (complaint: any) => {
    setSelectedComplaint(complaint);
    setModalStatus(complaint.status);
    setModalNotes(complaint.notes || '');
  };

  const handleCloseDetail = () => {
    setSelectedComplaint(null);
    setModalStatus('');
    setModalNotes('');
  };

  const handleUpdateStatusAndNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdating(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedComplaint.id,
          status: modalStatus,
          notes: modalNotes
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Status dan catatan pengaduan berhasil diperbarui!', 'success');
        // Refresh local list
        setComplaints(prev => prev.map(item => {
          if (item.id === selectedComplaint.id) {
            return { ...item, status: modalStatus, notes: modalNotes };
          }
          return item;
        }));
        handleCloseDetail();
      } else {
        showNotification(data.error || 'Gagal memperbarui status pengaduan.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setDeleteWarningMessage('Apakah Anda yakin ingin menghapus pengaduan ini secara permanen? Tindakan ini juga akan menghapus berkas lampiran terkait.');
    setIsDeleteModalOpen(true);
  };

  const openBulkDeleteModal = () => {
    if (selectedIds.length === 0) return;
    setDeleteTargetId('bulk');
    setDeleteWarningMessage(`Apakah Anda yakin ingin menghapus ${selectedIds.length} pengaduan terpilih secara permanen? Tindakan ini juga akan menghapus berkas lampiran terkait.`);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    if (deleteTargetId === 'bulk') {
      try {
        const res = await fetch('/api/complaints', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          showNotification(`${selectedIds.length} pengaduan berhasil dihapus.`, 'success');
          setComplaints(prev => prev.filter(item => !selectedIds.includes(item.id)));
          setSelectedIds([]);
          setIsSelectMode(false);
        } else {
          showNotification(data.error || 'Gagal menghapus pengaduan terpilih.', 'error');
        }
      } catch (err) {
        console.error(err);
        showNotification('Terjadi kesalahan koneksi.', 'error');
      }
    } else {
      try {
        const res = await fetch(`/api/complaints?id=${deleteTargetId}`, {
          method: 'DELETE'
        });

        const data = await res.json();
        if (res.ok && data.success) {
          showNotification('Pengaduan berhasil dihapus.', 'success');
          setComplaints(prev => prev.filter(item => item.id !== deleteTargetId));
          setSelectedIds(prev => prev.filter(item => item !== deleteTargetId));
        } else {
          showNotification(data.error || 'Gagal menghapus pengaduan.', 'error');
        }
      } catch (err) {
        console.error(err);
        showNotification('Terjadi kesalahan koneksi.', 'error');
      }
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  // Bulk select helpers
  const isAllSelected = filteredComplaints.length > 0 && filteredComplaints.every(item => selectedIds.includes(item.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      // Deselect all filtered
      const filteredIds = filteredComplaints.map(item => item.id);
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      // Select all filtered
      const filteredIds = filteredComplaints.map(item => item.id);
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const existing = complaints.find(c => c.id === id);
      const notes = existing ? existing.notes : '';

      const res = await fetch('/api/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
          notes
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Status pengaduan berhasil diperbarui!', 'success');
        setComplaints(prev => prev.map(item => {
          if (item.id === id) {
            return { ...item, status: newStatus };
          }
          return item;
        }));
      } else {
        showNotification(data.error || 'Gagal memperbarui status pengaduan.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Terjadi kesalahan koneksi.', 'error');
    }
  };

  // Helpers to render status badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Baru':
        return (
          <span className="inline-flex items-center text-[10px] font-extrabold font-mono uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
            Baru
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center text-[10px] font-extrabold font-mono uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            Diproses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center text-[10px] font-extrabold font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Selesai
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center text-[10px] font-extrabold font-mono uppercase tracking-wider text-red-800 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };



  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateOnly = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTimeOnly = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';
    } catch {
      return '';
    }
  };

  const exportToExcel = () => {
    const headers = ['No', 'Tanggal', 'Waktu', 'Judul Pengaduan', 'Isi Pengaduan', 'Kontak', 'Status', 'Catatan Admin', 'Gambar'];
    const rows = filteredComplaints.map((item, index) => [
      index + 1,
      formatDateOnly(item.createdAt),
      formatTimeOnly(item.createdAt),
      item.title,
      item.content,
      item.contact || 'Anonim',
      item.status,
      item.notes || '',
      item.imageUrl ? 'Ada' : 'Tidak Ada'
    ]);

    // Explicitly set sep=; to tell Excel that we use semicolons for layout division
    const csvContent = 'sep=;\r\n' + [
      headers.join(';'),
      ...rows.map(row =>
        row.map(val => {
          // Replace newlines with spaces and double-escape quotes
          const cleanVal = String(val)
            .replace(/\r?\n|\r/g, ' ')
            .replace(/"/g, '""');
          return `"${cleanVal}"`;
        }).join(';')
      )
    ].join('\r\n');

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Pengaduan_Internal_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

      {/* Control Action Bar */}
      <div className="sticky top-0 z-20 flex flex-col xl:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari pengaduan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3B66]"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              e.target.blur();
            }}
            className="w-full sm:w-40 px-3.5 py-2.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 transition-all rounded-xl text-xs text-slate-700 font-bold focus:outline-none cursor-pointer bg-white"
          >
            <option value="Semua">Semua Status</option>
            <option value="Baru">Baru</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 justify-end w-full xl:w-auto self-stretch xl:self-auto">
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
              onClick={exportToExcel}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-extrabold uppercase tracking-wider rounded-full transition-all shadow-md active:scale-98 flex items-center gap-2 cursor-pointer"
              title="Unduh Csv"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Unduh Csv</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider shrink-0 ml-auto sm:ml-0">
            Total: {complaints.length} Pengaduan
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm font-inter">
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
                <th className="py-4 px-6 text-center w-12">No</th>
                <th className="py-4 px-4 w-40">Tanggal</th>
                <th className="py-4 px-4">Judul Pengaduan</th>
                <th className="py-4 px-4 w-48">Kontak</th>
                <th className="py-4 px-4 text-center w-24">Gambar</th>
                <th className="py-4 px-4 text-center w-32">Status</th>
                <th className="py-4 px-6 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={isSelectMode ? 8 : 7} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <span className="font-mono text-[10px] font-bold uppercase">TIDAK ADA DATA PENGADUAN</span>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item, index) => (
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
                    <td className="py-4 px-6 text-center text-slate-400 font-mono font-bold">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#0E3B66] max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-4 px-4 text-slate-600 truncate max-w-[180px]">
                      {item.contact || <span className="text-slate-350 italic text-[10px]">Anonim</span>}
                    </td>
                    {/* Gambar Column */}
                    <td className="py-4 px-4 text-center">
                      {item.imageUrl ? (
                        <div
                          onClick={() => setZoomedImage(item.imageUrl)}
                          className="w-10 h-10 mx-auto rounded-lg overflow-hidden border border-slate-200 shadow-xs cursor-zoom-in shrink-0"
                          title="Klik untuk memperbesar"
                        >
                          <img src={item.imageUrl} alt="Lampiran" className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs">X X X</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0E3B66] ${item.status === 'Baru'
                          ? 'text-blue-800 bg-blue-50 border-blue-200'
                          : item.status === 'Diproses'
                            ? 'text-amber-800 bg-amber-50 border-amber-200'
                            : item.status === 'Selesai'
                              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                              : 'text-red-800 bg-red-50 border-red-200'
                          }`}
                      >
                        <option value="Baru">Baru</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Ditolak">Ditolak</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="p-1.5 text-[#0E3B66] bg-transparent border border-transparent hover:!bg-[#0E3B66] hover:!text-white hover:!border-[#0E3B66] rounded-xl transition-all cursor-pointer"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item.id)}
                          className="p-1.5 text-red-600 bg-transparent border border-transparent hover:!bg-red-600 hover:!text-white hover:!border-red-600 rounded-xl transition-all cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL POPUP MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          {/* Dismiss by clicking outside card */}
          <div className="absolute inset-0" onClick={handleCloseDetail} />

          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative z-10 animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4.5 h-4.5 text-[#0E3B66]" />
                <h3 className="text-sm font-black text-[#0E3B66] uppercase tracking-wider font-mono">Detail Pengaduan Internal</h3>
              </div>
              <button
                onClick={handleCloseDetail}
                className="p-1.5 text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6 text-left">

              {/* Metadata Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-150 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block leading-none">Tanggal Pengaduan</span>
                    <span className="text-xs text-slate-700 font-bold font-mono">{formatDate(selectedComplaint.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2.5 sm:pt-0 sm:pl-4">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block leading-none">Kontak Pengirim</span>
                    <span className="text-xs text-slate-700 font-bold max-w-[200px] truncate block">
                      {selectedComplaint.contact || <span className="text-slate-400 italic font-medium">Anonim / Rahasia</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Content */}
              <div className="space-y-2">
                <h4 className="text-base font-black text-[#0E3B66] leading-snug">{selectedComplaint.title}</h4>
                <p className="text-xs sm:text-sm text-slate-650 leading-relaxed whitespace-pre-line bg-slate-50/50 border border-slate-100 p-4 rounded-2xl font-inter font-light">
                  {selectedComplaint.content}
                </p>
              </div>

              {/* Attachment Preview (Zoomable) */}
              {selectedComplaint.imageUrl ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono block">Lampiran Foto</span>
                  <div
                    onClick={() => setZoomedImage(selectedComplaint.imageUrl)}
                    className="relative w-44 h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs cursor-zoom-in group shrink-0"
                  >
                    <img
                      src={selectedComplaint.imageUrl}
                      alt="Lampiran"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ZoomIn className="w-5 h-5 drop-shadow-md" />
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono block italic">* Klik gambar untuk memperbesar</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono block">Lampiran Foto</span>
                  <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl text-slate-400 text-xs flex items-center gap-2">
                    <ImageIcon className="w-4.5 h-4.5 opacity-40 shrink-0" />
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider">Tidak ada lampiran foto</span>
                  </div>
                </div>
              )}

              {/* Catatan Admin Form */}
              <form onSubmit={handleUpdateStatusAndNotes} className="space-y-4 pt-4 border-t border-slate-150">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Catatan Admin</label>
                  <textarea
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    placeholder="Masukkan catatan pemrosesan pengaduan..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseDetail}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold font-mono text-xs uppercase cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2.5 bg-[#0E3B66] hover:bg-[#0c3359] text-white rounded-xl font-bold font-mono text-xs uppercase cursor-pointer transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2 min-w-[120px]"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>Simpan Catatan</span>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* SECONDARY ZOOM POPUP MODAL */}
      {zoomedImage && (
        <div className="fixed inset-y-0 right-0 left-0 md:left-64 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
          {/* Close zoom by clicking backdrop outside image */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setZoomedImage(null)} />

          <div className="relative max-w-4xl max-h-[85vh] z-10 animate-scale-in">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 p-2 text-white/85 hover:text-white bg-slate-950/50 hover:bg-slate-950/80 rounded-full transition-all cursor-pointer flex items-center justify-center z-20"
              title="Tutup"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed Lampiran"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
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

    </div>
  );
}
