import { prisma } from '@/lib/prisma';
import BeritaPageClient from './BeritaPageClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const newsDb = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const news = newsDb.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString()
  }));

  const categoriesDb = await prisma.category.findMany();
  
  const initialCategories = {
    news: categoriesDb.filter(c => c.module === 'news').map(c => c.name),
    gallery: categoriesDb.filter(c => c.module === 'gallery').map(c => c.name),
    services: categoriesDb.filter(c => c.module === 'services').map(c => c.name),
    retribusi: categoriesDb.filter(c => c.module === 'retribusi').map(c => c.name)
  };

  if (initialCategories.news.length === 0) {
    initialCategories.news = ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Pengumuman', 'Event'];
  }

  return (
    <BeritaPageClient
      initialNews={news}
      initialCategories={initialCategories}
    />
  );
}
