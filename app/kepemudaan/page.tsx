import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import KepemudaanPageClient from './page.client';
import dbData from '@/lib/db.json';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let kepemudaanCards: any[] = [];
  let bidangBottomCards: any[] = [];

  if (await checkDatabaseConnection()) {
    try {
      const kepemudaanCardsDb = await prisma.kepemudaanCard.findMany({
        orderBy: { createdAt: 'asc' }
      });

      kepemudaanCards = kepemudaanCardsDb.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        facilities: c.facilities ? c.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : []
      }));

      const bidangBottomCardsDb = await prisma.bidangBottomCard.findMany();
      bidangBottomCards = bidangBottomCardsDb.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString()
      }));
    } catch (error) {
      console.warn("Database connection failed, falling back to local json storage:", error);
      kepemudaanCards = (dbData.kepemudaanCards || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
        facilities: Array.isArray(item.facilities) ? item.facilities : (item.facilities ? item.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : [])
      }));

      bidangBottomCards = (dbData.bidangBottomCards || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));
    }
  } else {
    kepemudaanCards = (dbData.kepemudaanCards || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      facilities: Array.isArray(item.facilities) ? item.facilities : (item.facilities ? item.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : [])
    }));

    bidangBottomCards = (dbData.bidangBottomCards || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  }

  return (
    <KepemudaanPageClient
      initialKepemudaanCards={kepemudaanCards}
      initialBidangBottomCards={bidangBottomCards}
    />
  );
}
