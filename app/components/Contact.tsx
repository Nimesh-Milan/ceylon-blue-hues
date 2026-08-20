'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

export default function Contact() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <section id="contact" className="py-16 md:py-20 lg:py-24 bg-cream relative overflow-hidden flex flex-col items-center px-6">
            
            <div className="max-w-[1400px] mx-auto relative z-10 w-full">
                
                <div className="flex flex-col items-center text-center">
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8 flex flex-col items-center"
                    >
                        <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-transparent to-navy/30 mb-6 md:mb-8" />
                        <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-navy/50 font-bold">
                            Private Services
                        </span>
                    </motion.div>

                    <div className="flex flex-col items-center justify-center gap-0 w-full mb-12 md:mb-16">
                        <div className="overflow-hidden pb-4 md:pb-8 -mb-4 md:-mb-8">
                            <motion.h2 
                                initial={{ y: "100%" }}
                                whileInView={{ y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="font-serif text-[12vw] md:text-[9vw] lg:text-[8vw] text-navy italic font-light leading-[0.9]"
                            >
                                Submit an
                            </motion.h2>
                        </div>
                        <div className="overflow-hidden pb-4 md:pb-8 -mb-4 md:-mb-8">
                            <motion.h2 
                                initial={{ y: "100%" }}
                                whileInView={{ y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="font-serif text-[14vw] md:text-[11vw] lg:text-[10vw] text-navy font-bold leading-[0.9] tracking-tighter uppercase"
                            >
                                Inquiry
                            </motion.h2>
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.4 }}
                        className="w-full max-w-2xl px-4 md:px-0"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-10">
                            {status === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12 md:py-20"
                                >
                                    <h3 className="font-serif text-3xl md:text-5xl text-navy italic mb-4 md:mb-6">Request Received</h3>
                                    <p className="font-sans font-light text-navy/70 tracking-wide text-xs md:text-sm">Our curation team will contact you shortly.</p>
                                    <div className="w-16 h-px bg-gold/50 mx-auto mt-8" />
                                </motion.div>
                            ) : (
                                <>
                                    <div className="relative group w-full flex flex-col">
                                        <label htmlFor="name" className="sr-only">Your Name</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            required 
                                            className="w-full bg-navy/[0.02] border-b border-navy/20 py-4 md:py-5 px-4 text-center font-serif text-xl md:text-2xl text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus:bg-navy/[0.04] focus:border-gold transition-all duration-300 placeholder-navy/40 hover:bg-navy/[0.03]" 
                                            placeholder="Your Name" 
                                        />
                                    </div>
                                    <div className="relative group w-full flex flex-col">
                                        <label htmlFor="email" className="sr-only">Email Address</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            required 
                                            className="w-full bg-navy/[0.02] border-b border-navy/20 py-4 md:py-5 px-4 text-center font-serif text-xl md:text-2xl text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus:bg-navy/[0.04] focus:border-gold transition-all duration-300 placeholder-navy/40 hover:bg-navy/[0.03]" 
                                            placeholder="Email Address" 
                                        />
                                    </div>
                                    <div className="relative group mb-6 md:mb-8 w-full flex flex-col">
                                        <label htmlFor="message" className="sr-only">Message or Reference ID</label>
                                        <textarea 
                                            id="message" 
                                            rows={2} 
                                            required 
                                            className="w-full bg-navy/[0.02] border-b border-navy/20 py-4 md:py-5 px-4 text-center font-serif text-xl md:text-2xl text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus:bg-navy/[0.04] focus:border-gold transition-all duration-300 placeholder-navy/40 hover:bg-navy/[0.03] resize-none" 
                                            placeholder="Message or Reference ID"
                                        ></textarea>
                                    </div>
                                    
                                    <div className="flex justify-center mt-4">
                                        <Button type="submit" disabled={status === 'loading'}>
                                            {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
