'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { motion } from 'framer-motion';

const JournalBlueprint = () => (
    <svg viewBox="0 0 100 100" className="w-[120vw] h-[120vw] md:w-[900px] md:h-[900px] stroke-gold/10 stroke-[0.05] fill-transparent overflow-visible">
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="35" />
        <polygon points="50,2 84,16 98,50 84,84 50,98 16,84 2,50 16,16" />
        <polygon points="50,15 75,25 85,50 75,75 50,85 25,75 15,50 25,25" />
    </svg>
);

export default function JournalPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch('/api/posts');
                const data = await res.json();
                setPosts(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    return (
        <div className="bg-cream min-h-screen text-navy font-sans relative overflow-hidden">
            <Header />
            
            {/* Massive Header Section */}
            <section className="relative pt-48 pb-24 md:pt-64 md:pb-32 px-6 overflow-hidden flex flex-col items-center">
                <div 
                    className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-50"
                    style={{ maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)" }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 250, repeat: Infinity, ease: "linear" }}
                        className="absolute z-0"
                    >
                        <JournalBlueprint />
                    </motion.div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8 flex flex-col items-center"
                    >
                        <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-navy/50 font-bold mb-8">
                            Our Stories
                        </span>
                        <div className="w-[1px] h-16 bg-gradient-to-b from-navy/30 to-transparent" />
                    </motion.div>

                    <div className="flex flex-col items-center justify-center gap-0 w-full mb-12">
                        <div className="overflow-hidden pb-4 -mb-4">
                            <motion.h1 
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="font-serif text-[12vw] md:text-[9vw] lg:text-[8vw] text-navy italic font-light leading-[0.9]"
                            >
                                The Heritage
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden pb-4 -mb-4">
                            <motion.h1 
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="font-serif text-[14vw] md:text-[11vw] lg:text-[10vw] text-navy font-bold leading-[0.9] tracking-tighter uppercase"
                            >
                                Journal
                            </motion.h1>
                        </div>
                    </div>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="text-sm md:text-base font-sans font-light text-navy/70 leading-relaxed max-w-lg tracking-wide text-center"
                    >
                        Insights, sourcing journeys, and the ancient legacy of Ceylon sapphires.
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <main className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-48 relative z-10">
                {loading ? (
                    <div className="w-full text-center py-32">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-t-2 border-gold rounded-full mx-auto" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-32 max-w-5xl mx-auto">
                        {posts.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                            >
                                <Link href={`/journal/${post.slug}`} className="group block relative cursor-pointer outline-none">
                                    <div className="flex flex-col items-center">
                                        
                                        {/* Floating Image */}
                                        <div className="relative w-full aspect-[4/5] md:aspect-[3/4] mb-8 overflow-hidden rounded-md bg-[#FDFBF7]">
                                            {post.cover_image ? (
                                                <Image 
                                                    src={post.cover_image} 
                                                    alt={post.title} 
                                                    fill 
                                                    className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" 
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-navy/20 font-sans font-bold uppercase tracking-widest text-[10px]">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Centered Minimalist Info */}
                                        <div className="flex flex-col items-center text-center px-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-gold">
                                                    {post.category || 'Article'}
                                                </span>
                                                <span className="w-1 h-1 bg-navy/20 rounded-full" />
                                                <span className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-navy/40">
                                                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h2 className="font-serif text-3xl md:text-4xl text-navy italic mb-4 transition-colors duration-500 group-hover:text-gold">
                                                {post.title}
                                            </h2>
                                            <p className="text-navy/60 font-sans font-light text-xs leading-relaxed max-w-sm">
                                                {post.excerpt}
                                            </p>
                                        </div>

                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}