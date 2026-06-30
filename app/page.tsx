import { prisma } from '@/lib/prisma';
import HomePageClient from './page.client';

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

  // 5. Fetch Office Info
  const officeInfoDb = await prisma.officeInfo.findUnique({
    where: { id: 'default' }
  });

  let officeInfo = null;
  if (officeInfoDb) {
    let socialMediaList: any[] = [];
    if (officeInfoDb.instagramResmi && officeInfoDb.instagramResmi.startsWith('[')) {
      try {
        socialMediaList = JSON.parse(officeInfoDb.instagramResmi);
      } catch (e) {
        console.error('Failed to parse socialMediaList JSON', e);
      }
    }

    if (socialMediaList.length === 0) {
      socialMediaList = [
        { platform: 'instagram', label: 'Resmi', url: (officeInfoDb.instagramResmi && !officeInfoDb.instagramResmi.startsWith('[')) ? officeInfoDb.instagramResmi : '' },
        { platform: 'instagram', label: 'Wisata', url: officeInfoDb.instagramTourism || '' },
        { platform: 'instagram', label: 'Pemuda', url: officeInfoDb.instagramPemuda || '' },
        { platform: 'youtube', label: 'YouTube', url: officeInfoDb.youtube || '' }
      ].filter(item => item.url !== '');
    }

    officeInfo = {
      address: officeInfoDb.address,
      phone: officeInfoDb.phone,
      email: officeInfoDb.email,
      operationalHours: officeInfoDb.operationalHours,
      socialMedia: {
        instagramResmi: (officeInfoDb.instagramResmi && !officeInfoDb.instagramResmi.startsWith('[')) ? officeInfoDb.instagramResmi : (socialMediaList.find(s => s.platform === 'instagram' && s.label === 'Resmi')?.url || ''),
        instagramTourism: officeInfoDb.instagramTourism,
        instagramPemuda: officeInfoDb.instagramPemuda,
        youtube: officeInfoDb.youtube
      },
      gmapsEmbedUrl: officeInfoDb.gmapsEmbedUrl,
      socialMediaList: socialMediaList
    };
  }

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

  // 8. Fetch Homepage Settings
  const homepageSettingsDb = await prisma.homepageSetting.findUnique({
    where: { id: 'default' }
  });
  const homepageSettings = homepageSettingsDb ? homepageSettingsDb.data : null;

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
      initialOfficeInfo={officeInfo || undefined}
      initialHeroSlides={heroSlides}
      initialHomepageSettings={homepageSettings || undefined}
      initialPriorityPrograms={priorityPrograms}
    />
  );
}
