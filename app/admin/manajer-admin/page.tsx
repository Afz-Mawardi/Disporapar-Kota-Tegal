'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle,
  ShieldAlert,
  Loader2,
  X,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export default function ManajerAdminPage() {
  const { data: session, status } = useSession();

  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const sortedAdmins = useMemo(() => {
    const currentUser = session?.user?.name;
    return [...admins].sort((a, b) => {
      // 1. Currently logged-in user (self) always at the very top (No. 1)
      const isSelfA = a.username === currentUser;
      const isSelfB = b.username === currentUser;
      if (isSelfA && !isSelfB) return -1;
      if (!isSelfA && isSelfB) return 1;

      // 2. SUPER_ADMIN role above ADMIN
      const isSuperA = a.role === 'SUPER_ADMIN';
      const isSuperB = b.role === 'SUPER_ADMIN';
      if (isSuperA && !isSuperB) return -1;
      if (!isSuperA && isSuperB) return 1;

      // 3. From newest to oldest (using createdAt)
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [admins, session]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Forms state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [roleInput, setRoleInput] = useState('ADMIN');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit states
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);
  const [editUsernameInput, setEditUsernameInput] = useState('');
  const [editPasswordInput, setEditPasswordInput] = useState('');
  const [editConfirmPasswordInput, setEditConfirmPasswordInput] = useState('');
  const [editRoleInput, setEditRoleInput] = useState('ADMIN');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showEditConfirmPassword, setShowEditConfirmPassword] = useState(false);

  // Delete states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAdminItem, setDeletingAdminItem] = useState<any | null>(null);

  // Notification Toast
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  }, [setNotification]);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admins');
      if (res.status === 403) {
        setIsAuthorized(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.admins)) {
          setAdmins(data.admins);
          setIsAuthorized(true);
        }
      } else {
        showNotification('Gagal mengambil data admin.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Gagal terhubung dengan server.', 'error');
    }
  }, [showNotification]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAdmins();
    }
  }, [status, fetchAdmins]);

  const handleOpenAddModal = () => {
    setUsernameInput('');
    setPasswordInput('');
    setConfirmPasswordInput('');
    setRoleInput('ADMIN');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (admin: any) => {
    setEditingAdmin(admin);
    setEditUsernameInput(admin.username);
    setEditPasswordInput('');
    setEditConfirmPasswordInput('');
    setEditRoleInput(admin.role);
    setShowEditPassword(false);
    setShowEditConfirmPassword(false);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAdmin(null);
  };

  // Create new Admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      showNotification('Username tidak boleh kosong.', 'error');
      return;
    }
    if (passwordInput.trim().length < 6) {
      showNotification('Password minimal harus 6 karakter.', 'error');
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      showNotification('Konfirmasi password tidak cocok.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput,
          role: roleInput
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Admin baru berhasil ditambahkan!', 'success');
        setAdmins(prev => [...prev, data.admin].sort((a, b) => a.username.localeCompare(b.username)));
        handleCloseAddModal();
      } else {
        showNotification(data.error || 'Gagal menambahkan admin baru.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Gagal menyimpan data.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit existing Admin
  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    if (!editUsernameInput.trim()) {
      showNotification('Username tidak boleh kosong.', 'error');
      return;
    }

    if (editPasswordInput) {
      if (editPasswordInput.trim().length < 6) {
        showNotification('Password baru minimal harus 6 karakter.', 'error');
        return;
      }
      if (editPasswordInput !== editConfirmPasswordInput) {
        showNotification('Konfirmasi password baru tidak cocok.', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAdmin.id,
          username: editUsernameInput.trim(),
          role: editRoleInput,
          password: editPasswordInput ? editPasswordInput.trim() : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Data admin berhasil diperbarui!', 'success');
        setAdmins(prev => prev.map(item => {
          if (item.id === editingAdmin.id) {
            return { ...item, username: editUsernameInput.trim(), role: editRoleInput };
          }
          return item;
        }));
        handleCloseEditModal();
      } else {
        showNotification(data.error || 'Gagal memperbarui data admin.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Gagal menyimpan perubahan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Admin
  const openDeleteModal = (admin: any) => {
    if (admin.username === session?.user?.name) {
      showNotification('Anda tidak dapat menghapus akun Anda sendiri.', 'error');
      return;
    }
    setDeletingAdminItem(admin);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingAdminItem(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAdminItem) return;

    try {
      const res = await fetch(`/api/admins?id=${deletingAdminItem.id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Administrator "${deletingAdminItem.username}" berhasil dihapus.`, 'success');
        setAdmins(prev => prev.filter(item => item.id !== deletingAdminItem.id));
      } else {
        showNotification(data.error || 'Gagal menghapus admin.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingAdminItem(null);
    }
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
            Halaman ini hanya dapat diakses oleh Super Administrator. Hubungi administrator utama untuk info lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

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
      <div className="sticky top-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#0E3B66]" />
          <h3 className="font-extrabold text-sm sm:text-base text-[#0E3B66] tracking-tight uppercase font-mono">Manajer Admin</h3>
        </div>

        <div className="flex items-center gap-3 justify-between w-full sm:w-auto">
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-extrabold uppercase tracking-wider rounded-full transition-all shadow-md active:scale-98 flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>TAMBAH ADMIN</span>
          </button>
          <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider shrink-0">
            Total: {sortedAdmins.length} Admin
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm font-inter">
            <thead>
              <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-200">
                <th className="py-4 px-6 text-center w-16">No</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6 text-center w-48">Peran / Role</th>
                <th className="py-4 px-6 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {sortedAdmins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <span className="font-mono text-[10px] font-bold uppercase">TIDAK ADA DATA ADMINISTRATOR</span>
                  </td>
                </tr>
              ) : (
                sortedAdmins.map((admin, index) => {
                  const isSelf = admin.username === session?.user?.name;
                  return (
                    <tr key={admin.id} className={`group hover:bg-slate-50/50 transition-colors ${isSelf ? 'bg-blue-50/20' : ''}`}>
                      <td className="py-4 px-6 text-center text-slate-400 font-mono font-bold">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#0E3B66]">
                        <div className="flex items-center gap-2">
                          <span>{admin.username}</span>
                          {isSelf && (
                            <span className="inline-flex items-center text-[9px] font-bold font-mono uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                              SAYA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {admin.role === 'SUPER_ADMIN' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold font-mono uppercase tracking-wider text-purple-800 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full">
                            Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
                            Admin Biasa
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(admin)}
                            className="p-1.5 text-[#0E3B66] bg-transparent border border-transparent hover:!bg-[#0E3B66] hover:!text-white hover:!border-[#0E3B66] rounded-xl transition-all cursor-pointer"
                            title="Edit Akun"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!isSelf && (
                            <button
                              onClick={() => openDeleteModal(admin)}
                              className="p-1.5 text-red-600 bg-transparent border border-transparent hover:!bg-red-600 hover:!text-white hover:!border-red-600 rounded-xl transition-all cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD ADMIN MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-inter">
          <div className="absolute inset-0" onClick={handleCloseAddModal} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative z-10 animate-scale-in text-left">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4.5 h-4.5 text-[#0E3B66]" />
                <h3 className="text-sm font-black text-[#0E3B66] uppercase tracking-wider font-mono">Tambah Admin Baru</h3>
              </div>
              <button
                onClick={handleCloseAddModal}
                className="p-1.5 text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Username</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Password (Min. 6 Karakter)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center justify-center font-bold"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Konfirmasi password"
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center justify-center font-bold"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Hak Akses / Peran</label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-700 cursor-pointer"
                >
                  <option value="ADMIN">Admin Biasa (Hanya Edit Konten)</option>
                  <option value="SUPER_ADMIN">Super Admin (Kontrol Penuh & Manajer Admin)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold font-mono text-xs uppercase cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold font-mono text-xs uppercase cursor-pointer transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menambahkan...</span>
                    </>
                  ) : (
                    <span>Tambah Admin</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ADMIN MODAL */}
      {isEditModalOpen && editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/60 backdrop-blur-sm animate-fade-in font-inter">
          <div className="absolute inset-0" onClick={handleCloseEditModal} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative z-10 animate-scale-in text-left">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4.5 h-4.5 text-[#0E3B66]" />
                <h3 className="text-sm font-black text-[#0E3B66] uppercase tracking-wider font-mono">Edit Admin: {editingAdmin.username}</h3>
              </div>
              <button
                onClick={handleCloseEditModal}
                className="p-1.5 text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleEditAdmin} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Username</label>
                <input
                  type="text"
                  required
                  value={editUsernameInput}
                  onChange={(e) => setEditUsernameInput(e.target.value)}
                  placeholder={editingAdmin.username}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Password Baru (Kosongkan jika tidak diubah)</label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editPasswordInput}
                    onChange={(e) => setEditPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center justify-center font-bold"
                  >
                    {showEditPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Konfirmasi Password Baru</label>
                <div className="relative">
                  <input
                    type={showEditConfirmPassword ? 'text' : 'password'}
                    value={editConfirmPasswordInput}
                    onChange={(e) => setEditConfirmPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditConfirmPassword(!showEditConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center justify-center font-bold"
                  >
                    {showEditConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Hak Akses / Peran</label>
                <select
                  value={editRoleInput}
                  onChange={(e) => setEditRoleInput(e.target.value)}
                  disabled={editingAdmin.username === session?.user?.name}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3B66] font-medium text-slate-700 cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  <option value="ADMIN">Admin Biasa (Hanya Edit Konten)</option>
                  <option value="SUPER_ADMIN">Super Admin (Kontrol Penuh & Manajer Admin)</option>
                </select>
                {editingAdmin.username === session?.user?.name && (
                  <span className="text-[9px] text-slate-400 font-mono italic block">* Anda tidak dapat menurunkan peran akun Anda sendiri.</span>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold font-mono text-xs uppercase cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#0E3B66] hover:bg-[#0c3359] text-white rounded-xl font-bold font-mono text-xs uppercase cursor-pointer transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && deletingAdminItem && (
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
                Apakah Anda yakin ingin menghapus administrator <span className="font-bold text-slate-800">&quot;{deletingAdminItem.username}&quot;</span> secara permanen?
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
