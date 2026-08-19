'use client';
import { motion } from 'framer-motion';

const GemBlueprint = () => (
    <svg viewBox="0 0 100 100" className="w-[120vw] h-[120vw] md:w-[900px] md:h-[900px] stroke-gold/20 stroke-[0.05] fill-transparent overflow-visible">
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="35" />
        <polygon points="50,2 84,16 98,50 84,84 50,98 16,84 2,50 16,16" />
        <polygon points="50,15 75,25 85,50 75,75 50,85 25,75 15,50 25,25" />
    </svg>
);

export default function About() {
    return (
        <section id="about" className="relative bg-cream overflow-hidden flex flex-col items-center justify-center py-32 md:py-48 lg:py-64 px-6 md:px-12">
            
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-50 overflow-hidden" style={{ maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)" }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 250, repeat: Infinity, ease: "linear" }}
                    className="absolute z-0"
                >
                    <GemBlueprint />
                </motion.div>
            </div>

            <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center text-center z-10 relative">
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12 flex flex-col items-center"
                >
                    <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-transparent to-gold/50 mb-6 md:mb-8" />
                    <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-gold font-bold mb-2">
                        About Us
                    </span>
                </motion.div>

                <div className="flex flex-col items-center justify-center gap-0 w-full mb-16 md:mb-24">
                    <div className="overflow-hidden pb-4 md:pb-8 -mb-4 md:-mb-8">
                        <motion.h2 
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-serif text-[12vw] md:text-[9vw] lg:text-[8vw] text-navy italic font-light leading-[0.9] tracking-tight"
                        >
                            Our Ancient
                        </motion.h2>
                    </div>
                    <div className="overflow-hidden pb-4 md:pb-8 -mb-4 md:-mb-8">
                        <motion.h2 
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="font-serif text-[14vw] md:text-[11vw] lg:text-[10vw] text-navy font-bold leading-[0.9] tracking-tighter uppercase drop-shadow-sm"
                        >
                            Heritage
                        </motion.h2>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="mb-16 md:mb-24 px-4 max-w-3xl flex flex-col gap-6"
                >
                    <p className="text-xl md:text-2xl font-serif italic text-navy leading-relaxed mb-4">
                        Sri Lanka has MAINTAINED its two-thousand-year-old tradition of gemstone mining by PROHIBITING large-scale mechanized operations, instead prioritizing the preservation of small-scale mining techniques.
                    </p>
                    
                    <p className="text-navy/70 font-sans font-light text-sm md:text-base leading-relaxed tracking-wide text-center">
                        This strategy not only creates more job opportunities for local communities but also guarantees the sustainability of gemstone resources for future extraction. Furthermore, Sri Lanka has led the way in improving the visual quality of rubies and sapphires through heat treatment, a method that has been recorded since the 13th century.
                    </p>
                </motion.div>

                <div className="w-[1px] h-12 bg-navy/20 mb-16" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    className="max-w-3xl px-4 flex flex-col gap-6"
                >
                    <h4 className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold text-navy/40 mb-2">
                        Preserving The Heritage
                    </h4>
                    
                    <p className="text-navy/70 font-sans font-light text-sm md:text-base leading-relaxed tracking-wide text-center">
                        Gemstones have been culturally significant throughout various civilizations since ancient times, fulfilling roles in trade, personal adornment, and symbolic meaning. In modern society, the cultural and symbolic value of gemstones is frequently overlooked, as the market primarily focuses on their financial or investment potential.
                    </p>
                    <p className="text-navy/70 font-sans font-light text-sm md:text-base leading-relaxed tracking-wide text-center">
                        At the same time, many areas that mine gemstones are encountering unsustainable social, economic, and environmental issues.
                    </p>
                </motion.div>
                
            </div>
        </section>
    );
}