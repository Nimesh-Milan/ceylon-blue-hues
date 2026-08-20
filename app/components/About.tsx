'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const GemBlueprint = () => (
    <svg viewBox="0 0 100 100" className="w-[150vw] h-[150vw] md:w-[1200px] md:h-[1200px] stroke-gold/20 stroke-[0.03] fill-transparent overflow-visible">
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="35" />
        <polygon points="50,2 84,16 98,50 84,84 50,98 16,84 2,50 16,16" />
        <polygon points="50,15 75,25 85,50 75,75 50,85 25,75 15,50 25,25" />
        <line x1="2" y1="50" x2="98" y2="50" className="stroke-navy/10 stroke-[0.02]" />
        <line x1="50" y1="2" x2="50" y2="98" className="stroke-navy/10 stroke-[0.02]" />
    </svg>
);

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

    return (
        <section id="about" ref={containerRef} className="relative bg-cream py-16 md:py-24 lg:py-32 px-6 md:px-12 overflow-hidden border-t border-navy/5 w-full">
            
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-60 overflow-hidden w-full">
                <motion.div
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                    animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                    transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                    className="absolute z-0"
                >
                    <GemBlueprint />
                </motion.div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-24 flex flex-col items-center"
                >
                    <div className="w-[1px] h-24 md:h-32 bg-gradient-to-b from-transparent via-gold to-transparent mb-8" />
                    <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.6em] text-navy font-bold">
                        The Legacy
                    </span>
                </motion.div>

                <div className="flex flex-col items-center w-full mb-32">
                    <motion.div style={{ y: y1 }} className="flex justify-start w-full md:w-3/4 lg:w-2/3 pl-0 md:pl-12 mb-4">
                        <h2 className="font-serif text-[12vw] md:text-[9vw] text-navy italic font-light leading-[0.9] tracking-tight">
                            Ancient
                        </h2>
                    </motion.div>
                    
                    <motion.div style={{ y: y2 }} className="flex justify-end w-full md:w-3/4 lg:w-2/3 pr-0 md:pr-12">
                        <h2 className="font-serif text-[14vw] md:text-[11vw] text-navy font-bold leading-[0.9] tracking-tighter uppercase relative">
                            Heritage
                            <span className="absolute -bottom-4 left-0 right-0 h-[1px] bg-navy/20" />
                        </h2>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 w-full max-w-6xl relative">
                    
                    <motion.div style={{ opacity }} className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-navy/10 hidden md:block -translate-x-1/2" />

                    <div className="md:col-span-5 flex flex-col justify-center">
                        <motion.p 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-2xl md:text-4xl font-serif italic text-navy leading-tight"
                        >
                            Sri Lanka has maintained its two-thousand-year-old tradition by prohibiting large-scale mechanized operations.
                        </motion.p>
                    </div>

                    <div className="md:col-span-2 hidden md:flex items-center justify-center">
                        <div className="w-4 h-4 border border-gold rotate-45" />
                    </div>

                    <div className="md:col-span-5 flex flex-col gap-8 justify-center">
                        <motion.p 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="text-navy/80 font-sans text-sm md:text-base leading-relaxed tracking-wide text-left"
                        >
                            This strategy not only creates more job opportunities for local communities but also guarantees the sustainability of gemstone resources for future extraction. Furthermore, Sri Lanka has led the way in improving the visual quality of rubies and sapphires through heat treatment, a method that has been recorded since the 13th century.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                        >
                            <h4 className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold text-navy mb-4">
                                Preserving The Heritage
                            </h4>
                            <p className="text-navy/80 font-sans text-sm leading-relaxed tracking-wide mb-4 text-left">
                                Gemstones have been culturally significant throughout various civilizations since ancient times, fulfilling roles in trade, personal adornment, and symbolic meaning. In modern society, the cultural and symbolic value of gemstones is frequently overlooked, as the market primarily focuses on their financial or investment potential.
                            </p>
                            <p className="text-navy/80 font-sans text-sm leading-relaxed tracking-wide text-left">
                                At the same time, many areas that mine gemstones are encountering unsustainable social, economic, and environmental issues.
                            </p>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
}

