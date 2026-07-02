import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('Failed to get admin logs:', error);
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

    // Log the logs deletion action itself (meta log)
    const currentUsername = session.user?.name || 'Super Admin';
    await prisma.adminLog.create({
      data: {
        action: `Super Admin "${currentUsername}" menghapus ${result.count} data riwayat aktivitas admin.`
      }
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error: any) {
    console.error('Failed to delete logs:', error);
    return NextResponse.json({ error: 'Gagal menghapus riwayat aktivitas.' }, { status: 500 });
  }
}
