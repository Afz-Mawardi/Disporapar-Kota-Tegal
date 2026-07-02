import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

import dbData from '@/lib/db.json';
import { OfficeInfo, WelcomeMessage, HomepageSettings } from '@/lib/types';

const OFFICE_INFO = dbData.officeInfo as unknown as OfficeInfo;
const WELCOME_MESSAGE = dbData.welcomeMessage as unknown as WelcomeMessage;
const INITIAL_HOMEPAGE_SETTINGS = dbData.homepageSettings as unknown as HomepageSettings;

export const dynamic = 'force-dynamic';

// Helper function to delete local files in public/uploads/
function deleteLocalFile(fileUrl: string) {
  if (!fileUrl || typeof fileUrl !== 'string') return;
  if (fileUrl.startsWith('/uploads/')) {
    const absolutePath = path.join(process.cwd(), 'public', fileUrl);
    try {
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`Successfully deleted unused file: ${absolutePath}`);
      }
    } catch (error) {
      console.error(`Error deleting unused file: ${absolutePath}`, error);
    }
  }
}

// Helper function to update and save changes to lib/db.json
function saveToLocalDbJson(key: string, data: any) {
  const dbPath = path.join(process.cwd(), 'lib', 'db.json');
  try {
    let dbData: any = {};
    if (fs.existsSync(dbPath)) {
      const fileContent = fs.readFileSync(dbPath, 'utf-8');
      dbData = JSON.parse(fileContent);
    }
    dbData[key] = data;
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    console.log(`Successfully synced key "${key}" to local db.json`);
  } catch (error) {
    console.error(`Failed to sync key "${key}" to local db.json`, error);
  }
}

// GET: Fetch all website contents from MySQL
export async function GET() {
  try {
    // 1. Fetch News (No fallback to mock data so deleting all items works)
    const newsDb = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const news = newsDb;

    // 2. Fetch Events (No fallback to mock data)
    const eventsDb = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const events = eventsDb;

    // 3. Fetch Gallery Photos (No fallback to mock data)
    const galleryDb = await prisma.galleryPhoto.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const gallery = galleryDb;

    // 4. Fetch Public Services (No fallback to mock data)
    const servicesDb = await prisma.publicService.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const services = servicesDb;

    // 5. Fetch Office Info
    const officeInfoDb = await prisma.officeInfo.findUnique({
      where: { id: 'default' }
    });

    let socialMediaList: any[] = [];
    if (officeInfoDb && officeInfoDb.instagramResmi && officeInfoDb.instagramResmi.startsWith('[')) {
      try {
        socialMediaList = JSON.parse(officeInfoDb.instagramResmi);
      } catch (e) {
        console.error('Failed to parse socialMediaList JSON', e);
      }
    }

    if (socialMediaList.length === 0) {
      const defaultList = OFFICE_INFO.socialMediaList || [];
      socialMediaList = defaultList.map(item => {
        let url = item.url;
        if (officeInfoDb) {
          if ((item.label === 'Dinas' || item.label === 'Resmi') && officeInfoDb.instagramResmi && !officeInfoDb.instagramResmi.startsWith('[')) {
            url = officeInfoDb.instagramResmi;
          } else if (item.label === 'Pemuda' && officeInfoDb.instagramPemuda) {
            url = officeInfoDb.instagramPemuda;
          } else if (item.label === 'Wisata' && officeInfoDb.instagramTourism) {
            url = officeInfoDb.instagramTourism;
          } else if (item.label === 'YouTube' && officeInfoDb.youtube) {
            url = officeInfoDb.youtube;
          }
        }
        return { ...item, url };
      });
      socialMediaList = socialMediaList.filter(item => item.url !== '');
    }

    const officeInfo = officeInfoDb ? {
      address: officeInfoDb.address,
      phone: officeInfoDb.phone,
      email: officeInfoDb.email,
      operationalHours: officeInfoDb.operationalHours,
      socialMedia: {
        instagramResmi: (officeInfoDb.instagramResmi && !officeInfoDb.instagramResmi.startsWith('[')) ? officeInfoDb.instagramResmi : (socialMediaList.find(s => s.platform === 'instagram' && (s.label === 'Dinas' || s.label === 'Resmi'))?.url || ''),
        instagramTourism: officeInfoDb.instagramTourism,
        instagramPemuda: officeInfoDb.instagramPemuda,
        youtube: officeInfoDb.youtube
      },
      gmapsEmbedUrl: officeInfoDb.gmapsEmbedUrl,
      socialMediaList: socialMediaList
    } : OFFICE_INFO;

    // 6. Fetch Welcome Message
    const welcomeMessageDb = await prisma.welcomeMessage.findUnique({
      where: { id: 'default' }
    });
    const welcomeMessage = welcomeMessageDb ? {
      name: welcomeMessageDb.name,
      nip: welcomeMessageDb.nip,
      content: welcomeMessageDb.content,
      imageUrl: welcomeMessageDb.imageUrl
    } : WELCOME_MESSAGE;

    // 7. Fetch Hero Slides (No fallback to mock data)
    const heroSlidesDb = await prisma.heroSlide.findMany({
      orderBy: { createdAt: 'asc' }
    });
    const heroSlides = heroSlidesDb;

    // 8. Fetch Categories (Load directly from db.json since they have no admin CRUD)
    const categories = dbData.categories || {
      news: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Pengumuman', 'Event'],
      gallery: ['Pariwisata', 'Olahraga', 'Kepemudaan'],
      services: ['SOP', 'Formulir', 'Berkas Layanan'],
      retribusi: ['Olahraga', 'Pariwisata', 'Kepemudaan']
    };

    // 9. Fetch Homepage Settings (Load directly from db.json since they have no admin CRUD)
    const homepageSettings = dbData.homepageSettings || INITIAL_HOMEPAGE_SETTINGS;

    // 10. Fetch Priority Programs (No fallback to mock data)
    const priorityProgramsDb = await prisma.priorityProgram.findMany({
      orderBy: { createdAt: 'asc' }
    });
    const priorityPrograms = priorityProgramsDb;

    // 11. Fetch Admin Users (excluding password for security)
    const usersDb = await prisma.user.findMany({
      select: { id: true, username: true }
    });
    const users = usersDb.length > 0 ? usersDb : [
      { id: 'env-super-admin', username: process.env.DEFAULT_SUPER_ADMIN_USERNAME || 'superadmin' },
      { id: 'env-regular-admin', username: process.env.DEFAULT_REGULAR_ADMIN_USERNAME || 'admin' }
    ];

    // 12. Fetch Bidang Cards (Kepemudaan, Olahraga, Pariwisata)
    const kepemudaanCards = (await prisma.kepemudaanCard.findMany({
      orderBy: { createdAt: 'asc' }
    })).map((c: any) => ({
      ...c,
      facilities: c.facilities ? c.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : []
    }));

    const olahragaCards = (await prisma.olahragaCard.findMany({
      orderBy: { createdAt: 'asc' }
    })).map((c: any) => ({
      ...c,
      facilities: c.facilities ? c.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : []
    }));

    const pariwisataCards = (await prisma.pariwisataCard.findMany({
      orderBy: { createdAt: 'asc' }
    })).map((c: any) => ({
      ...c,
      capacity: c.operationalHours || '',
      facilities: c.facilities ? c.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : []
    }));

    const bidangBottomCards = await prisma.bidangBottomCard.findMany();

    const retribusi = await prisma.retribusi.findMany({
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      news,
      events,
      gallery,
      services,
      officeInfo,
      welcomeMessage,
      heroSlides,
      categories,
      homepageSettings,
      priorityPrograms,
      users,
      kepemudaanCards,
      olahragaCards,
      pariwisataCards,
      bidangBottomCards,
      retribusi
    });
  } catch (error) {
    console.error('Failed to read database, returning db.json instead:', error);

    // Format db.json contents as expected by GET response
    return NextResponse.json({
      news: dbData.news || [],
      events: dbData.events || [],
      gallery: dbData.gallery || [],
      services: dbData.services || [],
      officeInfo: dbData.officeInfo || OFFICE_INFO,
      welcomeMessage: dbData.welcomeMessage || WELCOME_MESSAGE,
      heroSlides: dbData.heroSlides || [],
      categories: dbData.categories || {
        news: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Pengumuman', 'Event'],
        gallery: ['Pariwisata', 'Olahraga', 'Kepemudaan'],
        services: ['SOP', 'Formulir', 'Berkas Layanan'],
        retribusi: ['Olahraga', 'Pariwisata', 'Kepemudaan']
      },
      homepageSettings: dbData.homepageSettings || INITIAL_HOMEPAGE_SETTINGS,
      priorityPrograms: dbData.priorityPrograms || [],
      users: [
        { id: 'env-super-admin', username: process.env.DEFAULT_SUPER_ADMIN_USERNAME || 'superadmin' },
        { id: 'env-regular-admin', username: process.env.DEFAULT_REGULAR_ADMIN_USERNAME || 'admin' }
      ],
      kepemudaanCards: (dbData.kepemudaanCards || []).map((c: any) => ({
        ...c,
        facilities: Array.isArray(c.facilities) ? c.facilities : (c.facilities ? c.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : [])
      })),
      olahragaCards: (dbData.olahragaCards || []).map((c: any) => ({
        ...c,
        facilities: Array.isArray(c.facilities) ? c.facilities : (c.facilities ? c.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : [])
      })),
      pariwisataCards: (dbData.pariwisataCards || []).map((c: any) => ({
        ...c,
        capacity: c.operationalHours || c.capacity || '',
        facilities: Array.isArray(c.facilities) ? c.facilities : (c.facilities ? c.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : [])
      })),
      bidangBottomCards: dbData.bidangBottomCards || [],
      retribusi: dbData.retribusi || [],
      isFallback: true
    });
  }
}



// POST: Sync frontend changes to MySQL and delete unused files
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'news') {
      const newsArray = data.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        excerpt: item.excerpt || '',
        content: item.content || '',
        category: item.category || '',
        date: item.date || '',
        imageUrl: item.imageUrl || '',
        author: item.author || '',
        featured: item.featured ?? false,
        showOnHomepage: item.showOnHomepage ?? true
      }));

      // Delete orphaned local files/images
      const existingNews = await prisma.news.findMany();
      const newImageUrls = new Set(newsArray.map((n: any) => n.imageUrl).filter(Boolean));
      for (const item of existingNews) {
        if (item.imageUrl && !newImageUrls.has(item.imageUrl)) {
          deleteLocalFile(item.imageUrl);
        }
      }

      await prisma.$transaction([
        prisma.news.deleteMany(),
        prisma.news.createMany({ data: newsArray })
      ]);
      saveToLocalDbJson('news', newsArray);
    } else if (type === 'events') {
      const eventsArray = data.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        date: item.date || '',
        time: item.time || '',
        location: item.location || '',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        showOnHomepage: item.showOnHomepage ?? true
      }));

      // Delete orphaned local files/images
      const existingEvents = await prisma.event.findMany();
      const newImageUrls = new Set(eventsArray.map((e: any) => e.imageUrl).filter(Boolean));
      for (const item of existingEvents) {
        if (item.imageUrl && !newImageUrls.has(item.imageUrl)) {
          deleteLocalFile(item.imageUrl);
        }
      }

      await prisma.$transaction([
        prisma.event.deleteMany(),
        prisma.event.createMany({ data: eventsArray })
      ]);
      saveToLocalDbJson('events', eventsArray);
    } else if (type === 'gallery') {
      const galleryArray = data.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        category: item.category || '',
        imageUrl: item.imageUrl || '',
        showOnHomepage: item.showOnHomepage ?? true
      }));

      // Delete orphaned local files/images
      const existingGallery = await prisma.galleryPhoto.findMany();
      const newImageUrls = new Set(galleryArray.map((g: any) => g.imageUrl).filter(Boolean));
      for (const item of existingGallery) {
        if (item.imageUrl && !newImageUrls.has(item.imageUrl)) {
          deleteLocalFile(item.imageUrl);
        }
      }

      await prisma.$transaction([
        prisma.galleryPhoto.deleteMany(),
        prisma.galleryPhoto.createMany({ data: galleryArray })
      ]);
      saveToLocalDbJson('gallery', galleryArray);
    } else if (type === 'services') {
      const servicesArray = data.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        category: item.category || '',
        downloadUrl: item.downloadUrl || '#',
        fileSize: item.fileSize || '0 KB',
        showOnHomepage: item.showOnHomepage ?? true
      }));

      // Delete orphaned local files/documents
      const existingServices = await prisma.publicService.findMany();
      const newDownloadUrls = new Set(servicesArray.map((s: any) => s.downloadUrl).filter(Boolean));
      for (const item of existingServices) {
        if (item.downloadUrl && !newDownloadUrls.has(item.downloadUrl)) {
          deleteLocalFile(item.downloadUrl);
        }
      }

      await prisma.$transaction([
        prisma.publicService.deleteMany(),
        prisma.publicService.createMany({ data: servicesArray })
      ]);
      saveToLocalDbJson('services', servicesArray);
    } else if (type === 'officeInfo') {
      const listStr = JSON.stringify(data.socialMediaList || []);
      await prisma.officeInfo.upsert({
        where: { id: 'default' },
        update: {
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          operationalHours: data.operationalHours || '',
          instagramResmi: listStr,
          instagramTourism: data.socialMedia?.instagramTourism || '',
          instagramPemuda: data.socialMedia?.instagramPemuda || '',
          youtube: data.socialMedia?.youtube || '',
          gmapsEmbedUrl: data.gmapsEmbedUrl || ''
        },
        create: {
          id: 'default',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          operationalHours: data.operationalHours || '',
          instagramResmi: listStr,
          instagramTourism: data.socialMedia?.instagramTourism || '',
          instagramPemuda: data.socialMedia?.instagramPemuda || '',
          youtube: data.socialMedia?.youtube || '',
          gmapsEmbedUrl: data.gmapsEmbedUrl || ''
        }
      });
      saveToLocalDbJson('officeInfo', data);
    } else if (type === 'categories') {
      saveToLocalDbJson('categories', data);
    } else if (type === 'welcomeMessage') {
      const existingWelcome = await prisma.welcomeMessage.findUnique({
        where: { id: 'default' }
      });
      const newImageUrl = data.imageUrl || '';
      if (existingWelcome && existingWelcome.imageUrl && existingWelcome.imageUrl !== newImageUrl) {
        deleteLocalFile(existingWelcome.imageUrl);
      }

      await prisma.welcomeMessage.upsert({
        where: { id: 'default' },
        update: {
          name: data.name || '',
          nip: data.nip || '',
          content: data.content || '',
          imageUrl: newImageUrl
        },
        create: {
          id: 'default',
          name: data.name || '',
          nip: data.nip || '',
          content: data.content || '',
          imageUrl: newImageUrl
        }
      });
      saveToLocalDbJson('welcomeMessage', data);
    } else if (type === 'heroSlides') {
      const slidesArray = data.map((item: any) => ({
        id: item.id,
        image: item.image || '',
        tagline: item.tagline || '',
        title: item.title || '',
        cta: item.cta || '',
        href: item.href || ''
      }));

      // Delete orphaned local files/images
      const existingSlides = await prisma.heroSlide.findMany();
      const newImageUrls = new Set(slidesArray.map((s: any) => s.image).filter(Boolean));
      for (const item of existingSlides) {
        if (item.image && !newImageUrls.has(item.image)) {
          deleteLocalFile(item.image);
        }
      }

      await prisma.$transaction([
        prisma.heroSlide.deleteMany(),
        prisma.heroSlide.createMany({ data: slidesArray })
      ]);
      saveToLocalDbJson('heroSlides', slidesArray);
    } else if (type === 'priorityPrograms') {
      const programsArray = data.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        points: item.points || []
      }));

      await prisma.$transaction([
        prisma.priorityProgram.deleteMany(),
        prisma.priorityProgram.createMany({ data: programsArray })
      ]);
      saveToLocalDbJson('priorityPrograms', programsArray);
    } else if (type === 'kepemudaanCards') {
      const now = new Date();
      const cardsArray = data.map((item: any, index: number) => ({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        location: item.location || '',
        capacity: item.capacity || '',
        price: item.price || '',
        facilities: Array.isArray(item.facilities) ? item.facilities.join(', ') : (item.facilities || ''),
        imageUrl: item.imageUrl || '',
        createdAt: new Date(now.getTime() + index * 1000)
      }));

      // Delete orphaned local files/images
      const existingCards = await prisma.kepemudaanCard.findMany();
      const newImageUrls = new Set(cardsArray.map((c: any) => c.imageUrl).filter(Boolean));
      for (const item of existingCards) {
        if (item.imageUrl && !newImageUrls.has(item.imageUrl)) {
          deleteLocalFile(item.imageUrl);
        }
      }

      await prisma.$transaction([
        prisma.kepemudaanCard.deleteMany(),
        prisma.kepemudaanCard.createMany({ data: cardsArray })
      ]);
      saveToLocalDbJson('kepemudaanCards', cardsArray);
    } else if (type === 'olahragaCards') {
      const now = new Date();
      const cardsArray = data.map((item: any, index: number) => ({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        location: item.location || '',
        capacity: item.capacity || '',
        price: item.price || '',
        facilities: Array.isArray(item.facilities) ? item.facilities.join(', ') : (item.facilities || ''),
        imageUrl: item.imageUrl || '',
        createdAt: new Date(now.getTime() + index * 1000)
      }));

      // Delete orphaned local files/images
      const existingCards = await prisma.olahragaCard.findMany();
      const newImageUrls = new Set(cardsArray.map((c: any) => c.imageUrl).filter(Boolean));
      for (const item of existingCards) {
        if (item.imageUrl && !newImageUrls.has(item.imageUrl)) {
          deleteLocalFile(item.imageUrl);
        }
      }

      await prisma.$transaction([
        prisma.olahragaCard.deleteMany(),
        prisma.olahragaCard.createMany({ data: cardsArray })
      ]);
      saveToLocalDbJson('olahragaCards', cardsArray);
    } else if (type === 'pariwisataCards') {
      const now = new Date();
      const cardsArray = data.map((item: any, index: number) => ({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        location: item.location || '',
        operationalHours: item.operationalHours || item.capacity || '',
        price: item.price || '',
        facilities: Array.isArray(item.facilities) ? item.facilities.join(', ') : (item.facilities || ''),
        imageUrl: item.imageUrl || '',
        createdAt: new Date(now.getTime() + index * 1000)
      }));

      // Delete orphaned local files/images
      const existingCards = await prisma.pariwisataCard.findMany();
      const newImageUrls = new Set(cardsArray.map((c: any) => c.imageUrl).filter(Boolean));
      for (const item of existingCards) {
        if (item.imageUrl && !newImageUrls.has(item.imageUrl)) {
          deleteLocalFile(item.imageUrl);
        }
      }

      await prisma.$transaction([
        prisma.pariwisataCard.deleteMany(),
        prisma.pariwisataCard.createMany({ data: cardsArray })
      ]);
      saveToLocalDbJson('pariwisataCards', cardsArray);
    } else if (type === 'bidangBottomCards') {
      const bottomCardsArray = data.map((item: any) => ({
        id: item.id,
        tag: item.tag || '',
        title: item.title || '',
        description: item.description || '',
        buttonText: item.buttonText || '',
        buttonLink: item.buttonLink || '',
        imageUrl: item.imageUrl || '',
        sectionTag: item.sectionTag || '',
        sectionTitle: item.sectionTitle || ''
      }));

      // Delete orphaned local files/images
      const existingCards = await prisma.bidangBottomCard.findMany();
      const newImageUrls = new Set(bottomCardsArray.map((c: any) => c.imageUrl).filter(Boolean));
      for (const item of existingCards) {
        if (item.imageUrl && !newImageUrls.has(item.imageUrl)) {
          deleteLocalFile(item.imageUrl);
        }
      }

      await prisma.$transaction([
        prisma.bidangBottomCard.deleteMany(),
        prisma.bidangBottomCard.createMany({ data: bottomCardsArray })
      ]);
      saveToLocalDbJson('bidangBottomCards', bottomCardsArray);
    } else if (type === 'homepageSettings') {
      saveToLocalDbJson('homepageSettings', data);
    } else if (type === 'retribusi') {
      const retribusiArray = data.map((item: any) => ({
        id: item.id,
        name: item.name || '',
        category: item.category || '',
        fee: item.fee || ''
      }));

      await prisma.$transaction([
        prisma.retribusi.deleteMany(),
        prisma.retribusi.createMany({ data: retribusiArray })
      ]);
      saveToLocalDbJson('retribusi', retribusiArray);
    }
    else if (type === 'adminAccount') {
      const { username: oldUsername, newUsername, newPassword } = data;
      const user = await prisma.user.findUnique({
        where: { username: oldUsername }
      });
      if (!user) {
        return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
      }

      const updateData: any = {};
      const changes: string[] = [];
      if (newUsername) {
        if (newUsername !== oldUsername) {
          const existing = await prisma.user.findUnique({
            where: { username: newUsername }
          });
          if (existing) {
            return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
          }
          changes.push(`username diubah menjadi "${newUsername}"`);
        }
        updateData.username = newUsername;
      }
      if (newPassword) {
        const crypto = require('crypto');
        const md5Password = crypto.createHash('md5').update(newPassword).digest('hex');
        updateData.password = md5Password;
        changes.push('password diperbarui');
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });

      // Log the action
      if (changes.length > 0) {
        await prisma.adminLog.create({
          data: {
            action: `Admin "${oldUsername}" memperbarui akunnya sendiri (${changes.join(', ')})`
          }
        });
      }
    } else {
      return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update database', error);
    return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
  }
}
