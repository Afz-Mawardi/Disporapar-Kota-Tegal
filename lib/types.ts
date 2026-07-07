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

export interface BidangCard {
  id: string;
  title: string;
  description: string;
  location: string;
  capacity: string; // operationalHours for pariwisata, capacity for others
  price: string; // ticketPrice for pariwisata, priceHour/retribusi for others
  facilities: string[];
  imageUrl: string;
  locationIcon?: string;
  capacityIcon?: string;
  priceIcon?: string;
  facilitiesTitle?: string;
  details?: Array<{ value: string; icon: string }>;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  imageUrl: string;
  author: string;
  featured?: boolean;
  showOnHomepage?: boolean;
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
  description: string;
  imageUrl: string;
  showOnHomepage?: boolean;
}

export interface PublicService {
  id: string;
  title: string;
  description: string;
  category: string;
  downloadUrl: string;
  fileSize: string;
  showOnHomepage?: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
  showOnHomepage?: boolean;
}

export interface WelcomeMessage {
  name: string;
  nip?: string;
  content: string;
  imageUrl: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  tagline: string;
  title: string;
  cta: string;
  href: string;
}

export interface Retribusi {
  id: string;
  name: string;
  category: string;
  fee: string;
}

export interface PriorityProgram {
  id: string;
  title: string;
  description: string;
  points: string[];
}

export interface SocialMediaItem {
  platform: 'instagram' | 'youtube' | 'facebook' | 'x' | 'tiktok' | 'whatsapp' | 'telegram' | 'linkedin';
  label: string;
  url: string;
}

export interface OfficeInfo {
  address: string;
  phone: string;
  email: string;
  operationalHours: string;
  socialMedia: {
    instagramResmi: string;
    instagramTourism: string;
    instagramPemuda: string;
    youtube: string;
  };
  gmapsEmbedUrl: string;
  socialMediaList?: SocialMediaItem[];
}

export interface StatCard {
  value: string;
  label: string;
}

export interface ProgramCard {
  title: string;
  desc: string;
  points: string[];
}

export interface HomepageSection {
  title: string;
  subtitle: string;
  desc: string;
  show: boolean;
}

export interface HomepageSettings {
  about: HomepageSection & { stats: StatCard[] };
  agenda: HomepageSection;
  programs: HomepageSection & { cards: ProgramCard[] };
  news: HomepageSection;
  gallery: HomepageSection;
  documents: HomepageSection;
  retribusiLegal?: {
    title: string;
    content: string;
  };
}

export interface CategoryStore {
  news: string[];
  gallery: string[];
  services: string[];
  retribusi: string[];
}
