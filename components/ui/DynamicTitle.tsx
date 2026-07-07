'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const updateTitle = () => {
      const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/login.admin');
      const expectedTitle = isAdmin ? 'Admin - DISPORAPAR Kota Tegal' : 'DISPORAPAR Kota Tegal';
      if (document.title !== expectedTitle) {
        document.title = expectedTitle;
      }
    };

    // Run initially to set the correct title
    updateTitle();

    // Set up MutationObserver to prevent title overrides (e.g. during Next.js HMR or route changes)
    const observer = new MutationObserver(() => {
      updateTitle();
    });

    observer.observe(document.head, {
      subtree: true,
      childList: true,
      characterData: true
    });

    // Set up an interval as a fallback for HMR/fast-refresh edge cases
    const interval = setInterval(updateTitle, 200);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [pathname]);

  return null;
}
