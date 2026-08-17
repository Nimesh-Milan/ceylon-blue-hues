import Image from 'next/image';
import Link from 'next/link';

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
  category: string;
  specs: GemstoneSpec[];
  media: GemstoneMedia[];
}

interface GemstoneCardProps {
  gemstone: Gemstone;
}

export default function GemstoneCard({ gemstone }: GemstoneCardProps) {
  const primaryMedia = gemstone.media.find((m) => m.type === 'image') || gemstone.media[0];
  const carat = gemstone.specs.find((s) => s.label.toLowerCase().includes('carat'));

  return (
      <Link
          href={`/gemstones/${gemstone.slug}`}
          className="group cursor-pointer block focus-visible:outline-none"
      >
        <div className="relative aspect-[4/3] bg-stone/5 overflow-hidden">
          {primaryMedia ? (
              <Image
                  src={primaryMedia.file_path}
                  alt={gemstone.name}
                  fill
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease-lux)] group-hover:scale-[1.06]"
              />
          ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif italic text-stone/20 text-lg">Blue Hues Ceylon</span>
              </div>
          )}

          {/* inset frame reveal — a quiet echo of the offset frames used elsewhere on the site */}
          <div className="absolute inset-3 border border-white/0 group-hover:border-white/50 transition-all duration-500 ease-[var(--ease-lux)] pointer-events-none" />

          {/* scrim + view prompt, only surfaces on hover/focus */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[var(--ease-lux)]" />
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[var(--ease-lux)]">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white">View Stone</span>
            <span className="text-white text-xs transition-transform duration-500 ease-[var(--ease-lux)] group-hover:translate-x-0.5">
                        →
                    </span>
          </div>

          {carat && (
              <span className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1">
                        {carat.value}
                    </span>
          )}
        </div>

        <div className="pt-6 pb-2 text-center transition-transform duration-500 ease-[var(--ease-lux)] group-hover:-translate-y-0.5">
          <h3 className="relative font-serif text-2xl text-stone inline-block">
            {gemstone.name}
            <span className="absolute bottom-0 left-0 w-full h-px bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[var(--ease-lux)] origin-left" />
          </h3>
          <p className="text-[11px] text-mid/70 mt-2 tracking-[0.25em] uppercase">
            {gemstone.category}
          </p>
        </div>
      </Link>
  );
}