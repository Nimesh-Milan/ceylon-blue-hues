'use client';

import { useState, useEffect, useMemo } from 'react';
import GemstoneCard from './GemstoneCard';
import { useInView } from '../hooks/useInView';
import type { Gemstone } from '@/types/gemstone';

const SkeletonCard = () => (
    <div>
        <div className="aspect-[4/3] bg-stone/[0.06] relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
        </div>
        <div className="pt-6 pb-2 flex flex-col items-center">
            <div className="h-6 bg-stone/[0.08] w-2/3 relative overflow-hidden">
                <div className="absolute inset-0 shimmer" />
            </div>
            <div className="h-3 bg-stone/[0.06] w-1/3 mt-3 relative overflow-hidden">
                <div className="absolute inset-0 shimmer" />
            </div>
        </div>
    </div>
);

const FilterButton = ({
    category,
    isActive,
    onClick,
}: {
    category: string;
    isActive: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`relative pb-2 px-1 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
            isActive ? 'text-stone font-medium' : 'text-mid/60 hover:text-stone'
        }`}
    >
        {category}
        <span
            className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-500 ease-[var(--ease-lux)] ${
                isActive ? 'w-full' : 'w-0'
            }`}
        />
    </button>
);

export default function GemstoneCollection() {
    const [gemstones, setGemstones] = useState<Gemstone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [gridRef, gridInView] = useInView({ threshold: 0.1, triggerOnce: true });

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
        if (activeCategory === 'All') return gemstones;
        return gemstones.filter((gem) => gem.category === activeCategory);
    }, [gemstones, activeCategory]);

    return (
        <section id="gemstones" className="relative py-24 sm:py-32 bg-white overflow-hidden">
            {/* watermark numeral */}
            <span
                aria-hidden
                className="pointer-events-none absolute -top-10 -left-6 font-serif italic text-[220px] leading-none text-stone/[0.03] select-none hidden lg:block"
            >
                03
            </span>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <span className="h-px w-8 bg-gold/70" />
                        <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-medium">
                            The Collection
                        </span>
                        <span className="h-px w-8 bg-gold/70" />
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl italic text-stone mb-4">
                        Our Collection
                    </h2>
                    <p className="text-lg text-mid max-w-2xl mx-auto">
                        A curated selection of fine, ethically sourced Sri Lankan gemstones.
                    </p>
                </div>

                {categories.length > 2 && (
                    <div className="flex justify-center flex-wrap gap-x-10 gap-y-3 mt-14 border-t border-b border-stone/10 py-5">
                        {categories.map((cat) => (
                            <FilterButton
                                key={cat}
                                category={cat}
                                isActive={activeCategory === cat}
                                onClick={() => setActiveCategory(cat)}
                            />
                        ))}
                    </div>
                )}

                <div ref={gridRef} className="mt-14">
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    )}

                    {error && !loading && (
                        <div className="max-w-md mx-auto text-center py-16 border border-stone/10">
                            <p className="font-serif italic text-2xl text-stone mb-2">
                                The collection couldn&apos;t be reached
                            </p>
                            <p className="text-sm text-mid/70">{error}</p>
                        </div>
                    )}

                    {!loading && !error && filteredGemstones.length === 0 && (
                        <div className="max-w-md mx-auto text-center py-16">
                            <p className="font-serif italic text-2xl text-stone mb-2">No stones in this category</p>
                            <p className="text-sm text-mid/70">Try another category, or view the full collection.</p>
                        </div>
                    )}

                    {!loading && !error && filteredGemstones.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                            {filteredGemstones.map((gem, i) => (
                                <div
                                    key={gem.id}
                                    className={`transition-all duration-700 ${
                                        gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}
                                    style={{ transitionDelay: `${i * 60}ms`, transitionTimingFunction: 'var(--ease-lux)' }}
                                >
                                    <GemstoneCard gemstone={gem} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}