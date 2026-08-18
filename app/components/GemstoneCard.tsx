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
  const primaryMedia = gemstone.media[0];
  const carat = gemstone.specs.find((s) => s.label.toLowerCase().includes('carat'));

  return (
      <Link
          href={`/gemstones/${gemstone.slug}`}
          className="group cursor-pointer block focus-visible:outline-none"
      >
        {/* Portrait crop reads more like a jewelry plate than a landscape product photo */}
        <div className="relative aspect-[3/4] bg-stone/5 overflow-hidden">
          {primaryMedia ? (
              <Image
                  src={primaryMedia.file_path}
                  alt={gemstone.name}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-[1.03]"
              />
          ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif italic text-stone/20 text-lg">Blue Hues Ceylon</span>
              </div>
          )}
        </div>

        {/* A single hairline is the only "interaction" — quiet, not decorative chrome on the image itself */}
        <div className="mt-5 h-px w-full bg-stone/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gold scale-x-0 origin-left transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-x-100" />
        </div>

        <div className="pt-5 text-center">
          <h3 className="font-serif text-2xl italic text-stone transition-colors duration-500 ease-[var(--ease-lux)] group-hover:text-gold">
            {gemstone.name}
          </h3>
          <p className="text-[11px] text-mid/60 mt-2 tracking-[0.25em] uppercase">
            {gemstone.category}
            {carat && <span className="text-mid/40"> · {carat.value}</span>}
          </p>
        </div>
      </Link>
  );
}