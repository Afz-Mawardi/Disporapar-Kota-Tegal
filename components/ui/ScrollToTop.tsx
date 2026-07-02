'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled down past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Check initial state in case page is loaded already scrolled
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Hide scroll-to-top button on admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg cursor-pointer focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-all duration-300 hover:bg-accent ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Kembali ke atas"
    >
      <ChevronUp className="h-6 w-6 stroke-[2.5]" />
    </button>
  );
}
