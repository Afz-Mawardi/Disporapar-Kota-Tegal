import { prisma } from '@/lib/prisma';
import KepemudaanPageClient from './page.client';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const kepemudaanCardsDb = await prisma.kepemudaanCard.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const kepemudaanCards = kepemudaanCardsDb.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    facilities: c.facilities ? c.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : []
  }));

  const bidangBottomCardsDb = await prisma.bidangBottomCard.findMany();
  const bidangBottomCards = bidangBottomCardsDb.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString()
  }));

  return (
    <KepemudaanPageClient
      initialKepemudaanCards={kepemudaanCards}
      initialBidangBottomCards={bidangBottomCards}
    />
  );
}
