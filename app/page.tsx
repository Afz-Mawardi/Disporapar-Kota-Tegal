import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import HomePageClient from './page.client';
import dbData from '@/lib/db.json';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let news: any[] = [];
  let events: any[] = [];
  let gallery: any[] = [];
  let services: any[] = [];
  let welcomeMessage: any = null;
  let heroSlides: any[] = [];
  let priorityPrograms: any[] = [];
  const homepageSettings = dbData.homepageSettings || null;

  if (await checkDatabaseConnection()) {
    try {
      // 1. Fetch News
      const newsDb = await prisma.news.findMany({
        orderBy: { createdAt: 'desc' }
      });
      news = newsDb.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString()
      }));

      // 2. Fetch Events
      const eventsDb = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' }
      });
      events = eventsDb.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString()
      }));

      // 3. Fetch Gallery Photos
      const galleryDb = await prisma.galleryPhoto.findMany({
        orderBy: { createdAt: 'desc' }
      });
      gallery = galleryDb.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString()
      }));

      // 4. Fetch Public Services
      const servicesDb = await prisma.publicService.findMany({
        orderBy: { createdAt: 'desc' }
      });
      services = servicesDb.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString()
      }));

      // 6. Fetch Welcome Message
      const welcomeMessageDb = await prisma.welcomeMessage.findUnique({
        where: { id: 'default' }
      });
      welcomeMessage = welcomeMessageDb ? {
        name: welcomeMessageDb.name,
        nip: welcomeMessageDb.nip,
        content: welcomeMessageDb.content,
        imageUrl: welcomeMessageDb.imageUrl
      } : null;

      // 7. Fetch Hero Slides
      const heroSlidesDb = await prisma.heroSlide.findMany({
        orderBy: { createdAt: 'asc' }
      });
      heroSlides = heroSlidesDb.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString()
      }));

      // 9. Fetch Priority Programs
      const priorityProgramsDb = await prisma.priorityProgram.findMany({
        orderBy: { createdAt: 'asc' }
      });
      priorityPrograms = priorityProgramsDb.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        points: item.points as any
      }));
    } catch (error) {
      console.warn("Database connection failed, falling back to local json storage:", error);
      
      // Fallback values from dbData (db.json)
      news = (dbData.news || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));

      events = (dbData.events || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));

      gallery = (dbData.gallery || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));

      services = (dbData.services || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));

      welcomeMessage = dbData.welcomeMessage || null;

      heroSlides = (dbData.heroSlides || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString()
      }));

      priorityPrograms = (dbData.priorityPrograms || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
        points: item.points || []
      }));
    }
  } else {
    // Fallback values from dbData (db.json)
    news = (dbData.news || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));

    events = (dbData.events || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));

    gallery = (dbData.gallery || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));

    services = (dbData.services || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));

    welcomeMessage = dbData.welcomeMessage || null;

    heroSlides = (dbData.heroSlides || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));

    priorityPrograms = (dbData.priorityPrograms || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      points: item.points || []
    }));
  }

  return (
    <HomePageClient
      initialNews={news}
      initialEvents={events}
      initialGallery={gallery}
      initialServices={services}
      initialHeroSlides={heroSlides}
      initialHomepageSettings={homepageSettings || undefined}
      initialPriorityPrograms={priorityPrograms}
    />
  );
}
