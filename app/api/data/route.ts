import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  NEWS,
  EVENTS,
  GALLERY_PHOTOS,
  PUBLIC_SERVICES,
  OFFICE_INFO
} from '@/lib/data';

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
        officeInfo: OFFICE_INFO
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
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to read database file, using fallback initial data', error);
    return {
      news: NEWS,
      events: EVENTS,
      gallery: GALLERY_PHOTOS,
      services: PUBLIC_SERVICES,
      officeInfo: OFFICE_INFO
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
    } else {
      return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
    
    saveDbData(currentData);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
  }
}
