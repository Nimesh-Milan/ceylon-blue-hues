'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const GemBlueprintFooter = () => (
    <svg viewBox="0 0 100 100" className="w-[120vw] h-[120vw] md:w-[1200px] md:h-[1200px] stroke-gold/10 stroke-[0.05] fill-transparent overflow-visible">
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="20" />
        <polygon points="50,2 84,16 98,50 84,84 50,98 16,84 2,50 16,16" />
        <line x1="50" y1="2" x2="50" y2="98" />
        <line x1="2" y1="50" x2="98" y2="50" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="relative bg-cream pt-32 pb-12 overflow-hidden border-t border-navy/5">
            
            {/* Massive Spinning Watermark */}
            <div 
                className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-50"
                style={{ 
                    maskImage: "linear-gradient(to top, transparent, black 20%, black 80%, transparent)", 
                    WebkitMaskImage: "linear-gradient(to top, transparent, black 20%, black 80%, transparent)" 
                }}
            >
                <motion.div
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 250, repeat: Infinity, ease: "linear" }}
                    className="absolute z-0 top-[20%]"
                >
                    <GemBlueprintFooter />
                </motion.div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center">
                
                {/* Massive Typographic Logo */}
                <div className="w-full flex flex-col items-center justify-center text-center mb-24 overflow-hidden">
                    <motion.h2 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="font-serif text-[12vw] md:text-[10vw] lg:text-[9vw] text-navy italic font-light leading-none tracking-tight"
                    >
                        Ceylon
                    </motion.h2>
                    <motion.h2 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="font-serif text-[13vw] md:text-[11vw] lg:text-[10vw] text-navy font-bold leading-none tracking-tighter uppercase mt-2"
                    >
                        Blue Hues
                    </motion.h2>
                </div>

                {/* Minimalist Centered Links */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-24 mb-16 md:mb-32 w-full">
                    
                    <div className="flex flex-col items-center text-center gap-4 flex-1">
                        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold font-bold mb-4">Explore</span>
                        <Link href="/collection" className="relative group font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-navy/60 hover:text-navy transition-colors">
                            Collection
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-gold -translate-x-1/2 transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link href="/#about" className="relative group font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-navy/60 hover:text-navy transition-colors">
                            Heritage
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-gold -translate-x-1/2 transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link href="/#sustainability" className="relative group font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-navy/60 hover:text-navy transition-colors">
                            Ethics
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-gold -translate-x-1/2 transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link href="/journal" className="relative group font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-navy/60 hover:text-navy transition-colors mt-2">
                            The Journal
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-gold -translate-x-1/2 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </div>

                    <div className="hidden md:block w-[1px] h-32 bg-navy/10 mt-4" />

                    <div className="flex flex-col items-center text-center gap-4 flex-1">
                        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold font-bold mb-4">Direct</span>
                        <a href="mailto:sales-us@ceybluehues.com" className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-navy/60 hover:text-navy transition-colors">sales-us@ceybluehues.com</a>
                        <a href="tel:+94723553882" className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-navy/60 hover:text-navy transition-colors">+94 72 355 3882</a>
                    </div>

                    <div className="hidden md:block w-[1px] h-32 bg-navy/10 mt-4" />

                    <div className="flex flex-col items-center text-center gap-4 flex-1">
                        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold font-bold mb-4">Headquarters</span>
                        <p className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-navy/60 leading-loose">
                            Ceylon Blue Hues Pvt Ltd<br/>
                            Level 26, East Tower<br/>
                            World Trade Center<br/>
                            Echelon Square<br/>
                            Colombo 00100, Sri Lanka
                        </p>
                    </div>
                    
                </div>

                {/* Bottom Bar */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between pt-8 border-t border-navy/10">
                    
                    <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-navy/40 mb-6 md:mb-0">
                        &copy; {new Date().getFullYear()} Ceylon Blue Hues.
                    </p>

                    <div className="flex items-center gap-6 md:gap-8">
                        <Link href="/privacy" className="relative group font-sans text-[9px] uppercase tracking-[0.3em] text-navy/40 hover:text-gold transition-colors">
                            Privacy
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-gold -translate-x-1/2 transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link href="/terms" className="relative group font-sans text-[9px] uppercase tracking-[0.3em] text-navy/40 hover:text-gold transition-colors">
                            Terms
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-gold -translate-x-1/2 transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link href="/admin/login" className="relative group font-sans text-[9px] uppercase tracking-[0.3em] text-navy/40 hover:text-gold transition-colors">
                            Staff
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-gold -translate-x-1/2 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </div>

                </div>

            </div>
        </footer>
    );
}


