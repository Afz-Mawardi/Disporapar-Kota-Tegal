'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useOlahragaCards, useBidangBottomCards } from '@/lib/data-store';
import { MapPin, Users, Ticket, Compass, Clock, Calendar, Circle } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  MapPin: MapPin,
  Clock: Clock,
  Users: Users,
  Ticket: Ticket,
  Calendar: Calendar,
  Circle: (props: any) => (
    <span className="h-3.5 w-3.5 flex items-center justify-center shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
    </span>
  )
};

export default function OlahragaPageClient({
  initialOlahragaCards,
  initialBidangBottomCards
}: {
  initialOlahragaCards: any[];
  initialBidangBottomCards: any[];
}) {
  const [olahragaCards] = useOlahragaCards(initialOlahragaCards);
  const [bottomCards] = useBidangBottomCards(initialBidangBottomCards);
  const bottomCard = bottomCards.find(c => c.id === 'olahraga') || {
    tag: 'Pemberdayaan Atlet Daerah',
    title: 'Pemusatan Latihan & Pembinaan Olahraga Berkelanjutan',
    description: 'DISPORAPAR bersinergi erat bersama KONI (Komite Olahraga Nasional Indonesia) Kota Tegal secara terpadu mengelola pemusatan latihan atlet usia dini berkala, peningkatan kualifikasi lisensi pelatih nasional, serta penyelenggaraan bonus apresiasi kejuaraan PORPROV & PON.',
    buttonText: 'Hubungi Layanan Atlet & KONI',
    buttonLink: '/pelayanan',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
    sectionTag: 'Sarana & Fasilitas Olahraga',
    sectionTitle: 'Pusat Kegiatan Keolahragaan Kota Tegal'
  };

  return (
    <div id="olahraga-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">

      {/* Immersive Editorial Hero Header */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Bidang Olahraga
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Pembinaan Keolahragaan
          </h1>
        </div>
      </section>

      {/* STRATEGIC PROGRAMS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="space-y-8 text-left mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {bottomCard.sectionTitle || 'Pusat Kegiatan Keolahragaan Kota Tegal'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {olahragaCards.map((venue) => (
            <div
              key={venue.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              {/* Visual Image Frame with hover zoom */}
              <div className="relative aspect-[21/9] md:aspect-16/10 w-full overflow-hidden bg-slate-50 rounded-t-2xl">
                {venue.imageUrl ? (
                  <Image
                    src={venue.imageUrl}
                    alt={venue.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 gap-1.5 p-4">
                    <Compass className="w-8 h-8 opacity-60 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 font-mono">Gambar Tidak Tersedia</span>
                  </div>
                )}
              </div>

              {/* Card Body Details */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-primary transition-colors leading-snug">
                    {venue.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-inter line-clamp-3">
                    {venue.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100/60 space-y-2.5 text-xs text-slate-600 font-inter">
                    {(venue.details && venue.details.length > 0 ? venue.details : [
                      { value: venue.location, icon: venue.locationIcon || 'MapPin' },
                      { value: venue.capacity, icon: venue.capacityIcon || 'Users' },
                      { value: venue.price, icon: venue.priceIcon || 'Ticket' }
                    ]).map((det: any, idx: number) => {
                      if (!det.value) return null;
                      const IconComponent = det.icon && iconMap[det.icon] ? iconMap[det.icon] : MapPin;
                      const iconColor = idx === 0 ? 'text-accent' : idx === 1 ? 'text-secondary' : 'text-emerald-500';
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <IconComponent className={`h-3.5 w-3.5 ${iconColor} shrink-0`} />
                          <span className="truncate">{det.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Facilities details */}
                {venue.facilities && venue.facilities.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100/60">
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 font-mono">
                      {venue.facilitiesTitle || 'Fasilitas Area'}:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {venue.facilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-lg text-[10px] text-slate-600 font-medium font-inter"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STRATEGIC COACHING / ATHLETES PRESTASI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-14 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Coach Details Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {bottomCard.title}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-inter font-light">
                {bottomCard.description}
              </p>

              <div className="pt-2">
                <Link
                  href={(bottomCard as any).buttonLink || '/pelayanan'}
                  className="px-6 py-3.5 bg-primary text-white font-bold text-xs uppercase tracking-widest font-mono rounded-xl hover:bg-primary-900 transition-all shadow-md inline-block"
                >
                  {bottomCard.buttonText}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative group">
              <div className="relative aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
                <Image
                  src={bottomCard.imageUrl}
                  alt={bottomCard.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
