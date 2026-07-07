import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const revalidate = 20;

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

// Helper to check if the session is SUPER_ADMIN
async function checkSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
    return { authorized: false, session: null };
  }
  return { authorized: true, session };
}

// GET: Get all admin activity logs (newest to oldest)
export async function GET() {
  try {
    const { authorized } = await checkSuperAdmin();
    if (!authorized) {
      return NextResponse.json({ error: 'Akses ditolak. Anda bukan Super Admin.' }, { status: 403 });
    }

    const logs = await prisma.adminLog.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Auto-update JSON file on successful database read
    saveToLocalDbJson('adminLogs', logs);

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('Failed to get admin logs, trying fallback to db.json:', error);
    try {
      const dbPath = path.join(process.cwd(), 'lib', 'db.json');
      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, 'utf-8');
        const dbData = JSON.parse(fileContent);
        if (dbData.adminLogs) {
          return NextResponse.json({ success: true, logs: dbData.adminLogs });
        }
      }
    } catch (e) {
      console.error('Failed to read fallback adminLogs:', e);
    }
    return NextResponse.json({ error: 'Gagal memuat riwayat aktivitas.' }, { status: 500 });
  }
}

// DELETE: Bulk delete history logs
export async function DELETE(request: Request) {
  try {
    const { authorized, session } = await checkSuperAdmin();
    if (!authorized || !session) {
      return NextResponse.json({ error: 'Akses ditolak. Anda bukan Super Admin.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    let ids: string[] = [];

    if (id) {
      ids = id.split(',');
    } else {
      const body = await request.json().catch(() => ({}));
      if (body.ids && Array.isArray(body.ids)) {
        ids = body.ids;
      } else if (body.id) {
        ids = [body.id];
      }
    }

    if (ids.length === 0) {
      return NextResponse.json({ error: 'ID riwayat tidak valid.' }, { status: 400 });
    }

    const result = await prisma.adminLog.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    // Sync all remaining logs to db.json
    try {
      const remainingLogs = await prisma.adminLog.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      saveToLocalDbJson('adminLogs', remainingLogs);
    } catch (e) {
      console.error('Failed to sync admin logs to db.json after deletion:', e);
    }

    return NextResponse.json({ success: true, count: result.count });
  } catch (error: any) {
    console.error('Failed to delete logs:', error);
    return NextResponse.json({ error: 'Gagal menghapus riwayat aktivitas.' }, { status: 500 });
  }
}
