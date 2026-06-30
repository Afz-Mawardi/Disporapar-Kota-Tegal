'use client';

import { useState, useEffect } from 'react';
import {
  NEWS as initialNews,
  EVENTS as initialEvents,
  GALLERY_PHOTOS as initialGallery,
  PUBLIC_SERVICES as initialServices,
  OFFICE_INFO as initialOfficeInfo,
  WELCOME_MESSAGE as initialWelcomeMessage,
  HERO_SLIDES as initialHeroSlides,
  PRIORITY_PROGRAMS as initialPriorityPrograms,
  News,
  EventAgenda,
  PublicService,
  WelcomeMessage,
  HeroSlide,
  PriorityProgram,
  HomepageSection,
  HomepageSettings,
  INITIAL_HOMEPAGE_SETTINGS as initialHomepageSettings,
  DEFAULT_KEPEMUDAAN_CARDS as initialKepemudaanCards,
  DEFAULT_OLAHRAGA_CARDS as initialOlahragaCards,
  DEFAULT_PARIWISATA_CARDS as initialPariwisataCards,
  BidangCard,
  Retribusi,
  DEFAULT_RETRIBUSI as initialRetribusi
} from './data';


export interface BidangBottomCard {
  id: 'kepemudaan' | 'olahraga' | 'pariwisata';
  tag: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  imageUrl: string;
  sectionTag?: string;
  sectionTitle?: string;
}

export const initialBidangBottomCards: BidangBottomCard[] = [
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

// Helper to check if running in client-side
const isClient = typeof window !== 'undefined';

// Get initial values from LocalStorage or fallback to static data
export const getStoredNews = (): News[] => {
  if (!isClient) return initialNews;
  try {
    const stored = localStorage.getItem('disporapar_news');
    if (!stored || stored === 'null' || stored === 'undefined') return initialNews;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialNews;
  } catch (e) {
    console.error('Error reading disporapar_news from localStorage', e);
    return initialNews;
  }
};

export const getStoredEvents = (): EventAgenda[] => {
  if (!isClient) return initialEvents;
  try {
    const stored = localStorage.getItem('disporapar_events');
    if (!stored || stored === 'null' || stored === 'undefined') return initialEvents;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialEvents;
  } catch (e) {
    console.error('Error reading disporapar_events from localStorage', e);
    return initialEvents;
  }
};

export const getStoredGallery = () => {
  if (!isClient) return initialGallery;
  try {
    const stored = localStorage.getItem('disporapar_gallery');
    if (!stored || stored === 'null' || stored === 'undefined') return initialGallery;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialGallery;
  } catch (e) {
    console.error('Error reading disporapar_gallery from localStorage', e);
    return initialGallery;
  }
};

export const getStoredServices = (): PublicService[] => {
  if (!isClient) return initialServices;
  try {
    const stored = localStorage.getItem('disporapar_services');
    if (!stored || stored === 'null' || stored === 'undefined') return initialServices;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialServices;
  } catch (e) {
    console.error('Error reading disporapar_services from localStorage', e);
    return initialServices;
  }
};

export const getStoredOfficeInfo = () => {
  if (!isClient) return initialOfficeInfo;
  try {
    const stored = localStorage.getItem('disporapar_office_info');
    if (!stored || stored === 'null' || stored === 'undefined') return initialOfficeInfo;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object') {
      return {
        ...initialOfficeInfo,
        ...parsed,
        socialMedia: {
          ...initialOfficeInfo.socialMedia,
          ...(parsed.socialMedia || {})
        },
        socialMediaList: parsed.socialMediaList || initialOfficeInfo.socialMediaList
      };
    }
    return initialOfficeInfo;
  } catch (e) {
    console.error('Error reading disporapar_office_info from localStorage', e);
    return initialOfficeInfo;
  }
};

export const getStoredWelcomeMessage = (): WelcomeMessage => {
  if (!isClient) return initialWelcomeMessage;
  try {
    const stored = localStorage.getItem('disporapar_welcome_message');
    if (!stored || stored === 'null' || stored === 'undefined') return initialWelcomeMessage;
    const parsed = JSON.parse(stored);
    return (parsed && typeof parsed === 'object') ? { ...initialWelcomeMessage, ...parsed } : initialWelcomeMessage;
  } catch (e) {
    console.error('Error reading disporapar_welcome_message from localStorage', e);
    return initialWelcomeMessage;
  }
};

export const getStoredHeroSlides = (): HeroSlide[] => {
  if (!isClient) return initialHeroSlides;
  try {
    const stored = localStorage.getItem('disporapar_hero_slides');
    if (!stored || stored === 'null' || stored === 'undefined') return initialHeroSlides;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialHeroSlides;
  } catch (e) {
    console.error('Error reading disporapar_hero_slides from localStorage', e);
    return initialHeroSlides;
  }
};

export const getStoredPriorityPrograms = (): PriorityProgram[] => {
  if (!isClient) return initialPriorityPrograms;
  try {
    const stored = localStorage.getItem('disporapar_priority_programs');
    if (!stored || stored === 'null' || stored === 'undefined') return initialPriorityPrograms;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialPriorityPrograms;
  } catch (e) {
    console.error('Error reading disporapar_priority_programs from localStorage', e);
    return initialPriorityPrograms;
  }
};

// Set values in LocalStorage and trigger update event to sync other pages
export const saveStoredNews = (data: News[]) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_news', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      
      // Persist to server db.json via API route
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'news', data })
      }).catch(err => console.error('Failed to save news to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export const saveStoredEvents = (data: EventAgenda[]) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_events', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));

      // Persist to server db.json via API route
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'events', data })
      }).catch(err => console.error('Failed to save events to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export const saveStoredGallery = (data: typeof initialGallery) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_gallery', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));

      // Persist to server db.json via API route
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'gallery', data })
      }).catch(err => console.error('Failed to save gallery to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export const saveStoredServices = (data: PublicService[]) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_services', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));

      // Persist to server db.json via API route
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'services', data })
      }).catch(err => console.error('Failed to save services to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export const saveStoredOfficeInfo = (data: typeof initialOfficeInfo) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_office_info', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));

      // Persist to server db.json via API route
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'officeInfo', data })
      }).catch(err => console.error('Failed to save office info to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export const saveStoredWelcomeMessage = (data: WelcomeMessage) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_welcome_message', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));

      // Persist to server db.json via API route
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'welcomeMessage', data })
      }).catch(err => console.error('Failed to save welcome message to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export const saveStoredHeroSlides = (data: HeroSlide[]) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_hero_slides', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));

      // Persist to server db.json via API route
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'heroSlides', data })
      }).catch(err => console.error('Failed to save hero slides to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export const saveStoredPriorityPrograms = (data: PriorityProgram[]) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_priority_programs', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));

      // Persist to server db.json via API route
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'priorityPrograms', data })
      }).catch(err => console.error('Failed to save priority programs to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export interface CategoryStore {
  news: string[];
  gallery: string[];
  services: string[];
  retribusi: string[];
}

export const initialCategories: CategoryStore = {
  news: ['Pariwisata', 'Olahraga', 'Kepemudaan', 'Pengumuman', 'Event'],
  gallery: ['Pariwisata', 'Olahraga', 'Kepemudaan'],
  services: ['SOP', 'Formulir', 'Berkas Layanan', 'Izin Usaha'],
  retribusi: ['Olahraga', 'Pariwisata', 'Kepemudaan']
};

export const getStoredCategories = (): CategoryStore => {
  if (!isClient) return initialCategories;
  try {
    const stored = localStorage.getItem('disporapar_categories');
    if (!stored || stored === 'null' || stored === 'undefined') return initialCategories;
    const parsed = JSON.parse(stored);
    return (parsed && typeof parsed === 'object') ? { ...initialCategories, ...parsed } : initialCategories;
  } catch (e) {
    console.error('Error reading disporapar_categories from localStorage', e);
    return initialCategories;
  }
};

export const saveStoredCategories = (data: CategoryStore) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_categories', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));

      // Persist to server db.json via API route
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'categories', data })
      }).catch(err => console.error('Failed to save categories to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

// Shared Promise reference to deduplicate parallel API calls on mount
let activeSyncPromise: Promise<void> | null = null;

const syncWithServer = async () => {
  if (activeSyncPromise) return activeSyncPromise;

  activeSyncPromise = (async () => {
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (res.ok) {
        const db = await res.json();
        if (db.news) localStorage.setItem('disporapar_news', JSON.stringify(db.news));
        if (db.events) localStorage.setItem('disporapar_events', JSON.stringify(db.events));
        if (db.gallery) localStorage.setItem('disporapar_gallery', JSON.stringify(db.gallery));
        if (db.services) localStorage.setItem('disporapar_services', JSON.stringify(db.services));
        if (db.officeInfo) localStorage.setItem('disporapar_office_info', JSON.stringify(db.officeInfo));
        if (db.categories) localStorage.setItem('disporapar_categories', JSON.stringify(db.categories));
        if (db.welcomeMessage) localStorage.setItem('disporapar_welcome_message', JSON.stringify(db.welcomeMessage));
        if (db.heroSlides) localStorage.setItem('disporapar_hero_slides', JSON.stringify(db.heroSlides));
        if (db.priorityPrograms) localStorage.setItem('disporapar_priority_programs', JSON.stringify(db.priorityPrograms));
        if (db.homepageSettings) localStorage.setItem('disporapar_homepage_settings', JSON.stringify(db.homepageSettings));
        if (db.kepemudaanCards) localStorage.setItem('disporapar_kepemudaan_cards', JSON.stringify(db.kepemudaanCards));
        if (db.olahragaCards) localStorage.setItem('disporapar_olahraga_cards', JSON.stringify(db.olahragaCards));
        if (db.pariwisataCards) localStorage.setItem('disporapar_pariwisata_cards', JSON.stringify(db.pariwisataCards));
        if (db.bidangBottomCards) localStorage.setItem('disporapar_bidang_bottom_cards', JSON.stringify(db.bidangBottomCards));
        if (db.retribusi) localStorage.setItem('disporapar_retribusi', JSON.stringify(db.retribusi));

        
        // Dispatch update to sync all states
        window.dispatchEvent(new Event('disporapar_data_update'));

      }
    } catch (e) {
      console.error('Failed to sync data with server database', e);
    } finally {
      activeSyncPromise = null;
    }
  })();

  return activeSyncPromise;
};

// Reactive custom hooks that listen to changes
// Initialize with static default data to guarantee SSR matches initial client render
export function useNews(initialData?: News[]) {
  const [data, setData] = useState<News[]>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredNews();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredNews());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredNews());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: News[]) => {
    saveStoredNews(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function useEvents(initialData?: EventAgenda[]) {
  const [data, setData] = useState<EventAgenda[]>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredEvents();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredEvents());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredEvents());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: EventAgenda[]) => {
    saveStoredEvents(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function useGallery(initialData?: typeof initialGallery) {
  const [data, setData] = useState<typeof initialGallery>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredGallery();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredGallery());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredGallery());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: typeof initialGallery) => {
    saveStoredGallery(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function usePublicServices(initialData?: PublicService[]) {
  const [data, setData] = useState<PublicService[]>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredServices();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredServices());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredServices());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: PublicService[]) => {
    saveStoredServices(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function useOfficeInfo(initialData?: typeof initialOfficeInfo) {
  const [data, setData] = useState<typeof initialOfficeInfo>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredOfficeInfo();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredOfficeInfo());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredOfficeInfo());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: typeof initialOfficeInfo) => {
    saveStoredOfficeInfo(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function useCategories(initialData?: CategoryStore) {
  const [data, setData] = useState<CategoryStore>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredCategories();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredCategories());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredCategories());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: CategoryStore) => {
    saveStoredCategories(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function useWelcomeMessage(initialData?: WelcomeMessage) {
  const [data, setData] = useState<WelcomeMessage>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredWelcomeMessage();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredWelcomeMessage());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredWelcomeMessage());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: WelcomeMessage) => {
    saveStoredWelcomeMessage(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function useHeroSlides(initialData?: HeroSlide[]) {
  const [data, setData] = useState<HeroSlide[]>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredHeroSlides();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredHeroSlides());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredHeroSlides());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: HeroSlide[]) => {
    saveStoredHeroSlides(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

// Homepage Section types and initial settings are imported from './data'

export const getStoredHomepageSettings = (): HomepageSettings => {
  if (!isClient) return initialHomepageSettings;
  try {
    const stored = localStorage.getItem('disporapar_homepage_settings');
    if (!stored || stored === 'null' || stored === 'undefined') return initialHomepageSettings;
    const parsed = JSON.parse(stored);
    return (parsed && typeof parsed === 'object') ? { ...initialHomepageSettings, ...parsed } : initialHomepageSettings;
  } catch (e) {
    console.error('Error reading disporapar_homepage_settings from localStorage', e);
    return initialHomepageSettings;
  }
};

export const saveStoredHomepageSettings = (data: HomepageSettings) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_homepage_settings', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'homepageSettings', data })
      }).catch(err => console.error('Failed to save homepage settings to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export function useHomepageSettings(initialData?: HomepageSettings) {
  const [data, setData] = useState<HomepageSettings>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredHomepageSettings();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredHomepageSettings());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredHomepageSettings());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: HomepageSettings) => {
    saveStoredHomepageSettings(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function usePriorityPrograms(initialData?: PriorityProgram[]) {
  const [data, setData] = useState<PriorityProgram[]>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredPriorityPrograms();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredPriorityPrograms());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredPriorityPrograms());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: PriorityProgram[]) => {
    saveStoredPriorityPrograms(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

// ==========================================
// Kepemudaan Cards Store
// ==========================================
export const getStoredKepemudaanCards = (): BidangCard[] => {
  if (!isClient) return initialKepemudaanCards;
  try {
    const stored = localStorage.getItem('disporapar_kepemudaan_cards');
    if (!stored || stored === 'null' || stored === 'undefined') return initialKepemudaanCards;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialKepemudaanCards;
  } catch (e) {
    console.error('Error reading disporapar_kepemudaan_cards', e);
    return initialKepemudaanCards;
  }
};

export const saveStoredKepemudaanCards = (data: BidangCard[]) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_kepemudaan_cards', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'kepemudaanCards', data })
      }).catch(err => console.error('Failed to save kepemudaan cards to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export function useKepemudaanCards(initialData?: BidangCard[]) {
  const [data, setData] = useState<BidangCard[]>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredKepemudaanCards();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredKepemudaanCards());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredKepemudaanCards());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: BidangCard[]) => {
    saveStoredKepemudaanCards(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

// ==========================================
// Olahraga Cards Store
// ==========================================
export const getStoredOlahragaCards = (): BidangCard[] => {
  if (!isClient) return initialOlahragaCards;
  try {
    const stored = localStorage.getItem('disporapar_olahraga_cards');
    if (!stored || stored === 'null' || stored === 'undefined') return initialOlahragaCards;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialOlahragaCards;
  } catch (e) {
    console.error('Error reading disporapar_olahraga_cards', e);
    return initialOlahragaCards;
  }
};

export const saveStoredOlahragaCards = (data: BidangCard[]) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_olahraga_cards', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'olahragaCards', data })
      }).catch(err => console.error('Failed to save olahraga cards to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export function useOlahragaCards(initialData?: BidangCard[]) {
  const [data, setData] = useState<BidangCard[]>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredOlahragaCards();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredOlahragaCards());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredOlahragaCards());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: BidangCard[]) => {
    saveStoredOlahragaCards(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

// ==========================================
// Pariwisata Cards Store
// ==========================================
export const getStoredPariwisataCards = (): BidangCard[] => {
  if (!isClient) return initialPariwisataCards;
  try {
    const stored = localStorage.getItem('disporapar_pariwisata_cards');
    if (!stored || stored === 'null' || stored === 'undefined') return initialPariwisataCards;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialPariwisataCards;
  } catch (e) {
    console.error('Error reading disporapar_pariwisata_cards', e);
    return initialPariwisataCards;
  }
};

export const saveStoredPariwisataCards = (data: BidangCard[]) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_pariwisata_cards', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pariwisataCards', data })
      }).catch(err => console.error('Failed to save pariwisata cards to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export function usePariwisataCards(initialData?: BidangCard[]) {
  const [data, setData] = useState<BidangCard[]>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredPariwisataCards();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredPariwisataCards());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredPariwisataCards());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: BidangCard[]) => {
    saveStoredPariwisataCards(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

// ==========================================
// Bidang Bottom Cards Store
// ==========================================
export const getStoredBidangBottomCards = (): BidangBottomCard[] => {
  if (!isClient) return initialBidangBottomCards;
  try {
    const stored = localStorage.getItem('disporapar_bidang_bottom_cards');
    if (!stored || stored === 'null' || stored === 'undefined') return initialBidangBottomCards;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialBidangBottomCards;
  } catch (e) {
    console.error('Error reading disporapar_bidang_bottom_cards', e);
    return initialBidangBottomCards;
  }
};

export const saveStoredBidangBottomCards = (data: BidangBottomCard[]) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_bidang_bottom_cards', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bidangBottomCards', data })
      }).catch(err => console.error('Failed to save bidang bottom cards to server database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export function useBidangBottomCards(initialData?: BidangBottomCard[]) {
  const [data, setData] = useState<BidangBottomCard[]>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredBidangBottomCards();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredBidangBottomCards());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredBidangBottomCards());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: BidangBottomCard[]) => {
    saveStoredBidangBottomCards(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export const getStoredRetribusi = (): Retribusi[] => {
  if (!isClient) return initialRetribusi;
  try {
    const stored = localStorage.getItem('disporapar_retribusi');
    if (!stored || stored === 'null' || stored === 'undefined') return initialRetribusi;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : initialRetribusi;
  } catch (e) {
    console.error('Error reading disporapar_retribusi', e);
    return initialRetribusi;
  }
};

export const saveStoredRetribusi = (data: Retribusi[]) => {
  if (isClient) {
    try {
      localStorage.setItem('disporapar_retribusi', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'retribusi', data })
      }).catch(err => console.error('Failed to save retribusi to database', err));
    } catch (e) {
      console.error(e);
    }
  }
};

export function useRetribusi(initialData?: Retribusi[]) {
  const [data, setData] = useState<Retribusi[]>(() => {
    if (initialData !== undefined) return initialData;
    return getStoredRetribusi();
  });

  useEffect(() => {
    if (initialData === undefined) {
      setData(getStoredRetribusi());
    }
    
    if (isClient) {
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredRetribusi());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [initialData]);

  const updateData = (newData: Retribusi[]) => {
    saveStoredRetribusi(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}



