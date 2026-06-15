'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname === '/') {
      document.title = 'DISPORAPAR Kota Tegal';
      return;
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      document.title = 'DISPORAPAR Kota Tegal';
      return;
    }

    const lastSegment = segments[segments.length - 1];
    
    // Replace hyphens/underscores with spaces
    const cleanSegment = lastSegment.replace(/[-_]/g, ' ');

    // Capitalize each word
    const capitalized = cleanSegment
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    document.title = `${capitalized} - DISPORAPAR Kota tegal`;
  }, [pathname]);

  return null;
}
