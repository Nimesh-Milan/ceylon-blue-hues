'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GemstoneCard from './GemstoneCard';
import type { Gemstone } from '@/types/gemstone';

const FilterButton = ({
    label,
    isActive,
    onClick,
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`px-3 md:px-4 py-2 text-[9px] font-sans font-bold tracking-[0.4em] uppercase transition-colors duration-500 ${
            isActive ? 'text-gold' : 'text-navy/40 hover:text-navy'
        }`}
    >
        {label}
    </button>
);

const SkeletonCard = () => (
    <div className="flex flex-col items-center opacity-50">
        <div className="relative w-full aspect-square mb-8 bg-navy/5 overflow-hidden rounded-md">
            <div className="absolute inset-0 shimmer opacity-50" />
        </div>
        <div className="h-6 bg-navy/5 w-1/2 mb-3 rounded-md relative overflow-hidden">
            <div className="absolute inset-0 shimmer opacity-50" />
        </div>
        <div className="h-2 bg-navy/5 w-1/4 rounded-md relative overflow-hidden">
            <div className="absolute inset-0 shimmer opacity-50" />
        </div>
    </div>
);

export default function GemstoneCollection() {
    const [gemstones, setGemstones] = useState<Gemstone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        async function fetchGemstones() {
            try {
                const response = await fetch('/api/gemstones');
                if (!response.ok) throw new Error('Failed to fetch gemstones');
                const data = await response.json();
                setGemstones(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        }
        fetchGemstones();
    }, []);

    const categories = useMemo(() => {
        const all = gemstones.map((gem) => gem.category).filter(Boolean) as string[];
        return ['All', ...Array.from(new Set(all))];
    }, [gemstones]);

    const filteredGemstones = useMemo(() => {
        return gemstones.filter((gem) => {
            if (activeCategory !== 'All' && gem.category !== activeCategory) return false;
            return true;
        });
    }, [gemstones, activeCategory]);

    return (
        <section id="gemstones" className="relative py-24 md:py-32 lg:py-40 bg-cream overflow-hidden px-6">
            
            <div className="max-w-[1400px] mx-auto relative z-10">
                
                <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8 flex flex-col items-center"
                    >
                        <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-transparent to-navy/30 mb-6 md:mb-8" />
                        <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-navy/50 font-bold">
                            Curated Selection
                        </span>
                    </motion.div>

                    <div className="flex flex-col items-center justify-center gap-0 w-full mb-12 md:mb-16">
                        <div className="overflow-hidden pb-4 md:pb-8 -mb-4 md:-mb-8">
                            <motion.h2 
                                initial={{ y: "100%" }}
                                whileInView={{ y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="font-serif text-[10vw] md:text-[8vw] lg:text-[7vw] text-navy italic font-light leading-[0.9]"
                            >
                                The Heritage
                            </motion.h2>
                        </div>
                        <div className="overflow-hidden pb-4 md:pb-8 -mb-4 md:-mb-8">
                            <motion.h2 
                                initial={{ y: "100%" }}
                                whileInView={{ y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="font-serif text-[12vw] md:text-[10vw] lg:text-[9vw] text-navy font-bold leading-[0.9] tracking-tighter uppercase"
                            >
                                Collection
                            </motion.h2>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 md:gap-6 px-2">
                        {categories.map((cat) => (
                            <FilterButton key={`cat-${cat}`} label={cat} isActive={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
                        ))}
                    </div>
                </div>

                <div>
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-12 gap-y-24 max-w-5xl mx-auto">
                            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    )}

                    {!loading && !error && filteredGemstones.length === 0 && (
                        <div className="w-full text-center py-20">
                            <p className="font-serif italic text-2xl text-navy mb-4">No stones found</p>
                        </div>
                    )}

                    {!loading && !error && filteredGemstones.length > 0 && (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-24 max-w-5xl mx-auto"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredGemstones.map((gem) => (
                                    <motion.div
                                        key={gem.id}
                                        layout
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <GemstoneCard gemstone={gem} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}

