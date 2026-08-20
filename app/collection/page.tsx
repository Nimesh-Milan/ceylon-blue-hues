'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import GemstoneCard from '@/app/components/GemstoneCard';
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
        className={`px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-sans font-bold tracking-[0.4em] uppercase transition-colors duration-500 ${
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

export default function CollectionPage() {
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
        <div className="min-h-screen bg-cream flex flex-col font-sans">
            <Header />

            <main className="flex-grow w-full pt-32 pb-24 md:pt-48 md:pb-32 px-6">
                <div className="max-w-[1400px] mx-auto">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-24">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="font-serif text-[12vw] md:text-[8vw] lg:text-[7vw] text-navy italic font-light leading-none mb-6"
                        >
                            The Collection
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="text-navy/50 font-sans text-sm md:text-base max-w-2xl font-light mb-12"
                        >
                            Explore our meticulously curated selection of the world's most exceptional gemstones, sourced directly from the mines of Ceylon.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-2 md:gap-6 px-2"
                        >
                            {categories.map((cat) => (
                                <FilterButton key={`cat-${cat}`} label={cat} isActive={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
                            ))}
                        </motion.div>
                    </div>

                    {/* Grid Section */}
                    <div>
                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        )}

                        {!loading && !error && filteredGemstones.length === 0 && (
                            <div className="w-full text-center py-20">
                                <p className="font-serif italic text-2xl text-navy mb-4">No stones found in this category.</p>
                            </div>
                        )}

                        {!loading && !error && filteredGemstones.length > 0 && (
                            <motion.div 
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredGemstones.map((gem) => (
                                        <motion.div
                                            key={gem.id}
                                            layout
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <GemstoneCard gemstone={gem} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}