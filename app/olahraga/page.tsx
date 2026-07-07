import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import OlahragaPageClient from './page.client';
import dbData from '@/lib/db.json';

export const revalidate = 20;

export default async function Page() {
  let olahragaCards: any[] = [];
  let bidangBottomCards: any[] = [];

  if (await checkDatabaseConnection()) {
    try {
      const olahragaCardsDb = await prisma.olahragaCard.findMany({
        orderBy: { createdAt: 'asc' }
      });

      olahragaCards = olahragaCardsDb.map(c => ({
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
      olahragaCards = (dbData.olahragaCards || []).map((item: any) => ({
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
    olahragaCards = (dbData.olahragaCards || []).map((item: any) => ({
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
    <OlahragaPageClient
      initialOlahragaCards={olahragaCards}
      initialBidangBottomCards={bidangBottomCards}
    />
  );
}
