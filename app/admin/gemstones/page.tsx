'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Button from '@/app/components/Button';

interface Gemstone { id: number; name: string; slug: string; category?: string; origin?: string; availability?: string; }

export default function GemstonesDirectory() {
    const [gemstones, setGemstones] = useState<Gemstone[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/admin/gemstones')
            .then(res => res.json())
            .then(data => setGemstones(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        return gemstones.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || (g.category && g.category.toLowerCase().includes(search.toLowerCase())));
    }, [gemstones, search]);

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 border-b border-navy/5 pb-12">
                <div>
                    <h1 className="text-[8vw] md:text-5xl lg:text-6xl font-serif italic text-navy mb-4 leading-none tracking-tight">Masterpieces</h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-navy/40 font-bold">The Collection Archive</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <input
                        type="text"
                        placeholder="Search collection..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full sm:w-auto bg-transparent border-b border-navy/20 py-2 text-md font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/30"
                    />
                    <Button href="/admin/gemstones/new" size="sm" className="whitespace-nowrap">
                        + Add Masterpiece
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-t-2 border-gold rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-32 text-center flex flex-col items-center">
                    <p className="text-3xl font-serif italic text-navy mb-4">No Masterpieces Found</p>
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-navy/40">Adjust search or add a new stone</p>
                </div>
            ) : (
                <div className="flex flex-col divide-y divide-navy/10 border-t border-navy/10">
                    {filtered.map((gem) => (
                        <Link
                            href={`/admin/gemstones/${gem.id}/edit`}
                            key={gem.id}
                            className="group flex flex-col md:flex-row md:items-center justify-between py-8 px-4 hover:bg-gold/5 transition-colors duration-500"
                        >
                            <div className="flex flex-col gap-2">
                                <h3 className="text-2xl md:text-3xl font-serif italic text-navy group-hover:text-gold transition-colors">{gem.name}</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-navy/40">{gem.origin || 'No Origin'}</span>
                                    {gem.category && (
                                        <>
                                            <span className="w-1 h-1 bg-navy/20 rounded-full" />
                                            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold">
                                                {gem.category}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-6">
                                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-navy/30">
                                    {gem.availability || 'Available'}
                                </span>
                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-navy/20 group-hover:text-gold group-hover:translate-x-2 transition-all">
                                    Edit &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}