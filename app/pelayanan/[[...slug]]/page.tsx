import { prisma } from '@/lib/prisma';
import PelayananPageClient from './page.client';
import dbData from '@/lib/db.json';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const servicesDb = await prisma.publicService.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const services = servicesDb.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString()
  }));

  // Load categories directly from db.json since it has no admin CRUD
  const initialCategories = dbData.categories || {
    news: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Pengumuman', 'Event'],
    gallery: ['Pariwisata', 'Olahraga', 'Kepemudaan'],
    services: ['SOP', 'Formulir', 'Berkas Layanan'],
    retribusi: ['Olahraga', 'Pariwisata', 'Kepemudaan']
  };

  const retribusiDb = await prisma.retribusi.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const retribusi = retribusiDb.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString()
  }));

  return (
    <PelayananPageClient
      initialServices={services}
      initialCategories={initialCategories}
      initialRetribusi={retribusi}
    />
  );
}
