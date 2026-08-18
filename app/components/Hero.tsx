'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getAnimationClass = () =>
        `transition-all duration-[1400ms] ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
    const getAnimationStyle = (delay: number) => ({
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'var(--ease-out-quint)',
    });

    return (
        <section id="top" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/Blue Hues hero Image.png')" }}
            >
                {/* layered vignette — reads as intentional grading rather than a single flat overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4">
                <div style={getAnimationStyle(200)} className={getAnimationClass()}>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="h-px w-8 bg-gold/70" />
                        <p className="text-[11px] tracking-[0.45em] uppercase text-white/75 font-medium">
                            Ceylon Sapphires · Sri Lanka
                        </p>
                        <span className="h-px w-8 bg-gold/70" />
                    </div>
                </div>

                <div style={getAnimationStyle(450)} className={getAnimationClass()}>
                    <h1 className="text-5xl md:text-7xl font-serif italic mb-6 [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]">
                        Legacy in Every Gem
                    </h1>
                </div>

                <div style={getAnimationStyle(650)} className={getAnimationClass()}>
                    <p className="text-lg md:text-xl font-light max-w-2xl mx-auto text-white/85 leading-relaxed mb-10">
                        Discover the unparalleled beauty of ethically sourced, artisanally crafted gemstones from
                        the heart of Sri Lanka.
                    </p>
                </div>

                <div style={getAnimationStyle(850)} className={getAnimationClass()}>
                    <a
                        href="#gemstones"
                        className="group relative inline-flex items-center gap-3 px-10 py-4 overflow-hidden text-white text-[11px] font-medium tracking-[0.25em] uppercase"
                    >
                        <span className="absolute inset-0 border border-white/40 transition-all duration-500 ease-[var(--ease-lux)] group-hover:border-gold/0" />
                        <span className="absolute inset-0 bg-gold scale-x-0 origin-left transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-100" />
                        <span className="relative">Explore The Collection</span>
                        <span className="relative transition-transform duration-500 ease-[var(--ease-lux)] group-hover:translate-x-1">
                            →
                        </span>
                    </a>
                </div>
            </div>

            {/* Scroll Down Indicator — a slow drawing line reads calmer and more considered than a bouncing icon */}
            <div
                style={getAnimationStyle(1200)}
                className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 ${getAnimationClass()}`}
            >
                <a href="#about" aria-label="Scroll down" className="group flex flex-col items-center gap-3">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 group-hover:text-white/80 transition-colors duration-300">
                        Scroll
                    </span>
                    <span className="relative h-10 w-px overflow-hidden bg-white/20">
                        <span className="absolute inset-x-0 top-0 h-1/2 bg-white/80 animate-[scrollLine_2.2s_ease-in-out_infinite]" />
                    </span>
                </a>
            </div>
        </section>
    );
}