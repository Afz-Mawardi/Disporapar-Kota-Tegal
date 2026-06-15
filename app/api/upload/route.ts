import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { fileBase64, fileName, menu } = await request.json();

    if (!fileBase64) {
      return NextResponse.json({ error: 'Data berkas tidak ditemukan.' }, { status: 400 });
    }

    // Extract mime type and base64 payload
    const matches = fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Format berkas base64 tidak valid.' }, { status: 400 });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const dataBuffer = Buffer.from(base64Data, 'base64');

    // Clean up menu folder name
    let folderName = (menu || 'uploads').toLowerCase().trim();
    // Map activeTab labels to clean folder names
    const allowedFolders = ['berita', 'galeri', 'sambutan', 'berkas', 'beranda', 'agenda'];
    if (!allowedFolders.includes(folderName)) {
      folderName = 'uploads';
    }

    // Target upload directory
    const uploadDir = path.join(process.cwd(), 'public', folderName);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Determine extension based on fileName or mimeType
    let extension = '';
    if (fileName && fileName.includes('.')) {
      extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    } else {
      const mimeToExt: Record<string, string> = {
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
      extension = mimeToExt[mimeType] || '.bin';
    }

    // Clean file name
    const originalBaseName = fileName
      ? fileName.substring(0, fileName.lastIndexOf('.'))
      : 'upload';
    const sanitizedBaseName = originalBaseName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Generate unique file name
    const finalFileName = `${Date.now()}_${sanitizedBaseName}${extension}`;
    const filePath = path.join(uploadDir, finalFileName);

    // Write file to disk
    fs.writeFileSync(filePath, dataBuffer);

    // Relative public URL
    const fileUrl = `/${folderName}/${finalFileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: finalFileName
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'Gagal mengunggah berkas.' }, { status: 500 });
  }
}
