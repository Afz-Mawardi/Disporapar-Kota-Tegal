# Dokumentasi Teknis Detail

Dokumen ini berisi penjelasan teknis mendalam mengenai arsitektur, skema database, mekanisme keamanan, struktur direktori, optimasi performa, dan konfigurasi Docker untuk proyek **Portal DISPORAPAR Kota Tegal**.

---

## 🗺️ Daftar Isi
1. [Arsitektur & Teknologi Utama](#-arsitektur--teknologi-utama)
2. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
3. [Skema Database (Prisma ORM)](#-skema-database-prisma-orm)
4. [Mekanisme Keamanan Mendalam (Security Hardening)](#-mekanisme-keamanan-mendalam-security-hardening)
5. [Detail Optimasi Performa](#-detail-optimasi-performa)
6. [Orkestrasi Docker & Runtime Migration](#-orkestrasi-docker--runtime-migration)

---

## 🏗️ Arsitektur & Teknologi Utama

Aplikasi dibangun menggunakan stack web modern dengan fokus pada performa tinggi, stabilitas, dan keamanan tingkat lanjut:

* **Framework Utama**: [Next.js v15.4](https://nextjs.org/) (menggunakan App Router untuk routing berbasis direktori, server components untuk optimasi beban client, dan client components untuk interaktivitas dinamis).
* **Library UI**: [React v19](https://react.dev/) & [Motion (Framer Motion)](https://motion.dev/) untuk micro-animations.
* **Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/) dengan `@tailwindcss/postcss` untuk pemrosesan CSS modern yang cepat.
* **Database & ORM**: [MySQL](https://www.mysql.com/) sebagai database relasional utama, dipetakan menggunakan [Prisma ORM v5.22](https://www.prisma.io/) untuk penulisan query tipe-aman (*type-safe*).
* **Autentikasi**: [Next-Auth v4.24](https://next-auth.js.org/) dengan *Credentials Provider* custom.
* **Kriptografi & Keamanan**: [Argon2](https://github.com/ranisalt/node-argon2) (khususnya varian Argon2id) untuk hashing password tingkat militer.

---

## 📂 Struktur Direktori Proyek

Berikut adalah peta struktur berkas utama beserta fungsinya:

```text
dispora_web/
├── app/                        # Direktori utama Next.js App Router
│   ├── admin/                  # Halaman dashboard administrasi (CRUD berita, agenda, dll.)
│   ├── agenda/                 # Halaman publik daftar dan detail agenda
│   ├── api/                    # Endpoint API backend Next.js
│   │   ├── admins/             # API pengelolaan administrator & log aktivitas
│   │   ├── auth/               # API autentikasi Next-Auth (signin, signout, session)
│   │   └── upload/             # API aman unggah/hapus berkas fisik
│   ├── berita/                 # Halaman publik daftar dan detail berita
│   ├── galeri/                 # Halaman publik galeri foto kegiatan
│   ├── kepemudaan/             # Halaman publik profil bidang kepemudaan
│   ├── kontak/                 # Halaman publik kontak & GMaps kantor dinas
│   ├── login.admin/            # Halaman masuk (login) panel administrator
│   ├── olahraga/               # Halaman publik profil bidang olahraga
│   ├── pariwisata/             # Halaman publik destinasi pariwisata
│   ├── pelayanan/              # Halaman publik layanan berkas & unduhan dokumen
│   ├── pengaduan/              # Halaman publik formulir pengaduan masyarakat
│   ├── profil/                 # Halaman publik profil dinas (visi, misi, struktur)
│   ├── layout.tsx              # Tata letak global (Navbar, Footer, Providers)
│   ├── page.tsx                # Halaman beranda utama (Server-side entry)
│   └── page.client.tsx         # Komponen interaktif beranda utama (Client-side rendering)
├── components/                 # Komponen React yang dapat digunakan kembali (reusable)
│   ├── layout/                 # Komponen layout seperti Navbar, Footer, Sidebar admin
│   └── ui/                     # Komponen antarmuka dasar (Button, Input, Modal, Badge)
├── lib/                        # Pustaka utilitas dan konfigurasi bersama
│   ├── audit.ts                # Layanan pencatatan aktivitas admin (Audit Logging)
│   ├── auth.ts                 # Konfigurasi Next-Auth, rate limiter, & migrasi Argon2
│   ├── data-store.ts           # Manajemen state client-side & fallback data JSON
│   ├── db.json                 # Berkas basis data fallback (jika MySQL offline)
│   ├── prisma.ts               # Inisialisasi Prisma Client & pengecekan koneksi DB cached
│   ├── types.ts                # Definisi tipe data TypeScript global
│   └── upload-utils.ts         # Wrapper helper API upload & delete berkas client-side
├── prisma/                     # Konfigurasi basis data
│   ├── schema.prisma           # Skema relasional database (tabel, index, tipe data)
│   └── seed.ts                 # Skrip seeding data awal
├── public/                     # Static assets (gambar, favicon, logo) & target folder uploads
│   └── uploads/                # Direktori penyimpanan berkas yang diunggah
├── Dockerfile                  # Konfigurasi multi-stage build container
├── docker-compose.yml          # Konfigurasi layanan container (Web App & MySQL)
└── entrypoint.sh               # Skrip startup container (tunggu DB + migrasi push)
```

---

## 🗄️ Skema Database (Prisma ORM)

Skema database dirancang menggunakan hubungan relasional MySQL. Berikut adalah detail model yang didefinisikan dalam `schema.prisma`:

### 1. Tabel `user` (Model: `User`)
Menyimpan kredensial administrator portal.
* `id` (String, Primary Key, UUID): Identifikasi unik pengguna.
* `username` (String, Unique): Nama pengguna untuk login.
* `password` (String): Hash sandi pengguna (Argon2id atau legacy MD5).
* `role` (String, Default: "ADMIN"): Peran akses administrator.
* `createdAt` (DateTime, Default: now).
* *Relasi*: Memiliki relasi *one-to-many* ke tabel `riwayat_admin`.

### 2. Tabel `riwayat_admin` (Model: `AdminLog`)
Pencatatan riwayat audit aktivitas penting yang dilakukan administrator.
* `id` (String, Primary Key, UUID): ID log.
* `action` (Text): Data aktivitas berformat JSON (mencakup waktu, IP, aksi, status, tipe berkas, dll.).
* `createdAt` (DateTime, Default: now).
* `userId` (String, Nullable, Foreign Key): Menghubungkan log ke tabel `user`.
* *Index*: Dioptimalkan dengan index pada kolom `userId` dan `createdAt` untuk query pencarian log yang cepat.

### 3. Tabel Konten Publik
* **`berita` (Model: `News`)**: Menyimpan data berita dinas. Dilengkapi index pada kolom `createdAt`.
* **`agenda` (Model: `Event`)**: Menyimpan jadwal agenda kegiatan. Dilengkapi index pada kolom `createdAt`.
* **`galeri` (Model: `GalleryPhoto`)**: Menyimpan album foto kegiatan. Dilengkapi index pada kolom `createdAt` dan `category`.
* **`berkas` (Model: `PublicService`)**: Menyimpan dokumen publik (PDF, ZIP) yang dapat diunduh bebas. Dilengkapi index pada kolom `createdAt`.

### 4. Tabel Konfigurasi Dinamis & Layanan
* **`Kontak` (Model: `OfficeInfo`)**: Menyimpan informasi kantor dinas, jam kerja, GMaps, dan tautan sosial media resmi.
* **`sambutan` (Model: `WelcomeMessage`)**: Informasi sambutan kepala dinas, NIP, nama, dan foto profil.
* **`beranda` (Model: `HeroSlide`)**: Slider gambar spanduk utama pada beranda.
* **`pilar_program` (Model: `PriorityProgram`)**: Pilar program prioritas pembangunan kepemudaan, olahraga, dan pariwisata.
* **`kepemudaan_card`, `olahraga_card`, `pariwisata_card`**: Kartu data fasilitas, daya tampung, harga retribusi, dan lokasi masing-masing bidang.
* **`retribusi` (Model: `Retribusi`)**: Daftar tarif masuk atau retribusi resmi fasilitas di bawah naungan DISPORAPAR Kota Tegal.
* **`pengaduan_internal` (Model: `Complaint`)**: Menyimpan data laporan/keluhan masyarakat. Status pengaduan meliputi: `Baru`, `Diproses`, `Selesai`, `Ditolak`. Dilengkapi index pada kolom `createdAt` dan `status`.
* **`link_eksternal` (Model: `ExternalLink`)**: Integrasi tautan luar seperti LaporGub, LAPOR! Nasional, dan PPID.

---

## 🛡️ Mekanisme Keamanan Mendalam (Security Hardening)

Portal ini menerapkan beberapa lapis pertahanan untuk memitigasi celah keamanan web umum:

### 1. Kriptografi Argon2id & Migrasi Transparan
Hashing sandi administrator menggunakan algoritma **Argon2id** (pemenang Password Hashing Competition) dengan parameter:
* `memoryCost`: 64MB (`2 ** 16` KB)
* `timeCost`: 3 iterasi
* `parallelism`: 1 thread

**Migrasi Transparan dari MD5 Lama:**
Saat proses login di [lib/auth.ts](file:///c:/Users/S A N M/KAMPUS/Proyek/PKL proyek/dispora_web/lib/auth.ts), jika sistem mendeteksi password administrator masih menggunakan hash MD5 lama:
1. Memverifikasi kecocokan MD5 sandi input dengan database.
2. Jika cocok, sistem secara otomatis men-generate hash Argon2id baru dari sandi tersebut.
3. Melakukan pembaruan (*update*) ke database secara instan dan aman tanpa menginterupsi proses masuk pengguna.

### 2. Pembatasan Percobaan Login (Brute-Force Rate Limiter)
Mencegah serangan kamus (*dictionary attack*) dengan membatasi percobaan masuk:
* Maksimal **5 kali percobaan login** berturut-turut yang gagal dalam jendela waktu **15 menit**.
* Dilacak menggunakan memori internal server (*In-memory Map*) berbasis alamat IP asal (`x-forwarded-for` atau `x-real-ip`).
* Jika limit terlampaui, IP diblokir sementara selama sisa jendela waktu dan aksi tercatat otomatis pada sistem audit log sebagai kegagalan brute-force.

### 3. Keamanan Unggah Berkas & Pencegahan RCE (Remote Code Execution)
Upload berkas merupakan vektor serangan kritis. Sistem di [app/api/upload/route.ts](file:///c:/Users/S A N M/KAMPUS/Proyek/PKL proyek/dispora_web/app/api/upload/route.ts) mengamankannya dengan cara:
* **Validasi MIME Type secara Ketat**: Hanya menerima berkas berekstensi aman: `.webp`, `.png`, `.jpg`, `.jpeg`, `.pdf`, `.zip`, `.doc`, `.docx`.
* **Pengabaian Nama Berkas Asli**: Mengabaikan total nama file yang dikirimkan client untuk mencegah serangan *path traversal* (seperti `../../恶意.sh`). Nama file diganti penuh dengan kombinasi UNIX timestamp dan UUID acak (`Date.now()_crypto.randomUUID()`).
* **Batas Kapasitas**: Membatasi ukuran berkas maksimal **5MB**.
* **Proteksi Path Traversal pada Penghapusan**: Endpoint `DELETE` memverifikasi bahwa file yang akan dihapus mutlak berada di dalam direktori `public/uploads` menggunakan validasi:
  ```typescript
  if (!filePath.startsWith(path.join(uploadDir, 'uploads'))) {
    return NextResponse.json({ error: 'Invalid file path.' }, { status: 400 });
  }
  ```

### 4. Silently Secure 404
Untuk mengelabui bot pemindai otomatis (*automatic vulnerability scanners*) yang mencari panel admin:
* Semua rute di bawah `/admin/*` dan API `/api/admins/*` disaring di [middleware.ts](file:///c:/Users/S A N M/KAMPUS/Proyek/PKL proyek/dispora_web/middleware.ts).
* Jika pengguna mencoba mengakses rute tersebut tanpa memiliki token sesi Next-Auth yang valid, sistem **tidak mengarahkan ke halaman login publik**, melainkan langsung me-redirect paksa ke rute `/404` (halaman standard Next.js Not Found). Ini membuat rute admin tampak seolah-olah tidak eksis di server.

### 5. Auto-Logout Sesi Inaktif
Melindungi komputer admin yang ditinggalkan tanpa terkunci:
* Sistem memantau aktivitas interaksi admin (gerakan mouse, klik, input keyboard) di area dashboard.
* Jika tidak ada interaksi apa pun selama **10 menit**, sesi masuk akan secara otomatis dihancurkan (`signOut`) dan admin diarahkan kembali ke halaman login.

---

## 🚀 Detail Optimasi Performa

Aplikasi ini dioptimalkan untuk menyajikan konten publik dengan latensi serendah mungkin:

### 1. Incremental Static Regeneration (ISR)
Halaman beranda publik dikonfigurasi dengan ISR (`revalidate = 20` detik). 
* Permintaan pertama menyajikan halaman statis yang telah di-cache di server (~5ms).
* Server Next.js akan meregenerasi halaman di latar belakang jika ada permintaan masuk setelah 20 detik berlalu sejak kompilasi terakhir. Ini menghemat beban koneksi database MySQL secara drastis.

### 2. Koneksi Database Cerdas dengan Mode Offline Fallback
Inisialisasi koneksi database di [lib/prisma.ts](file:///c:/Users/S A N M/KAMPUS/Proyek/PKL proyek/dispora_web/lib/prisma.ts) dilengkapi dengan verifikasi port TCP aktif (`checkDatabaseConnection`):
* Status koneksi database di-cache selama **5 detik** untuk mencegah pengecekan berulang-ulang pada request paralel.
* Jika database MySQL mati atau tidak merespons dalam waktu 500ms, sistem secara otomatis beralih ke berkas basis data statis cadangan ([lib/db.json](file:///c:/Users/S A N M/KAMPUS/Proyek/PKL proyek/dispora_web/lib/data-store.ts)) agar situs publik tetap dapat diakses pengunjung tanpa memunculkan error 500.

### 3. Query Paralel & Memoisasi Render
* Pengambilan data masif untuk berita, agenda, galeri, berkas, sambutan, spanduk, dan program prioritas dieksekusi secara paralel menggunakan `Promise.all` di [app/page.tsx](file:///c:/Users/S A N M/KAMPUS/Proyek/PKL proyek/dispora_web/app/page.tsx). Hal ini memangkas waktu tunggu respon database.
* Di sisi client ([app/page.client.tsx](file:///c:/Users/S A N M/KAMPUS/Proyek/PKL proyek/dispora_web/app/page.client.tsx)), render ulang yang tidak perlu dicegah menggunakan Hook `useMemo` saat slider spanduk bergeser secara berkala setiap 5 detik.

---

## 🐳 Orkestrasi Docker & Runtime Migration

Untuk deployment tingkat produksi, aplikasi dikemas menggunakan Docker Container dengan spesifikasi performa optimal:

### 1. Multi-Stage Build di Dockerfile
Pembagian build menjadi 3 stage terpisah dalam [Dockerfile](file:///c:/Users/S A N M/KAMPUS/Proyek/PKL proyek/dispora_web/Dockerfile):
1. **`deps`**: Mengunduh modul dependensi menggunakan `npm ci` berbasis image ringan `node:20-alpine`.
2. **`builder`**: Menyalin seluruh kode sumber, melakukan generate Prisma Client, dan melakukan kompilasi build produksi Next.js standalone.
3. **`runner`**: Image akhir yang sangat bersih dan ringan. Hanya menyalin berkas publik (`public/`), folder static (`.next/static`), hasil standalone build (`.next/standalone`), berkas skema Prisma, serta Prisma CLI yang dibutuhkan untuk runtime migrations. Dijalankan di bawah user sistem non-root (`nextjs`) demi aspek keamanan runtime.

### 2. Penanganan Startup dan Migrasi Otomatis
Pada file [entrypoint.sh](file:///c:/Users/S A N M/KAMPUS/Proyek/PKL proyek/dispora_web/entrypoint.sh):
1. Menggunakan utilitas `nc` (Netcat) untuk memeriksa status port database MySQL (`db:3306`) di dalam jaringan virtual Docker.
2. Script akan menunggu (*sleep 2 detik*) secara terus menerus sampai database MySQL siap menerima koneksi.
3. Setelah database aktif, perintah `npx prisma migrate deploy` langsung dieksekusi secara otomatis untuk menyinkronkan struktur tabel produksi terbaru sebelum menjalankan aplikasi (`node server.js`).
