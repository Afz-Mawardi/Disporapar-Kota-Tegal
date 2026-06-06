'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KontakRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/hubungi-kami');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-sans">
      <div className="text-center space-y-4">
        {/* Sleek Minimalist Spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-accent animate-spin mx-auto" />
        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
          MEMINDAHKAN PINDAIAN KE HUBUNGI KAMI...
        </p>
      </div>
    </div>
  );
}
