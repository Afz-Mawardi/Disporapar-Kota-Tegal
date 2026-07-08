#!/bin/sh

# Menunggu database MySQL siap menerima koneksi
echo "Menunggu database MySQL di port 3306 siap..."
until nc -z -v -w30 db 3306; do
  echo "Database belum siap. Mencoba lagi dalam 2 detik..."
  sleep 2
done
echo "Database telah aktif!"

# Menjalankan migrasi Prisma
echo "Menjalankan migrasi database..."
npx prisma migrate deploy

# Menjalankan seeding jika diperlukan (opsional, hapus tanda komentar jika ingin selalu seed)
# echo "Menjalankan database seeding..."
# npx prisma db seed

# Menjalankan aplikasi Next.js (perintah CMD dari Dockerfile)
echo "Memulai aplikasi..."
exec "$@"
