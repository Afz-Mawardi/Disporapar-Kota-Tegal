'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGallery } from '@/lib/data-store';
import { Camera, X, ZoomIn, Eye, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GaleriPage() {
  const [galleryPhotos] = useGallery();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePhotoModal, setActivePhotoModal] = useState<typeof galleryPhotos[0] | null>(null);

  // Lock background body scroll when modal is active
  useEffect(() => {
    if (activePhotoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePhotoModal]);

  const categories = ['Semua', 'Pariwisata', 'Olahraga', 'Kepemudaan'];

  const filteredPhotos = galleryPhotos.filter((photo) => {
    return selectedCategory === 'Semua' || photo.category === selectedCategory;
  });

  return (
    <div id="galeri-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">
      
      {/* Editorial Page Header */}
      <section className="relative py-20 sm:py-24 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-65">
          <Image
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1600"
            alt="Galeri Dokumentasi"
            fill
            priority
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Galeri Dokumentasi & Perspektif Suasana
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Dokumentasi Kegiatan Dinas
          </h1>
        </div>
      </section>

      {/* FILTER BUTTON TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-5">
          
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono tracking-wide shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl shrink-0 hidden sm:block border border-slate-100">
            📷 Total: {filteredPhotos.length} Dokumentasi Foto
          </div>

        </div>
      </section>

      {/* GRID LISTING IMAGE CELLS WITH NEXT/IMAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredPhotos.length > 0 ? (
          <div className="w-full max-h-[580px] overflow-y-auto pr-2 scrollbar-thin">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoModal(photo)}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Visual Image container with optimized Next.js Image component */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      sizes="(max-w-711px) 100vw, (max-w-1023px) 50vw, 25vw"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between text-left">
                      <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold text-white bg-[#0E3B66] hover:bg-opacity-90 w-max uppercase tracking-widest font-mono">
                        {photo.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-white">
                        <Eye className="w-3.5 h-3.5 shrink-0 text-white" />
                        <span className="text-[10px] font-bold truncate tracking-wider font-mono uppercase leading-none">Buka Detail</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtitle bottom card information */}
                  <div className="p-5">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug tracking-tight group-hover:text-primary transition-colors">
                      {photo.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 max-w-md mx-auto shadow-sm">
            <Camera className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">Dokumentasi Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-2 font-inter">
              Tidak ada dokumentasi foto dalam kategori penyeleksian saat ini.
            </p>
          </div>
        )}
      </section>

      {/* FULLSCREEN LIGHTBOX POPUP SYSTEM WITH AnimatePresence */}
      <AnimatePresence>
        {activePhotoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhotoModal(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center cursor-default"
            >
              
              {/* Close Button top edge */}
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black hover:text-accent transition-colors cursor-pointer"
                aria-label="Tutup Galeri"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative w-full h-[55vh] sm:h-[70vh] rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={activePhotoModal.imageUrl}
                  alt={activePhotoModal.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Bottom layout label feedback */}
              <div className="text-center mt-6 max-w-2xl">
                <span className="px-2.5 py-0.5 rounded text-[9px] font-bold text-accent uppercase tracking-widest bg-orange-100/10 border border-orange-200/10 font-mono inline-block">
                  {activePhotoModal.category}
                </span>
                <p className="text-white font-bold text-sm sm:text-base tracking-tight leading-snug mt-2.5 select-none">
                  {activePhotoModal.title}
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
