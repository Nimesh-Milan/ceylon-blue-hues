'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function GemstoneDetailClient({ params }: { params: Promise<{ slug: string }> }) { const { slug } = React.use(params);
    const [gem, setGem] = useState<any>(null);
    const [relatedGems, setRelatedGems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGem() {
            try {
                const res = await fetch('/api/gemstones');
                const data = await res.json();
                const decodedSlug = decodeURIComponent(slug); const found = data.find((g: any) => g.slug === decodedSlug || g.slug === slug);
                if (found) {
                    setGem(found);
                    setRelatedGems(data.filter((g: any) => g.id !== found.id).slice(0, 3));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchGem();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-t-2 border-gold rounded-full" />
            </div>
        );
    }

    if (!gem) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center">
                <h1 className="font-serif text-5xl text-navy italic mb-4">Masterpiece Not Found</h1>
                <Link href="/#gemstones" className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gold hover:text-navy transition-colors">Return to Collection</Link>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen text-navy font-sans">
            <Header />
            
            <main className="pt-40 md:pt-48 pb-32">
                <div className="max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
                    
                    {/* Editorial Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center gap-6 mb-16"
                    >
                        <div className="flex items-center gap-4">
                            {gem.category && (
                                <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-gold">
                                    {gem.category}
                                </span>
                            )}
                            <span className="w-1 h-1 bg-navy/20 rounded-full" />
                            {gem.origin && (
                                <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-navy/40">
                                    {gem.origin}
                                </span>
                            )}
                        </div>
                        
                        <h1 className="font-serif text-[12vw] md:text-[8vw] lg:text-[7vw] text-navy italic leading-[0.9] tracking-tight">
                            {gem.name}
                        </h1>

                        {gem.availability && (
                            <span className={`text-[9px] font-sans font-bold tracking-[0.3em] uppercase px-4 py-2 mt-4 border ${
                                gem.availability === 'Sold' ? 'text-red-700/70 border-red-700/20' :
                                gem.availability === 'Reserved' ? 'text-orange-600/70 border-orange-600/20' :
                                'text-gold border-gold/30'
                            }`}>
                                {gem.availability}
                            </span>
                        )}
                    </motion.div>

                    {/* Massive Floating Image */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="w-full max-w-4xl aspect-square md:aspect-[4/3] relative mb-24 bg-[#FDFBF7] mix-blend-multiply drop-shadow-2xl flex items-center justify-center p-12 md:p-24"
                    >
                        {gem.media && gem.media.length > 0 ? (
                            <Image 
                                src={gem.media[0].file_path} 
                                alt={gem.name} 
                                fill 
                                className="object-contain p-8 md:p-16 hover:scale-105 transition-transform duration-[2s] ease-out" 
                                priority
                            />
                        ) : (
                            <span className="font-sans font-bold tracking-[0.3em] uppercase text-navy/20 text-[12px]">Image Unavailable</span>
                        )}
                    </motion.div>

                    {/* Centered Description */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                        className="max-w-2xl mb-24 md:mb-32"
                    >
                        <p className="text-base md:text-lg text-navy/70 font-sans font-light leading-relaxed tracking-wide">
                            {gem.description}
                        </p>
                    </motion.div>

                    {/* Ultra-Minimalist Specifications */}
                    {gem.specs && gem.specs.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                            className="w-full max-w-3xl mb-24 md:mb-32"
                        >
                            <h2 className="font-sans text-[10px] font-bold tracking-[0.4em] uppercase text-navy/40 mb-16">
                                Gemological Specifications
                            </h2>
                            <div className="flex flex-col gap-6">
                                {gem.specs.map((spec: any, i: number) => (
                                    <div key={spec.id || i} className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-navy/5 gap-2 md:gap-0">
                                        <span className="text-[10px] md:text-[11px] font-sans font-bold tracking-[0.3em] uppercase text-navy/40 md:w-1/3 text-left">{spec.spec_key || spec.label}</span>
                                        <span className="text-lg md:text-xl font-serif italic text-navy text-left md:text-right">{spec.spec_value || spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* CTA Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                        className="flex flex-col items-center gap-8"
                    >
                        <div className="w-[1px] h-24 bg-gradient-to-b from-navy/30 to-transparent mb-4" />
                        
                        {gem.availability === 'Sold' ? (
                            <Link
                                href="/#contact"
                                className="group relative inline-flex justify-center items-center px-6 py-4 md:px-16 md:py-6 text-center text-[10px] md:text-[12px] font-sans font-bold tracking-[0.3em] uppercase text-navy border border-navy hover:text-gold hover:border-gold transition-colors duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 transition-colors duration-500">Inquire About Similar</span>
                            </Link>
                        ) : (
                            <Link
                                href={`/#contact?stone=${gem.slug}`}
                                className="group relative inline-flex justify-center items-center px-6 py-4 md:px-16 md:py-6 text-center text-[10px] md:text-[12px] font-sans font-bold tracking-[0.3em] uppercase text-navy border border-navy hover:text-gold hover:border-gold transition-colors duration-500 overflow-hidden bg-transparent"
                            >
                                <motion.span 
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent skew-x-12 z-0"
                                />
                                <span className="relative z-10 transition-colors duration-500">
                                    Request Private Viewing
                                </span>
                            </Link>
                        )}
                        
                        <p className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-navy/30 mt-4">
                            Reference: CBH-{gem.id?.toString().padStart(4, '0') || '0000'}
                        </p>
                                        </motion.div>

                    {relatedGems.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="w-full mt-32 md:mt-48 border-t border-navy/10 pt-24 flex flex-col items-center"
                        >
                            <h2 className="font-sans text-[10px] font-bold tracking-[0.4em] uppercase text-navy/40 mb-16 text-center">
                                Discover More Masterpieces
                            </h2>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full max-w-[1400px] mx-auto mt-12">
                                {relatedGems.map((g, i) => (
                                    <Link key={g.id} href={`/gemstones/${g.slug}`} className="group flex flex-col items-center text-center flex-1">
                                        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-12 flex items-center justify-center mix-blend-multiply transition-transform duration-[2s] ease-out group-hover:scale-105">
                                            {g.media && g.media.length > 0 && (
                                                <Image src={g.media[0].file_path} alt={g.name} fill className="object-contain drop-shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-1000" />
                                            )}
                                        </div>
                                        <h3 className="font-serif text-2xl md:text-3xl text-navy italic group-hover:text-gold transition-colors">{g.name}</h3>
                                        <span className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-navy/40 mt-4">
                                            {g.specs?.find((s: any) => (s.spec_key || s.label || '').toLowerCase().includes('carat'))?.spec_value || g.category || 'Collection'}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}






