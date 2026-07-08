<div align="center">

# 🏛️ Portal DISPORAPAR Kota Tegal

Aplikasi portal informasi terintegrasi dan database modern terpusat milik **Dinas Kepemudaan, Olahraga, dan Pariwisata Kota Tegal**.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2d3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL Database](https://img.shields.io/badge/MySQL-Database-4479a1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Security Argon2id](https://img.shields.io/badge/Security-Argon2id-red?style=for-the-badge&logo=shield&logoColor=white)](https://en.wikipedia.org/wiki/Argon2)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 📖 Tentang Proyek
Portal ini dirancang untuk menyajikan informasi publik seputar kepemudaan, olahraga, dan destinasi pariwisata di Kota Tegal, sekaligus berfungsi sebagai panel administrasi terpusat bagi petugas DISPORAPAR untuk memperbarui data operasional dinas secara real-time.

---

## ⚡ Fitur Utama & Optimasi Performa

### 🛡️ Keamanan (Security Hardening)
* **Kriptografi Argon2id** — Mengamankan data sandi administrator di [lib/auth.ts](./lib/auth.ts) dengan dukungan migrasi transparan dari MD5 lama saat login berhasil.
* **Brute-Force Rate Limiter** — Pembatasan maksimal 5 kali kegagalan login berturut-turut per IP dalam kurun waktu 15 menit.
* **Upload Security & RCE Prevention** — Sanitasi unggahan berkas di [app/api/upload/route.ts](./app/api/upload/route.ts) dengan membuang nama asli berkas, memvalidasi MIME type secara ketat (PNG, JPG, PDF, ZIP, DOCX), membatasi kapasitas maksimal 5MB, dan mengacak nama file via UUIDv4.
* **Silently Secure 404** — Mengamankan rute sensitif `/admin/*` dan `/api/admins/*` di [middleware.ts](./middleware.ts) dengan mengarahkan pengguna tanpa token sesi langsung ke halaman 404 palsu Next.js demi menyembunyikan panel admin dari pemindai otomatis.
* **Audit Logging** — Setiap tindakan CRUD dan login terekam secara terenkapsulasi JSON pada tabel `riwayat_admin`.

### 🚀 Optimasi Performa
* **Query Paralel (`Promise.all`)** — Memproses pengambilan data majemuk pada beranda utama secara paralel guna mereduksi *latency* koneksi database.
* **Memoisasi Render Client** — Penerapan `useMemo` di [app/page.client.tsx](./app/page.client.tsx) mencegah render ulang (*re-render*) komponen statis saat transisi slider interval 5 detik.
* **Incremental Static Regeneration (ISR)** — Caching halaman publik dengan waktu revalidasi 20 detik (`revalidate = 20`) untuk penyajian instan (~5ms).
* **Pemangkasan Dependensi** — Mengurangi beban kompilasi build produksi dengan menghapus modul-modul tidak terpakai.

---

## 💻 Panduan Menjalankan Project Secara Lokal

### 📋 Prasyarat
* **Node.js** (v18 ke atas)
* **MySQL Database Server**

### 🛠️ Langkah Instalasi

1. **Unduh Dependensi Proyek**
   ```bash
   npm install
   ```

2. **Konfigurasi Environment**
   Salin berkas sampel `.env.example` menjadi `.env` lalu isi detail koneksi MySQL database Anda:
   ```bash
   cp .env.example .env
   ```

3. **Migrasi Database & Seeding Awal**
   Terapkan skema tabel ke database MySQL dan jalankan program pengisian data dummy awal (*seed*):
   ```bash
   npx prisma db push
   npm run seed
   ```

4. **Jalankan Server Development**
   ```bash
   npm run dev
   ```

5. **Akses Aplikasi**
    * **Portal Publik**: [http://localhost:3000](http://localhost:3000)
    * **Akses Login Admin**: [http://localhost:3000/login.admin](http://localhost:3000/login.admin)

> [!IMPORTANT]
> Mengakses langsung `http://localhost:3000/admin` tanpa sesi login yang sah akan menghasilkan tampilan **404 Not Found**. Anda wajib masuk secara manual melalui halaman `/login.admin`.

---

## 🐳 Panduan Menjalankan Project dengan Docker (Rekomendasi Produksi)

Aplikasi ini sudah dilengkapi dengan konfigurasi Docker multi-stage (standalone build) dan Docker Compose untuk efisiensi performa dan kemudahan deployment.

### 📋 Prasyarat
* **Docker** & **Docker Compose** terpasang di sistem Anda.

### 🛠️ Langkah Menjalankan

1. **Jalankan Container Stack**
   Jalankan perintah berikut untuk mengompilasi Next.js standalone build dan menyalakan server MySQL serta aplikasi:
   ```bash
   docker compose up -d --build
   ```

2. **Migrasi Database Otomatis**
   Container aplikasi (`web`) akan mendeteksi database MySQL (`db`), menunggu hingga port 3306 siap menerima koneksi, lalu menjalankan perintah `npx prisma migrate deploy` secara otomatis sebelum server web dimulai.

3. **Seeding Data Awal (Dummy Data)**
   Untuk mengisi database dengan data default (akun administrator, berita, agenda, pariwisata, fasilitas, retribusi, dll.), jalankan perintah seed berikut di dalam container:
   ```bash
   docker compose exec web npx prisma db seed
   ```

4. **Memantau Aktivitas & Log**
   Untuk memantau logs startup aplikasi dan proses migrasi secara real-time:
   ```bash
   docker compose logs -f
   ```

5. **Menghentikan Kontainer**
   ```bash
   docker compose down
   ```

---

## 📂 Struktur Utama Berkas Konfigurasi & Berkas Sensitif
* 📄 [schema.prisma](./prisma/schema.prisma) — Skema database relasional proyek.
* 📄 [middleware.ts](./middleware.ts) — Gerbang penyaringan sesi login admin.
* 🐳 [Dockerfile](./Dockerfile) — Konfigurasi build Next.js standalone multi-stage.
* 🐳 [docker-compose.yml](./docker-compose.yml) — Orkestrasi kontainer layanan web dan MySQL database.
* 📄 [entrypoint.sh](./entrypoint.sh) — Script startup untuk menunggu database dan menjalankan migrasi Prisma.
* 📄 [package.json](./package.json) — Konfigurasi package, dependensi modul, dan script build.
