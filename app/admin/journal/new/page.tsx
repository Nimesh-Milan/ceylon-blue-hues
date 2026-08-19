'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NewPostPage() {
    const router = useRouter();
    const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', cover_image: '', category: '' });
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/admin/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) router.push('/admin/journal');
        setLoading(false);
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-navy/5 pb-12">
                <div>
                    <h1 className="text-[6vw] md:text-4xl lg:text-5xl font-serif italic text-navy mb-4 leading-none tracking-tight">Draft Story</h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-navy/40 font-bold">Editorial Entry</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                
                <div className="flex flex-col gap-8">
                    <div>
                        <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-navy/40 mb-2">Title</label>
                        <input required value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-transparent border-b border-navy/20 py-4 text-3xl md:text-5xl font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20" placeholder="The Art of Sourcing" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-navy/40 mb-2">Slug</label>
                            <input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full bg-transparent border-b border-navy/20 py-3 text-lg font-sans text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20" />
                        </div>
                        <div>
                            <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-navy/40 mb-2">Category</label>
                            <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-transparent border-b border-navy/20 py-3 text-lg font-sans text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-navy/40 mb-2">Cover Image URL</label>
                        <input value={form.cover_image} onChange={e => setForm({...form, cover_image: e.target.value})} className="w-full bg-transparent border-b border-navy/20 py-3 text-lg font-sans text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20" />
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <div>
                        <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-navy/40 mb-4">Excerpt</label>
                        <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full bg-transparent border-b border-navy/20 py-3 text-xl font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20 h-24 resize-none" placeholder="A brief summary..." />
                    </div>
                    <div>
                        <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-navy/40 mb-4">Content (HTML)</label>
                        <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full bg-transparent border-b border-navy/20 py-3 text-lg font-sans text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20 min-h-[300px] resize-y" placeholder="<p>Story begins here...</p>" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-12 border-t border-navy/10 gap-8">
                    <Link href="/admin/journal" className="text-[9px] uppercase tracking-[0.3em] text-navy/40 hover:text-navy font-bold transition-colors border-b border-transparent hover:border-navy pb-1">
                        Cancel & Return
                    </Link>
                    <button type="submit" disabled={loading} className="group relative inline-flex justify-center items-center px-16 py-6 text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-navy border border-navy hover:text-gold hover:border-gold transition-colors duration-500 overflow-hidden bg-transparent disabled:opacity-50">
                        <motion.span 
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent skew-x-12 z-0"
                        />
                        <span className="relative z-10 transition-colors duration-500">{loading ? 'Publishing...' : 'Publish Entry'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}