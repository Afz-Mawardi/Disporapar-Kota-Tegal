'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGallery, useCategories } from '@/lib/data-store';
import { Camera, X, ZoomIn, Eye, ArrowRight, HelpCircle, Search, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GaleriPageClient({
  initialGallery,
  initialCategories
}: {
  initialGallery: any[];
  initialCategories: any;
}) {
  const [galleryPhotos] = useGallery(initialGallery);
  const [categoriesStore] = useCategories(initialCategories);
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  const categories = ['Semua', ...categoriesStore.gallery];

  const filteredPhotos = galleryPhotos.filter((photo) => {
    const matchesCategory = selectedCategory === 'Semua' || photo.category === selectedCategory;
    const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="galeri-page" className="w-full bg-[#F8FAFC] pb-24 font-sans text-slate-800">
      
      {/* Editorial Page Header */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-transparent tracking-widest uppercase bg-transparent border border-transparent px-3.5 py-1.5 rounded-full inline-block font-mono mb-4 select-none pointer-events-none" aria-hidden="true">
            Galeri Dokumentasi & Perspektif Suasana
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 font-sans leading-none">
            Dokumentasi Kegiatan Dinas
          </h1>
        </div>
      </section>

      {/* FILTER & SEARCH INTERACTIVE BAR */}
      <section className="sticky top-[68px] lg:top-[76px] z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-4">
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-slate-100/80 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between transition-all duration-300">
          
          {/* Category Chips Tab Panel */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase font-mono transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-opacity-95'
                    : 'bg-slate-50 text-slate-500 hover:text-[#0E3B66] hover:bg-slate-100 border border-slate-200/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box block - Expanded for ultra elegance */}
          <div className="relative w-full lg:w-96 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Cari dokumentasi foto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 transition-all font-medium font-inter"
            />
          </div>

        </div>
      </section>

      {/* GRID LISTING IMAGE CELLS WITH NEXT/IMAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoModal(photo)}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 aspect-square"
                >
                  {/* Visual Image container with optimized Next.js Image component */}
                  <div className="relative w-full h-full overflow-hidden bg-slate-100 flex items-center justify-center">
                    {photo.imageUrl ? (
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        sizes="(max-w-711px) 100vw, (max-w-1023px) 50vw, 25vw"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
                        <ImageIcon className="w-8 h-8 opacity-60 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 font-mono">Gambar Tidak Tersedia</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between text-left">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold text-white bg-primary hover:bg-opacity-90 w-max uppercase tracking-widest font-mono">
                          {photo.category}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <h4 className="font-bold text-xs sm:text-sm text-white leading-snug tracking-tight">
                          {photo.title}
                        </h4>
                        <div className="flex items-center gap-1 text-white self-end mt-1">
                          <Eye className="w-3.5 h-3.5 shrink-0 text-white" />
                          <span className="text-[10px] font-bold tracking-wider font-mono uppercase leading-none">Buka Detail</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer"
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

              <div className="relative w-full h-[55vh] sm:h-[70vh] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center">
                {activePhotoModal.imageUrl ? (
                  <Image
                    src={activePhotoModal.imageUrl}
                    alt={activePhotoModal.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                    <ImageIcon className="w-12 h-12 opacity-60 text-accent" />
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-450 font-mono">Gambar Tidak Tersedia</span>
                  </div>
                )}
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
