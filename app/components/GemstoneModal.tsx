'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Re-using the types from the main collection component
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

interface GemstoneModalProps {
  gemstone: Gemstone | null;
  onClose: () => void;
}

export default function GemstoneModal({ gemstone, onClose }: GemstoneModalProps) {
  const [isShowing, setIsShowing] = useState(false);
  const [activeMedia, setActiveMedia] = useState<GemstoneMedia | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (gemstone) {
      setIsShowing(true);
      setActiveMedia(gemstone.media[0] || null);
      document.body.style.overflow = 'hidden';
      // move focus into the dialog for keyboard and screen-reader users
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      setIsShowing(false);
      document.body.style.overflow = '';
    }
  }, [gemstone]);

  useEffect(() => {
    if (!gemstone) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gemstone, onClose]);

  if (!gemstone) return null;

  return (
      <div
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gemstone-modal-title"
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 transition-opacity duration-500 ease-[var(--ease-lux)] ${
              isShowing ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundColor: 'rgba(26, 24, 20, 0.85)', backdropFilter: 'blur(12px)' }}
      >
        <div
            onClick={(e) => e.stopPropagation()}
            className={`relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto transition-all duration-700 ease-[var(--ease-lux)] ${
                isShowing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
        >
          {/* signature hairline across the top of the panel */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 text-stone hover:text-gold hover:rotate-90 transition-all duration-500 ease-[var(--ease-lux)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12">
            {/* Media Column */}
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/3] relative bg-stone/5 flex items-center justify-center overflow-hidden">
                <div key={activeMedia?.file_path} className="absolute inset-0 fade-media">
                  {activeMedia?.type === 'image' ? (
                      <Image
                          src={activeMedia.file_path}
                          alt={gemstone.name}
                          fill
                          className="object-contain"
                      />
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
              <h2 id="gemstone-modal-title" className="font-serif text-4xl italic text-stone mb-4">
                {gemstone.name}
              </h2>
              <p className="text-mid text-lg leading-relaxed mb-6">{gemstone.description}</p>

              <div className="border-t border-stone/10 pt-6">
                <h3 className="text-[11px] uppercase tracking-[0.25em] text-mid/60 mb-4">
                  Specifications
                </h3>
                <ul className="space-y-3">
                  {gemstone.specs.map((spec, i) => (
                      <li
                          key={spec.label}
                          className={`flex items-baseline gap-3 transition-all duration-500 ease-[var(--ease-lux)] ${
                              isShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                          }`}
                          style={{ transitionDelay: `${200 + i * 60}ms` }}
                      >
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
                    href={`#contact?gemstone=${gemstone.slug}`}
                    onClick={onClose}
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

        <style jsx>{`
                .fade-media {
                    animation: fadeMedia 400ms var(--ease-lux, ease) both;
                }
                @keyframes fadeMedia {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .fade-media {
                        animation: none;
                    }
                }
            `}</style>
      </div>
  );
}