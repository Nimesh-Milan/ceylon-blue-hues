'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/app/components/Button';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ gems: 0, inquiries: 0, unread: 0 });
    const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [gemsRes, inqRes] = await Promise.all([
                    fetch('/api/admin/gemstones'),
                    fetch('/api/admin/inquiries'),
                ]);

                if (gemsRes.ok && inqRes.ok) {
                    const gems = await gemsRes.json();
                    const inqs = await inqRes.json();
                    
                    setStats({
                        gems: gems.length,
                        inquiries: inqs.length,
                        unread: inqs.filter((i: any) => i.status === 'unread').length
                    });
                    
                    setRecentInquiries(inqs.slice(0, 5));
                }
            } catch (error) {
                console.error('Failed to load admin data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <div className="w-full">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 border-b border-navy/5 pb-12">
                <div>
                    <h1 className="text-[8vw] md:text-5xl lg:text-6xl font-serif italic text-navy mb-4 leading-none tracking-tight">Overview</h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-navy/40 font-bold">Workspace & Analytics</p>
                </div>
                <Button href="/admin/gemstones/new" size="sm">
                    + Add Masterpiece
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-t-2 border-gold rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
                        <div className="flex flex-col">
                            <span className="text-[9px] tracking-[0.4em] uppercase text-navy/40 font-bold mb-4">Total Stones</span>
                            <span className="font-serif italic text-7xl md:text-8xl lg:text-9xl text-navy">{stats.gems}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] tracking-[0.4em] uppercase text-navy/40 font-bold mb-4">Total Inquiries</span>
                            <span className="font-serif italic text-7xl md:text-8xl lg:text-9xl text-navy">{stats.inquiries}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] tracking-[0.4em] uppercase text-navy/40 font-bold mb-4">Unread</span>
                            <span className={`font-serif italic text-7xl md:text-8xl lg:text-9xl ${stats.unread > 0 ? 'text-gold' : 'text-navy/20'}`}>{stats.unread}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        
                        <div>
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-3xl md:text-4xl font-serif italic text-navy">Recent Inquiries</h2>
                                <Link href="/admin/inquiries" className="text-[9px] uppercase font-bold tracking-[0.3em] text-gold hover:text-navy transition-colors">View All</Link>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                {recentInquiries.length === 0 ? (
                                    <p className="text-sm font-light text-navy/40 italic">No inquiries yet.</p>
                                ) : (
                                    recentInquiries.map(inq => (
                                        <div key={inq.id} className="flex items-center justify-between border-b border-navy/5 pb-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm text-navy font-medium">{inq.name}</span>
                                                <span className="text-[10px] text-navy/50 font-light truncate max-w-[200px] md:max-w-[300px]">{inq.subject}</span>
                                            </div>
                                            <span className={`text-[8px] font-bold tracking-[0.3em] uppercase ${
                                                inq.status === 'unread' ? 'text-gold' : 'text-navy/30'
                                            }`}>
                                                {inq.status}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-start border-l border-navy/5 pl-0 lg:pl-12">
                            <h2 className="text-3xl md:text-4xl font-serif italic text-navy mb-6">The Journal</h2>
                            <p className="text-sm font-light text-navy/60 max-w-sm mb-12 leading-relaxed tracking-wide">
                                Curate the legacy. Manage articles, news, and journal entries to engage your audience with the heritage of Ceylon.
                            </p>
                            <Link href="/admin/journal" className="inline-flex text-[9px] font-bold tracking-[0.3em] uppercase text-navy border-b border-navy/20 pb-1 hover:text-gold hover:border-gold transition-all">
                                Open Journal Editor &rarr;
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}