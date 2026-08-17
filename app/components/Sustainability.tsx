'use client';

import Image from 'next/image';
import { useInView } from '../hooks/useInView';

const pillars = [
  { label: 'Ethical Sourcing', detail: 'Every stone traced to its origin' },
  { label: 'Fair Partnerships', detail: 'Direct, honorable terms with miners' },
  { label: 'Land Stewardship', detail: 'Restoration built into every mine' },
];

export default function Sustainability() {
  const [textRef, textInView] = useInView({ threshold: 0.5, triggerOnce: true });
  const [imageRef, imageInView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
      <section id="sustainability" className="relative py-24 sm:py-32 bg-white overflow-hidden">
        {/* watermark numeral continues the sequence started in "Our Heritage" (01) */}
        <span
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-6 font-serif italic text-[220px] leading-none text-stone/[0.03] select-none hidden lg:block"
        >
                02
            </span>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Image */}
            <div ref={imageRef}>
              <div className="relative">
                {/* offset frame — mirrored to the top-left, in call-and-response with About's bottom-right frame */}
                <div
                    className={`absolute -top-4 -left-4 md:-top-6 md:-left-6 w-full h-full border border-gold/40 transition-all duration-1000 ${
                        imageInView ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-2 translate-y-2'
                    }`}
                    style={{ transitionTimingFunction: 'var(--ease-lux)' }}
                    aria-hidden
                />
                <div className="relative aspect-[4/3] overflow-hidden group">
                  <Image
                      src="/images/BlueHuesSustainability.jpg"
                      alt="A rough, uncut sapphire held in hand"
                      fill
                      className={`object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04] ${
                          imageInView ? 'scale-100' : 'scale-105'
                      }`}
                      style={{ transitionTimingFunction: 'var(--ease-lux)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <p className="absolute bottom-5 left-5 text-[11px] tracking-[0.25em] uppercase text-white/85">
                    Hand to Hand, Ethically Sourced
                  </p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div
                ref={textRef}
                className={`text-mid transition-all duration-1000 ${
                    textInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionTimingFunction: 'var(--ease-lux)' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-gold/70" />
                <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-medium">
                                Our Commitment
                            </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl italic text-stone mb-8">
                Our Sustainability
              </h2>

              <div className="space-y-5 text-lg tracking-wide leading-relaxed">
                <p className="first-letter:font-serif first-letter:italic first-letter:text-gold first-letter:text-6xl first-letter:mr-2 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1">
                  We believe the beauty of a gemstone is intrinsically linked to its{' '}
                  <span className="text-gold">journey</span>. Our commitment is to ethical and
                  sustainable practices, ensuring that the splendor of our gems does not come at the
                  expense of our land or our people.
                </p>
                <p>
                  From <span className="font-serif italic text-xl text-stone">responsible</span>{' '}
                  mining that respects the local environment to fair partnerships with our miners,
                  we strive for a process that is transparent and honorable. We are dedicated to
                  preserving Sri Lanka's natural heritage for the future.
                </p>
              </div>

              {/* Three parallel commitments — a list, not a sequence, so no numbering */}
              <div
                  className={`mt-10 space-y-4 transition-all duration-1000 delay-300 ${
                      textInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionTimingFunction: 'var(--ease-lux)' }}
              >
                {pillars.map((pillar) => (
                    <div key={pillar.label} className="flex items-start gap-4 py-3 border-t border-stone/10 first:border-t-0 first:pt-0">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                      <div>
                        <p className="text-stone font-medium tracking-wide">{pillar.label}</p>
                        <p className="text-sm text-mid/70 mt-0.5">{pillar.detail}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}