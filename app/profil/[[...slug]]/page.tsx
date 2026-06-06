'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Landmark, Target, Users, BookOpen, User, Briefcase, Award, Compass, Shield, ChevronRight, HelpCircle } from 'lucide-react';

export default function ProfilPage() {
  const pathname = usePathname();
  const [selectedRole, setSelectedRole] = useState<string>('kepala');

  // Determine activeTab primarily from the URL route path
  let activeTab: 'struktur' | 'tupoksi' = 'struktur';
  if (pathname === '/profil/struktur-organisasi') {
    activeTab = 'struktur';
  } else if (pathname === '/profil/tupoksi') {
    activeTab = 'tupoksi';
  }

  useEffect(() => {
    if (pathname !== '/profil') {
      setTimeout(() => {
        const element = document.getElementById('profil-tabs-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [pathname]);

  const tabs = [
    { id: 'struktur', name: 'Struktur Organisasi', icon: <Users className="h-4 w-4" />, href: '/profil/struktur-organisasi' },
    { id: 'tupoksi', name: 'Tugas Pokok & Fungsi', icon: <BookOpen className="h-4 w-4" />, href: '/profil/tupoksi' },
  ];

  return (
    <div id="profil-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">

      {/* Immersive Page Header */}
      <section className="relative py-20 sm:py-24 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-65">
          <Image
            src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1600"
            alt="Profil DISPORAPAR"
            fill
            priority
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Mengenal Instansi
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Profil Resmi DISPORAPAR
          </h1>
        </div>
      </section>

      {/* Sambutan Kepala Dinas - Real Documentation Photo Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-14 shadow-lg mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Foto Kepala Dinas */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-60 h-76 rounded-2xl overflow-hidden shadow-md border-4 border-slate-100 bg-slate-50 shrink-0">
                <Image
                  src="/images/kabid Image 5 Jun 2026, 14.29.31.webp"
                  alt="Khusnul Hidayati, S.E,. M.Si. - Kepala Dinas"
                  fill
                  className="object-cover"
                  sizes="(max-w-711px) 100vw, 30vw"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center mt-6">
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-tight">Khusnul Hidayati, S.E,. M.Si.</h3>
                <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-widest font-bold font-mono">Pit. Kepala DISPORAPAR Kota Tegal</p>
              </div>
            </div>

            {/* Sambutan Text block */}
            <div className="lg:col-span-8 space-y-6">
              <div className="text-slate-500 text-sm sm:text-base leading-relaxed space-y-4 font-inter font-light">
                <p>
                  Assalamualaikum Warahmatullahi Wabarakatuh, Salam sejahtera bagi kita semua, Shalom, Om Swastyastu, Namo Buddhaya, Salam Kebajikan.
                </p>
                <p>
                  Puji syukur kehadirat Allah SWT, berkat kemudahan teknologi digital kini DISPORAPAR Kota Tegal meluncurkan portal informasi dan database modern terpusat dalam menyongsong Smart Government Kota Tegal. Website ini kami dedikasikan sebagai jembatan penghubung antara kebijakan publik dinas dengan keterlibatan aktif masyarakat secara terbuka.
                </p>
                <p>
                  Kami meyakini bahwa generasi muda Kota Tegal memiliki elan kreatif luar biasa, atlet kita memiliki stamina bahari tangguh pemburu prestasi, dan wisata pesisir kita memiliki pesona unik yang layak memperoleh sorotan nasional. Mari berkolaborasi membangun Kota Tegal menjadi episentrum prestasi wisata dan kepemudaan.
                </p>
                <p className="font-bold text-slate-900 pt-3 italic font-sans">
                  Wassalamualaikum Warahmatullahi Wabarakatuh.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tabbed Interactive Information Segment */}
      <section id="profil-tabs-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tab Controls headers */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-1.5 pb-4 border-b border-slate-200 mb-12">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`${tab.href}#profil-tabs-section`}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold font-mono tracking-wide shrink-0 transition-colors w-full sm:w-auto ${isActive
                  ? 'bg-primary text-white shadow-sm font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
              >
                {tab.icon}
                <span className="uppercase">{tab.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Tab contents show */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm">

          {/* Struktur Organisasi tab view contents */}
          {activeTab === 'struktur' && (() => {
            const rolesDetails: Record<string, {
              title: string;
              responsibility: string[];
              programs: string[];
              bgClass: string;
              icon: React.ReactNode;
            }> = {
              kepala: {
                title: "KEPALA DISPORAPAR",
                bgClass: "bg-[#0E3B66]",
                icon: <User className="h-5 w-5" />,
                responsibility: [
                  "Memimpin, membina, mengarahkan, dan menetapkan seluruh kebijakan umum sektoral bidang Kepemudaan, Keolahragaan, dan Pariwisata di wilayah Kota Tegal.",
                  "Mengawasi kinerja seluruh Aparatur Sipil Negara (ASN) di lingkungan kerja dinas.",
                  "Menandatangani kesepakatan kemitraan strategis, pemberian hibah, serta kerjasama pengembangan destinasi wisata daerah."
                ],
                programs: ["Agenda Reformasi Birokrasi Terpadu", "Penyelarasan RPJMD Sektor Wisata & Olahraga", "Supervisi Zona Integritas Bebas Pungli"]
              },
              sekretaris: {
                title: "SEKRETARIS",
                bgClass: "bg-sky-600",
                icon: <User className="h-5 w-5" />,
                responsibility: [
                  "Mengkoordinasikan perumusan rencana operasional kerja, pembinaan administrasi organisasi, kepegawaian, keuangan, serta aset dinas.",
                  "Menyelenggarakan ketatausahaan dinas demi kelancaran administrasi terpadu.",
                  "Mengevaluasi dan melaporkan capaian target program kedinasan secara berkala kepada Kepala Dinas."
                ],
                programs: ["Sistem Informasi Kearsipan Dinamis (Srikandi)", "Pelayanan Administrasi Satu Pintu Sektoral", "Penyusunan Standard Operating Procedure (SOP) Terpadu"]
              },
              subbag_umum: {
                title: "KEPALA SUB BAGIAN UMUM DAN KEPEGAWAIAN",
                bgClass: "bg-slate-650",
                icon: <User className="h-4 w-4" />,
                responsibility: [
                  "Melaksanakan tata laksana surat-menyurat masuk/keluar, penggandaan, kearsipan dinas, serta ketatausahaan umum.",
                  "Mengasuh pembinaan disiplin, daftar urut kepangkatan, penilaian kinerja, jaminan kesejahteraan, mutasi, dan kesejahteraan ASN.",
                  "Mengelola urusan rumah tangga dinas, kebersihan, pemeliharaan sarana kantor, serta inventarisasi barang milik daerah."
                ],
                programs: ["Sistem Informasi Penilaian Kinerja ASN", "Digitalisasi Profil Kepegawaian DISPORAPAR", "Pengadaan Alat Tulis Kantor & Fasilitas Berwawasan Lingkungan"]
              },
              subbag_perencanaan: {
                title: "KEPALA SUB BAGIAN PERENCANAAN EVALUASI DAN KEUANGAN",
                bgClass: "bg-slate-650",
                icon: <User className="h-4 w-4" />,
                responsibility: [
                  "Menghimpun draf rencana kerja anggaran (RKA) dan dokumen pelaksanaan anggaran (DPA) seluruh bidang.",
                  "Melakukan verifikasi dokumen pertanggungjawaban penatausahaan keuangan serta membina pencatatan pembukuan.",
                  "Menyusun Laporan Realisasi Keuangan (LRA), dokumen evaluasi kinerja pembangunan dinas (LPPD, LKjIP, LAKIP)."
                ],
                programs: ["Integrasi Aplikasi e-Planning & SIPD RI", "Rekonsiliasi Pengeluaran Kas Sektoral", "Asistensi Audit Eksternal BPK-RI"]
              },
              kabid_kepemudaan: {
                title: "KEPALA BIDANG KEPEMUDAAN",
                bgClass: "bg-violet-600",
                icon: <User className="h-5 w-5" />,
                responsibility: [
                  "Merancang program inkubasi kewirausahaan pemuda, pelatihan kepemimpinan kader pelopor daerah secara berkala.",
                  "Melakukan pembinaan kemitraan organisasi kepemudaan (OKP) serta pembinaan karang taruna tingkat wilayah Tegal.",
                  "Memfasilitasi prasarana dan kegiatan pemuda pelopor rintisan digital."
                ],
                programs: ["Wadah Wirausaha Muda Tegal (AWMT)", "Seleksi Pemuda Pelopor Berprestasi Tingkat Provinsi", "Forum Kemitraan Pemuda Pelopor Kreatif"]
              },
              kabid_keolahragaan: {
                title: "KEPALA BIDANG KEOLAHRAGAAN",
                bgClass: "bg-emerald-600",
                icon: <User className="h-5 w-5" />,
                responsibility: [
                  "Menyelenggarakan pembinaan atlet dan pelatih berprestasi jangka panjang bersinergi bersama KONI Kota Tegal.",
                  "Mengelola pengelolaan fasilitas prasarana olahraga daerah seperti GOR Serbaguna dan Stadion.",
                  "Merancang pembibitan atlet usia dini berpotensi melalui festival olahraga pelajar & daerah."
                ],
                programs: ["Pemusatan Latihan Terpadu Kualifikasi PON/KONI", "Revitalisasi Kompleks Sarana Olahraga Publik", "Festival Olahraga Tradisional & Rekreasi"]
              },
              kabid_pariwisata: {
                title: "KEPALA BIDANG PARIWISATA",
                bgClass: "bg-amber-600",
                icon: <User className="h-5 w-5" />,
                responsibility: [
                  "Mengembangkan destinasi wisata unggulan bahari daerah, penataan objek pesisir terintegrasi.",
                  "Memfasilitasi kepatuhan tata kelola, pendaftaran izin tanda daftar pariwisata daerah berkelanjutan.",
                  "Mendorong promosi wisata bahari pesisir Tegal ke jejaring promosi nasional & mancanegara."
                ],
                programs: ["Masterplan Dermaga Apung & Pesisir Pantai Alam Indah (PAI)", "Sertifikasi Kelayakan Destinasi Wisata Bersih (CHSE)", "Promosi Event Pariwisata Bahari & UMKM Karangtaruna"]
              },
              fungsional_kepala: {
                title: "KELOMPOK JABATAN FUNGSIONAL",
                bgClass: "bg-slate-600",
                icon: <User className="h-5 w-5" />,
                responsibility: [
                  "Melakukan kajian akademis teknis, rekomendasi standar kebijakan kedinasan tertentu di bawah bimbingan Kepala Dinas langsung.",
                  "Merumuskan usulan rekomendasi strategis terhadap tantangan penyerapan sektor pemuda, olahraga, dan pariwisata."
                ],
                programs: ["Analisis Statistik Produktivitas Pemuda Tegal", "Kajian Pemulihan Pasca Pandemi Sektor Industri Pariwisata"]
              },
              fungsional_pemuda: {
                title: "KELOMPOK JABATAN FUNGSIONAL",
                bgClass: "bg-slate-600",
                icon: <User className="h-4 w-4" />,
                responsibility: [
                  "Melaksanakan tugas-tugas bimbingan, pendataan statistik komunitas kepemudaan secara fungsional keahlian.",
                  "Melakukan sertifikasi dan pemetaan kebutuhan inkubasi wirausaha muda daerah."
                ],
                programs: ["Penyuluhan Manajemen Anggaran OKP", "Sertifikasi Kelayakan Inkubasi Wirausaha"]
              },
              fungsional_olahraga: {
                title: "KELOMPOK JABATAN FUNGSIONAL",
                bgClass: "bg-slate-600",
                icon: <User className="h-4 w-4" />,
                responsibility: [
                  "Mendukung verifikasi kualifikasi wasit dan uji kelayakan tanding bagi atlet daerah.",
                  "Penyusunan basis statistik hasil skor tanding dan penyiapan sistem informasi keatletan."
                ],
                programs: ["Studi Komparasi Pembinaan Fisik Akademis Pelatih", "Database Sistem Informasi Keatletan Tegal"]
              },
              fungsional_parwis: {
                title: "KELOMPOK JABATAN FUNGSIONAL",
                bgClass: "bg-slate-600",
                icon: <User className="h-4 w-4" />,
                responsibility: [
                  "Melakukan penyuluhan kesadaran sapta pesona pariwisata, pembinaan Kelompok Sadar Wisata (Pokdarwis).",
                  "Melakukan pemantauan angka kunjungan wisata mingguan dan kepuasan pengunjung Pantai Alam Indah Tegal."
                ],
                programs: ["Penyuluhan Sapta Pesona Masyarakat Pantai", "Pemberdayaan Pokdarwis Area Maritim Wisata"]
              }
            };

            const roleStyling: Record<string, {
              primaryColor: string;
              borderColor: string;
              hoverBorder: string;
              badgeBg: string;
              badgeText: string;
              avatarBg: string;
            }> = {
              kepala: {
                primaryColor: "border-[#0E3B66]",
                borderColor: "border-[#0E3B66]/30",
                hoverBorder: "hover:border-[#0E3B66] hover:shadow-[#0E3B66]/10",
                badgeBg: "bg-blue-100 text-[#0E3B66]",
                badgeText: "text-[#0E3B66]",
                avatarBg: "bg-[#0E3B66]"
              },
              sekretaris: {
                primaryColor: "border-sky-600",
                borderColor: "border-sky-200",
                hoverBorder: "hover:border-sky-500 hover:shadow-sky-500/10",
                badgeBg: "bg-sky-50 text-sky-700",
                badgeText: "text-[#0E3B66]",
                avatarBg: "bg-sky-600"
              },
              subbag_umum: {
                primaryColor: "border-slate-500",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-500 hover:shadow-slate-500/10",
                badgeBg: "bg-slate-50 text-slate-700",
                badgeText: "text-slate-650",
                avatarBg: "bg-slate-500"
              },
              subbag_perencanaan: {
                primaryColor: "border-slate-500",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-500 hover:shadow-slate-500/10",
                badgeBg: "bg-slate-50 text-slate-700",
                badgeText: "text-slate-650",
                avatarBg: "bg-slate-500"
              },
              kabid_kepemudaan: {
                primaryColor: "border-violet-600",
                borderColor: "border-violet-200",
                hoverBorder: "hover:border-violet-500 hover:shadow-violet-500/10",
                badgeBg: "bg-violet-50 text-violet-700",
                badgeText: "text-violet-700",
                avatarBg: "bg-violet-600"
              },
              kabid_keolahragaan: {
                primaryColor: "border-emerald-600",
                borderColor: "border-emerald-200",
                hoverBorder: "hover:border-emerald-500 hover:shadow-emerald-500/10",
                badgeBg: "bg-emerald-50 text-emerald-700",
                badgeText: "text-emerald-700",
                avatarBg: "bg-emerald-600"
              },
              kabid_pariwisata: {
                primaryColor: "border-amber-600",
                borderColor: "border-amber-200",
                hoverBorder: "hover:border-amber-500 hover:shadow-amber-500/10",
                badgeBg: "bg-amber-50 text-amber-700",
                badgeText: "text-amber-700",
                avatarBg: "bg-amber-600"
              },
              fungsional_kepala: {
                primaryColor: "border-slate-400",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-400 hover:shadow-slate-400/5",
                badgeBg: "bg-slate-100 text-slate-600",
                badgeText: "text-slate-600",
                avatarBg: "bg-slate-400"
              },
              fungsional_pemuda: {
                primaryColor: "border-slate-400",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-400 hover:shadow-slate-400/5",
                badgeBg: "bg-slate-100 text-slate-600",
                badgeText: "text-slate-600",
                avatarBg: "bg-slate-400"
              },
              fungsional_olahraga: {
                primaryColor: "border-slate-400",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-400 hover:shadow-slate-400/5",
                badgeBg: "bg-slate-100 text-slate-600",
                badgeText: "text-slate-600",
                avatarBg: "bg-slate-400"
              },
              fungsional_parwis: {
                primaryColor: "border-slate-400",
                borderColor: "border-slate-200",
                hoverBorder: "hover:border-slate-400 hover:shadow-slate-400/5",
                badgeBg: "bg-slate-100 text-slate-600",
                badgeText: "text-slate-600",
                avatarBg: "bg-slate-400"
              }
            };

            const roleCategories: Record<string, string> = {
              kepala: "Unsur Pimpinan Utama",
              sekretaris: "Unsur Pembantu Pimpinan",
              subbag_umum: "Staf Sekretariat",
              subbag_perencanaan: "Staf Sekretariat",
              kabid_kepemudaan: "Unsur Pelaksana Sektoral",
              fungsional_pemuda: "Kelompok Fungsional Sektoral",
              kabid_keolahragaan: "Unsur Pelaksana Sektoral",
              fungsional_olahraga: "Kelompok Fungsional Sektoral",
              kabid_pariwisata: "Unsur Pelaksana Sektoral",
              fungsional_parwis: "Kelompok Fungsional Sektoral",
              fungsional_kepala: "Kelompok Fungsional Utama"
            };

            const renderCardObj = (roleKey: string) => {
              const role = rolesDetails[roleKey];
              if (!role) return null;
              const style = roleStyling[roleKey] || roleStyling.fungsional_kepala;
              const isSelected = selectedRole === roleKey;

              return (
                <button
                  type="button"
                  key={roleKey}
                  id={`card-${roleKey}`}
                  onClick={() => setSelectedRole(roleKey)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors duration-200 block relative overflow-hidden ${isSelected
                    ? `${style.primaryColor} bg-white shadow-sm ring-2 ring-blue-100/30`
                    : `bg-white ${style.borderColor} shadow-xs`
                    }`}
                >
                  {/* Absolute left subtle accent color strip */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.avatarBg}`} />

                  <div className="flex items-center gap-3 pl-2">
                    <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center text-white ${style.avatarBg} shrink-0 shadow-xs border border-white/10`}>
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1 font-sans">
                      <h4 className="text-[10px] sm:text-[11.5px] font-black text-slate-800 tracking-wide uppercase leading-tight">
                        {role.title}
                      </h4>
                    </div>
                  </div>
                </button>
              );
            };

            return (
              <div className="space-y-10">

                {/* Section Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-[#F2994A] font-mono uppercase bg-orange-100/50 border border-orange-200/40 px-3 py-1 rounded-full inline-block">
                      Hierarki Resmi Dinas
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E3B66] tracking-tight">
                      Sistem Bagan Struktur Organisasi
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-inter font-light max-w-2xl leading-relaxed">
                      Representasi visual bagan pembagian unit kerja sesuai Keputusan Walikota Tegal.
                    </p>
                  </div>
                </div>

                {/* DESKTOP BAGAN DIAGRAM (Scrollable horizontally if screen gets tiny) */}
                <div className="hidden lg:block w-full overflow-x-auto bg-[#F8FAFC] border border-slate-150 rounded-3xl p-8 scrollbar-thin">
                  <div className="min-w-[1060px] relative">

                    {/* LEVEL 1: KEPALA DISPORAPAR */}
                    <div className="flex justify-center select-none pb-0">
                      <div className="w-[230px]">
                        {renderCardObj('kepala')}
                      </div>
                    </div>

                    {/* PERFECTLY CONNECTED SEGMENTED LINES WITH ZERO GAPS */}
                    <div className="relative h-12 w-full select-none">
                      {/* Vertical line coming down from Kepala card */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-[26px] w-[2px] bg-slate-300" />

                      {/* Horizontal rail that connects the 1st column center to the 5th column center */}
                      <div className="absolute top-[23px] left-[10%] right-[10%] h-[2px] bg-slate-300" />

                      {/* 5 vertical drop lines with arrows going down from the horizontal rail */}
                      <div className="absolute top-[23px] bottom-0 left-0 right-0 grid grid-cols-5">
                        <div className="relative h-full">
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                        <div className="relative h-full">
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                        <div className="relative h-full">
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                        <div className="relative h-full">
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                        <div className="relative h-full">
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                      </div>
                    </div>

                    {/* 5 HIERARCHICAL COLUMNS */}
                    <div className="grid grid-cols-5 gap-4 items-start pt-0">

                      {/* COLUMN 1: SEKRETARIS & SUB-BAGIANS */}
                      <div className="flex flex-col items-stretch">
                        <div className="w-full">
                          {renderCardObj('sekretaris')}
                        </div>

                        {/* Sub vertical linking line for Sekretariat */}
                        <div className="relative h-6 w-full select-none">
                          {/* Vertical down from center of Sekretaris */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-[2px] bg-slate-300" />
                          {/* Horizontal branch leftwards to rail (spans from exact center to left-4 position which is 16px) */}
                          <div className="absolute top-3 left-4 right-1/2 h-[2px] bg-slate-300" />
                          {/* Rail starting from horizontal corner going down */}
                          <div className="absolute top-3 bottom-0 left-4 w-[2px] bg-slate-300" />
                        </div>

                        {/* Indented Left Side Tree Layout with row-by-row structure for perfect alignment and zero gaps */}
                        <div className="w-full flex flex-col select-none">

                          {/* Row 1: subbag_umum */}
                          <div className="flex items-center min-h-[58px]">
                            {/* Rail and arrow to subbag_umum */}
                            <div className="relative w-8 self-stretch select-none shrink-0">
                              {/* Vertical rail going through this row */}
                              <div className="absolute top-0 bottom-0 left-4 w-[2px] bg-slate-300" />
                              {/* Horizontal arrow to card */}
                              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-0 h-[2px] bg-slate-300" />
                              <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-[1px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-slate-300" />
                            </div>
                            <div className="flex-1">
                              {renderCardObj('subbag_umum')}
                            </div>
                          </div>

                          {/* Gap spacer between rows with continuous rail */}
                          <div className="flex h-3 select-none">
                            <div className="relative w-8 shrink-0 self-stretch">
                              <div className="absolute top-0 bottom-0 left-4 w-[2px] bg-slate-300" />
                            </div>
                            <div className="flex-1" />
                          </div>

                          {/* Row 2: subbag_perencanaan */}
                          <div className="flex items-center min-h-[58px]">
                            {/* Rail and arrow to subbag_perencanaan */}
                            <div className="relative w-8 self-stretch select-none shrink-0">
                              {/* Vertical rail ending at the arrow level */}
                              <div className="absolute top-0 h-1/2 left-4 w-[2px] bg-slate-300" />
                              {/* Horizontal arrow to card */}
                              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-0 h-[2px] bg-slate-300" />
                              <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-[1px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-slate-300" />
                            </div>
                            <div className="flex-1">
                              {renderCardObj('subbag_perencanaan')}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* COLUMN 2: KABID KEPEMUDAAN & FUNGSIONAL */}
                      <div className="flex flex-col items-center">
                        <div className="w-full">
                          {renderCardObj('kabid_kepemudaan')}
                        </div>
                        <div className="relative h-6 w-full select-none">
                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                        <div className="w-full">
                          {renderCardObj('fungsional_pemuda')}
                        </div>
                      </div>

                      {/* COLUMN 3: KABID KEOLAHRAGAAN & FUNGSIONAL */}
                      <div className="flex flex-col items-center">
                        <div className="w-full">
                          {renderCardObj('kabid_keolahragaan')}
                        </div>
                        <div className="relative h-6 w-full select-none">
                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                        <div className="w-full">
                          {renderCardObj('fungsional_olahraga')}
                        </div>
                      </div>

                      {/* COLUMN 4: KABID PARIWISATA & FUNGSIONAL */}
                      <div className="flex flex-col items-center">
                        <div className="w-full">
                          {renderCardObj('kabid_pariwisata')}
                        </div>
                        <div className="relative h-6 w-full select-none">
                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-300" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-300" />
                        </div>
                        <div className="w-full">
                          {renderCardObj('fungsional_parwis')}
                        </div>
                      </div>

                      {/* COLUMN 5: KELOMPOK JABATAN FUNGSIONAL DIRECT */}
                      <div className="w-full">
                        {renderCardObj('fungsional_kepala')}
                      </div>

                    </div>
                  </div>
                </div>

                {/* MOBILE ACCORDION & LIST BAGAN (Clean step-by-step tree for touchscreens) */}
                <div className="block lg:hidden space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-[11px] text-orange-850 font-inter leading-relaxed flex items-center gap-2">
                    <span className="font-extrabold flex shrink-0 w-5 h-5 rounded-full bg-orange-200/50 items-center justify-center">ℹ</span>
                    <span>Tampilan Bagan disesuaikan secara vertikal demi mempermudah akses pada perangkat smartphone.</span>
                  </div>

                  <div className="space-y-4 border-l-2 border-slate-200 pl-4 ml-2">
                    {/* Level 1 */}
                    <div className="space-y-2">
                      {renderCardObj('kepala')}
                    </div>

                    {/* Level 2 Sub-Branches */}
                    <div className="space-y-6 pt-4 border-t border-dashed border-slate-200">

                      {/* Sekretariat Branch */}
                      <div className="space-y-3">
                        {renderCardObj('sekretaris')}
                        <div className="pl-4 border-l-2 border-slate-100 space-y-3 ml-2">
                          {renderCardObj('subbag_umum')}
                          {renderCardObj('subbag_perencanaan')}
                        </div>
                      </div>

                      {/* Bidang Kepemudaan Branch */}
                      <div className="space-y-3 border-t border-slate-100 pt-4">
                        {renderCardObj('kabid_kepemudaan')}
                        <div className="pl-4 border-l-2 border-slate-100 ml-2">
                          {renderCardObj('fungsional_pemuda')}
                        </div>
                      </div>

                      {/* Bidang Keolahragaan Branch */}
                      <div className="space-y-3 border-t border-slate-100 pt-4">
                        {renderCardObj('kabid_keolahragaan')}
                        <div className="pl-4 border-l-2 border-slate-100 ml-2">
                          {renderCardObj('fungsional_olahraga')}
                        </div>
                      </div>

                      {/* Bidang Pariwisata Branch */}
                      <div className="space-y-3 border-t border-slate-100 pt-4">
                        {renderCardObj('kabid_pariwisata')}
                        <div className="pl-4 border-l-2 border-slate-100 ml-2">
                          {renderCardObj('fungsional_parwis')}
                        </div>
                      </div>

                      {/* Fungsional Dinas Utama */}
                      <div className="space-y-3 border-t border-slate-100 pt-4">
                        {renderCardObj('fungsional_kepala')}
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            );
          })()}          {/* Tugas Pokok dan fungsi tab view contents */}
          {activeTab === 'tupoksi' && (
            <div className="space-y-8 w-full select-none">
              {/* Header Info */}
              <div className="mb-2">
                <span className="text-[10px] font-bold tracking-widest text-[#0F5A9E] font-mono uppercase bg-blue-50 border border-blue-100/60 px-3 py-1 rounded-full inline-block">
                  Regulasi & Mandat
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0E3B66] tracking-tight mt-3">
                  Tugas Pokok & Fungsi (Tupoksi)
                </h3>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed text-left">
                  Berdasarkan Peraturan Wali Kota Tegal mengenai kedudukan, susunan organisasi, tugas dan fungsi serta tata kerja Dinas Kepemudaan dan Olahraga dan Pariwisata.
                </p>
              </div>

              {/* CARD 1: TUGAS POKOK */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="border-l-4 border-[#0F5A9E] p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl shrink-0">
                      <Target className="h-6 w-6 text-[#0F5A9E]" />
                    </div>
                    <div className="w-full">
                      <span className="text-xs font-bold text-[#0F5A9E] font-mono uppercase tracking-wider block mb-1">Mandat Utama</span>
                      <h4 className="text-lg sm:text-xl font-bold text-[#0E3B66] tracking-tight">
                        Tugas Pokok
                      </h4>
                      <p className="text-slate-650 text-sm sm:text-base font-inter leading-relaxed mt-2.5 text-left">
                        Membantu Wali Kota Tegal melaksanakan urusan pemerintahan yang menjadi kewenangan daerah bidang kepemudaan dan olahraga, dan bidang pariwisata.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: FUNGSI */}
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-emerald-50 p-2 rounded-xl shrink-0">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#0E3B66] tracking-tight">
                    Fungsi Dinas
                  </h4>
                </div>

                {/* 2-COLUMN GRID OF MINI-CARDS FOR FUNGSI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Perumusan kebijakan teknis di bidang kepemudaan dan olahraga, dan bidang pariwisata.",
                    "Pengoordinasian pelaksanaan kebijakan teknis di bidang kepemudaan dan olahraga, dan bidang pariwisata.",
                    "Pengoordinasian pelaksanaan tugas dan fungsi di bidang kepemudaan, bidang keolahragaan, dan bidang pariwisata.",
                    "Pembinaan dan fasilitasi di bidang kepemudaan dan olahraga, dan bidang pariwisata.",
                    "Pemantauan, evaluasi dan pelaporan pelaksanaan tugas di bidang kepemudaan dan olahraga, dan bidang pariwisata.",
                    "Pengendalian administrasi kesekretariatan Dinas.",
                    "Pengendalian penyelenggaraan tugas UPTD.",
                    "Pelaksanaan tugas lain yang diberikan oleh Wali Kota sesuai dengan tugas dan fungsinya."
                  ].map((fungsiItem, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 hover:shadow-md hover:border-blue-100/80 transition-all duration-300 h-full group"
                    >
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-50 text-[#0F5A9E] font-mono text-sm font-bold shrink-0 shadow-sm group-hover:bg-[#0F5A9E] group-hover:text-white transition-all duration-300">
                        {idx + 1}
                      </span>
                      <p className="text-slate-600 text-sm sm:text-base font-inter leading-relaxed pt-0.5 text-left">
                        {fungsiItem}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
}
