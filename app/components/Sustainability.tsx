'use client';
import { motion } from 'framer-motion';

const GemBlueprintSustain = () => (
    <svg viewBox="0 0 100 100" className="w-[120vw] h-[120vw] md:w-[900px] md:h-[900px] stroke-navy/10 stroke-[0.05] fill-transparent overflow-visible">
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="35" />
        <circle cx="50" cy="50" r="20" />
        {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = Math.round((50 + 48 * Math.cos(angle)) * 1000) / 1000;
            const y = Math.round((50 + 48 * Math.sin(angle)) * 1000) / 1000;
            return <line key={i} x1="50" y1="50" x2={x} y2={y} />
        })}
    </svg>
);

export default function Sustainability() {
    return (
        <section id="sustainability" className="relative bg-[#FDFBF7] overflow-hidden flex flex-col items-center justify-center py-24 md:py-32 lg:py-48 px-6 md:px-12">
            
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
                    className="absolute z-0"
                >
                    <GemBlueprintSustain />
                </motion.div>
            </div>

            <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center text-center z-10 relative">
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8 flex flex-col items-center"
                >
                    <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-transparent to-navy/30 mb-6 md:mb-8" />
                    <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-navy/50 font-bold">
                        Ethical Practice
                    </span>
                </motion.div>

                <div className="flex flex-col items-center justify-center gap-0 w-full mb-16 md:mb-24">
                    <div className="overflow-hidden pb-4 md:pb-8 -mb-4 md:-mb-8">
                        <motion.h2 
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-serif text-[10vw] md:text-[8vw] lg:text-[7vw] text-navy italic font-light leading-[0.9]"
                        >
                            Sustainable
                        </motion.h2>
                    </div>
                    <div className="overflow-hidden pb-4 md:pb-8 -mb-4 md:-mb-8">
                        <motion.h2 
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="font-serif text-[12vw] md:text-[10vw] lg:text-[9vw] text-navy font-bold leading-[0.9] tracking-tighter uppercase"
                        >
                            Future
                        </motion.h2>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="mb-24 px-4 max-w-4xl"
                >
                    <p className="text-xl md:text-3xl font-serif italic text-navy leading-relaxed">
                        Our Objective is to ENSURE that artisanal mining PRACTICES are Safeguarded, preserved, Promoted, Validated, and Granted access to formalization and INTERNATIONAL markets under equitable CONDITIONS.
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row items-start gap-12 md:gap-16 max-w-4xl px-4 md:px-0">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        className="flex flex-col items-center md:items-start text-center md:text-left flex-1"
                    >
                        <h3 className="font-serif text-2xl md:text-3xl text-navy italic mb-4">Land Restoration</h3>
                        <p className="text-navy/70 font-sans font-light text-[11px] md:text-xs leading-relaxed uppercase tracking-[0.1em]">
                            By adopting sustainable mining practices, initiating land restoration projects, and enhancing regulatory frameworks, Sri Lanka can preserve its gemstone heritage while protecting its environment. It is crucial to shift towards eco-friendly mining methods to safeguard the island's natural beauty and ensure a sustainable future for both the gemstone industry and the ecosystem.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                        className="flex flex-col items-center md:items-start text-center md:text-left flex-1"
                    >
                        <h3 className="font-serif text-2xl md:text-3xl text-navy italic mb-4">Community Cooperatives</h3>
                        <p className="text-navy/70 font-sans font-light text-[11px] md:text-xs leading-relaxed uppercase tracking-[0.1em]">
                            Additionally, enabling local communities to manage mining activities through cooperative models can greatly reduce environmental impacts. Involving local residents in the decision-making process and guaranteeing that they benefit from these resources will boost their commitment to sustainable management.
                        </p>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}