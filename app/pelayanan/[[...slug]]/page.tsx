import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import PelayananPageClient from './page.client';
import dbData from '@/lib/db.json';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let services: any[] = [];
  let retribusi: any[] = [];

  if (await checkDatabaseConnection()) {
    try {
      const servicesDb = await prisma.publicService.findMany({
        orderBy: { createdAt: 'desc' }
      });

      services = servicesDb.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString()
      }));

      const retribusiDb = await prisma.retribusi.findMany({
        orderBy: { createdAt: 'asc' }
      });

      retribusi = retribusiDb.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString()
      }));
    } catch (error) {
      console.warn("Database connection failed, falling back to local json storage:", error);
      services = (dbData.services || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));

      retribusi = (dbData.retribusi || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));
    }
  } else {
    services = (dbData.services || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));

    retribusi = (dbData.retribusi || []).map((item: any) => ({
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
    <PelayananPageClient
      initialServices={services}
      initialCategories={initialCategories}
      initialRetribusi={retribusi}
    />
  );
}
