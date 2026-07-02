# Prototype Portal DISPORAPAR Kota Tegal

Aplikasi portal informasi dan database modern terpusat Dinas Kepemudaan, Olahraga, dan Pariwisata Kota Tegal. Dibangun menggunakan Next.js, Tailwind CSS, Prisma ORM, dan MySQL.

## Cara Menjalankan Project Secara Lokal

### Prasyarat
- Node.js (v18 ke atas)
- MySQL Database

### Langkah-langkah
1. **Install dependensi**:
   ```bash
   npm install
   ```
2. **Konfigurasi Environment**:
   Salin file `.env.example` menjadi `.env` lalu sesuaikan konfigurasi koneksi database:
   ```bash
   cp .env.example .env
   ```
3. **Migrasi Database & Seeding**:
   Jalankan perintah berikut untuk membuat tabel dan mengisi data awal ke database Anda:
   ```bash
   npx prisma db push
   npm run seed
   ```
4. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
5. **Buka di Browser**:
   Buka [http://localhost:3000](http://localhost:3000) untuk melihat web portal.
   Buka [http://localhost:3000/admin](http://localhost:3000/admin) untuk masuk ke panel admin.
