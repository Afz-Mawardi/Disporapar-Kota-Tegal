import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import PariwisataPageClient from './page.client';
import dbData from '@/lib/db.json';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let pariwisataCards: any[] = [];
  let bidangBottomCards: any[] = [];

  if (await checkDatabaseConnection()) {
    try {
      const pariwisataCardsDb = await prisma.pariwisataCard.findMany({
        orderBy: { createdAt: 'asc' }
      });

      pariwisataCards = pariwisataCardsDb.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        capacity: c.operationalHours || '',
        facilities: c.facilities ? c.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : []
      }));

      const bidangBottomCardsDb = await prisma.bidangBottomCard.findMany();
      bidangBottomCards = bidangBottomCardsDb.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString()
      }));
    } catch (error) {
      console.warn("Database connection failed, falling back to local json storage:", error);
      pariwisataCards = (dbData.pariwisataCards || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
        capacity: item.operationalHours || item.capacity || '',
        facilities: Array.isArray(item.facilities) ? item.facilities : (item.facilities ? item.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : [])
      }));

      bidangBottomCards = (dbData.bidangBottomCards || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));
    }
  } else {
    pariwisataCards = (dbData.pariwisataCards || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      capacity: item.operationalHours || item.capacity || '',
      facilities: Array.isArray(item.facilities) ? item.facilities : (item.facilities ? item.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : [])
    }));

    bidangBottomCards = (dbData.bidangBottomCards || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  }

  return (
    <PariwisataPageClient
      initialPariwisataCards={pariwisataCards}
      initialBidangBottomCards={bidangBottomCards}
    />
  );
}
