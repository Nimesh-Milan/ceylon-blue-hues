'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Sustainability() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    const xMarquee1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
    const xMarquee2 = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

    return (
        <section id="sustainability" ref={containerRef} className="relative bg-gradient-to-b from-[#FDFBF7] to-cream py-16 md:py-24 px-6 md:px-12 overflow-hidden border-t border-navy/5 w-full">
            
            <div className="absolute inset-0 z-0 flex flex-col justify-center pointer-events-none opacity-[0.03] overflow-hidden gap-8 w-full">
                <motion.div style={{ x: xMarquee1 }} className="whitespace-nowrap">
                    <span className="font-serif italic text-[20vw] text-navy">
                        SUSTAINABLE TRACEABLE ETHICAL SUSTAINABLE TRACEABLE ETHICAL
                    </span>
                </motion.div>
                <motion.div style={{ x: xMarquee2 }} className="whitespace-nowrap">
                    <span className="font-serif italic text-[20vw] text-navy">
                        ETHICAL SUSTAINABLE TRACEABLE ETHICAL SUSTAINABLE TRACEABLE
                    </span>
                </motion.div>
            </div>

            <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center">
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 flex flex-col items-center"
                >
                    <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-navy/50 font-bold mb-6">
                        Ethical Practice
                    </span>
                    <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-navy/30 to-transparent" />
                </motion.div>

                <div className="flex flex-col items-center justify-center gap-0 w-full mb-32">
                    <div className="overflow-hidden pb-2 -mb-2">
                        <motion.h2 
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-serif text-[12vw] md:text-[8vw] text-navy italic font-light leading-[1.1] tracking-tight"
                        >
                            Sustainable
                        </motion.h2>
                    </div>
                    <div className="overflow-hidden pb-4 -mb-4">
                        <motion.h2 
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="font-serif text-[14vw] md:text-[10vw] text-navy font-bold leading-[0.9] tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-navy via-navy to-navy/70 relative inline-block"
                        >
                            Future
                            <span className="absolute -top-4 right-0 w-16 h-[1px] bg-gold" />
                            <span className="absolute top-0 -right-4 w-[1px] h-16 bg-gold" />
                        </motion.h2>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-16 md:gap-24 w-full max-w-5xl text-center md:text-left">
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1"
                    >
                        <h3 className="font-serif text-3xl md:text-4xl text-navy italic mb-6">Land Restoration</h3>
                        <p className="text-navy/80 font-sans text-sm md:text-base leading-relaxed tracking-wide text-left md:text-left">
                            By adopting sustainable mining practices, initiating land restoration projects, and enhancing regulatory frameworks, Sri Lanka can preserve its gemstone heritage while protecting its environment. It is crucial to shift towards eco-friendly mining methods to safeguard the island's natural beauty and ensure a sustainable future for both the gemstone industry and the ecosystem.
                        </p>
                    </motion.div>

                    <div className="w-24 h-[1px] md:w-[1px] md:h-32 bg-gold/50 shrink-0" />

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="flex-1"
                    >
                        <h3 className="font-serif text-3xl md:text-4xl text-navy italic mb-6">Community Cooperatives</h3>
                        <p className="text-navy/80 font-sans text-sm md:text-base leading-relaxed tracking-wide text-left md:text-left">
                            Additionally, enabling local communities to manage mining activities through cooperative models can greatly reduce environmental impacts. Involving local residents in the decision-making process and guaranteeing that they benefit from these resources will boost their commitment to sustainable management.
                        </p>
                    </motion.div>
                    
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    className="mt-32 p-8 md:p-12 border border-navy/10 bg-white/50 backdrop-blur-sm max-w-4xl text-center relative"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-b from-[#FDFBF7] to-cream border border-gold rotate-45" />
                    <p className="font-serif italic text-navy text-xl md:text-2xl leading-relaxed">
                        Our Objective is to ENSURE that artisanal mining PRACTICES are Safeguarded.
                    </p>
                </motion.div>

            </div>
        </section>
    );
}

