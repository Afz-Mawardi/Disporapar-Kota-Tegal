import { prisma } from '@/lib/prisma';
import OlahragaPageClient from './OlahragaPageClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const olahragaCardsDb = await prisma.olahragaCard.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const olahragaCards = olahragaCardsDb.map(c => ({
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
    <OlahragaPageClient
      initialOlahragaCards={olahragaCards}
      initialBidangBottomCards={bidangBottomCards}
    />
  );
}
