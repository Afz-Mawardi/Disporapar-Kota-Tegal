import { prisma } from '@/lib/prisma';
import GaleriPageClient from './GaleriPageClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const galleryDb = await prisma.galleryPhoto.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const gallery = galleryDb.map(item => ({
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

  if (initialCategories.gallery.length === 0) {
    initialCategories.gallery = ['Pariwisata', 'Olahraga', 'Kepemudaan'];
  }

  return (
    <GaleriPageClient
      initialGallery={gallery}
      initialCategories={initialCategories}
    />
  );
}
