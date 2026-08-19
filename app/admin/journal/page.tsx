'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function JournalDirectory() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 border-b border-navy/5 pb-12">
                <div>
                    <h1 className="text-[8vw] md:text-5xl lg:text-6xl font-serif italic text-navy mb-4 leading-none tracking-tight">The Journal</h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-navy/40 font-bold">Editorial Archive</p>
                </div>
                <Link href="/admin/journal/new" className="group relative inline-flex justify-center items-center px-10 py-4 text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-navy border border-navy hover:text-gold hover:border-gold transition-colors duration-500 bg-transparent whitespace-nowrap">
                    <span className="relative z-10 transition-colors duration-500">+ Draft Story</span>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-t-2 border-gold rounded-full animate-spin" />
                </div>
            ) : posts.length === 0 ? (
                <div className="py-32 text-center flex flex-col items-center">
                    <p className="text-3xl font-serif italic text-navy mb-4">No Stories Found</p>
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-navy/40">The archive is empty</p>
                </div>
            ) : (
                <div className="flex flex-col divide-y divide-navy/10 border-t border-navy/10">
                    {posts.map((post) => (
                        <Link
                            href={`/admin/journal/${post.id}/edit`}
                            key={post.id}
                            className="group flex flex-col md:flex-row md:items-center justify-between py-8 px-4 hover:bg-gold/5 transition-colors duration-500"
                        >
                            <div className="flex flex-col gap-2">
                                <h3 className="text-2xl md:text-3xl font-serif italic text-navy group-hover:text-gold transition-colors">{post.title}</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-navy/40">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                    {post.category && (
                                        <>
                                            <span className="w-1 h-1 bg-navy/20 rounded-full" />
                                            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold">
                                                {post.category}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-6">
                                <span className={`text-[9px] font-bold tracking-[0.3em] uppercase ${post.published ? 'text-navy/50' : 'text-orange-600/70'}`}>
                                    {post.published ? 'Published' : 'Draft'}
                                </span>
                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-navy/20 group-hover:text-gold group-hover:translate-x-2 transition-all">
                                    Edit &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}