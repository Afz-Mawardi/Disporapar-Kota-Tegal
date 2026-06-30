import { prisma } from '@/lib/prisma';
import PariwisataPageClient from './PariwisataPageClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const pariwisataCardsDb = await prisma.pariwisataCard.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const pariwisataCards = pariwisataCardsDb.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    capacity: c.operationalHours || '',
    facilities: c.facilities ? c.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : []
  }));

  const bidangBottomCardsDb = await prisma.bidangBottomCard.findMany();
  const bidangBottomCards = bidangBottomCardsDb.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString()
  }));

  return (
    <PariwisataPageClient
      initialPariwisataCards={pariwisataCards}
      initialBidangBottomCards={bidangBottomCards}
    />
  );
}
