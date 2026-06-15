import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  NEWS,
  EVENTS,
  GALLERY_PHOTOS,
  PUBLIC_SERVICES,
  OFFICE_INFO,
  WELCOME_MESSAGE,
  HERO_SLIDES,
  INITIAL_HOMEPAGE_SETTINGS
} from '@/lib/data';
export const dynamic = 'force-dynamic';

const dbPath = path.join(process.cwd(), 'lib', 'db.json');

// Helper to read data from db.json
function getDbData() {
  try {
    if (!fs.existsSync(dbPath)) {
      const initialData = {
        news: NEWS,
        events: EVENTS,
        gallery: GALLERY_PHOTOS,
        services: PUBLIC_SERVICES,
        officeInfo: OFFICE_INFO,
        welcomeMessage: WELCOME_MESSAGE,
        heroSlides: HERO_SLIDES,
        categories: {
          news: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Pengumuman', 'Event'],
          gallery: ['Pariwisata', 'Olahraga', 'Kepemudaan'],
          events: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Dinas'],
          services: ['SOP', 'Formulir', 'Berkas Layanan', 'Izin Usaha']
        },
        homepageSettings: INITIAL_HOMEPAGE_SETTINGS
      };
      // Ensure the directory exists
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    const parsed = JSON.parse(fileContent);
    // Ensure categories key exists on read
    if (!parsed.categories) {
      parsed.categories = {
        news: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Pengumuman', 'Event'],
        gallery: ['Pariwisata', 'Olahraga', 'Kepemudaan'],
        events: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Dinas'],
        services: ['SOP', 'Formulir', 'Berkas Layanan', 'Izin Usaha']
      };
      saveDbData(parsed);
    }
    // Ensure welcomeMessage key exists on read
    if (!parsed.welcomeMessage) {
      parsed.welcomeMessage = WELCOME_MESSAGE;
      saveDbData(parsed);
    }
    // Ensure heroSlides key exists on read
    if (!parsed.heroSlides) {
      parsed.heroSlides = HERO_SLIDES;
      saveDbData(parsed);
    }
    // Ensure homepageSettings key exists on read
    if (!parsed.homepageSettings) {
      parsed.homepageSettings = INITIAL_HOMEPAGE_SETTINGS;
      saveDbData(parsed);
    } else {
      let needsSave = false;
      if (!parsed.homepageSettings.about) {
        parsed.homepageSettings.about = { ...INITIAL_HOMEPAGE_SETTINGS.about };
        needsSave = true;
      } else if (!parsed.homepageSettings.about.stats) {
        parsed.homepageSettings.about.stats = INITIAL_HOMEPAGE_SETTINGS.about.stats;
        needsSave = true;
      }
      
      if (!parsed.homepageSettings.programs) {
        parsed.homepageSettings.programs = { ...INITIAL_HOMEPAGE_SETTINGS.programs };
        needsSave = true;
      } else if (!parsed.homepageSettings.programs.cards) {
        parsed.homepageSettings.programs.cards = INITIAL_HOMEPAGE_SETTINGS.programs.cards;
        needsSave = true;
      }

      if (needsSave) {
        saveDbData(parsed);
      }
    }
    return parsed;
  } catch (error) {
    console.error('Failed to read database file, using fallback initial data', error);
    return {
      news: NEWS,
      events: EVENTS,
      gallery: GALLERY_PHOTOS,
      services: PUBLIC_SERVICES,
      officeInfo: OFFICE_INFO,
      welcomeMessage: WELCOME_MESSAGE,
      heroSlides: HERO_SLIDES,
      categories: {
        news: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Pengumuman', 'Event'],
        gallery: ['Pariwisata', 'Olahraga', 'Kepemudaan'],
        events: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Dinas'],
        services: ['SOP', 'Formulir', 'Berkas Layanan', 'Izin Usaha']
      }
    };
  }
}

// Helper to write data to db.json
function saveDbData(data: any) {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write database file', error);
    throw error;
  }
}

export async function GET() {
  try {
    const data = getDbData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    const currentData = getDbData();
    
    if (type === 'news') {
      currentData.news = data;
    } else if (type === 'events') {
      currentData.events = data;
    } else if (type === 'gallery') {
      currentData.gallery = data;
    } else if (type === 'services') {
      currentData.services = data;
    } else if (type === 'officeInfo') {
      currentData.officeInfo = data;
    } else if (type === 'categories') {
      currentData.categories = data;
    } else if (type === 'welcomeMessage') {
      currentData.welcomeMessage = data;
    } else if (type === 'heroSlides') {
      currentData.heroSlides = data;
    } else if (type === 'homepageSettings') {
      currentData.homepageSettings = data;
    } else {
      return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
    
    saveDbData(currentData);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
  }
}
