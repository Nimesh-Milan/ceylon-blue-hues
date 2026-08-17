'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

// Define types for our data structure
interface GemstoneSpec {
  label: string;
  value: string;
}

interface GemstoneMedia {
  file_path: string;
  type: 'image' | 'video';
}

interface Gemstone {
  id: number;
  name: string;
  slug: string;
  description: string;
  specs: GemstoneSpec[];
  media: GemstoneMedia[];
}

const GemstonePage = () => {
  const params = useParams();
  const slug = params.slug;
  const [gemstone, setGemstone] = useState<Gemstone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<GemstoneMedia | null>(null);
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (slug) {
      async function fetchGemstone() {
        try {
          const response = await fetch(`/api/gemstones/${slug}`);
          if (!response.ok) {
            throw new Error('Gemstone not found');
          }
          const data = await response.json();
          setGemstone(data);
          setActiveMedia(data.media[0] || null);
          requestAnimationFrame(() => setIsShowing(true));
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      }
      fetchGemstone();
    }
  }, [slug]);

  if (loading) {
    return (
        <>
          <Header />
          <main className="py-24 sm:py-32">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="aspect-[4/3] bg-stone/[0.06] relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="flex flex-col gap-4 pt-2">
                  <div className="h-10 bg-stone/[0.08] w-2/3 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                  <div className="h-4 bg-stone/[0.06] w-full relative overflow-hidden mt-4">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                  <div className="h-4 bg-stone/[0.06] w-5/6 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
          <style jsx>{`
                    .shimmer {
                        background: linear-gradient(90deg, transparent 0%, rgba(190, 158, 90, 0.12) 50%, transparent 100%);
                        background-size: 200% 100%;
                        animation: shimmer 1.8s ease-in-out infinite;
                    }
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .shimmer { animation: none; }
                    }
                `}</style>
        </>
    );
  }

  if (error || !gemstone) {
    return (
        <>
          <Header />
          <main className="py-32 sm:py-40 text-center px-4">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">404</p>
            <h1 className="font-serif italic text-4xl text-stone mb-4">This stone couldn't be found</h1>
            <p className="text-mid/70 mb-8 max-w-sm mx-auto">
              It may have been reserved, or the link may be out of date.
            </p>
            <a
                href="/#gemstones"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-gold hover:text-stone transition-colors duration-300"
            >
              ← Back to Collection
            </a>
          </main>
          <Footer />
        </>
    );
  }

  return (
      <>
        <Header />
        <main className="py-24 sm:py-32">
          <div
              className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
                  isShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionTimingFunction: 'var(--ease-lux)' }}
          >
            <a
                href="/#gemstones"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-mid/60 hover:text-gold transition-colors duration-300 mb-10"
            >
              ← Back to Collection
            </a>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Media Column */}
              <div className="flex flex-col gap-4">
                <div className="aspect-[4/3] relative bg-stone/5 flex items-center justify-center overflow-hidden">
                  <div key={activeMedia?.file_path} className="absolute inset-0 fade-media">
                    {activeMedia?.type === 'image' ? (
                        <Image src={activeMedia.file_path} alt={gemstone.name} fill className="object-contain" />
                    ) : (
                        <video
                            key={activeMedia?.file_path}
                            src={activeMedia?.file_path}
                            controls
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-contain"
                        />
                    )}
                  </div>
                </div>

                {gemstone.media.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {gemstone.media.map((mediaItem) => {
                        const isActive = activeMedia?.file_path === mediaItem.file_path;
                        return (
                            <button
                                key={mediaItem.file_path}
                                onClick={() => setActiveMedia(mediaItem)}
                                aria-label={`Show ${mediaItem.type}`}
                                aria-pressed={isActive}
                                className={`aspect-square relative overflow-hidden border transition-all duration-300 ease-[var(--ease-lux)] ${
                                    isActive ? 'border-gold' : 'border-transparent hover:border-stone/20'
                                }`}
                            >
                              {mediaItem.type === 'image' ? (
                                  <Image
                                      src={mediaItem.file_path}
                                      alt={`${gemstone.name} thumbnail`}
                                      fill
                                      className="object-cover"
                                  />
                              ) : (
                                  <div className="w-full h-full bg-stone/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-stone/40" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm11.586 6.586l-4.293-4.293A1 1 0 0010 7v6a1 1 0 001.293.707l4.293-4.293a1 1 0 000-1.414z" />
                                    </svg>
                                  </div>
                              )}
                            </button>
                        );
                      })}
                    </div>
                )}
              </div>

              {/* Details Column */}
              <div className="flex flex-col">
                            <span className="text-[11px] tracking-[0.3em] uppercase text-gold font-medium mb-3">
                                Certificate of Provenance
                            </span>
                <h1 className="font-serif text-4xl lg:text-5xl italic text-stone mb-4">{gemstone.name}</h1>
                <p className="text-mid text-lg leading-relaxed mb-6">{gemstone.description}</p>

                <div className="border-t border-stone/10 pt-6">
                  <h3 className="text-[11px] uppercase tracking-[0.25em] text-mid/60 mb-4">
                    Specifications
                  </h3>
                  <ul className="space-y-3">
                    {gemstone.specs.map((spec) => (
                        <li key={spec.label} className="flex items-baseline gap-3">
                                            <span className="text-stone/70 text-sm tracking-wide whitespace-nowrap">
                                                {spec.label}
                                            </span>
                          <span className="flex-1 border-b border-dotted border-stone/25 translate-y-[-3px]" />
                          <span className="font-medium text-stone whitespace-nowrap">{spec.value}</span>
                        </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-10">
                  <a
                      href={`/contact?gemstone=${gemstone.slug}`}
                      className="group relative w-full flex items-center justify-center overflow-hidden py-4 px-6 text-white text-[11px] font-medium tracking-[0.25em] uppercase"
                  >
                    <span className="absolute inset-0 bg-stone transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-0 origin-right" />
                    <span className="absolute inset-0 bg-gold scale-x-0 transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-100 origin-left" />
                    <span className="relative">Inquire About This Gemstone</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />

        <style jsx>{`
                .fade-media {
                    animation: fadeMedia 400ms var(--ease-lux, ease) both;
                }
                @keyframes fadeMedia {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .fade-media { animation: none; }
                }
            `}</style>
      </>
  );
};

export default GemstonePage;