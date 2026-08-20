'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import GemstoneCard from '@/app/components/GemstoneCard';
import type { Gemstone } from '@/types/gemstone';

const DiamondIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L2 12l10 10 10-10L12 2zm0 2.8l7.2 7.2-7.2 7.2-7.2-7.2L12 4.8z" />
    </svg>
);

export default function GemstoneShowPage() {
    const params = useParams();
    const slug = params.slug as string;
    
    const [gem, setGem] = useState<Gemstone | null>(null);
    const [relatedGems, setRelatedGems] = useState<Gemstone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxImage(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        async function fetchGem() {
            try {
                const res = await fetch(`/api/gemstones/${slug}`);
                if (!res.ok) throw new Error('Gemstone not found');
                const data = await res.json();
                setGem(data);

                if (data.category) {
                    const relatedRes = await fetch(`/api/gemstones`);
                    if (relatedRes.ok) {
                        const all: Gemstone[] = await relatedRes.json();
                        setRelatedGems(all.filter(g => g.category === data.category && g.id !== data.id).slice(0, 3));
                    }
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchGem();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="w-12 h-12 border-t-2 border-gold rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !gem) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center">
                <Header />
                <h1 className="text-4xl font-serif italic text-navy mb-4">Gemstone not found</h1>
                <Link href="/" className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-gold hover:text-navy transition-colors">
                    &larr; Return to Collection
                </Link>
            </div>
        );
    }

    // Split name for dramatic typography
    const nameWords = gem.name.split(' ');
    const firstWord = nameWords[0] || '';
    const restOfName = nameWords.slice(1).join(' ') || '';

    return (
        <div className="min-h-screen bg-cream flex flex-col font-sans relative">
            <Header />

            <main className="flex-grow w-full pt-[110px]">
                
                {/* Desktop Split Screen / Mobile Stack */}
                <div className="flex flex-col md:flex-row w-full h-full min-h-[calc(100vh-110px)]">
                    
                    {/* Left: Sticky Image Showcase & Thumbnails */}
                    <div className="w-full md:w-1/2 md:h-[calc(100vh-110px)] md:sticky md:top-[110px] bg-[#FDFBF7] border-r border-navy/5 flex flex-col relative overflow-hidden pt-8 md:pt-0">
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-cream via-transparent to-transparent opacity-50 z-0 pointer-events-none" />
                        
                        <div className="flex-1 relative flex items-center justify-center p-8 md:p-16">
                            {gem.media && gem.media.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={activeImageIndex}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="relative w-full h-full max-h-[70vh] flex items-center justify-center mix-blend-multiply z-10 cursor-zoom-in group"
                                        onClick={() => setLightboxImage(gem.media![activeImageIndex].file_path)}
                                    >
                                        <img 
                                            src={gem.media[activeImageIndex].file_path} 
                                            alt={gem.name} 
                                            className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <span className="font-sans font-bold tracking-[0.3em] uppercase text-navy/20 text-[12px] z-10">Image Unavailable</span>
                            )}
                        </div>

                        {/* Thumbnail Navigation */}
                        {gem.media && gem.media.length > 0 && (
                            <div className="relative h-24 md:h-32 border-t border-navy/5 flex items-center justify-center gap-4 z-50 bg-[#FDFBF7]/80 backdrop-blur-sm px-6 overflow-x-auto">
                                {gem.media.map((m: any, idx: number) => (
                                    <button
                                        key={m.id || idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative z-10 cursor-pointer flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-sm border transition-all duration-300 overflow-hidden mix-blend-multiply bg-transparent ${activeImageIndex === idx ? 'border-navy shadow-md scale-105' : 'border-navy/10 opacity-50 hover:opacity-100 hover:border-navy/30'}`}
                                    >
                                        <img src={m.file_path} alt="Thumbnail" className="w-full h-full object-cover p-1" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Scrolling Editorial Content */}
                    <div className="w-full md:w-1/2 flex flex-col px-8 py-16 md:px-16 md:py-24 lg:px-24 lg:py-32 bg-cream">
                        
                        {/* Top Label with Diamonds */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="mb-8"
                        >
                            <div className="inline-flex items-center gap-4 px-6 py-2 border border-gold/30 rounded-full bg-cream/30 backdrop-blur-md">
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1], filter: ['drop-shadow(0px 0px 4px rgba(212,175,55,0.4))', 'drop-shadow(0px 0px 12px rgba(212,175,55,1))', 'drop-shadow(0px 0px 4px rgba(212,175,55,0.4))'] }} 
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="text-gold"
                                >
                                    <DiamondIcon className="w-3 h-3" />
                                </motion.div>
                                <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-navy font-bold">
                                    {gem.category || 'Masterpiece'}
                                </span>
                            </div>
                        </motion.div>

                        {/* Animated Typography */}
                        <div className="flex flex-col items-start gap-2 w-full mb-12">
                            <motion.h1
                                initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                className="font-serif text-5xl md:text-6xl lg:text-[5rem] text-navy italic font-light leading-tight tracking-tight drop-shadow-sm"
                            >
                                {firstWord}
                            </motion.h1>
                            {restOfName && (
                                <motion.h1
                                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                    className="font-serif text-4xl md:text-5xl lg:text-[4rem] text-navy font-bold leading-none tracking-tighter uppercase drop-shadow-md relative mt-4"
                                >
                                    {restOfName}
                                    <motion.div 
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                                        className="absolute -bottom-4 left-0 w-3/4 h-[2px] bg-gold origin-left rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                    />
                                </motion.h1>
                            )}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                            className="mb-16 md:mb-24"
                        >
                            <p className="text-base md:text-lg text-navy/80 font-sans font-normal leading-relaxed tracking-wide">
                                {gem.description}
                            </p>
                        </motion.div>

                        {/* Delicate Specifications Grid */}
                        {(gem.availability || (gem.specs && gem.specs.length > 0)) && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                                className="mb-16 md:mb-24 w-full"
                            >
                                <h2 className="font-sans text-[9px] font-bold tracking-[0.4em] uppercase text-navy/40 mb-8">
                                    Gemological Details
                                </h2>
                                <div className="flex flex-col border-t border-navy/10">
                                    {gem.availability && (
                                        <div className="flex justify-between items-center py-4 md:py-5 border-b border-navy/5 group hover:border-navy/20 transition-colors">
                                            <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-navy/40 group-hover:text-navy/70 transition-colors">Status</span>
                                            <span className="text-sm md:text-base font-serif italic text-navy">{gem.availability}</span>
                                        </div>
                                    )}
                                    {gem.origin && (
                                        <div className="flex justify-between items-center py-4 md:py-5 border-b border-navy/5 group hover:border-navy/20 transition-colors">
                                            <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-navy/40 group-hover:text-navy/70 transition-colors">Origin</span>
                                            <span className="text-sm md:text-base font-serif italic text-navy">{gem.origin}</span>
                                        </div>
                                    )}
                                    {(gem.specs || []).map((spec: any, i: number) => (
                                        <div key={spec.id || i} className="flex justify-between items-center py-4 md:py-5 border-b border-navy/5 group hover:border-navy/20 transition-colors">
                                            <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-navy/40 group-hover:text-navy/70 transition-colors">{spec.spec_key || spec.label}</span>
                                            <span className="text-sm md:text-base font-serif italic text-navy">{spec.spec_value || spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Ultra-Luxe CTA */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1 }}
                            className="mt-auto pt-12 border-t border-navy/5 flex flex-col items-start gap-6"
                        >
                            {gem.availability === 'Sold' ? (
                                <Link
                                    href="/#contact"
                                    className="group relative inline-flex justify-center items-center px-10 py-5 text-[10px] md:text-[11px] font-sans font-bold tracking-[0.3em] uppercase text-navy border border-navy transition-all duration-500 overflow-hidden hover:border-gold hover:text-cream bg-cream w-full md:w-auto"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1] z-0" />
                                    <motion.span 
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent skew-x-12 z-0 pointer-events-none"
                                    />
                                    <span className="relative z-10 transition-colors duration-500">Inquire About Similar</span>
                                </Link>
                            ) : (
                                <Link
                                    href={`/#contact?stone=${gem.slug}`}
                                    className="group relative inline-flex justify-center items-center px-10 py-5 text-[10px] md:text-[11px] font-sans font-bold tracking-[0.3em] uppercase text-navy border border-navy transition-all duration-500 overflow-hidden hover:border-gold hover:text-cream bg-cream w-full md:w-auto"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1] z-0" />
                                    <motion.span 
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent skew-x-12 z-0 pointer-events-none"
                                    />
                                    <span className="relative z-10 transition-colors duration-500">Request Private Viewing</span>
                                </Link>
                            )}
                            <p className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-navy/30">
                                Reference: CBH-{gem.id?.toString().padStart(4, '0') || '0000'}
                            </p>
                        </motion.div>
                        
                    </div>
                </div>

                
                {/* Related Gems Section - Curated Gallery Style */}
                {relatedGems.length > 0 && (
                    <div className="w-full bg-[#FDFBF7] border-t border-navy/5 py-24 md:py-40 px-6 lg:px-12">
                        <div className="max-w-[1400px] mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="flex flex-col items-center mb-24"
                            >
                                <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-navy/40 mb-6 text-center">
                                    Curated Pairings
                                </span>
                                <h2 className="font-serif text-4xl md:text-5xl text-navy italic text-center">
                                    Similar Masterpieces
                                </h2>
                            </motion.div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16 md:gap-y-24">
                                {relatedGems.map((g) => (
                                    <motion.div
                                        key={g.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <GemstoneCard gemstone={g} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100] bg-[#0F1F2C]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                        onClick={() => setLightboxImage(null)}
                    >
                        <div className="absolute top-6 right-6 md:top-12 md:right-12">
                            <button 
                                onClick={() => setLightboxImage(null)}
                                className="text-cream/50 hover:text-cream transition-colors p-4"
                                aria-label="Close lightbox"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <motion.img 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            src={lightboxImage} 
                            alt="Fullscreen view" 
                            className="max-w-full max-h-full object-contain drop-shadow-2xl"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
