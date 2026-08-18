'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GemstoneError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Gemstone page error:', error);
    }, [error]);

    return (
        <main className="py-32 sm:py-40 text-center px-4">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">Error</p>
            <h1 className="font-serif italic text-4xl text-stone mb-4">
                Something went wrong
            </h1>
            <p className="text-mid/70 mb-8 max-w-sm mx-auto">
                We couldn&apos;t load this gemstone. Please try again or return to the collection.
            </p>
            <div className="flex items-center justify-center gap-6">
                <button
                    onClick={reset}
                    className="text-[11px] tracking-[0.25em] uppercase text-gold hover:text-stone transition-colors duration-300"
                >
                    Try Again
                </button>
                <span className="text-stone/20">|</span>
                <Link
                    href="/#gemstones"
                    className="text-[11px] tracking-[0.25em] uppercase text-mid/60 hover:text-gold transition-colors duration-300"
                >
                    ← Back to Collection
                </Link>
            </div>
        </main>
    );
}
