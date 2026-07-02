'use client';

import React from 'react';
import Image from 'next/image';
import { Quicksand, Outfit } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-logo-disporapar',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-logo-kotategal',
  display: 'swap',
});

interface LogoProps {
  isWhiteNav?: boolean;
  variant?: 'light' | 'dark' | 'colored';
  className?: string;
  showEmblem?: boolean;
}

export default function Logo({ isWhiteNav, variant, className = '', showEmblem = true }: LogoProps) {
  // Determine color theme based on scrolled header, explicit variant, or background darkness
  const isDarkBg = variant === 'dark' || (variant === undefined && !isWhiteNav);

  const orangeColor = '#F3702A';
  const yellowColor = '#FFD200';
  const blueColor = isDarkBg ? '#FFFFFF' : '#353086';

  return (
    <div className={`flex items-center gap-3 ${quicksand.variable} ${outfit.variable} ${className}`}>
      {showEmblem && (
        <div className="relative shrink-0">
          <Image
            src="/assets/tegal-emblem.svg"
            alt="Kota Tegal Shield Emblem"
            width={38}
            height={44}
            className="object-contain w-auto h-9 sm:h-10"
            priority
          />
        </div>
      )}
      <div className="flex flex-col select-none leading-none">
        {/* "disporapar" in rounded custom font */}
        <div
          className="font-logo-disporapar font-bold text-lg sm:text-xl md:text-2xl tracking-normal flex items-baseline leading-none"
          style={{ color: orangeColor, fontFamily: 'var(--font-logo-disporapar)' }}
        >
          <span>d</span>

          {/* Letter i with custom yellow dot */}
          <span className="relative inline-block">
            ı
            <span
              className="absolute -top-[0.08em] left-1/2 -translate-x-1/2 w-[0.21em] h-[0.21em] rounded-full"
              style={{ backgroundColor: yellowColor }}
            />
          </span>

          <span>s</span>
          <span>p</span>

          {/* Letter o with custom double yellow dots (umlaut) */}
          <span className="relative inline-block">
            o
            <span className="absolute -top-[0.08em] left-1/2 -translate-x-1/2 flex gap-[0.06em]">
              <span className="w-[0.21em] h-[0.21em] rounded-full shrink-0" style={{ backgroundColor: yellowColor }} />
              <span className="w-[0.21em] h-[0.21em] rounded-full shrink-0" style={{ backgroundColor: yellowColor }} />
            </span>
          </span>

          <span>r</span>
          <span>a</span>
          <span>p</span>
          <span>a</span>
          <span>r</span>
        </div>

        {/* "KOTA TEGAL" subtext right-aligned */}
        <span
          className="font-logo-kotategal font-extrabold text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] uppercase leading-none self-end mt-1"
          style={{ color: blueColor, fontFamily: 'var(--font-logo-kotategal)' }}
        >
          KOTA TEGAL
        </span>
      </div>
    </div>
  );
}

