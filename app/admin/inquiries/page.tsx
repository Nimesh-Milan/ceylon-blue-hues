'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/inquiries')
            .then(res => res.json())
            .then(data => setInquiries(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const markRead = async (id: number) => {
        try {
            await fetch(`/api/admin/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'read' })
            });
            setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: 'read' } : i));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 border-b border-navy/5 pb-12">
                <div>
                    <h1 className="text-[8vw] md:text-5xl lg:text-6xl font-serif italic text-navy mb-4 leading-none tracking-tight">Client Inquiries</h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-navy/40 font-bold">Private Correspondence</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-t-2 border-gold rounded-full animate-spin" />
                </div>
            ) : inquiries.length === 0 ? (
                <div className="py-32 text-center flex flex-col items-center">
                    <p className="text-3xl font-serif italic text-navy mb-4">No Correspondence Found</p>
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-navy/40">Inbox is empty</p>
                </div>
            ) : (
                <div className="flex flex-col divide-y divide-navy/10 border-t border-navy/10">
                    {inquiries.map((inq) => (
                        <div
                            key={inq.id}
                            className={`flex flex-col md:flex-row justify-between py-12 px-4 transition-colors duration-500 ${inq.status === 'unread' ? 'bg-gold/5' : 'hover:bg-[#FDFBF7]'}`}
                        >
                            <div className="flex flex-col gap-4 max-w-3xl">
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="text-2xl font-serif italic text-navy">{inq.name}</h3>
                                    <span className="w-1 h-1 bg-navy/20 rounded-full" />
                                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-navy/40">{inq.email}</span>
                                    {inq.status === 'unread' && (
                                        <>
                                            <span className="w-1 h-1 bg-navy/20 rounded-full" />
                                            <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-gold bg-gold/10 px-2 py-1">New</span>
                                        </>
                                    )}
                                </div>
                                
                                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-navy/60">{inq.subject}</p>
                                
                                <p className="text-sm font-light text-navy/80 leading-relaxed tracking-wide whitespace-pre-wrap">
                                    {inq.message}
                                </p>
                            </div>
                            <div className="mt-8 md:mt-0 flex flex-col items-start md:items-end gap-6 justify-between">
                                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-navy/30">
                                    {new Date(inq.created_at).toLocaleDateString()}
                                </span>
                                {inq.status === 'unread' && (
                                    <button 
                                        onClick={() => markRead(inq.id)}
                                        className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold border-b border-gold/30 hover:border-gold transition-all"
                                    >
                                        Mark as Read &rarr;
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}