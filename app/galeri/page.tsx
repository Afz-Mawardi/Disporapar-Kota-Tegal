import { prisma } from '@/lib/prisma';
import GaleriPageClient from './page.client';
import dbData from '@/lib/db.json';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const galleryDb = await prisma.galleryPhoto.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const gallery = galleryDb.map(item => ({
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
    <GaleriPageClient
      initialGallery={gallery}
      initialCategories={initialCategories}
    />
  );
}
