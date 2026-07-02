import { prisma } from '@/lib/prisma';
import BeritaPageClient from './page.client';
import dbData from '@/lib/db.json';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const newsDb = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const news = newsDb.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString()
  }));

  // Load categories directly from db.json since it has no admin CRUD
  const initialCategories = dbData.categories || {
    news: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Pengumuman', 'Event'],
    gallery: ['Pariwisata', 'Olahraga', 'Kepemudaan'],
    services: ['SOP', 'Formulir', 'Berkas Layanan'],
    retribusi: ['Olahraga', 'Pariwisata', 'Kepemudaan']
  };

  return (
    <BeritaPageClient
      initialNews={news}
      initialCategories={initialCategories}
    />
  );
}
