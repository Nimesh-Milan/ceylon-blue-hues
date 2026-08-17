'use client';

import Image from 'next/image';
import { useInView } from '../hooks/useInView';

export default function About() {
  const [textRef, textInView] = useInView({ threshold: 0.5, triggerOnce: true });
  const [imageRef, imageInView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
      <section id="about" className="relative py-24 sm:py-32 bg-cream overflow-hidden">
        {/* faint watermark numeral — quiet editorial texture, not a UI element */}
        <span
            aria-hidden
            className="pointer-events-none absolute -top-10 -left-6 font-serif italic text-[220px] leading-none text-stone/[0.03] select-none hidden lg:block"
        >
                01
            </span>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Text */}
            <div
                ref={textRef}
                className={`order-2 md:order-1 text-mid transition-all duration-1000 ${
                    textInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionTimingFunction: 'var(--ease-lux)' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-gold/70" />
                <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-medium">
                                The Story
                            </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl italic text-stone mb-8">
                Our Heritage
              </h2>

              <div className="space-y-5 text-lg tracking-wide leading-relaxed">
                <p className="first-letter:font-serif first-letter:italic first-letter:text-gold first-letter:text-6xl first-letter:mr-2 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1">
                  For <span className="text-gold">generations</span>, our family has been deeply
                  rooted in the rich soil of Sri Lanka, unearthing the treasures that lie beneath.
                  Blue Hues Ceylon is the culmination of this legacy, a bridge between the ancient
                  traditions of gemstone mining and the modern world.
                </p>
                <p>
                  We are not just merchants; we are{' '}
                  <span className="font-serif italic text-xl text-stone">custodians</span> of a
                  craft passed down through time. Each stone we present is a piece of our island's
                  story, handled with the reverence and expertise that only comes from a lifetime
                  of dedication.
                </p>
              </div>

              <div
                  className={`mt-10 flex items-center gap-6 transition-all duration-1000 delay-300 ${
                      textInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionTimingFunction: 'var(--ease-lux)' }}
              >
                <div>
                  <p className="font-serif italic text-3xl text-stone">3rd</p>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-mid/60 mt-1">
                    Generation
                  </p>
                </div>
                <span className="h-10 w-px bg-stone/15" />
                <div>
                  <p className="font-serif italic text-3xl text-stone">Ratnapura</p>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-mid/60 mt-1">
                    City of Gems
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div ref={imageRef} className="order-1 md:order-2">
              <div className="relative">
                {/* offset frame — sits behind the photo as a quiet signature */}
                <div
                    className={`absolute -top-4 -right-4 md:-top-6 md:-right-6 w-full h-full border border-gold/40 transition-all duration-1000 ${
                        imageInView ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-2 translate-y-2'
                    }`}
                    style={{ transitionTimingFunction: 'var(--ease-lux)' }}
                    aria-hidden
                />
                <div className="relative aspect-[4/3] overflow-hidden group">
                  <Image
                      src="/images/sri-lanka-mines.jpg"
                      alt="Artisanal gemstone mining in Sri Lanka"
                      fill
                      className={`object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04] ${
                          imageInView ? 'scale-100' : 'scale-105'
                      }`}
                      style={{ transitionTimingFunction: 'var(--ease-lux)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <p className="absolute bottom-5 left-5 text-[11px] tracking-[0.25em] uppercase text-white/85">
                    Ratnapura, Sri Lanka
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}