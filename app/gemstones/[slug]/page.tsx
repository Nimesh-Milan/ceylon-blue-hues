import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import GemstoneGallery from '@/app/components/GemstoneGallery';
import { Metadata } from 'next';
import Link from 'next/link';

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
  origin?: string;
  category?: string;
  specs: GemstoneSpec[];
  media: GemstoneMedia[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getGemstone(slug: string): Promise<Gemstone | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/gemstones/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch gemstone:', error);
    return null;
  }
}

// --- SEO: Dynamic metadata per gemstone ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gemstone = await getGemstone(slug);

  if (!gemstone) {
    return {
      title: 'Stone Not Found | Ceylon Blue Hues',
      description: 'This gemstone could not be found.',
    };
  }

  const primaryImage = gemstone.media.find((m) => m.type === 'image');
  const caratSpec = gemstone.specs.find((s) =>
    s.label.toLowerCase().includes('carat')
  );

  const description =
    gemstone.description.length > 155
      ? gemstone.description.slice(0, 152) + '…'
      : gemstone.description ||
        `Discover the ${gemstone.name} — an ethically sourced Sri Lankan gemstone from Ceylon Blue Hues.`;

  return {
    title: `${gemstone.name}${caratSpec ? ` · ${caratSpec.value}` : ''} | Ceylon Blue Hues`,
    description,
    openGraph: {
      title: gemstone.name,
      description,
      images: primaryImage
        ? [{ url: primaryImage.file_path, alt: gemstone.name }]
        : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: gemstone.name,
      description,
      images: primaryImage ? [primaryImage.file_path] : [],
    },
  };
}

// --- SSG: Pre-render all gemstone slugs at build time ---
export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/api/gemstones`);
    if (!res.ok) return [];
    const gemstones: Gemstone[] = await res.json();
    return gemstones.map((g) => ({ slug: g.slug }));
  } catch {
    return [];
  }
}

export default async function GemstonePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gemstone = await getGemstone(slug);

  if (!gemstone) {
    return (
      <>
        <Header />
        <main className="py-32 sm:py-40 text-center px-4">
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">404</p>
          <h1 className="font-serif italic text-4xl text-stone mb-4">
            This stone couldn&apos;t be found
          </h1>
          <p className="text-mid/70 mb-8 max-w-sm mx-auto">
            It may have been reserved, or the link may be out of date.
          </p>
          <Link
            href="/#gemstones"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-gold hover:text-stone transition-colors duration-300"
          >
            ← Back to Collection
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#gemstones"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-mid/60 hover:text-gold transition-colors duration-300 mb-10"
          >
            ← Back to Collection
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

            {/* Media Column — interactive Client Component */}
            <GemstoneGallery media={gemstone.media} name={gemstone.name} />

            {/* Details Column — Server-rendered for SEO */}
            <div className="flex flex-col">
              <span className="text-[11px] tracking-[0.3em] uppercase text-gold font-medium mb-3">
                Certificate of Provenance
              </span>
              <h1 className="font-serif text-4xl lg:text-5xl italic text-stone mb-4">
                {gemstone.name}
              </h1>
              <p className="text-mid text-lg leading-relaxed mb-6">
                {gemstone.description}
              </p>

              {gemstone.specs && gemstone.specs.length > 0 && (
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
                        <span className="font-medium text-stone whitespace-nowrap">
                          {spec.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto pt-10">
                <Link
                  href={`/#contact?gemstone=${gemstone.slug}`}
                  className="group relative w-full flex items-center justify-center overflow-hidden py-4 px-6 text-white text-[11px] font-medium tracking-[0.25em] uppercase"
                >
                  <span className="absolute inset-0 bg-stone transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-0 origin-right" />
                  <span className="absolute inset-0 bg-gold scale-x-0 transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-100 origin-left" />
                  <span className="relative">Inquire About This Gemstone</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}