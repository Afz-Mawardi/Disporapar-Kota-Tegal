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
  const defaultKepemudaanCards = [
    {
      id: 'kc-1',
      title: 'Bumi Perkemahan Pramuka Martoloyo',
      description: 'Area perkemahan yang representatif dan asri untuk kegiatan luar ruangan gerakan pramuka, latihan kepemimpinan pemuda, serta outbound umum dengan fasilitas air bersih dan keamanan terjaga.',
      location: 'Mintaragen, Tegal Timur, Kota Tegal',
      capacity: '1.500 Peserta',
      price: 'Rp 150.000 / Hari',
      facilities: 'Area Tenda Luas, MCK Bersih, Pendopo Utama, Akses Air Bersih, Pos Keamanan',
      imageUrl: 'https://picsum.photos/seed/bumi_perkemahan/800/600'
    },
    {
      id: 'kc-2',
      title: 'Gedung Serbaguna Kepemudaan (GSG)',
      description: 'Gedung pertemuan indoor untuk kegiatan organisasi kepemudaan, pentas seni, seminar, rapat pleno, dan pameran kreativitas wirausaha muda Kota Tegal.',
      location: 'Kejambon, Tegal Timur, Kota Tegal',
      capacity: '500 Kursi',
      price: 'Rp 100.000 / Jam',
      facilities: 'Panggung Utama, Sound System, Kursi Lipat, AC/Kipas Angin, Area Parkir',
      imageUrl: 'https://picsum.photos/seed/gedung_pemuda/800/600'
    },
    {
      id: 'kc-3',
      title: 'Co-working Space & Youth Hub Room',
      description: 'Ruangan kerja bersama yang tenang dan nyaman dilengkapi koneksi internet cepat untuk mendukung produktivitas freelancer, developer muda, dan kreator konten lokal.',
      location: 'Slerok, Tegal Timur, Kota Tegal',
      capacity: '50 Orang',
      price: 'Gratis (Bagi Organisasi Binaan)',
      facilities: 'Akses WiFi Cepat, Colokan Listrik, AC Dingin, Meja & Kursi Kerja, Whiteboard',
      imageUrl: 'https://picsum.photos/seed/creative_hub_room/800/600'
    }
  ];

  for (const item of defaultKepemudaanCards) {
    await prisma.kepemudaanCard.create({ data: item });
  }
  console.log(`Seeded ${defaultKepemudaanCards.length} Kepemudaan cards.`);

  // 15. Seed Olahraga Cards (Sewa Lapangan/GOR)
  const defaultOlahragaCards = [
    {
      id: 'oc-1',
      title: 'Stadion Yos Sudarso Tegal',
      description: 'Stadion utama Kota Tegal dengan lapangan sepak bola rumput alami standar nasional, lintasan atletik, serta kapasitas tribun penonton yang memadai untuk kompetisi olahraga regional.',
      location: 'Jl. Melati, Kejambon, Tegal Timur',
      capacity: '15.000 Penonton',
      price: 'Rp 250.000 / Jam',
      facilities: 'Lap. Rumput Alami, Lintasan Atletik, Tribun Penonton, Lampu Penerangan, Area Parkir Luas',
      imageUrl: 'https://picsum.photos/seed/stadion_yos_sudarso/800/600'
    },
    {
      id: 'oc-2',
      title: 'GOR Wisanggeni (Indoor)',
      description: 'Gelanggang olahraga indoor serbaguna untuk olahraga bulu tangkis, futsal, dan basket. Dilengkapi tribun penonton dan pencahayaan optimal untuk pertandingan.',
      location: 'Slerok, Tegal Timur, Kota Tegal',
      capacity: '2.500 Penonton',
      price: 'Rp 75.000 / Jam',
      facilities: 'Lapangan Futsal, Lapangan Badminton, Ring Basket, Tribun Indoor, Toilet & Ruang Ganti',
      imageUrl: 'https://picsum.photos/seed/gor_wisanggeni/800/600'
    },
    {
      id: 'oc-3',
      title: 'Kolam Renang Samudra Bahari',
      description: 'Fasilitas kolam renang prestasi dengan ukuran standar Olympic, sistem filter air yang terawat, area bilas modern, serta tribun penonton untuk kejuaraan renang daerah.',
      location: 'Kawasan Wisata PAI, Mintaragen',
      capacity: '1.000 Pengunjung',
      price: 'Rp 15.000 / Orang',
      facilities: 'Kolam Olympic Standard, Kolam Anak, Area Bilas Modern, Tribun Penonton, Kios Makanan',
      imageUrl: 'https://picsum.photos/seed/kolam_renang_bahari/800/600'
    }
  ];

  for (const item of defaultOlahragaCards) {
    await prisma.olahragaCard.create({ data: item });
  }
  console.log(`Seeded ${defaultOlahragaCards.length} Olahraga cards.`);

  // 16. Seed Pariwisata Cards (Destinasi Wisata)
  const defaultPariwisataCards = [
    {
      id: 'pc-1',
      title: 'Pantai Alam Indah (PAI)',
      description: 'Icon pariwisata bahari Kota Tegal dengan pasir putih, hutan mangrove yang asri, dermaga apung yang modern, sunset menawan, serta Monumen Bahari TNI AL yang memajang kendaraan tempur bersejarah asli.',
      location: 'Mintaragen, Tegal Timur, Kota Tegal',
      operationalHours: '05:00 - 21:00 WIB',
      price: 'Rp 5.000 (Anak) / Rp 10.000 (Dewasa)',
      facilities: 'Area Bermain, Hutan Mangrove, Dermaga Apung, Monumen Alutsista, Food Court Kuliner Khas, Mushola & Toilet',
      imageUrl: 'https://picsum.photos/seed/pantai_alam_indah/1200/800'
    },
    {
      id: 'pc-2',
      title: 'Pantai Pulau Kodok',
      description: 'Pantai yang terkenal dengan suasana sejuk berkat rindangnya cemara laut dan memiliki terapi air laut alami bagi wisatawan. Destinasi favorit keluarga dan komunitas di pesisir Tegal.',
      location: 'Panggung, Tegal Timur, Kota Tegal',
      operationalHours: '05:00 - 18:00 WIB',
      price: 'Rp 3.000',
      facilities: 'Kios Teh Poci, Gazebo Pantai, Area Terapi Air, Panggung Hiburan, Spot Foto Instagramable',
      imageUrl: 'https://picsum.photos/seed/pulau_kodok/1200/800'
    },
    {
      id: 'pc-3',
      title: 'Alun-Alun Kota Tegal & Taman Pancasila',
      description: 'Kawasan pusat kota yang terintegrasi indah dengan Masjid Agung Tegal, Gedung Birao (SCS) peninggalan kolonial bersejarah, dan Menara Air peninggalan Belanda. Dilengkapi dancing fountain dan pedestrian ramah pejalan kaki.',
      location: 'Mangkukusuman, Tegal Timur, Kota Tegal',
      operationalHours: 'Buka 24 Jam',
      price: 'Gratis',
      facilities: 'Pedestrian Edukatif, Taman Pancasila, Lokomotif Antik Kereta Api, Kawasan Kuliner, Gedung SCS Kolonial',
      imageUrl: 'https://picsum.photos/seed/alun_alun_tegal/1200/800'
    }
  ];

  for (const item of defaultPariwisataCards) {
    await prisma.pariwisataCard.create({ data: item });
  }
  console.log(`Seeded ${defaultPariwisataCards.length} Pariwisata cards.`);

  // 17. Seed Bidang Bottom Cards
  const defaultBidangBottomCards = [
    {
      id: 'kepemudaan',
      tag: 'Layanan & Kemitraan Pemuda',
      title: 'Kemitraan Organisasi & Legalitas Kepemudaan',
      description: 'DISPORAPAR memandu, membina legalitas organisasi kepemudaan, serta memfasilitasi gerakan KNPI, Karang Taruna, dan Forum Anak Tegal (FAT) dalam upaya mewujudkan sinergi dan pemberdayaan potensi pemuda Kota Tegal secara berkelanjutan.',
      buttonText: 'Hubungi Kemitraan Pemuda',
      buttonLink: '/pelayanan',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
      sectionTag: 'Program Strategis & Layanan Pemuda',
      sectionTitle: 'Fasilitas Pembinaan Pemuda Kota Tegal'
    },
    {
      id: 'olahraga',
      tag: 'Pemberdayaan Atlet Daerah',
      title: 'Pemusatan Latihan & Pembinaan Olahraga Berkelanjutan',
      description: 'DISPORAPAR bersinergi erat bersama KONI (Komite Olahraga Nasional Indonesia) Kota Tegal secara terpadu mengelola pemusatan latihan atlet usia dini berkala, peningkatan kualifikasi lisensi pelatih nasional, serta penyelenggaraan bonus apresiasi kejuaraan PORPROV & PON.',
      buttonText: 'Hubungi Layanan Atlet & KONI',
      buttonLink: '/pelayanan',
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
      sectionTag: 'Sarana & Fasilitas Olahraga',
      sectionTitle: 'Pusat Kegiatan Keolahragaan Kota Tegal'
    },
    {
      id: 'pariwisata',
      tag: 'Mitra Pelaku Usaha Wisata',
      title: 'Kembangkan Usaha Pariwisata & Kuliner Kreatif Anda Bersama Kami',
      description: 'DISPORAPAR mendukung penuh pelaku industri penginapan, restoran Sate Tegal legendaris, agen perjalanan, serta pemandu wisata bahari untuk mengajukan data usaha resmi agar terdaftar secara luas di bawah rekomendasi katalog pariwisata terpadu.',
      buttonText: 'Urus Izin Usaha & TDUP',
      buttonLink: '/pelayanan',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
      sectionTag: 'Destinasi Wisata',
      sectionTitle: 'Destinasi Wisata Terpopuler & Unggulan'
    }
  ];

  for (const item of defaultBidangBottomCards) {
    await prisma.bidangBottomCard.create({ data: item });
  }
  console.log(`Seeded ${defaultBidangBottomCards.length} Bidang bottom cards.`);

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
