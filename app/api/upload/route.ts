import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export const revalidate = 20;

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/webp': '.webp',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'application/pdf': '.pdf',
  'application/zip': '.zip',
  'application/x-zip-compressed': '.zip',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')) || 'Unknown IP';

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Format JSON tidak valid.' }, { status: 400 });
    }

    const { fileBase64, fileName, menu } = body;
    const menuClean = (menu || 'uploads').toLowerCase().trim();
    const isPublicUpload = menuClean === 'pengaduan';

    let user = 'Public Guest';
    if (!isPublicUpload) {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized. Akses ditolak.' }, { status: 401 });
      }
      user = (session.user as any).username || 'Unknown Admin';
    }

    if (!fileBase64) {
      return NextResponse.json({ error: 'Data berkas tidak ditemukan.' }, { status: 400 });
    }

    // Extract mime type and base64 payload
    const matches = fileBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Format berkas base64 tidak valid.' }, { status: 400 });
    }

    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2];

    // Validate MIME Type
    if (!ALLOWED_MIME_TYPES[mimeType]) {
      await logAudit({ user, ip, endpoint: '/api/upload', action: 'Upload', status: 'Gagal', details: { reason: 'Tipe MIME tidak diizinkan', mimeType } });
      return NextResponse.json({ error: 'Tipe file tidak diizinkan. Dilarang mengunggah file berbahaya.' }, { status: 400 });
    }

    const dataBuffer = Buffer.from(base64Data, 'base64');

    // Validate File Size
    if (dataBuffer.length > MAX_FILE_SIZE) {
      await logAudit({ user, ip, endpoint: '/api/upload', action: 'Upload', status: 'Gagal', details: { reason: 'Ukuran file melebihi 5MB', size: dataBuffer.length } });
      return NextResponse.json({ error: 'Ukuran file melebihi batas maksimal (5MB).' }, { status: 400 });
    }

    // Map menu labels to designated paths under public/uploads/
    let subFolder = 'uploads';
    if (menuClean === 'berita') {
      subFolder = 'uploads/berita';
    } else if (menuClean === 'galeri') {
      subFolder = 'uploads/galeri';
    } else if (menuClean === 'agenda') {
      subFolder = 'uploads/agenda';
    } else if (menuClean === 'berkas') {
      subFolder = 'uploads/dokumen';
    } else if (menuClean === 'pengaduan') {
      subFolder = 'uploads/pengaduan';
    } else if (menuClean === 'sambutan' || menuClean === 'beranda') {
      subFolder = 'uploads/berandaprofil';
    }

    // Target upload directory
    const uploadDir = path.join(process.cwd(), 'public', subFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate secure random file name (Ignoring user's extension entirely to prevent path traversal & execution)
    const secureExtension = ALLOWED_MIME_TYPES[mimeType];
    const finalFileName = `${Date.now()}_${crypto.randomUUID()}${secureExtension}`;
    const filePath = path.join(uploadDir, finalFileName);

    // Write file to disk
    fs.writeFileSync(filePath, dataBuffer);

    // Relative public URL
    const fileUrl = `/${subFolder}/${finalFileName}`;

    await logAudit({ user, ip, endpoint: '/api/upload', action: 'Upload', status: 'Berhasil', details: { fileUrl, size: dataBuffer.length } });

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: finalFileName
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Gagal mengunggah berkas. Internal Server Error.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Akses ditolak.' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Format JSON tidak valid.' }, { status: 400 });
    }

    const { fileUrl } = body;
    if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('/uploads/')) {
      return NextResponse.json({ success: true }); // Ignore external URLs or invalid paths silently
    }

    // Securely construct the file path
    const uploadDir = path.join(process.cwd(), 'public');
    const filePath = path.join(uploadDir, fileUrl.replace(/\//g, path.sep));

    // Ensure the file path is within public/uploads/ to prevent path traversal
    if (!filePath.startsWith(path.join(uploadDir, 'uploads'))) {
      return NextResponse.json({ error: 'Invalid file path.' }, { status: 400 });
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      const ip = (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')) || 'Unknown IP';
      const user = (session.user as any).username || 'Unknown Admin';
      await logAudit({ user, ip, endpoint: '/api/upload', action: 'Delete', status: 'Berhasil', details: { fileUrl } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('File delete error:', error);
    return NextResponse.json({ error: 'Gagal menghapus berkas. Internal Server Error.' }, { status: 500 });
  }
}
