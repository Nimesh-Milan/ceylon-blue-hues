'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gemstone } from '@/types/gemstone';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const [allGemstones, setAllGemstones] = useState<Gemstone[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch all gemstones once on first open
    useEffect(() => {
        if (!isOpen || allGemstones.length > 0) return;
        setLoading(true);
        fetch('/api/gemstones')
            .then((r) => r.json())
            .then((data: Gemstone[]) => setAllGemstones(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [isOpen, allGemstones.length]);

    // Auto-focus input and lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 80);
        } else {
            document.body.style.overflow = '';
            setQuery('');
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    const results = query.trim().length === 0
        ? allGemstones
        : allGemstones.filter((g) => {
            const q = query.toLowerCase();
            return (
                g.name.toLowerCase().includes(q) ||
                g.category?.toLowerCase().includes(q) ||
                g.origin?.toLowerCase().includes(q)
            );
        });

    return (
        <div
            aria-modal="true"
            role="dialog"
            aria-label="Search gemstones"
            onClick={onClose}
            className={`fixed inset-0 z-50 transition-opacity duration-500 ease-[var(--ease-lux)] ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            style={{ backgroundColor: 'rgba(26, 24, 20, 0.88)', backdropFilter: 'blur(14px)' }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-2xl mx-auto mt-[10vh] px-4 transition-all duration-700 ease-[var(--ease-lux)] ${
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
            >
                {/* Search input */}
                <div className="relative flex items-center border-b border-white/20 pb-4">
                    <svg
                        className="w-5 h-5 text-white/50 flex-shrink-0 mr-4"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, origin, or category…"
                        className="flex-1 bg-transparent text-white text-lg placeholder-white/30 focus:outline-none"
                    />
                    <button
                        onClick={onClose}
                        aria-label="Close search"
                        className="ml-4 text-white/40 hover:text-white transition-colors duration-300 hover:rotate-90 transition-transform"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25}
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Results */}
                <div className="mt-6 max-h-[60vh] overflow-y-auto">
                    {loading && (
                        <p className="text-white/40 text-sm text-center py-8">Loading collection…</p>
                    )}

                    {!loading && results.length === 0 && query.trim() !== '' && (
                        <p className="text-white/40 text-sm text-center py-8">
                            No gems found for &ldquo;{query}&rdquo;
                        </p>
                    )}

                    {!loading && results.length > 0 && (
                        <ul className="space-y-2">
                            {results.map((gem) => {
                                const thumb = gem.media?.[0];
                                return (
                                    <li key={gem.id}>
                                        <Link
                                            href={`/gemstones/${gem.slug}`}
                                            onClick={onClose}
                                            className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-white/8 transition-colors duration-200 group"
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-12 h-12 flex-shrink-0 bg-white/5 overflow-hidden rounded">
                                                {thumb?.type === 'image' ? (
                                                    <Image
                                                        src={thumb.file_path}
                                                        alt={gem.name}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="font-serif italic text-white/20 text-xs">
                                                            CBH
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium truncate group-hover:text-gold transition-colors duration-300">
                                                    {gem.name}
                                                </p>
                                                <p className="text-white/40 text-xs tracking-wide uppercase mt-0.5">
                                                    {gem.category}
                                                    {gem.origin && (
                                                        <span className="text-white/25"> · {gem.origin}</span>
                                                    )}
                                                </p>
                                            </div>

                                            <span className="text-white/25 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0">
                                                →
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {!loading && query.trim() === '' && results.length > 0 && (
                        <p className="text-white/25 text-[11px] tracking-[0.25em] uppercase text-center mt-6 pb-2">
                            {results.length} stones in collection
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
