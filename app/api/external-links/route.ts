import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_LINKS = [
  { id: 'laporgub', title: 'LaporGub!', url: 'https://laporgub.jatengprov.go.id/' },
  { id: 'lapor', title: 'SP4N-LAPOR!', url: 'https://lapor.go.id/' },
  { id: 'ppid', title: 'PPID', url: 'https://ppid.tegalkota.go.id/' }
];

// GET: Retrieve all dynamic external links
export async function GET() {
  try {
    let links = await prisma.externalLink.findMany();
    
    // Seed default links if the table is empty
    if (links.length === 0) {
      await prisma.$transaction(
        DEFAULT_LINKS.map(link =>
          prisma.externalLink.upsert({
            where: { id: link.id },
            update: {},
            create: link
          })
        )
      );
      links = await prisma.externalLink.findMany();
    }
    
    return NextResponse.json(links);
  } catch (error: any) {
    console.error('Failed to get external links, returning defaults:', error);
    return NextResponse.json(DEFAULT_LINKS);
  }
}

// POST: Save updated dynamic external links
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { links } = body; // Array of { id, title, url }

    if (!links || !Array.isArray(links)) {
      return NextResponse.json({ error: 'Data link tidak valid.' }, { status: 400 });
    }

    // Perform upsert for each link to update title and url
    await prisma.$transaction(
      links.map(link => {
        if (!link.id || !link.title || !link.url) {
          throw new Error('Setiap link wajib memiliki id, judul, dan url.');
        }
        return prisma.externalLink.upsert({
          where: { id: link.id },
          update: {
            title: link.title.trim(),
            url: link.url.trim()
          },
          create: {
            id: link.id,
            title: link.title.trim(),
            url: link.url.trim()
          }
        });
      })
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to save external links:', error);
    return NextResponse.json({ error: error.message || 'Gagal menyimpan perubahan link eksternal.' }, { status: 550 });
  }
}
