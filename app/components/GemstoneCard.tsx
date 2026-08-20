'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Gemstone } from '@/types/gemstone';

export default function GemstoneCard({ gemstone }: { gemstone: Gemstone }) {
    
    const weightSpec = gemstone.specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.toLowerCase().includes('carat'));
    const weightText = weightSpec ? weightSpec.value : '';

    return (
        <Link href={`/gemstones/${gemstone.slug}`} className="group block relative cursor-pointer outline-none w-full flex flex-col items-center">
            
            {/* The Floating Image Container - No borders, just pure space */}
            <div className="relative w-full aspect-square md:aspect-[4/5] flex items-center justify-center mb-8 mix-blend-multiply overflow-visible">
                {gemstone.media && gemstone.media.length > 0 ? (
                    <>
                        <Image
                            src={gemstone.media[0].file_path}
                            alt={gemstone.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-4 md:p-8 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-110 drop-shadow-2xl z-10"
                        />

                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-navy/20 font-sans font-bold uppercase tracking-widest text-[10px]">
                        No Image
                    </div>
                )}
            </div>

            {/* Ultra-Minimalist Typography */}
            <div className="flex flex-col items-center justify-center text-center transition-transform duration-700 ease-out group-hover:-translate-y-2">
                <h3 className="font-serif text-2xl md:text-3xl text-navy italic mb-3 group-hover:text-gold transition-colors duration-500">
                    {gemstone.name}
                </h3>
                
                <div className="flex items-center gap-3">
                    {weightText && (
                        <span className="text-[8px] md:text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-navy/60">
                            {weightText}
                        </span>
                    )}
                    {weightText && gemstone.origin && (
                        <span className="w-1 h-1 rounded-full bg-gold/50" />
                    )}
                    {gemstone.origin && (
                        <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-navy/60">
                            {gemstone.origin}
                        </span>
                    )}
                </div>
            </div>
            
        </Link>
    );
}