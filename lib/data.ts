// Mock Data Hub for DISPORAPAR Kota Tegal
// Using authentic, high-quality documentation themes and images from Tegal, Central Java.

export interface Destination {
  id: string;
  name: string;
  category: 'Bahari' | 'Religi/Sejarah' | 'Kuliner' | 'Alam';
  description: string;
  location: string;
  imageUrl: string;
  facilities: string[];
  operationalHours: string;
  ticketPrice: string;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Pariwisata' | 'Olahraga' | 'Kepemudaan' | 'Pengumuman' | 'Event';
  date: string;
  imageUrl: string;
  author: string;
  featured?: boolean;
}

export interface YouthProgram {
  id: string;
  title: string;
  description: string;
  participants: string;
  achievements: string[];
  imageUrl: string;
  status: 'Aktif' | 'Selesai' | 'Mendatang';
}

export interface SportsVenue {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: string;
  imageUrl: string;
  priceHour: string;
  status: 'Tersedia' | 'Pemeliharaan' | 'Digunakan';
}

export interface EventAgenda {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Pariwisata' | 'Olahraga' | 'Kepemudaan' | 'Dinas';
  description: string;
  imageUrl: string;
}

export interface PublicService {
  id: string;
  title: string;
  description: string;
  category: 'SOP' | 'Formulir' | 'Berkas Layanan' | 'Izin Usaha';
  downloadUrl: string;
  fileSize: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Pantai Alam Indah (PAI)',
    category: 'Bahari',
    description: 'Icon pariwisata bahari Kota Tegal dengan pasir putih, hutan mangrove yang asri, dermaga apung yang modern, sunset menawan, serta Monumen Bahari TNI AL yang memajang kendaraan tempur bersejarah asli.',
    location: 'Mintaragen, Tegal Timur, Kota Tegal',
    imageUrl: 'https://picsum.photos/seed/pantai_alam_indah/1200/800',
    facilities: ['Area Bermain', 'Hutan Mangrove', 'Dermaga Apung', 'Monumen Alutsista', 'Food Court Kuliner Khas', 'Mushola & Toilet'],
    operationalHours: '05:00 - 21:00 WIB',
    ticketPrice: 'Rp 5.000 (Anak) / Rp 10.000 (Dewasa)'
  },
  {
    id: '2',
    name: 'Pantai Pulau Kodok',
    category: 'Bahari',
    description: 'Pantai yang terkenal dengan suasana sejuk berkat rindangnya cemara laut dan memiliki terapi air laut alami bagi wisatawan. Destinasi favorit keluarga dan komunitas di pesisir Tegal.',
    location: 'Panggung, Tegal Timur, Kota Tegal',
    imageUrl: 'https://picsum.photos/seed/pulau_kodok/1200/800',
    facilities: ['Kios Teh Poci', 'Gazebo Pantai', 'Area Terapi Air', 'Panggung Hiburan', 'Spot Foto Instagramable'],
    operationalHours: '05:00 - 18:00 WIB',
    ticketPrice: 'Rp 3.000'
  },
  {
    id: '3',
    name: 'Alun-Alun Kota Tegal & Taman Pancasila',
    category: 'Religi/Sejarah',
    description: 'Kawasan pusat kota yang terintegrasi indah dengan Masjid Agung Tegal, Gedung Birao (SCS) peninggalan kolonial bersejarah, dan Menara Air peninggalan Belanda. Dilengkapi dancing fountain dan pedestrian ramah pejalan kaki.',
    location: 'Mangkukusuman, Tegal Timur, Kota Tegal',
    imageUrl: 'https://picsum.photos/seed/alun_alun_tegal/1200/800',
    facilities: ['Pedestrian Edukatif', 'Taman Pancasila', 'Lokomotif Antik Kereta Api', 'Kawasan Kuliner', 'Gedung SCS Kolonial'],
    operationalHours: 'Buka 24 Jam',
    ticketPrice: 'Gratis'
  },
  {
    id: '4',
    name: 'Kampung Seni & Galeri Pariwisata PAI',
    category: 'Alam',
    description: 'Pusat inkubasi seni budaya lokal, kerajinan khas Tegalan, batik Tegal, dan tempat pameran eksekutif pariwisata yang dikelola oleh DISPORAPAR bersama budayawan lokal.',
    location: 'Kawasan Wisata PAI, Kota Tegal',
    imageUrl: 'https://picsum.photos/seed/kampung_seni/1200/800',
    facilities: ['Teater Terbuka', 'Galeri Batik Tegalan', 'Ruang Workshop Seni', 'Pusat Oleh-Oleh Cinderamata'],
    operationalHours: '09:00 - 17:00 WIB',
    ticketPrice: 'Gratis'
  },
  {
    id: '5',
    name: 'Pusat Kuliner Sate Kambing Muda & Teh Poci',
    category: 'Kuliner',
    description: 'Sentra wisata gastronomi legendaris Kota Tegal menyajikan Sate Kambing Muda nan empuk berpadu dengan tradisi luhur minum teh melati seduh tanah liat (moci) berkarakter nasgitel (panas, legi, kenthel).',
    location: 'Jl. Jenderal Sudirman & Jl. Kartini, Kota Tegal',
    imageUrl: 'https://picsum.photos/seed/sate_tegal/1200/800',
    facilities: ['Warung Tradisional Nyaman', 'Area Parkir Luas', 'Atraksi Moci Tegal', 'Oleh-oleh khas Tegalan'],
    operationalHours: '10:00 - 22:00 WIB',
    ticketPrice: 'Sesuai pesanan'
  },
  {
    id: '6',
    name: 'Hutan Mangrove & Pesisir Muarareja',
    category: 'Alam',
    description: 'Area konservasi ekologi pesisir yang dikembangkan menjadi destinasi rekreasi edukatif mangrove. Sangat asri untuk berjalan kaki di atas dermaga kayu keliling hutan bakau.',
    location: 'Muarareja, Tegal Barat, Kota Tegal',
    imageUrl: 'https://picsum.photos/seed/mangrove_muarareja/1200/800',
    facilities: ['Jembatan Kayu Edukasi', 'Sewa Perahu Tradisional', 'Sentra Pengolahan Kupat Glabed Pesisir', 'Gardu Pandang'],
    operationalHours: '07:00 - 17:30 WIB',
    ticketPrice: 'Rp 5.000'
  }
];

export const NEWS: News[] = [
  {
    id: 'news-1',
    title: 'Festival Pesisir Tegal 2026: Sinergi Pariwisata Bahari dan Kebudayaan Lokal Resmi Dibuka',
    excerpt: 'Festival tahunan pariwisata Pantai Alam Indah resmi dibuka oleh Walikota Tegal bersama DISPORAPAR dengan target 50.000 pengunjung lokal dan mancanegara.',
    content: 'Kota Tegal menyambut perhelatan Festival Pesisir Tegal 2026 yang berlangsung meriah di pesisir Pantai Alam Indah. Acara dibuka langsung dengan pertunjukan tarian tradisional pesisiran, pameran UMKM ekonomi kreatif, lomba perahu hias bahari, dan festival moci bersama 5.000 masyarakat. DISPORAPAR Kota Tegal mengusung visi modernisasi wisata bahari dengan tetap melestarikan keasrian alam dan budaya pesisir utara Jawa Tengah.',
    category: 'Pariwisata',
    date: '24 Mei 2026',
    imageUrl: 'https://picsum.photos/seed/festival_pesisir/800/600',
    author: 'Humas DISPORAPAR',
    featured: true
  },
  {
    id: 'news-2',
    title: 'Pemilihan Pemuda Pelopor Kota Tegal Tahun 2026 Memasuki Tahap Penilaian Kreativitas',
    excerpt: 'DISPORAPAR menyaring 15 pemuda kreatif dalam seleksi Pemuda Pelopor bidang Teknologi Informasi, Kewirausahaan, Seni Budaya, dan Ketahanan Pangan.',
    content: 'Sebanyak 15 nominator Pemuda Pelopor Kota Tegal 2026 mempresentasikan kontribusi sosial mereka di hadapan tim penguji profesional di Aula DISPORAPAR. Program kepemudaan ini bertujuan melahirkan pionir-pionir muda tangguh yang mampu memecahkan permasalahan ekonomi dan kemasyarakatan di wilayah Kota Tegal, meningkatkan daya saing sumber daya pemuda menyongsong Indonesia Emas.',
    category: 'Kepemudaan',
    date: '20 Mei 2026',
    imageUrl: 'https://picsum.photos/seed/pemuda_pelopor/800/600',
    author: 'Bidang Kepemudaan'
  },
  {
    id: 'news-3',
    title: 'Kota Tegal Persiapkan GOR Wisanggeni Sebagai Pusat Pemusatan Latihan Atlet Berprestasi',
    excerpt: 'Revitalisasi fasilitas olahraga di GOR Wisanggeni mulai diimplementasikan demi mendukung pembinaan atlet muda berprestasi menyongsong PORPROV Jateng.',
    content: 'Pit. Kepala DISPORAPAR Kota Tegal mengumumkan langkah baru peningkatan infrastruktur olahraga di GOR Wisanggeni. Revitalisasi ini meliputi perbaikan arena indoor futsal, badminton, basket, serta penyediaan asrama bagi para atlet berprestasi daerah. Hal ini diharapkan mampu menumbuhkan semangat latihan intensif demi memboyong medali emas bagi Kota Bahari.',
    category: 'Olahraga',
    date: '15 Mei 2026',
    imageUrl: 'https://picsum.photos/seed/gor_wisanggeni_news/800/600',
    author: 'Bidang Keolahragaan'
  },
  {
    id: 'news-4',
    title: 'Peningkatan Pelayanan Publik: DISPORAPAR Luncurkan Sistem Digital E-Event & E-Sewa Venue',
    excerpt: 'Sistem booking fasilitas olahraga negara dan perizinan event kreatif kini bisa diajukan 100% online mudah, transparan, dan akurat.',
    content: 'Selaras dengan misi tata pamong digital, DISPORAPAR Kota Tegal meluncurkan portal pelayanan publik baru. Masyarakat kini dapat mengunduh formulir, mengecek ketersediaan Stadion Yos Sudarso atau GOR Wisanggeni secara real-time, dan mengajukan rekomendasi perizinan kepariwisataan secara transparan tanpa pungutan liar berkas fisik.',
    category: 'Pengumuman',
    date: '10 Mei 2026',
    imageUrl: 'https://picsum.photos/seed/layanan_publik_news/800/600',
    author: 'Seksi Data & Informasi'
  }
];

export const YOUTH_PROGRAMS: YouthProgram[] = [
  {
    id: 'y-1',
    title: 'Akselerator Wirausaha Muda Tegal (AWMT)',
    description: 'Inkubasi bisnis intensif selama 3 bulan bagi pemuda Kota Tegal usia 16-30 tahun. Terdiri dari mentoring manajemen keuangan, digital marketing, pengemasan produk, dan penyaluran akses modal usaha kerja sama bank daerah.',
    participants: '120 Pemimpin Muda Kreatif / Tahun',
    achievements: ['Membantu 45 UMKM Naik Kelas ke Go-Digital', 'Penghargaan Tingkat Provinsi dalam Pengabdian Ekonomi Pemuda'],
    imageUrl: 'https://picsum.photos/seed/wirausaha_muda/800/600',
    status: 'Aktif'
  },
  {
    id: 'y-2',
    title: 'Seleksi Paskibraka Kota Tegal',
    description: 'Penjaringan, pelatihan fisik, kecerdasan kepemimpinan, dan ideologi pancasila untuk calon anggota Pasukan Pengibar Bendera Pusaka Merah Putih dalam rangka upacara Kemerdekaan RI tingkat Kota Tegal.',
    participants: '75 Siswa-Siswi SMA Sederajat Terpilih',
    achievements: ['2 Perwakilan Berhasil Lolos ke Tim Paskibraka Provinsi Jawa Tengah', 'Kedisiplinan & Kesetiakawanan Sosial Berkelanjutan'],
    imageUrl: 'https://picsum.photos/seed/paskibraka/800/600',
    status: 'Selesai'
  },
  {
    id: 'y-3',
    title: 'Tegal Youth Creative Hub & Forum Co-Working',
    description: 'Penyediaan ruang kolaborasi kreatif di gedung pemuda, mendukung peningkatan skill desain grafis, coding, videografi, dan podcasting secara gratis.',
    participants: '500+ Member Pemuda Komunitas Kreatif',
    achievements: ['Melahirkan 3 Karya Film Pendek Masuk Nominasi Nasional', 'Mengurangi Angka Pengangguran Produktif Sektor Kreatif'],
    imageUrl: 'https://picsum.photos/seed/creative_hub/800/600',
    status: 'Mendatang'
  }
];

export const SPORTS_VENUES: SportsVenue[] = [
  {
    id: 'v-1',
    name: 'Stadion Yos Sudarso Tegal',
    type: 'Stadion Sepak Bola & Atletik',
    location: 'Jl. Melati, Kejambon, Tegal Timur',
    capacity: '15.000 Penonton',
    imageUrl: 'https://picsum.photos/seed/stadion_yos_sudarso/800/600',
    priceHour: 'Rp 250.000',
    status: 'Tersedia'
  },
  {
    id: 'v-2',
    name: 'GOR Wisanggeni (Indoor)',
    type: 'Lapangan Badminton, Futsal, & Basket',
    location: 'Slerok, Tegal Timur, Kota Tegal',
    capacity: '2.500 Penonton',
    imageUrl: 'https://picsum.photos/seed/gor_wisanggeni/800/600',
    priceHour: 'Rp 75.000',
    status: 'Tersedia'
  },
  {
    id: 'v-3',
    name: 'Kompleks Lapangan Tenis Balaikota',
    type: 'Lapangan Tenis Outdoor',
    location: 'Kawasan Kantor Balaikota, Pesurungan Kidul',
    capacity: '200 Penonton',
    imageUrl: 'https://picsum.photos/seed/lapangan_tenis/800/600',
    priceHour: 'Rp 40.000',
    status: 'Pemeliharaan'
  },
  {
    id: 'v-4',
    name: 'Kolam Renang Samudra Bahari',
    type: 'Kolam Renang Standar Olympic',
    location: 'Kawasan Wisata PAI, Mintaragen',
    capacity: '1.000 Pengunjung',
    imageUrl: 'https://picsum.photos/seed/kolam_renang_bahari/800/600',
    priceHour: 'Rp 15.000 / Orang',
    status: 'Tersedia'
  }
];

export const EVENTS: EventAgenda[] = [
  {
    id: 'e-1',
    title: 'Tegal Pesisir Fun Run 10K',
    date: '14 Juni 2026',
    time: '06:00 - 09:30 WIB',
    location: 'Start-Finish di Pantai Alam Indah (PAI)',
    category: 'Olahraga',
    description: 'Lari santai menyusuri indahnya garis pantai utara Kota Tegal dengan target 2.000 pelari dari seluruh Jawa Tengah. Berhadiah total Rp 50 Juta dan hiburan musik lokal.',
    imageUrl: 'https://picsum.photos/seed/fun_run/800/600'
  },
  {
    id: 'e-2',
    title: 'Festival Kuliner Moci & Sate Tegal 2026',
    date: '28 Juni 2026',
    time: '15:00 - 22:00 WIB',
    location: 'Taman Pancasila, Kota Tegal',
    category: 'Pariwisata',
    description: 'Atraksi bakar sate massal terpanjang dan pemecahan rekor minum teh poci tanah liat bersama 1.000 perajin lokal Tegal, dimeriahkan kesenian tari Balo-Balo.',
    imageUrl: 'https://picsum.photos/seed/fest_kuliner/800/600'
  },
  {
    id: 'e-3',
    title: 'Pelatihan Kader Pemuda Anti Narkoba',
    date: '02 Juli 2026',
    time: '08:00 - 14:00 WIB',
    location: 'Gedung Pertemuan KNPI Kota Tegal',
    category: 'Kepemudaan',
    description: 'Sinergisitas DISPORAPAR bersama BNN Kota Tegal untuk mendidik agen-agen milenial anti-narkoba di setiap kelurahan se-Kota Tegal.',
    imageUrl: 'https://picsum.photos/seed/pemuda_anti_narkoba/800/600'
  },
  {
    id: 'e-4',
    title: 'Rapat Kerja KONI Jateng & Forkopimda Olahraga',
    date: '10 Juli 2026',
    time: '09:00 - 16:00 WIB',
    location: 'Ruang Rapat Utama Balai Kota Swasana',
    category: 'Dinas',
    description: 'Koordinasi teknis persiapan kontingen atlet Tegal dan penyesuaian regulasi sewa fasilitas umum keolahragaan daerah.',
    imageUrl: 'https://picsum.photos/seed/rapat_dinas/800/600'
  }
];

export const GALLERY_PHOTOS = [
  {
    id: 'g-1',
    title: 'Gubernur Jateng bersama Walikota Tegal meninjau Dermaga Apung PAI',
    category: 'Pariwisata',
    imageUrl: 'https://picsum.photos/seed/galeri1/900/600'
  },
  {
    id: 'g-2',
    title: 'Pelepasan Kontingen Atlet Sepak Bola Kota Tegal oleh Ka Dinas',
    category: 'Olahraga',
    imageUrl: 'https://picsum.photos/seed/galeri2/600/900'
  },
  {
    id: 'g-3',
    title: 'Pelatihan Kewirausahaan Pemuda Kreatif di Aula Balaikota',
    category: 'Kepemudaan',
    imageUrl: 'https://picsum.photos/seed/galeri3/800/600'
  },
  {
    id: 'g-4',
    title: 'Suasana Sunset Romantis dengan latar Kapal Layar Tradisional di PAI',
    category: 'Pariwisata',
    imageUrl: 'https://picsum.photos/seed/galeri4/800/800'
  },
  {
    id: 'g-5',
    title: 'Latihan Bersama Atlet Panahan Kota Tegal di Stadion Yos Sudarso',
    category: 'Olahraga',
    imageUrl: 'https://picsum.photos/seed/galeri5/700/900'
  },
  {
    id: 'g-6',
    title: 'Pemberian Piala Juara Pemuda Pelopor bidang Teknologi Kreatif',
    category: 'Kepemudaan',
    imageUrl: 'https://picsum.photos/seed/galeri6/800/600'
  },
  {
    id: 'g-7',
    title: 'Kawasan Pedestrian Taman Pancasila yang ramai dikunjungi malam hari',
    category: 'Pariwisata',
    imageUrl: 'https://picsum.photos/seed/galeri7/1000/600'
  },
  {
    id: 'g-8',
    title: 'Sinergi Pramuka dan Pemuda Tegal dalam Aksi Bersih Pantai Bahari',
    category: 'Kepemudaan',
    imageUrl: 'https://picsum.photos/seed/galeri8/900/700'
  }
];

export const PUBLIC_SERVICES: PublicService[] = [
  {
    id: 's-1',
    title: 'SOP Penyewaan Fasilitas Olahraga (Stadion / GOR)',
    description: 'Panduan tata cara penyewaan sarana prasarana olahraga milik daerah untuk kegiatan olahraga maupun luar olahraga.',
    category: 'SOP',
    downloadUrl: '#',
    fileSize: '1.2 MB'
  },
  {
    id: 's-2',
    title: 'Formulir Permohonan Izin Keikutsertaan Pameran Pariwisata',
    description: 'Formulir pengajuan pendaftaran pameran bagi asosiasi pariwisata, pengelola destinasi, dan perajin cinderamata binaan.',
    category: 'Formulir',
    downloadUrl: '#',
    fileSize: '450 KB'
  },
  {
    id: 's-3',
    title: 'Berkas Layanan Rekomendasi Tanda Daftar Usaha Pariwisata (TDUP)',
    description: 'Persyaratan lengkap, durasi penyelesaian, dan jaminan keamanan penerbitan rekomendasi teknis pariwisata.',
    category: 'Berkas Layanan',
    downloadUrl: '#',
    fileSize: '1.8 MB'
  },
  {
    id: 's-4',
    title: 'Formulir Pendaftaran Sertifikasi Organisasi Kepemudaan (OK)',
    description: 'Formulir verifikasi legalitas kelayakan organisasi kepemudaan dalam menerima bansos dan rekomendasi kegiatan.',
    category: 'Formulir',
    downloadUrl: '#',
    fileSize: '320 KB'
  },
  {
    id: 's-5',
    title: 'SOP Pengajuan Rekomendasi Penyelenggaraan Event Olahraga',
    description: 'Prosedur pengusulan event olahraga berskala daerah, nasional, maupun internasional agar terdata resmi di bawah naungan dinas.',
    category: 'SOP',
    downloadUrl: '#',
    fileSize: '950 KB'
  },
  {
    id: 's-6',
    title: 'Berkas Layanan Standar Operasional Pengelolaan Pondok Wisata (Homestay)',
    description: 'Dokumen panduan standar pelayanan akomodasi rakyat untuk menunjang pariwisata bahari terpadu di Kota Tegal.',
    category: 'Berkas Layanan',
    downloadUrl: '#',
    fileSize: '2.1 MB'
  },
  {
    id: 's-7',
    title: 'Formulir Pengajuan Stimulus Sarana Prasarana Klub Olahraga Masyarakat',
    description: 'Formulir administrasi usulan bantuan bola, net, rompi, dan perbaikan sarana olahraga tingkat RW binaan dinas.',
    category: 'Formulir',
    downloadUrl: '#',
    fileSize: '380 KB'
  },
  {
    id: 's-8',
    title: 'SOP Pelaksanaan Sertifikasi Kompetensi Pemandu Wisata Pesisir',
    description: 'Tata laksana pengujian kredibilitas dan keahlian pemandu wisata bahari berkolaborasi dengan Himpunan Pramuwisata Indonesia.',
    category: 'SOP',
    downloadUrl: '#',
    fileSize: '1.5 MB'
  },
  {
    id: 's-9',
    title: 'Berkas Layanan Registrasi Pelaku Usaha Ekonomi Kreatif Unggulan',
    description: 'Formulir basis data sertifikasi kurasi produk kriya, batik Tegalan, logam, dan makanan khas untuk event pameran daerah.',
    category: 'Berkas Layanan',
    downloadUrl: '#',
    fileSize: '850 KB'
  },
  {
    id: 's-10',
    title: 'Formulir Pendaftaran Seleksi Pertukaran Pemuda Antar Negara (PPAN)',
    description: 'Pendaftaran berkas seleksi delegasi pemuda andalan Kota Tegal ke tingkat provinsi untuk dikirim ke kancah global.',
    category: 'Formulir',
    downloadUrl: '#',
    fileSize: '540 KB'
  }
];

export const OFFICE_INFO = {
  address: 'Jl. Melati No.30a, Kejambon, Kec. Tegal Tim., Kota Tegal, Jawa Tengah 52124, Indonesia',
  phone: '(0283) 351052',
  email: 'disporapar@tegalkota.go.id',
  operationalHours: 'Senin - Kamis: 07:15 - 15:45 WIB | Jumat: 07:15 - 11:30 WIB',
  socialMedia: {
    instagramResmi: 'https://www.instagram.com/disporaparkotategal',
    instagramTourism: 'https://www.instagram.com/tegal.tourism',
    instagramPemuda: 'https://www.instagram.com/bidpemuda_disporapartegal',
    youtube: 'https://www.youtube.com/disporapartegal'
  },
  gmapsEmbedUrl: 'https://maps.google.com/maps?q=Jl.+Melati+No.30a,+Kejambon,+Kec.+Tegal+Tim.,+Kota+Tegal,+Jawa+Tengah+52124&t=&z=17&hl=id&output=embed'
};

export const FAQS = [
  {
    question: 'Bagaimana cara menyewa GOR Wisanggeni atau Stadion Yos Sudarso?',
    answer: 'Penyewaan dapat dilakukan secara online melalui halaman Pelayanan Publik dengan mengunduh formulir sewa, melengkapi dokumen persyaratan, dan mengunggahnya kembali atau diserahkan langsung ke Bidang Keolahragaan kantor DISPORAPAR paling lambat H-7 sebelum penggunaan.'
  },
  {
    question: 'Apakah masuk ke spot Monumen Bahari di Pantai Alam Indah dikenakan biaya tambahan?',
    answer: 'Tidak. Tiket masuk Pantai Alam Indah (PAI) sudah mencakup akses melihat Monumen Bahari (Alutsista TNI AL) dan area Mangrove. Anda bebas berswafoto di area tersebut selama jam operasional wisata.'
  },
  {
    question: 'Bagaimana prosedur mendaftar sebagai Organisasi Kepemudaan (OK) binaan dinas?',
    answer: 'Pengurus OK dapat mengunjungi bidang Kepemudaan untuk menaruh berkas AD/ART, SK Kemenkumham, serta susunan kepengurusan lengkap, atau melakukan pendaftaran pendataan online melalui form legalitas di Pelayanan Publik.'
  },
  {
    question: 'Apakah pengajuan rekomendasi kegiatan pariwisata atau event olahraga dipungut biaya?',
    answer: 'Sama sekali tidak. Seluruh pelayanan publik penerbitan surat rekomendasi kegiatan pariwisata, pemuda, dan olahraga di DISPORAPAR Kota Tegal adalah GRATIS (Rp 0) tanpa biaya sampingan apa pun.'
  }
];
