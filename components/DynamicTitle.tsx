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

    if (pathname.startsWith('/admin')) {
      document.title = 'ADMIN - DISPORAPAR  Kota Tegal';
      return;
    }

    if (pathname.startsWith('/profil')) {
      document.title = 'PROFIL - DISPORAPAR  Kota Tegal';
      return;
    }

    if (
      pathname.startsWith('/kepemudaan') ||
      pathname.startsWith('/olahraga') ||
      pathname.startsWith('/pariwisata') ||
      pathname.startsWith('/bidang')
    ) {
      document.title = 'BIDANG - DISPORAPAR  Kota Tegal';
      return;
    }

    if (pathname.startsWith('/pelayanan')) {
      document.title = 'LAYANAN - DISPORAPAR  Kota Tegal';
      return;
    }

    if (
      pathname.startsWith('/berita') ||
      pathname.startsWith('/agenda') ||
      pathname.startsWith('/galeri') ||
      pathname.startsWith('/publikasi')
    ) {
      document.title = 'PUBLIKASI - DISPORAPAR  Kota Tegal';
      return;
    }

    if (pathname.startsWith('/kontak')) {
      document.title = 'KONTAK - DISPORAPAR  Kota Tegal';
      return;
    }

    // Fallback if none of the above matches
    document.title = 'DISPORAPAR Kota Tegal';
  }, [pathname]);

  return null;
}
