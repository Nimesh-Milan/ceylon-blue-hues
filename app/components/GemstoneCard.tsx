'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Gemstone } from '@/types/gemstone';

export default function GemstoneCard({ gemstone }: { gemstone: Gemstone }) {
    
    const weightSpec = gemstone.specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.toLowerCase().includes('carat'));
    const weightText = weightSpec ? weightSpec.value : '';

    return (
        <Link href={`/gemstones/${gemstone.slug}`} className="group block relative cursor-pointer outline-none">
            
            {/* The Museum Plaque Container */}
            <div className="flex flex-col h-full bg-[#FDFBF7] border border-navy/10 transition-all duration-700 hover:border-gold/50 hover:shadow-[0_20px_40px_-15px_rgba(4,20,44,0.08)] hover:-translate-y-2 relative overflow-hidden">
                
                {/* Decorative Plaque Corner Accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-navy/10 transition-colors duration-700 group-hover:border-gold/40 pointer-events-none" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-navy/10 transition-colors duration-700 group-hover:border-gold/40 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-navy/10 transition-colors duration-700 group-hover:border-gold/40 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-navy/10 transition-colors duration-700 group-hover:border-gold/40 pointer-events-none" />

                {/* Image Section */}
                <div className="relative w-full aspect-[4/5] bg-cream p-6 overflow-hidden">
                    {gemstone.media && gemstone.media.length > 0 ? (
                        <>
                            <Image
                                src={gemstone.media[0].file_path}
                                alt={gemstone.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain p-8 transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 mix-blend-multiply drop-shadow-md"
                            />
                            {gemstone.media.length > 1 && (
                                <Image
                                    src={gemstone.media[1].file_path}
                                    alt={gemstone.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain p-8 absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 mix-blend-multiply drop-shadow-md"
                                />
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-navy/20 font-sans font-bold uppercase tracking-widest text-[10px]">
                            No Image
                        </div>
                    )}
                </div>

                {/* Museum Plaque Info Section */}
                <div className="flex flex-col items-center justify-center text-center p-8 bg-[#FDFBF7] border-t border-navy/5 flex-grow">
                    
                    <h3 className="font-serif text-2xl md:text-3xl text-navy italic mb-4 transition-colors duration-500 group-hover:text-gold">
                        {gemstone.name}
                    </h3>
                    
                    <div className="w-12 h-[1px] bg-gold/30 mb-5 transition-all duration-700 ease-out group-hover:w-24 group-hover:bg-gold/60" />
                    
                    <div className="flex flex-col items-center justify-center gap-2">
                        {weightText && (
                            <span className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-navy/50">
                                {weightText}
                            </span>
                        )}
                        {gemstone.origin && (
                            <span className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-navy/40">
                                {gemstone.origin}
                            </span>
                        )}
                    </div>
                    
                </div>
            </div>
        </Link>
    );
}