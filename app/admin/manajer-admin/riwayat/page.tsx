'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Clock,
  Trash2,
  CheckCircle,
  ShieldAlert,
  Loader2,
  AlertCircle,
  FileSpreadsheet,
  SquareDot,
  CheckSquare,
  X
} from 'lucide-react';

export default function RiwayatAdminPage() {
  const { data: session, status } = useSession();

  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Selection Mode States
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteWarningMessage, setDeleteWarningMessage] = useState('');

  // Notification Toast
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  }, [setNotification]);

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admins/history');
      if (res.status === 403) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setLogs(data.logs);
          setIsAuthorized(true);
        }
      } else {
        showNotification('Gagal mengambil riwayat aktivitas.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Gagal terhubung dengan server.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchLogs();
    }
  }, [status, fetchLogs]);

  // Selection mode helpers
  const handleToggleSelectMode = () => {
    if (isSelectMode) {
      // Exit select mode
      setIsSelectMode(false);
      setSelectedIds([]);
    } else {
      // Enter select mode
      setIsSelectMode(true);
    }
  };

  const handleSelectToggle = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllSelected = logs.length > 0 && logs.every(item => selectedIds.includes(item.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(logs.map(item => item.id));
    }
  };

  // Bulk Delete
  const openBulkDeleteModal = () => {
    if (selectedIds.length === 0) return;
    setDeleteWarningMessage(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data riwayat aktivitas terpilih secara permanen?`);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      const res = await fetch('/api/admins/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`${selectedIds.length} data riwayat berhasil dihapus.`, 'success');
        setLogs(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        setIsSelectMode(false);
      } else {
        showNotification(data.error || 'Gagal menghapus riwayat terpilih.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsDeleteModalOpen(false);
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
        minute: '2-digit',
        second: '2-digit'
      }) + ' WIB';
    } catch {
      return dateStr;
    }
  };

  // Export to Excel (CSV format helper)
  const exportToExcel = () => {
    const headers = ['No', 'Tanggal & Waktu', 'Aktivitas Perubahan'];
    const rows = logs.map((item, index) => [
      index + 1,
      formatDate(item.createdAt),
      item.action
    ]);

    const csvContent = 'sep=;\r\n' + [
      headers.join(';'),
      ...rows.map(row =>
        row.map(val => {
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
    a.download = `Riwayat_Perubahan_Admin_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render Access Denied
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in space-y-4">
        <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center text-red-600 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-[#0E3B66] uppercase tracking-wider font-mono">Akses Ditolak</h3>
          <p className="text-xs text-slate-555 font-inter max-w-sm">
            Halaman ini hanya dapat diakses oleh Super Administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in relative font-inter">
      {/* Toast Notification */}
      {notification && (
        <div
          onClick={() => setNotification(null)}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-4 rounded-xl flex items-center gap-3 border text-xs font-bold font-inter transition-all animate-fade-in cursor-pointer select-none ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
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
      <div className="sticky top-0 z-20 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md">
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Clock className="w-5 h-5 text-[#0E3B66]" />
          <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight uppercase font-mono">Riwayat Perubahan Admin</h3>
        </div>

        <div className="flex items-center gap-3 justify-between w-full md:w-auto self-stretch md:self-auto">
          <div className="flex items-center gap-2">
            {/* Selection Mode Actions */}
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
              title="Unduh Riwayat"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Unduh Csv</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider shrink-0">
            Total: {logs.length} Log
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm font-inter">
            <thead>
              <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-200 select-none">
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
                <th className="py-4 px-6 text-center w-16">No</th>
                <th className="py-4 px-4 w-52">Waktu Perubahan</th>
                <th className="py-4 px-6">Teks Perubahan / Log Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={isSelectMode ? 4 : 3} className="py-12 text-center text-slate-400 select-none">
                    {status === 'loading' || isLoading ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#0E3B66]" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">Memuat riwayat aktivitas...</span>
                      </div>
                    ) : (
                      <>
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <span className="font-mono text-[10px] font-bold uppercase">BELUM ADA RIWAYAT AKTIVITAS</span>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`group hover:bg-slate-50/50 transition-colors ${selectedIds.includes(log.id) ? 'bg-slate-50/80' : ''
                      }`}
                  >
                    {isSelectMode && (
                      <td className="py-4 px-3 text-center animate-fade-in">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(log.id)}
                          onChange={() => handleSelectToggle(log.id)}
                          className="w-4 h-4 rounded border-slate-350 text-[#0E3B66] focus:ring-[#0E3B66] cursor-pointer accent-[#0E3B66]"
                        />
                      </td>
                    )}
                    <td className="py-4 px-6 text-center text-slate-400 font-mono font-bold">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-xs">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                      {log.action}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-inter">
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
