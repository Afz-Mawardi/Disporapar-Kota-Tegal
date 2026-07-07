'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import {
  News,
  EventAgenda,
  PublicService,
  WelcomeMessage,
  HeroSlide,
  PriorityProgram,
  HomepageSection,
  HomepageSettings,
  BidangCard,
  Retribusi
} from './types';
import dbData from './db.json';

// Cast JSON mock data as default fallbacks
const initialNews = dbData.news as News[];
const initialEvents = dbData.events as EventAgenda[];
const initialGallery = dbData.gallery as any[];
const initialServices = dbData.services as PublicService[];
const initialOfficeInfo = dbData.officeInfo as any;
const initialWelcomeMessage = dbData.welcomeMessage as WelcomeMessage;
const initialHeroSlides = dbData.heroSlides as HeroSlide[];
const initialPriorityPrograms = dbData.priorityPrograms as PriorityProgram[];
const initialHomepageSettings = dbData.homepageSettings as unknown as HomepageSettings;
const initialKepemudaanCards = dbData.kepemudaanCards as BidangCard[];
const initialOlahragaCards = dbData.olahragaCards as BidangCard[];
const initialPariwisataCards = dbData.pariwisataCards as BidangCard[];
const initialRetribusi = dbData.retribusi as Retribusi[];

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

export const initialBidangBottomCards: BidangBottomCard[] = dbData.bidangBottomCards as BidangBottomCard[];

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
export const saveStoredNews = async (data: News[]): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'news', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_news', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save news to server database', e);
    return false;
  }
};

export const saveStoredEvents = async (data: EventAgenda[]): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'events', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_events', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save events to server database', e);
    return false;
  }
};

export const saveStoredGallery = async (data: typeof initialGallery): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'gallery', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_gallery', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save gallery to server database', e);
    return false;
  }
};

export const saveStoredServices = async (data: PublicService[]): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'services', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_services', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save services to server database', e);
    return false;
  }
};

export const saveStoredOfficeInfo = async (data: typeof initialOfficeInfo): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'officeInfo', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_office_info', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save office info to server database', e);
    return false;
  }
};

export const saveStoredWelcomeMessage = async (data: WelcomeMessage): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'welcomeMessage', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_welcome_message', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save welcome message to server database', e);
    return false;
  }
};

export const saveStoredHeroSlides = async (data: HeroSlide[]): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'heroSlides', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_hero_slides', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save hero slides to server database', e);
    return false;
  }
};

export const saveStoredPriorityPrograms = async (data: PriorityProgram[]): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'priorityPrograms', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_priority_programs', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save priority programs to server database', e);
    return false;
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

export const saveStoredCategories = async (data: CategoryStore): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'categories', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_categories', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save categories to server database', e);
    return false;
  }
};

// Shared Promise reference to deduplicate parallel API calls on mount
let activeSyncPromise: Promise<void> | null = null;
let isSyncedGlobal = false;
let adminSyncedGlobal = false;

const syncWithServer = async (force = false) => {
  if (isSyncedGlobal && !force) return;
  if (activeSyncPromise) return activeSyncPromise;

  activeSyncPromise = (async () => {
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (res.ok) {
        const db = await res.json();
        
        // Check if database connection failed and fell back to db.json
        if (db.isFallback) {
          const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
          if (isAdmin) {
            localStorage.removeItem('disporapar_admin_login_time');
            localStorage.removeItem('disporapar_admin_last_activity');
            signOut({ callbackUrl: '/login.admin?reason=db_error' });
            return;
          }
        }

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

        isSyncedGlobal = true;
        
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
function useDataStore<T>(
  initialData: T | undefined,
  fallbackData: T,
  getStored: () => T,
  saveStored: (data: T) => any
) {
  const [data, setData] = useState<T>(initialData !== undefined ? initialData : fallbackData);

  useEffect(() => {
    setData(getStored());
    
    if (isClient) {
      const isAdmin = window.location.pathname.startsWith('/admin');
      if (isAdmin && !adminSyncedGlobal) {
        adminSyncedGlobal = true;
        syncWithServer(true);
      } else {
        syncWithServer();
      }
    }
    
    const handleUpdate = () => {
      setData(getStored());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, [getStored]);

  const updateData = async (newData: T): Promise<boolean> => {
    const result = saveStored(newData);
    if (result instanceof Promise) {
      const success = await result;
      if (success) {
        setData(newData);
      }
      return success;
    } else {
      setData(newData);
      return true;
    }
  };

  return [data, updateData] as const;
}

export function useNews(initialData?: News[]) {
  return useDataStore(initialData, initialNews, getStoredNews, saveStoredNews);
}

export function useEvents(initialData?: EventAgenda[]) {
  return useDataStore(initialData, initialEvents, getStoredEvents, saveStoredEvents);
}

export function useGallery(initialData?: typeof initialGallery) {
  return useDataStore(initialData, initialGallery, getStoredGallery, saveStoredGallery);
}

export function usePublicServices(initialData?: PublicService[]) {
  return useDataStore(initialData, initialServices, getStoredServices, saveStoredServices);
}

export function useOfficeInfo(initialData?: typeof initialOfficeInfo) {
  return useDataStore(initialData, initialOfficeInfo, getStoredOfficeInfo, saveStoredOfficeInfo);
}

export function useCategories(initialData?: CategoryStore) {
  return useDataStore(initialData, initialCategories, getStoredCategories, saveStoredCategories);
}

export function useWelcomeMessage(initialData?: WelcomeMessage) {
  return useDataStore(initialData, initialWelcomeMessage, getStoredWelcomeMessage, saveStoredWelcomeMessage);
}

export function useHeroSlides(initialData?: HeroSlide[]) {
  return useDataStore(initialData, initialHeroSlides, getStoredHeroSlides, saveStoredHeroSlides);
}

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

export const saveStoredHomepageSettings = async (data: HomepageSettings): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'homepageSettings', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_homepage_settings', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save homepage settings to server database', e);
    return false;
  }
};

export function useHomepageSettings(initialData?: HomepageSettings) {
  return useDataStore(initialData, initialHomepageSettings, getStoredHomepageSettings, saveStoredHomepageSettings);
}

export function usePriorityPrograms(initialData?: PriorityProgram[]) {
  return useDataStore(initialData, initialPriorityPrograms, getStoredPriorityPrograms, saveStoredPriorityPrograms);
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

export const saveStoredKepemudaanCards = async (data: BidangCard[]): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'kepemudaanCards', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_kepemudaan_cards', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save kepemudaan cards to server database', e);
    return false;
  }
};

export function useKepemudaanCards(initialData?: BidangCard[]) {
  return useDataStore(initialData, initialKepemudaanCards, getStoredKepemudaanCards, saveStoredKepemudaanCards);
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

export const saveStoredOlahragaCards = async (data: BidangCard[]): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'olahragaCards', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_olahraga_cards', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save olahraga cards to server database', e);
    return false;
  }
};

export function useOlahragaCards(initialData?: BidangCard[]) {
  return useDataStore(initialData, initialOlahragaCards, getStoredOlahragaCards, saveStoredOlahragaCards);
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

export const saveStoredPariwisataCards = async (data: BidangCard[]): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pariwisataCards', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_pariwisata_cards', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save pariwisata cards to server database', e);
    return false;
  }
};

export function usePariwisataCards(initialData?: BidangCard[]) {
  return useDataStore(initialData, initialPariwisataCards, getStoredPariwisataCards, saveStoredPariwisataCards);
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

export const saveStoredBidangBottomCards = async (data: BidangBottomCard[]): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'bidangBottomCards', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_bidang_bottom_cards', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save bidang bottom cards to server database', e);
    return false;
  }
};

export function useBidangBottomCards(initialData?: BidangBottomCard[]) {
  return useDataStore(initialData, initialBidangBottomCards, getStoredBidangBottomCards, saveStoredBidangBottomCards);
}

// ==========================================
// Retribusi Store
// ==========================================
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

export const saveStoredRetribusi = async (data: Retribusi[]): Promise<boolean> => {
  if (!isClient) return false;
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'retribusi', data })
    });
    if (res.ok) {
      localStorage.setItem('disporapar_retribusi', JSON.stringify(data));
      window.dispatchEvent(new Event('disporapar_data_update'));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save retribusi to database', e);
    return false;
  }
};

export function useRetribusi(initialData?: Retribusi[]) {
  return useDataStore(initialData, initialRetribusi, getStoredRetribusi, saveStoredRetribusi);
}



