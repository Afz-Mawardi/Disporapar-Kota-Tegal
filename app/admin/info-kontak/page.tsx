'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Trash2,
  ShieldAlert,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useOfficeInfo } from '@/lib/data-store';
import { SocialMediaItem } from '@/lib/types';

export default function InfoKontakAdminPage() {
  const [officeInfo, setOfficeInfo] = useOfficeInfo();

  // Local editing states
  const [isEditingContact, setIsEditingContact] = useState<boolean>(false);
  const [editingSocials, setEditingSocials] = useState<SocialMediaItem[]>([]);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 3000);
  };

  // Sync editingSocials when officeInfo loads
  useEffect(() => {
    if (officeInfo) {
      setEditingSocials(officeInfo.socialMediaList || []);
    }
  }, [officeInfo]);

  const handleCancelContact = () => {
    setIsEditingContact(false);
    if (officeInfo) {
      setEditingSocials(officeInfo.socialMediaList || []);
    }
  };

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const operationalHours = formData.get('operationalHours') as string;
    const gmapsEmbedUrl = formData.get('gmapsEmbedUrl') as string;

    const cleanSocials = editingSocials.filter(s => s.url.trim() !== '');
    const firstIg = cleanSocials.find(s => s.platform === 'instagram')?.url || '';
    const firstYt = cleanSocials.find(s => s.platform === 'youtube')?.url || '';

    setOfficeInfo({
      address,
      phone,
      email,
      operationalHours,
      socialMedia: {
        instagramResmi: firstIg,
        instagramTourism: cleanSocials.find(s => s.platform === 'instagram' && s.label === 'Wisata')?.url || '',
        instagramPemuda: cleanSocials.find(s => s.platform === 'instagram' && s.label === 'Pemuda')?.url || '',
        youtube: firstYt
      },
      gmapsEmbedUrl,
      socialMediaList: cleanSocials
    });

    setIsEditingContact(false);
    showNotification('Informasi Kontak dinas berhasil diperbarui!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in text-left space-y-6 font-inter">
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

      <form onSubmit={handleUpdateContact} className="space-y-6 font-inter">
        {/* Sticky Action Header Card */}
        <div className="sticky top-0 z-20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md transition-all duration-300">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#0E3B66]">Kelola Informasi Kontak Dinas</h3>
          </div>
          {isEditingContact ? (
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => {
                  setEditingSocials([...editingSocials, { platform: 'instagram', label: '', url: '' }]);
                }}
                className="h-10 px-4 flex items-center justify-center font-extrabold bg-accent hover:bg-orange-500 text-white rounded-xl transition-all shadow-md font-mono text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer select-none border border-transparent shrink-0"
              >
                + Tambah Medsos
              </button>
              <button
                type="button"
                onClick={handleCancelContact}
                className="h-10 px-5 flex items-center justify-center font-extrabold border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-all shadow-md font-mono text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer select-none shrink-0"
              >
                Batal
              </button>
              <button
                type="submit"
                className="h-10 px-5 flex items-center justify-center font-extrabold bg-[#0E3B66] hover:bg-[#0c3359] text-white rounded-xl transition-all shadow-md font-mono text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer select-none border border-transparent shrink-0"
              >
                Simpan
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingContact(true)}
              className="h-10 px-6 flex items-center justify-center font-extrabold bg-[#0E3B66] hover:bg-[#0c3359] text-white rounded-xl transition-all shadow-md font-mono text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer select-none border border-transparent shrink-0"
            >
              Edit Kontak
            </button>
          )}
        </div>

        {/* Main Form Fields Content Card */}
        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-6">
          {/* Alamat, Telepon, Email, Jam Kerja Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Alamat */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Alamat Lengkap Kantor</label>
              <textarea
                required
                rows={4}
                name="address"
                defaultValue={officeInfo.address}
                disabled={!isEditingContact}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-slate-100/50 resize-none h-[122px]"
              />
            </div>

            {/* Right: Telepon, Email, Jam Kerja */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">No. Telepon Resmi</label>
                  <input
                    type="text"
                    required
                    name="phone"
                    defaultValue={officeInfo.phone}
                    disabled={!isEditingContact}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-slate-100/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Alamat Email Resmi</label>
                  <input
                    type="email"
                    required
                    name="email"
                    defaultValue={officeInfo.email}
                    disabled={!isEditingContact}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-slate-100/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Jam Kerja Operasional</label>
                <input
                  type="text"
                  required
                  name="operationalHours"
                  defaultValue={officeInfo.operationalHours}
                  disabled={!isEditingContact}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-slate-100/50"
                />
              </div>
            </div>
          </div>

          {/* Google Maps Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Google Maps Embed URL</label>
            <input
              type="text"
              required
              name="gmapsEmbedUrl"
              defaultValue={officeInfo.gmapsEmbedUrl}
              disabled={!isEditingContact}
              placeholder="Masukkan URL embed google maps (https://www.google.com/maps/embed?...)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-slate-800 placeholder-slate-400 transition-all font-medium disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-slate-100/50 font-mono text-xs"
            />
          </div>

          {/* Divider */}
          <hr className="border-slate-100 my-6" />

          {/* Social Media Table */}
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-150 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm font-inter">
                <thead>
                  <tr className="bg-[#051424] text-white font-mono text-[10px] tracking-widest uppercase border-b border-slate-250">
                    <th className="py-3.5 px-6 w-1/4">Platform</th>
                    <th className="py-3.5 px-6 w-1/4">Nama Akun</th>
                    <th className="py-3.5 px-6">URL Tautan</th>
                    <th className="py-3.5 px-6 text-center w-1/6">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {editingSocials.map((social, index) => {
                    const moveUp = () => {
                      if (index === 0) return;
                      const newList = [...editingSocials];
                      const temp = newList[index];
                      newList[index] = newList[index - 1];
                      newList[index - 1] = temp;
                      setEditingSocials(newList);
                    };

                    const moveDown = () => {
                      if (index === editingSocials.length - 1) return;
                      const newList = [...editingSocials];
                      const temp = newList[index];
                      newList[index] = newList[index + 1];
                      newList[index + 1] = temp;
                      setEditingSocials(newList);
                    };

                    const updateField = (field: 'platform' | 'label' | 'url', value: string) => {
                      const newList = [...editingSocials];
                      newList[index] = { ...newList[index], [field]: value };
                      setEditingSocials(newList);
                    };

                    const removeRow = () => {
                      const newList = editingSocials.filter((_, i) => i !== index);
                      setEditingSocials(newList);
                    };

                    const platformLabel = social.platform.charAt(0).toUpperCase() + social.platform.slice(1);

                    return (
                      <tr key={index} className="align-middle hover:bg-slate-50/50 transition-colors">
                        {/* Platform Selector */}
                        <td className="py-3.5 px-6">
                          {isEditingContact ? (
                            <select
                              value={social.platform}
                              onChange={(e) => updateField('platform', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent text-slate-800 cursor-pointer"
                            >
                              <option value="instagram">Instagram</option>
                              <option value="youtube">YouTube</option>
                              <option value="facebook">Facebook</option>
                              <option value="x">X (Twitter)</option>
                              <option value="tiktok">TikTok</option>
                              <option value="whatsapp">WhatsApp</option>
                              <option value="telegram">Telegram</option>
                              <option value="linkedin">LinkedIn</option>
                            </select>
                          ) : (
                            <span className="text-slate-800 font-bold uppercase tracking-wider text-[10px] bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                              {platformLabel === 'X' ? 'X (Twitter)' : platformLabel}
                            </span>
                          )}
                        </td>

                        {/* Nama Akun (Label) */}
                        <td className="py-3.5 px-6">
                          {isEditingContact ? (
                            <input
                              type="text"
                              value={social.label}
                              onChange={(e) => updateField('label', e.target.value)}
                              placeholder="Nama Akun"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent text-slate-800 placeholder-slate-400"
                            />
                          ) : (
                            <span className="text-slate-800 font-bold text-xs">{social.label}</span>
                          )}
                        </td>

                        {/* URL Tautan */}
                        <td className="py-3.5 px-6 font-mono text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                          {isEditingContact ? (
                            <input
                              type="text"
                              value={social.url}
                              onChange={(e) => updateField('url', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent text-slate-800 placeholder-slate-400 font-mono"
                            />
                          ) : (
                            <span className="truncate block">{social.url}</span>
                          )}
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-6 text-center w-1/6">
                          {isEditingContact ? (
                            <div className="flex items-center justify-center gap-1.5 font-sans font-bold text-xs">
                              <button
                                type="button"
                                onClick={moveUp}
                                disabled={index === 0}
                                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[#0E3B66] hover:bg-[#0E3B66] hover:text-white disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-500 cursor-pointer transition-colors"
                                title="Pindahkan ke atas"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={moveDown}
                                disabled={index === editingSocials.length - 1}
                                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[#0E3B66] hover:bg-[#0E3B66] hover:text-white disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-500 cursor-pointer transition-colors"
                                title="Pindahkan ke bawah"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={removeRow}
                                className="p-2 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg text-red-600 shrink-0 cursor-pointer transition-colors flex items-center justify-center"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            social.url ? (
                              <a
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[12px] inline-flex items-center justify-center gap-1 text-[#0E3B66] hover:text-accent font-bold transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
                              >
                                <span>Buka</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-slate-400 font-mono italic text-[10px]">Kosong</span>
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {editingSocials.length === 0 && (
              <div className="bg-slate-50 py-8 text-center border border-dashed border-slate-200 rounded-2xl">
                <p className="text-xs text-slate-450 italic select-none font-inter">Belum ada media sosial terhubung.</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
