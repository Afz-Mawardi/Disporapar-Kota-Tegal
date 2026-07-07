import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import HomePageClient from './page.client';
import dbData from '@/lib/db.json';

export const revalidate = 20;

const getFallbackData = () => ({
  news: (dbData.news || []).map((item: any) => ({
    ...item,
    createdAt: item.createdAt || new Date().toISOString()
  })),
  events: (dbData.events || []).map((item: any) => ({
    ...item,
    createdAt: item.createdAt || new Date().toISOString()
  })),
  gallery: (dbData.gallery || []).map((item: any) => ({
    ...item,
    createdAt: item.createdAt || new Date().toISOString()
  })),
  services: (dbData.services || []).map((item: any) => ({
    ...item,
    createdAt: item.createdAt || new Date().toISOString()
  })),
  welcomeMessage: dbData.welcomeMessage || null,
  heroSlides: (dbData.heroSlides || []).map((item: any) => ({
    ...item,
    createdAt: item.createdAt || new Date().toISOString()
  })),
  priorityPrograms: (dbData.priorityPrograms || []).map((item: any) => ({
    ...item,
    createdAt: item.createdAt || new Date().toISOString(),
    points: item.points || []
  }))
});

export default async function Page() {
  const homepageSettings = dbData.homepageSettings || null;
  let data;

  if (await checkDatabaseConnection()) {
    try {
      const [
        newsDb,
        eventsDb,
        galleryDb,
        servicesDb,
        welcomeMessageDb,
        heroSlidesDb,
        priorityProgramsDb
      ] = await Promise.all([
        prisma.news.findMany({
          where: { showOnHomepage: true },
          orderBy: { createdAt: 'desc' },
          take: 6,
          select: { id: true, title: true, excerpt: true, category: true, date: true, imageUrl: true, author: true, featured: true, showOnHomepage: true, createdAt: true }
        }),
        prisma.event.findMany({
          where: { showOnHomepage: true },
          orderBy: { createdAt: 'desc' },
          take: 6,
          select: { id: true, title: true, date: true, time: true, location: true, description: true, imageUrl: true, showOnHomepage: true, createdAt: true }
        }),
        prisma.galleryPhoto.findMany({
          where: { showOnHomepage: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: { id: true, title: true, category: true, imageUrl: true, date: true, showOnHomepage: true, createdAt: true }
        }),
        prisma.publicService.findMany({
          where: { showOnHomepage: true },
          orderBy: { createdAt: 'desc' },
          take: 8,
          select: { id: true, title: true, description: true, category: true, downloadUrl: true, fileSize: true, showOnHomepage: true, createdAt: true }
        }),
        prisma.welcomeMessage.findUnique({
          where: { id: 'default' }
        }),
        prisma.heroSlide.findMany({
          orderBy: { createdAt: 'asc' }
        }),
        prisma.priorityProgram.findMany({
          orderBy: { createdAt: 'asc' }
        })
      ]);

      data = {
        news: newsDb.map(item => ({ ...item, createdAt: item.createdAt.toISOString() })),
        events: eventsDb.map(item => ({ ...item, createdAt: item.createdAt.toISOString() })),
        gallery: galleryDb.map(item => ({ ...item, createdAt: item.createdAt.toISOString() })),
        services: servicesDb.map(item => ({ ...item, createdAt: item.createdAt.toISOString() })),
        welcomeMessage: welcomeMessageDb ? {
          name: welcomeMessageDb.name,
          nip: welcomeMessageDb.nip,
          content: welcomeMessageDb.content,
          imageUrl: welcomeMessageDb.imageUrl
        } : null,
        heroSlides: heroSlidesDb.map(item => ({ ...item, createdAt: item.createdAt.toISOString() })),
        priorityPrograms: priorityProgramsDb.map(item => ({ ...item, createdAt: item.createdAt.toISOString(), points: item.points as any }))
      };
    } catch (error) {
      console.warn("Database connection failed, falling back to local json storage:", error);
      data = getFallbackData();
    }
  } else {
    data = getFallbackData();
  }

  return (
    <HomePageClient
      initialNews={data.news}
      initialEvents={data.events}
      initialGallery={data.gallery}
      initialServices={data.services}
      initialHeroSlides={data.heroSlides}
      initialHomepageSettings={homepageSettings || undefined}
      initialPriorityPrograms={data.priorityPrograms}
    />
  );
}
