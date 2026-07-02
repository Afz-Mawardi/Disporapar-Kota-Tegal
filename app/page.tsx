import { prisma } from '@/lib/prisma';
import HomePageClient from './page.client';
import dbData from '@/lib/db.json';

export const dynamic = 'force-dynamic';

export default async function Page() {
  // 1. Fetch News
  const newsDb = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const news = newsDb.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString()
  }));

  // 2. Fetch Events
  const eventsDb = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const events = eventsDb.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString()
  }));

  // 3. Fetch Gallery Photos
  const galleryDb = await prisma.galleryPhoto.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const gallery = galleryDb.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString()
  }));

  // 4. Fetch Public Services
  const servicesDb = await prisma.publicService.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const services = servicesDb.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString()
  }));



  // 6. Fetch Welcome Message
  const welcomeMessageDb = await prisma.welcomeMessage.findUnique({
    where: { id: 'default' }
  });
  const welcomeMessage = welcomeMessageDb ? {
    name: welcomeMessageDb.name,
    nip: welcomeMessageDb.nip,
    content: welcomeMessageDb.content,
    imageUrl: welcomeMessageDb.imageUrl
  } : null;

  // 7. Fetch Hero Slides
  const heroSlidesDb = await prisma.heroSlide.findMany({
    orderBy: { createdAt: 'asc' }
  });
  const heroSlides = heroSlidesDb.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString()
  }));

  // 8. Load Homepage Settings directly from db.json since it has no admin CRUD
  const homepageSettings = dbData.homepageSettings || null;

  // 9. Fetch Priority Programs
  const priorityProgramsDb = await prisma.priorityProgram.findMany({
    orderBy: { createdAt: 'asc' }
  });
  const priorityPrograms = priorityProgramsDb.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    points: item.points as any
  }));

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
