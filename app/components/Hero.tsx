'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Elegant Diamond SVG Icon
const DiamondIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 1.5L22 8l-10 14.5L2 8l10-6.5zm0 3.2L5.8 8h12.4L12 4.7zm-6.2 4.8l4.4 10.2-8.3-10.2h3.9zm5 0l1.2 10.5 1.2-10.5H10.8zm6.4 0H21l-8.3 10.2 4.5-10.2z"/>
    </svg>
);

// Outer Geometry (Girdle and Table)
const GemBlueprintOuter = () => (
    <svg viewBox="0 0 100 100" className="w-[120vw] h-[120vw] md:w-[900px] md:h-[900px] lg:w-[1200px] lg:h-[1200px] stroke-gold/20 stroke-[0.1] md:stroke-[0.05] fill-transparent overflow-visible">
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="20" />
        <polygon points="50,2 84,16 98,50 84,84 50,98 16,84 2,50 16,16" />
        <polygon points="50,20 71.2,28.8 80,50 71.2,71.2 50,80 28.8,71.2 20,50 28.8,28.8" />
        <line x1="50" y1="2" x2="50" y2="20" />
        <line x1="98" y1="50" x2="80" y2="50" />
        <line x1="50" y1="98" x2="50" y2="80" />
        <line x1="2" y1="50" x2="20" y2="50" />
        <line x1="84" y1="16" x2="71.2" y2="28.8" />
        <line x1="84" y1="84" x2="71.2" y2="71.2" />
        <line x1="16" y1="84" x2="28.8" y2="71.2" />
        <line x1="16" y1="16" x2="28.8" y2="28.8" />
    </svg>
);

// Inner Geometry (Complex Facets)
const GemBlueprintInner = () => (
    <svg viewBox="0 0 100 100" className="w-[120vw] h-[120vw] md:w-[900px] md:h-[900px] lg:w-[1200px] lg:h-[1200px] stroke-navy/15 stroke-[0.1] md:stroke-[0.05] fill-transparent overflow-visible">
        <line x1="50" y1="2" x2="71.2" y2="28.8" />
        <line x1="50" y1="2" x2="28.8" y2="28.8" />
        <line x1="98" y1="50" x2="71.2" y2="28.8" />
        <line x1="98" y1="50" x2="71.2" y2="71.2" />
        <line x1="50" y1="98" x2="71.2" y2="71.2" />
        <line x1="50" y1="98" x2="28.8" y2="71.2" />
        <line x1="2" y1="50" x2="28.8" y2="71.2" />
        <line x1="2" y1="50" x2="28.8" y2="28.8" />
        <polygon points="50,2 67,8 84,16 92,33 98,50 92,67 84,84 67,92 50,98 33,92 16,84 8,67 2,50 8,33 16,16 33,8" />
        <line x1="67" y1="8" x2="71.2" y2="28.8" />
        <line x1="92" y1="33" x2="71.2" y2="28.8" />
        <line x1="92" y1="67" x2="71.2" y2="71.2" />
        <line x1="67" y1="92" x2="71.2" y2="71.2" />
        <line x1="33" y1="92" x2="28.8" y2="71.2" />
        <line x1="8" y1="67" x2="28.8" y2="71.2" />
        <line x1="8" y1="33" x2="28.8" y2="28.8" />
        <line x1="33" y1="8" x2="28.8" y2="28.8" />
    </svg>
);

export default function Hero() {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section className="relative min-h-screen bg-cream overflow-hidden flex flex-col items-center justify-center pt-24 pb-12 px-6">
            
            {/* The Mesmerizing Multi-Layered Blueprint */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}>
                
                {/* Layer 1: Outer Structure rotating slowly Clockwise */}
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                    transition={{ 
                        rotate: { duration: 120, repeat: Infinity, ease: "linear" },
                        scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute z-0"
                >
                    <GemBlueprintOuter />
                </motion.div>

                {/* Layer 2: Inner Facets counter-rotating Counter-Clockwise */}
                <motion.div
                    animate={{ rotate: -360, scale: [1.05, 1, 1.05] }}
                    transition={{ 
                        rotate: { duration: 160, repeat: Infinity, ease: "linear" },
                        scale: { duration: 25, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute z-0"
                >
                    <GemBlueprintInner />
                </motion.div>

                {/* Animated Particles / Sparkles */}
                {isMounted && [...Array(25)].map((_, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        animate={{
                            opacity: [0, 1, 0.5, 0],
                            scale: [0, 1.5, 0.5, 0],
                            y: [0, -100, -200],
                            x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 5
                        }}
                        className="absolute w-[2px] h-[2px] bg-gold rounded-full blur-[0.5px]"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Content Layer */}
            <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center text-center z-10 relative h-full">
                
                {/* Top Label */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-4 px-6 py-2 border border-gold/30 rounded-full bg-cream/30 backdrop-blur-md">
                        {/* Glowing Diamond Left */}
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1],
                                filter: [
                                    'drop-shadow(0px 0px 4px rgba(212,175,55,0.4))', 
                                    'drop-shadow(0px 0px 12px rgba(212,175,55,1))', 
                                    'drop-shadow(0px 0px 4px rgba(212,175,55,0.4))'
                                ]
                            }} 
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="text-gold"
                        >
                            <DiamondIcon className="w-3 h-3" />
                        </motion.div>
                        
                        <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-navy font-bold">
                            Ceylon Blue Hues
                        </span>
                        
                        {/* Glowing Diamond Right */}
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1],
                                filter: [
                                    'drop-shadow(0px 0px 4px rgba(212,175,55,0.4))', 
                                    'drop-shadow(0px 0px 12px rgba(212,175,55,1))', 
                                    'drop-shadow(0px 0px 4px rgba(212,175,55,0.4))'
                                ]
                            }} 
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                            className="text-gold"
                        >
                            <DiamondIcon className="w-3 h-3" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Highly Animated Typography */}
                <div className="flex flex-col items-center justify-center gap-2 w-full z-10 relative">
                    <motion.h1
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="font-serif text-5xl md:text-7xl lg:text-[7rem] text-navy italic font-light leading-tight tracking-tight drop-shadow-sm"
                    >
                        Masterpieces
                    </motion.h1>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        className="font-serif text-6xl md:text-8xl lg:text-[8rem] text-navy font-bold leading-none tracking-tighter uppercase drop-shadow-md relative"
                    >
                        of Nature
                        {/* Animated Underline */}
                        <motion.div 
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                            className="absolute -bottom-4 left-1/4 right-1/4 h-[2px] bg-gold origin-center rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                        />
                    </motion.h1>
                    <motion.h1
                        initial={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                        className="font-serif text-5xl md:text-7xl lg:text-[7rem] text-navy italic font-light leading-tight tracking-tight drop-shadow-sm mt-6"
                    >
                        & Time
                    </motion.h1>
                </div>

                {/* Subtitle & CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    className="mt-16 flex flex-col items-center gap-10"
                >
                    <p className="text-navy/70 font-sans font-light text-sm md:text-base max-w-lg text-center leading-relaxed tracking-wide">
                        Ethically sourced, world-class gemstones from the historic mines of Ratnapura. Uncompromising quality, absolute traceability.
                    </p>
                    
                    <Link
                        href="#gemstones"
                        className="group relative inline-flex justify-center items-center px-12 py-5 text-[10px] md:text-[12px] font-sans font-bold tracking-[0.3em] uppercase text-navy border border-navy hover:border-gold hover:text-gold transition-colors duration-300 overflow-hidden bg-cream"
                    >
                        {/* Continuous shimmer effect on button */}
                        <motion.span 
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent skew-x-12 z-0"
                        />
                        <span className="relative z-10 transition-colors duration-300">Discover the Collection</span>
                    </Link>
                </motion.div>
                
            </div>
            
        </section>
    );
}
