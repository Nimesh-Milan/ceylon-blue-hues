'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { motion } from 'framer-motion';

export default function SinglePostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            try {
                const decoded = decodeURIComponent(slug);
                const res = await fetch(`/api/posts/${decoded}`);
                const data = await res.json();
                setPost(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-t-2 border-gold rounded-full" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="bg-cream min-h-screen pt-40 flex flex-col items-center justify-center text-center">
                <h1 className="font-serif text-5xl text-navy italic mb-4">Story Not Found</h1>
                <Link href="/journal" className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gold hover:text-navy transition-colors">Return to Journal</Link>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen text-navy font-sans selection:bg-gold/20">
            <Header />
            
            <main className="pt-40 md:pt-48 pb-32">
                <article className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center">
                    
                    {/* Editorial Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center gap-6 mb-16 text-center max-w-4xl"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-gold">
                                {post.category || 'Editorial'}
                            </span>
                            <span className="w-1 h-1 bg-navy/20 rounded-full" />
                            <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-navy/40">
                                {new Date(post.published_at || post.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <h1 className="font-serif text-[10vw] md:text-[6vw] lg:text-[5vw] text-navy italic leading-[0.95] tracking-tight">
                            {post.title}
                        </h1>

                    </motion.div>

                    {/* Massive Floating Image */}
                    {post.cover_image && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="w-full max-w-5xl aspect-video relative mb-16 md:mb-24 bg-[#FDFBF7] mix-blend-multiply drop-shadow-2xl overflow-hidden"
                        >
                            <Image 
                                src={post.cover_image} 
                                alt={post.title} 
                                fill 
                                className="object-cover" 
                                priority
                            />
                        </motion.div>
                    )}

                    {/* Centered Prose Body */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                        className="w-full max-w-3xl mb-24 md:mb-32"
                    >
                        <div className="prose prose-lg md:prose-xl prose-headings:font-serif prose-headings:italic prose-headings:text-navy prose-p:text-navy/70 prose-p:font-light prose-p:leading-relaxed prose-p:tracking-wide prose-a:text-gold prose-a:no-underline hover:prose-a:text-navy prose-strong:font-medium prose-strong:text-navy prose-img:rounded-sm mx-auto">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                    </motion.div>

                    {/* Return Link */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-[1px] h-16 bg-gradient-to-b from-navy/30 to-transparent mb-8" />
                        <Link href="/journal" className="group relative inline-flex justify-center items-center px-6 py-4 md:px-16 md:py-6 text-center text-[10px] md:text-[12px] font-sans font-bold tracking-[0.3em] uppercase text-navy border border-navy hover:text-gold hover:border-gold transition-colors duration-500 overflow-hidden bg-transparent">
                            <motion.span 
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent skew-x-12 z-0"
                            />
                            <span className="relative z-10 transition-colors duration-500">Return to Journal</span>
                        </Link>
                    </motion.div>

                </article>
            </main>

            <Footer />
        </div>
    );
}
