'use client';

import { useState, useEffect } from 'react';
import {
  NEWS as initialNews,
  EVENTS as initialEvents,
  GALLERY_PHOTOS as initialGallery,
  PUBLIC_SERVICES as initialServices,
  OFFICE_INFO as initialOfficeInfo,
  News,
  EventAgenda,
  PublicService,
} from './data';

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
        }
      };
    }
    return initialOfficeInfo;
  } catch (e) {
    console.error('Error reading disporapar_office_info from localStorage', e);
    return initialOfficeInfo;
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

// Global synchronization flag to avoid duplicate calls on initial render
let hasSynced = false;

const syncWithServer = async () => {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const db = await res.json();
      if (db.news) localStorage.setItem('disporapar_news', JSON.stringify(db.news));
      if (db.events) localStorage.setItem('disporapar_events', JSON.stringify(db.events));
      if (db.gallery) localStorage.setItem('disporapar_gallery', JSON.stringify(db.gallery));
      if (db.services) localStorage.setItem('disporapar_services', JSON.stringify(db.services));
      if (db.officeInfo) localStorage.setItem('disporapar_office_info', JSON.stringify(db.officeInfo));
      
      // Dispatch update to sync all states
      window.dispatchEvent(new Event('disporapar_data_update'));
    }
  } catch (e) {
    console.error('Failed to sync data with server database', e);
  }
};

// Reactive custom hooks that listen to changes
// Initialize with static default data to guarantee SSR matches initial client render
export function useNews() {
  const [data, setData] = useState<News[]>(initialNews);

  useEffect(() => {
    setData(getStoredNews());
    
    if (!hasSynced && isClient) {
      hasSynced = true;
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredNews());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, []);

  const updateData = (newData: News[]) => {
    saveStoredNews(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function useEvents() {
  const [data, setData] = useState<EventAgenda[]>(initialEvents);

  useEffect(() => {
    setData(getStoredEvents());
    
    if (!hasSynced && isClient) {
      hasSynced = true;
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredEvents());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, []);

  const updateData = (newData: EventAgenda[]) => {
    saveStoredEvents(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function useGallery() {
  const [data, setData] = useState<typeof initialGallery>(initialGallery);

  useEffect(() => {
    setData(getStoredGallery());
    
    if (!hasSynced && isClient) {
      hasSynced = true;
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredGallery());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, []);

  const updateData = (newData: typeof initialGallery) => {
    saveStoredGallery(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function usePublicServices() {
  const [data, setData] = useState<PublicService[]>(initialServices);

  useEffect(() => {
    setData(getStoredServices());
    
    if (!hasSynced && isClient) {
      hasSynced = true;
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredServices());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, []);

  const updateData = (newData: PublicService[]) => {
    saveStoredServices(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}

export function useOfficeInfo() {
  const [data, setData] = useState<typeof initialOfficeInfo>(initialOfficeInfo);

  useEffect(() => {
    setData(getStoredOfficeInfo());
    
    if (!hasSynced && isClient) {
      hasSynced = true;
      syncWithServer();
    }
    
    const handleUpdate = () => {
      setData(getStoredOfficeInfo());
    };

    window.addEventListener('disporapar_data_update', handleUpdate);
    return () => {
      window.removeEventListener('disporapar_data_update', handleUpdate);
    };
  }, []);

  const updateData = (newData: typeof initialOfficeInfo) => {
    saveStoredOfficeInfo(newData);
    setData(newData);
  };

  return [data, updateData] as const;
}
