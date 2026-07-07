import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';
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

// GET: Get all admins (restricted to SUPER_ADMIN)
export async function GET() {
  try {
    const { authorized } = await checkSuperAdmin();
    if (!authorized) {
      return NextResponse.json({ error: 'Akses ditolak. Anda bukan Super Admin.' }, { status: 403 });
    }

    const admins = await (prisma.user as any).findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true
      }
    });

    // Auto-update JSON file on successful database read
    try {
      const allUsers = await prisma.user.findMany();
      saveToLocalDbJson('users', allUsers);
    } catch (e) {
      console.error('Failed to sync users list on GET:', e);
    }

    return NextResponse.json({ success: true, admins });
  } catch (error: any) {
    console.error('Failed to get admins, trying fallback to db.json:', error);
    try {
      const dbPath = path.join(process.cwd(), 'lib', 'db.json');
      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, 'utf-8');
        const dbData = JSON.parse(fileContent);
        if (dbData.users) {
          const admins = dbData.users.map((u: any) => ({
            id: u.id,
            username: u.username,
            role: u.role || 'ADMIN',
            createdAt: u.createdAt
          }));
          return NextResponse.json({ success: true, admins });
        }
      }
    } catch (e) {
      console.error('Failed to read fallback users:', e);
    }
    return NextResponse.json({ error: 'Gagal memuat data administrator.' }, { status: 500 });
  }
}

// POST: Add new admin (restricted to SUPER_ADMIN)
export async function POST(request: Request) {
  try {
    const { authorized, session } = await checkSuperAdmin();
    if (!authorized || !session) {
      return NextResponse.json({ error: 'Akses ditolak. Anda bukan Super Admin.' }, { status: 403 });
    }

    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !username.trim()) {
      return NextResponse.json({ error: 'Username wajib diisi.' }, { status: 400 });
    }
    if (!password || password.trim().length < 6) {
      return NextResponse.json({ error: 'Password wajib diisi dan minimal 6 karakter.' }, { status: 400 });
    }
    if (!role || (role !== 'SUPER_ADMIN' && role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Role tidak valid.' }, { status: 400 });
    }

    // Check if username already exists
    const existing = await prisma.user.findUnique({
      where: { username: username.trim() }
    });
    if (existing) {
      return NextResponse.json({ error: 'Username sudah terdaftar.' }, { status: 400 });
    }

    const md5Password = crypto.createHash('md5').update(password.trim()).digest('hex');

    const newAdmin = await prisma.user.create({
      data: {
        username: username.trim(),
        password: md5Password,
        role
      }
    });

    // Log this action
    const currentUsername = session.user?.name || 'Super Admin';
    await prisma.adminLog.create({
      data: {
        action: `Super Admin "${currentUsername}" menambahkan admin baru "${username.trim()}" dengan peran ${role}.`
      }
    });

    // Sync users and logs to db.json
    try {
      const allUsers = await prisma.user.findMany();
      saveToLocalDbJson('users', allUsers);
      const logs = await prisma.adminLog.findMany({ orderBy: { createdAt: 'desc' } });
      saveToLocalDbJson('adminLogs', logs);
    } catch (e) {
      console.error('Failed to sync users/logs to db.json after POST:', e);
    }

    return NextResponse.json({ success: true, admin: { id: newAdmin.id, username: newAdmin.username, role: newAdmin.role, createdAt: (newAdmin as any).createdAt } });
  } catch (error: any) {
    console.error('Failed to create admin:', error);
    return NextResponse.json({ error: 'Gagal menambahkan admin baru.' }, { status: 500 });
  }
}

// PATCH: Edit existing admin (restricted to SUPER_ADMIN)
export async function PATCH(request: Request) {
  try {
    const { authorized, session } = await checkSuperAdmin();
    if (!authorized || !session) {
      return NextResponse.json({ error: 'Akses ditolak. Anda bukan Super Admin.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, username, password, role } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID admin tidak valid.' }, { status: 400 });
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingAdmin) {
      return NextResponse.json({ error: 'Admin tidak ditemukan.' }, { status: 404 });
    }

    const updateData: any = {};
    const logChanges: string[] = [];

    if (username && username.trim() !== existingAdmin.username) {
      const duplicate = await prisma.user.findUnique({
        where: { username: username.trim() }
      });
      if (duplicate) {
        return NextResponse.json({ error: 'Username sudah digunakan.' }, { status: 400 });
      }
      updateData.username = username.trim();
      logChanges.push(`username diubah dari "${existingAdmin.username}" menjadi "${username.trim()}"`);
    }

    if (password && password.trim()) {
      if (password.trim().length < 6) {
        return NextResponse.json({ error: 'Password baru minimal 6 karakter.' }, { status: 400 });
      }
      const md5Password = crypto.createHash('md5').update(password.trim()).digest('hex');
      updateData.password = md5Password;
      logChanges.push('password diperbarui');
    }

    if (role && role !== existingAdmin.role) {
      if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
        return NextResponse.json({ error: 'Peran tidak valid.' }, { status: 400 });
      }
      updateData.role = role;
      logChanges.push(`peran diubah dari ${existingAdmin.role} menjadi ${role}`);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true, message: 'Tidak ada perubahan.' });
    }

    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: updateData
    });

    // Log this action
    const currentUsername = session.user?.name || 'Super Admin';
    await prisma.adminLog.create({
      data: {
        action: `Super Admin "${currentUsername}" mengubah admin "${existingAdmin.username}" (${logChanges.join(', ')}).`
      }
    });

    // Sync users and logs to db.json
    try {
      const allUsers = await prisma.user.findMany();
      saveToLocalDbJson('users', allUsers);
      const logs = await prisma.adminLog.findMany({ orderBy: { createdAt: 'desc' } });
      saveToLocalDbJson('adminLogs', logs);
    } catch (e) {
      console.error('Failed to sync users/logs to db.json after PATCH:', e);
    }

    return NextResponse.json({
      success: true,
      admin: { id: updatedAdmin.id, username: updatedAdmin.username, role: updatedAdmin.role }
    });
  } catch (error: any) {
    console.error('Failed to update admin:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data admin.' }, { status: 500 });
  }
}

// DELETE: Delete admin (restricted to SUPER_ADMIN)
export async function DELETE(request: Request) {
  try {
    const { authorized, session } = await checkSuperAdmin();
    if (!authorized || !session) {
      return NextResponse.json({ error: 'Akses ditolak. Anda bukan Super Admin.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID admin tidak valid.' }, { status: 400 });
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingAdmin) {
      return NextResponse.json({ error: 'Admin tidak ditemukan.' }, { status: 404 });
    }

    // Safety checks: Prevent deleting oneself
    const currentUsername = session.user?.name;
    if (existingAdmin.username === currentUsername) {
      return NextResponse.json({ error: 'Anda tidak dapat menghapus akun Anda sendiri.' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    // Log this action
    await prisma.adminLog.create({
      data: {
        action: `Super Admin "${currentUsername}" menghapus admin "${existingAdmin.username}" dengan peran ${existingAdmin.role}.`
      }
    });

    // Sync users and logs to db.json
    try {
      const allUsers = await prisma.user.findMany();
      saveToLocalDbJson('users', allUsers);
      const logs = await prisma.adminLog.findMany({ orderBy: { createdAt: 'desc' } });
      saveToLocalDbJson('adminLogs', logs);
    } catch (e) {
      console.error('Failed to sync users/logs to db.json after DELETE:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete admin:', error);
    return NextResponse.json({ error: 'Gagal menghapus admin.' }, { status: 500 });
  }
}
