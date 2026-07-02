import { prisma } from '@/lib/prisma';
import AgendaPageClient from './page.client';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const eventsDb = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const events = eventsDb.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString()
  }));

  return (
    <AgendaPageClient
      initialEvents={events}
    />
  );
}
