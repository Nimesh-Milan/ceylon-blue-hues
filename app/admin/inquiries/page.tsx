'use client';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetch('/api/admin/inquiries')
            .then(res => res.json())
            .then(data => setInquiries(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            await fetch(`/api/admin/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
        } catch (e) {
            console.error(e);
        }
    };

    const deleteInquiry = async (id: number) => {
        if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;
        try {
            await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
            setInquiries(prev => prev.filter(i => i.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const filteredInquiries = useMemo(() => {
        return inquiries.filter(inq => {
            const matchesSearch = 
                inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                inq.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                inq.subject.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === 'All' || inq.status === statusFilter.toLowerCase();
            
            return matchesSearch && matchesStatus;
        });
    }, [inquiries, searchQuery, statusFilter]);

    const statuses = ['All', 'Unread', 'Read', 'Replied', 'Archived'];

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-16 border-b border-navy/5 pb-8 md:pb-12">
                <div>
                    <h1 className="text-[8vw] md:text-5xl lg:text-6xl font-serif italic text-navy mb-4 leading-none tracking-tight">Client Inquiries</h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-navy/40 font-bold">Private Correspondence</p>
                </div>
                
                <div className="flex flex-col gap-6 md:items-end w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="Search name, email, or subject..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-72 bg-navy/[0.02] border-b border-navy/20 py-3 px-4 text-sm font-sans text-navy focus:outline-none focus:bg-navy/[0.04] focus:border-gold transition-all duration-300 placeholder-navy/30"
                    />
                    <div className="flex flex-wrap gap-4">
                        {statuses.map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-colors duration-300 ${
                                    statusFilter === s ? 'text-gold border-b border-gold pb-1' : 'text-navy/40 hover:text-navy pb-1'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-t-2 border-gold rounded-full animate-spin" />
                </div>
            ) : filteredInquiries.length === 0 ? (
                <div className="py-32 text-center flex flex-col items-center">
                    <p className="text-3xl font-serif italic text-navy mb-4">No Correspondence Found</p>
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-navy/40">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="flex flex-col divide-y divide-navy/10 border-t border-navy/10">
                    <AnimatePresence>
                        {filteredInquiries.map((inq) => (
                            <motion.div
                                key={inq.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.3 }}
                                className={`flex flex-col md:flex-row justify-between py-8 md:py-12 px-4 md:px-6 transition-colors duration-500 ${inq.status === 'unread' ? 'bg-gold/5' : 'hover:bg-[#FDFBF7]'}`}
                            >
                                <div className="flex flex-col gap-4 max-w-3xl">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                        <h3 className="text-xl md:text-2xl font-serif italic text-navy">{inq.name}</h3>
                                        <span className="hidden md:block w-1 h-1 bg-navy/20 rounded-full" />
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-navy/40 break-all">{inq.email}</span>
                                            <span className="hidden md:block w-1 h-1 bg-navy/20 rounded-full" />
                                        <span className={`text-[8px] font-bold tracking-[0.4em] uppercase px-2 py-1 ${
                                            inq.status === 'unread' ? 'text-gold bg-gold/10' : 
                                            inq.status === 'replied' ? 'text-emerald-700 bg-emerald-50' :
                                            inq.status === 'archived' ? 'text-navy/50 bg-navy/5' :
                                            'text-navy/70 bg-navy/5'
                                        }`}>
                                            {inq.status}
                                        </span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-navy/60">{inq.subject}</p>
                                    
                                    <p className="text-sm font-light text-navy/80 leading-relaxed tracking-wide whitespace-pre-wrap">
                                        {inq.message}
                                    </p>
                                </div>
                                <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end gap-4 md:gap-6 justify-between min-w-[140px]">
                                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-navy/30">
                                        {new Date(inq.created_at).toLocaleDateString()}
                                    </span>
                                    
                                    <div className="flex flex-row flex-wrap md:flex-col items-center md:items-end gap-4 md:gap-3 w-full">
                                        <a 
                                            href={`mailto:${inq.email}?subject=Re: ${inq.subject}`}
                                            onClick={() => updateStatus(inq.id, 'replied')}
                                            className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold hover:text-navy transition-colors md:w-full md:text-right"
                                        >
                                            Reply &rarr;
                                        </a>
                                        <button 
                                            onClick={() => updateStatus(inq.id, inq.status === 'unread' ? 'read' : 'unread')}
                                            className="text-[9px] font-bold tracking-[0.3em] uppercase text-navy/50 hover:text-navy transition-colors md:w-full md:text-right"
                                        >
                                            Mark {inq.status === 'unread' ? 'Read' : 'Unread'}
                                        </button>
                                        {inq.status !== 'archived' && (
                                            <button 
                                                onClick={() => updateStatus(inq.id, 'archived')}
                                                className="text-[9px] font-bold tracking-[0.3em] uppercase text-navy/50 hover:text-navy transition-colors md:w-full md:text-right"
                                            >
                                                Archive
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteInquiry(inq.id)}
                                            className="text-[9px] font-bold tracking-[0.3em] uppercase text-red-900/50 hover:text-red-900 transition-colors mt-2 md:mt-4 md:w-full md:text-right"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
