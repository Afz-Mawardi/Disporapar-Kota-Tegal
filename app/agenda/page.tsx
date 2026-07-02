import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import AgendaPageClient from './page.client';
import dbData from '@/lib/db.json';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let events: any[] = [];
  if (await checkDatabaseConnection()) {
    try {
      const eventsDb = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' }
      });

      events = eventsDb.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString()
      }));
    } catch (error) {
      console.warn("Database connection failed, falling back to local json storage:", error);
      events = (dbData.events || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));
    }
  } else {
    events = (dbData.events || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  }

  return (
    <AgendaPageClient
      initialEvents={events}
    />
  );
}
