import { prisma } from '@/lib/prisma';
import PelayananPageClient from './PelayananPageClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const servicesDb = await prisma.publicService.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const services = servicesDb.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString()
  }));

  const categoriesDb = await prisma.category.findMany();
  const initialCategories = {
    news: categoriesDb.filter(c => c.module === 'news').map(c => c.name),
    gallery: categoriesDb.filter(c => c.module === 'gallery').map(c => c.name),
    services: categoriesDb.filter(c => c.module === 'services').map(c => c.name),
    retribusi: categoriesDb.filter(c => c.module === 'retribusi').map(c => c.name)
  };

  if (initialCategories.services.length === 0) {
    initialCategories.services = ['SOP', 'Formulir', 'Berkas Layanan'];
  }

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
