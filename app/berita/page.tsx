import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import BeritaPageClient from './page.client';
import dbData from '@/lib/db.json';

export const revalidate = 20;

export default async function Page() {
  let news: any[] = [];
  if (await checkDatabaseConnection()) {
    try {
      const newsDb = await prisma.news.findMany({
        orderBy: { createdAt: 'desc' }
      });

      news = newsDb.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString()
      }));
    } catch (error) {
      console.warn("Database connection failed, falling back to local json storage:", error);
      news = (dbData.news || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));
    }
  } else {
    news = (dbData.news || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  }

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
