import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient() as PrismaClient & { [key: string]: any };

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing records in correct order to avoid foreign key issues
  await prisma.user.deleteMany();
  await prisma.news.deleteMany();
  await prisma.event.deleteMany();
  await prisma.galleryPhoto.deleteMany();
  await prisma.publicService.deleteMany();
  await prisma.officeInfo.deleteMany();
  await prisma.welcomeMessage.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.priorityProgram.deleteMany();
  await prisma.kepemudaanCard.deleteMany();
  await prisma.olahragaCard.deleteMany();
  await prisma.pariwisataCard.deleteMany();
  await prisma.bidangBottomCard.deleteMany();
  await prisma.retribusi.deleteMany();
  // 2. Hash admin password with MD5 and insert Users (read from process.env to avoid hardcoding in the codebase)
  const superUsername = process.env.DEFAULT_SUPER_ADMIN_USERNAME || 'superadmin';
  const superPassword = process.env.DEFAULT_SUPER_ADMIN_PASSWORD || 'superpassword123';
  const regularUsername = process.env.DEFAULT_REGULAR_ADMIN_USERNAME || 'admin';
  const regularPassword = process.env.DEFAULT_REGULAR_ADMIN_PASSWORD || 'adminpassword123';

  const md5SuperPassword = crypto.createHash('md5').update(superPassword).digest('hex');
  const md5RegularPassword = crypto.createHash('md5').update(regularPassword).digest('hex');

  await prisma.user.create({
    data: {
      username: superUsername,
      password: md5SuperPassword,
      role: 'SUPER_ADMIN'
    }
  });
  await prisma.user.create({
    data: {
      username: regularUsername,
      password: md5RegularPassword,
      role: 'ADMIN'
    }
  });
  console.log('Admin users seeded from environment variables.');

  // 3. Read db.json
  const dbPath = path.join(process.cwd(), 'lib', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.error('db.json not found, seeding only admin user.');
    return;
  }

  const fileContent = fs.readFileSync(dbPath, 'utf-8');
  const dbData = JSON.parse(fileContent);

  // 4. Seed News
  if (dbData.news && Array.isArray(dbData.news)) {
    for (const item of dbData.news) {
      await prisma.news.create({
        data: {
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
        }
      });
    }
    console.log(`Seeded ${dbData.news.length} news items.`);
  }

  // 5. Seed Events
  if (dbData.events && Array.isArray(dbData.events)) {
    for (const item of dbData.events) {
      await prisma.event.create({
        data: {
          id: item.id,
          title: item.title || '',
          date: item.date || '',
          time: item.time || '',
          location: item.location || '',
          description: item.description || '',
          imageUrl: item.imageUrl || '',
          showOnHomepage: item.showOnHomepage ?? true
        }
      });
    }
    console.log(`Seeded ${dbData.events.length} events.`);
  }

  // 6. Seed Gallery Photos
  if (dbData.gallery && Array.isArray(dbData.gallery)) {
    for (const item of dbData.gallery) {
      await prisma.galleryPhoto.create({
        data: {
          id: item.id,
          title: item.title || '',
          category: item.category || '',
          imageUrl: item.imageUrl || '',
          date: item.date || '',
          showOnHomepage: item.showOnHomepage ?? true
        }
      });
    }
    console.log(`Seeded ${dbData.gallery.length} gallery photos.`);
  }

  // 7. Seed Public Services (Berkas Layanan)
  if (dbData.services && Array.isArray(dbData.services)) {
    for (const item of dbData.services) {
      await prisma.publicService.create({
        data: {
          id: item.id,
          title: item.title || '',
          description: item.description || '',
          category: item.category || '',
          downloadUrl: item.downloadUrl || '#',
          fileSize: item.fileSize || '0 KB',
          showOnHomepage: item.showOnHomepage ?? true
        }
      });
    }
    console.log(`Seeded ${dbData.services.length} public services.`);
  }

  // 8. Seed Office Info
  if (dbData.officeInfo) {
    const info = dbData.officeInfo;
    const listStr = JSON.stringify(info.socialMediaList || []);
    await prisma.officeInfo.create({
      data: {
        id: 'default',
        address: info.address || '',
        phone: info.phone || '',
        email: info.email || '',
        operationalHours: info.operationalHours || '',
        instagramResmi: listStr,
        instagramTourism: info.socialMedia?.instagramTourism || '',
        instagramPemuda: info.socialMedia?.instagramPemuda || '',
        youtube: info.socialMedia?.youtube || '',
        gmapsEmbedUrl: info.gmapsEmbedUrl || ''
      }
    });
    console.log('Seeded office info.');
  }

  // 9. Seed Welcome Message
  if (dbData.welcomeMessage) {
    const wm = dbData.welcomeMessage;
    await prisma.welcomeMessage.create({
      data: {
        id: 'default',
        name: wm.name || '',
        nip: wm.nip || '',
        content: wm.content || '',
        imageUrl: wm.imageUrl || ''
      }
    });
    console.log('Seeded welcome message.');
  }

  // 10. Seed Hero Slides
  if (dbData.heroSlides && Array.isArray(dbData.heroSlides)) {
    for (const item of dbData.heroSlides) {
      await prisma.heroSlide.create({
        data: {
          id: item.id,
          image: item.image || '',
          tagline: item.tagline || '',
          title: item.title || '',
          cta: item.cta || '',
          href: item.href || ''
        }
      });
    }
    console.log(`Seeded ${dbData.heroSlides.length} hero slides.`);
  }



  // 13. Seed Priority Programs
  if (dbData.priorityPrograms && Array.isArray(dbData.priorityPrograms)) {
    for (const item of dbData.priorityPrograms) {
      await prisma.priorityProgram.create({
        data: {
          id: item.id,
          title: item.title || '',
          description: item.description || '',
          points: item.points || []
        }
      });
    }
    console.log(`Seeded ${dbData.priorityPrograms.length} priority programs.`);
  }

  // 14. Seed Kepemudaan Cards (Layanan Sewa Pemuda)
  if (dbData.kepemudaanCards && Array.isArray(dbData.kepemudaanCards)) {
    for (const item of dbData.kepemudaanCards) {
      await prisma.kepemudaanCard.create({
        data: {
          id: item.id,
          title: item.title || '',
          description: item.description || '',
          location: item.location || '',
          capacity: item.capacity || '',
          price: item.price || '',
          facilities: Array.isArray(item.facilities) ? item.facilities.join(', ') : (item.facilities || ''),
          imageUrl: item.imageUrl || ''
        }
      });
    }
    console.log(`Seeded ${dbData.kepemudaanCards.length} Kepemudaan cards.`);
  }

  // 15. Seed Olahraga Cards (Sewa Lapangan/GOR)
  if (dbData.olahragaCards && Array.isArray(dbData.olahragaCards)) {
    for (const item of dbData.olahragaCards) {
      await prisma.olahragaCard.create({
        data: {
          id: item.id,
          title: item.title || '',
          description: item.description || '',
          location: item.location || '',
          capacity: item.capacity || '',
          price: item.price || '',
          facilities: Array.isArray(item.facilities) ? item.facilities.join(', ') : (item.facilities || ''),
          imageUrl: item.imageUrl || ''
        }
      });
    }
    console.log(`Seeded ${dbData.olahragaCards.length} Olahraga cards.`);
  }

  // 16. Seed Pariwisata Cards (Destinasi Wisata)
  if (dbData.pariwisataCards && Array.isArray(dbData.pariwisataCards)) {
    for (const item of dbData.pariwisataCards) {
      await prisma.pariwisataCard.create({
        data: {
          id: item.id,
          title: item.title || '',
          description: item.description || '',
          location: item.location || '',
          operationalHours: item.operationalHours || item.capacity || '',
          price: item.price || '',
          facilities: Array.isArray(item.facilities) ? item.facilities.join(', ') : (item.facilities || ''),
          imageUrl: item.imageUrl || ''
        }
      });
    }
    console.log(`Seeded ${dbData.pariwisataCards.length} Pariwisata cards.`);
  }

  // 17. Seed Bidang Bottom Cards
  if (dbData.bidangBottomCards && Array.isArray(dbData.bidangBottomCards)) {
    for (const item of dbData.bidangBottomCards) {
      await prisma.bidangBottomCard.create({
        data: {
          id: item.id,
          tag: item.tag || '',
          title: item.title || '',
          description: item.description || '',
          buttonText: item.buttonText || '',
          buttonLink: item.buttonLink || '',
          imageUrl: item.imageUrl || '',
          sectionTag: item.sectionTag || '',
          sectionTitle: item.sectionTitle || ''
        }
      });
    }
    console.log(`Seeded ${dbData.bidangBottomCards.length} Bidang bottom cards.`);
  }

  // 18. Seed Retribusi
  if (dbData.retribusi && Array.isArray(dbData.retribusi)) {
    for (const item of dbData.retribusi) {
      await prisma.retribusi.create({
        data: {
          id: item.id,
          name: item.name || '',
          category: item.category || '',
          fee: item.fee || ''
        }
      });
    }
    console.log(`Seeded ${dbData.retribusi.length} retribusi items.`);
  }

  console.log('Seeding completed successfully.');
}


main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
