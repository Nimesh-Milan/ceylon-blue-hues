'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface Gemstone {
    id: number;
    name: string;
    slug: string;
    origin: string;
    category: string;
}

const SkeletonRow = () => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-mid/10 last:border-0">
        <div className="space-y-2">
            <div className="h-4 w-40 bg-mid/10 rounded relative overflow-hidden">
                <div className="absolute inset-0 shimmer" />
            </div>
            <div className="h-3 w-24 bg-mid/10 rounded relative overflow-hidden">
                <div className="absolute inset-0 shimmer" />
            </div>
        </div>
        <div className="h-3 w-3 bg-mid/10 rounded-full" />
    </div>
);

export default function AdminDashboard() {
    const [gemstones, setGemstones] = useState<Gemstone[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetch('/api/admin/gemstones')
            .then((res) => res.json())
            .then((data) => {
                setGemstones(data);
                setLoading(false);
            });
    }, []);

    const categories = useMemo(
        () => new Set(gemstones.map((g) => g.category).filter(Boolean)),
        [gemstones]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return gemstones;
        return gemstones.filter(
            (g) =>
                g.name.toLowerCase().includes(q) ||
                g.origin?.toLowerCase().includes(q) ||
                g.category?.toLowerCase().includes(q)
        );
    }, [gemstones, query]);

    return (
        <div className="min-h-screen bg-cream py-10 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl font-light text-stone">Gemstone Collection</h1>
                        {!loading && (
                            <p className="text-sm text-mid mt-1">
                                {gemstones.length} {gemstones.length === 1 ? 'stone' : 'stones'}
                                {categories.size > 0 && ` · ${categories.size} categories`}
                            </p>
                        )}
                    </div>
                    <Link
                        href="/admin/gemstones/new"
                        className="px-5 py-2.5 bg-stone text-white rounded-full text-sm uppercase tracking-widest hover:bg-stone/85 transition"
                    >
                        + Add Gemstone
                    </Link>
                </div>

                {!loading && gemstones.length > 0 && (
                    <div className="relative mt-6 mb-6">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mid/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, origin, or category"
                            className="w-full pl-11 pr-4 py-3 bg-white border border-mid/15 rounded-full text-sm text-stone placeholder-mid/40 focus:outline-none focus:border-gold transition-colors"
                        />
                    </div>
                )}

                {loading ? (
                    <div className="bg-white border border-mid/15 rounded-xl overflow-hidden">
                        {[...Array(4)].map((_, i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </div>
                ) : gemstones.length === 0 ? (
                    <div className="bg-white border border-mid/15 rounded-xl px-6 py-16 text-center">
                        <p className="text-stone font-medium mb-1">No gemstones yet</p>
                        <p className="text-sm text-mid mb-6">Your collection will appear here once you add a stone.</p>
                        <Link
                            href="/admin/gemstones/new"
                            className="inline-flex px-5 py-2.5 bg-stone text-white rounded-full text-sm uppercase tracking-widest hover:bg-stone/85 transition"
                        >
                            + Add Your First Gemstone
                        </Link>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-mid/15 rounded-xl px-6 py-16 text-center">
                        <p className="text-stone font-medium mb-1">No matches for "{query}"</p>
                        <button
                            onClick={() => setQuery('')}
                            className="text-sm text-gold hover:text-stone transition-colors mt-2"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="bg-white border border-mid/15 rounded-xl overflow-hidden">
                        {filtered.map((gem) => (
                            <Link
                                key={gem.id}
                                href={`/admin/gemstones/${gem.id}`}
                                className="group flex items-center justify-between px-6 py-4 border-b border-mid/10 last:border-0 hover:bg-cream transition-colors"
                            >
                                <div className="min-w-0">
                                    <p className="text-stone font-medium truncate">{gem.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-mid uppercase tracking-wide">{gem.origin}</p>
                                        {gem.category && (
                                            <>
                                                <span className="text-mid/30">·</span>
                                                <span className="text-[10px] font-medium tracking-wide uppercase text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                                                    {gem.category}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <span className="text-mid group-hover:text-gold group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-4">
                                    →
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .shimmer {
                    background: linear-gradient(90deg, transparent 0%, rgba(190, 158, 90, 0.15) 50%, transparent 100%);
                    background-size: 200% 100%;
                    animation: shimmer 1.6s ease-in-out infinite;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .shimmer { animation: none; }
                }
            `}</style>
        </div>
    );
}