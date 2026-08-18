'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Gemstone {
    id: number;
    name: string;
    slug: string;
    origin: string;
    category: string;
}

type InquiryStatus = 'unread' | 'read' | 'replied' | 'archived';

interface Inquiry {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    related_gemstone_id: number | null;
    status: InquiryStatus;
    created_at: string;
}

const SkeletonRow = () => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-mid/10 last:border-0">
        <div className="space-y-2">
            <div className="h-4 w-40 bg-mid/10 rounded relative overflow-hidden">
                <div className="absolute inset-0 shimmer" />
            </div>
            <div className="h-3 w-24 bg-mid/10 rounded relative overflow-hidden">
                <div className="absolute inset-0 shimmer" />
            </div>
        </div>
        <div className="h-3 w-3 bg-mid/10 rounded-full" />
    </div>
);

const STATUS_COLORS: Record<InquiryStatus, string> = {
    unread: 'bg-gold/15 text-gold',
    read: 'bg-mid/10 text-mid',
    replied: 'bg-green-50 text-green-700',
    archived: 'bg-stone/8 text-stone/40',
};

export default function AdminDashboard() {
    const router = useRouter();
    const [gemstones, setGemstones] = useState<Gemstone[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/api/admin/gemstones').then((res) => res.json()),
            fetch('/api/admin/inquiries').then((res) => res.json()),
        ]).then(([gemstoneData, inquiryData]) => {
            setGemstones(Array.isArray(gemstoneData) ? gemstoneData : []);
            setInquiries(Array.isArray(inquiryData) ? inquiryData : []);
            setLoading(false);
        });
    }, []);

    const categories = useMemo(
        () => new Set(gemstones.map((g) => g.category).filter(Boolean)),
        [gemstones]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return gemstones;
        return gemstones.filter(
            (g) =>
                g.name.toLowerCase().includes(q) ||
                g.origin?.toLowerCase().includes(q) ||
                g.category?.toLowerCase().includes(q)
        );
    }, [gemstones, query]);

    const handleLogout = useCallback(async () => {
        setLoggingOut(true);
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    }, [router]);

    const updateInquiryStatus = useCallback(
        async (id: number, status: InquiryStatus) => {
            setInquiries((prev) =>
                prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
            );
            await fetch('/api/admin/inquiries', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
        },
        []
    );

    const toggleExpand = useCallback(
        (inquiry: Inquiry) => {
            const isOpening = expandedId !== inquiry.id;
            setExpandedId(isOpening ? inquiry.id : null);
            // Mark as read when opening
            if (isOpening && inquiry.status === 'unread') {
                updateInquiryStatus(inquiry.id, 'read');
            }
        },
        [expandedId, updateInquiryStatus]
    );

    const unreadCount = inquiries.filter((i) => i.status === 'unread').length;

    return (
        <div className="min-h-screen bg-cream py-10 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl font-light text-stone">Admin Dashboard</h1>
                    </div>
                    <button
                        id="logout-btn"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="text-[11px] tracking-[0.2em] uppercase text-mid/60 hover:text-stone transition-colors duration-300 disabled:opacity-40"
                    >
                        {loggingOut ? 'Logging out…' : '← Log Out'}
                    </button>
                </div>

                {/* ── Gemstone Collection ── */}
                <div className="mt-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                        <h2 className="text-2xl font-light text-stone">Gemstone Collection</h2>
                        <Link
                            href="/admin/gemstones/new"
                            className="px-5 py-2.5 bg-stone text-white rounded-full text-sm uppercase tracking-widest hover:bg-stone/85 transition"
                        >
                            + Add Gemstone
                        </Link>
                    </div>

                    {!loading && gemstones.length > 0 && (
                        <div className="relative mt-6 mb-6">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mid/40"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by name, origin, or category"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-mid/15 rounded-full text-sm text-stone placeholder-mid/40 focus:outline-none focus:border-gold transition-colors"
                            />
                        </div>
                    )}

                    {loading ? (
                        <div className="bg-white border border-mid/15 rounded-xl overflow-hidden">
                            {[...Array(4)].map((_, i) => (
                                <SkeletonRow key={i} />
                            ))}
                        </div>
                    ) : gemstones.length === 0 ? (
                        <div className="bg-white border border-mid/15 rounded-xl px-6 py-16 text-center">
                            <p className="text-stone font-medium mb-1">No gemstones yet</p>
                            <p className="text-sm text-mid mb-6">Your collection will appear here once you add a stone.</p>
                            <Link
                                href="/admin/gemstones/new"
                                className="inline-flex px-5 py-2.5 bg-stone text-white rounded-full text-sm uppercase tracking-widest hover:bg-stone/85 transition"
                            >
                                + Add Your First Gemstone
                            </Link>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white border border-mid/15 rounded-xl px-6 py-16 text-center">
                            <p className="text-stone font-medium mb-1">No matches for &ldquo;{query}&rdquo;</p>
                            <button
                                onClick={() => setQuery('')}
                                className="text-sm text-gold hover:text-stone transition-colors mt-2"
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white border border-mid/15 rounded-xl overflow-hidden">
                            {filtered.map((gem) => (
                                <Link
                                    key={gem.id}
                                    href={`/admin/gemstones/${gem.id}`}
                                    className="group flex items-center justify-between px-6 py-4 border-b border-mid/10 last:border-0 hover:bg-cream transition-colors"
                                >
                                    <div className="min-w-0">
                                        <p className="text-stone font-medium truncate">{gem.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs text-mid uppercase tracking-wide">{gem.origin}</p>
                                            {gem.category && (
                                                <>
                                                    <span className="text-mid/30">·</span>
                                                    <span className="text-[10px] font-medium tracking-wide uppercase text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                                                        {gem.category}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-mid group-hover:text-gold group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-4">
                                        →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Inquiries ── */}
                <div id="inquiries" className="mt-16">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-light text-stone">Inquiries</h2>
                        {unreadCount > 0 && (
                            <span className="text-[10px] font-medium tracking-wide uppercase text-white bg-gold px-2 py-0.5 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="bg-white border border-mid/15 rounded-xl overflow-hidden">
                            <SkeletonRow />
                        </div>
                    ) : inquiries.length === 0 ? (
                        <div className="bg-white border border-mid/15 rounded-xl px-6 py-16 text-center">
                            <p className="text-stone font-medium mb-1">No inquiries yet</p>
                            <p className="text-sm text-mid">Customer inquiries will appear here.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-mid/15 rounded-xl overflow-hidden divide-y divide-mid/10">
                            {inquiries.map((inquiry) => {
                                const isExpanded = expandedId === inquiry.id;
                                return (
                                    <div key={inquiry.id}>
                                        {/* Row header — click to expand */}
                                        <button
                                            className="w-full text-left px-6 py-4 hover:bg-cream transition-colors"
                                            onClick={() => toggleExpand(inquiry)}
                                            aria-expanded={isExpanded}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="text-stone font-medium">{inquiry.name}</p>
                                                        {inquiry.status === 'unread' && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                                                        )}
                                                        <span className={`text-[9px] font-medium tracking-widest uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[inquiry.status]}`}>
                                                            {inquiry.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-mid/80 truncate mt-0.5">{inquiry.subject}</p>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <p className="text-xs text-mid/60">
                                                        {new Date(inquiry.created_at).toLocaleDateString()}
                                                    </p>
                                                    <span className={`text-mid/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        ↓
                                                    </span>
                                                </div>
                                            </div>
                                        </button>

                                        {/* Expanded body */}
                                        {isExpanded && (
                                            <div className="px-6 pb-5 bg-cream/50 border-t border-mid/8">
                                                <a
                                                    href={`mailto:${inquiry.email}`}
                                                    className="text-sm text-gold hover:text-stone transition-colors inline-block mt-3 mb-3"
                                                >
                                                    {inquiry.email}
                                                </a>
                                                <p className="text-sm text-mid leading-relaxed whitespace-pre-wrap">
                                                    {inquiry.message}
                                                </p>

                                                {/* Status actions */}
                                                <div className="flex items-center gap-3 mt-4 flex-wrap">
                                                    <span className="text-[10px] uppercase tracking-widest text-mid/40">
                                                        Mark as:
                                                    </span>
                                                    {(['read', 'replied', 'archived', 'unread'] as InquiryStatus[])
                                                        .filter((s) => s !== inquiry.status)
                                                        .map((s) => (
                                                            <button
                                                                key={s}
                                                                onClick={() => updateInquiryStatus(inquiry.id, s)}
                                                                className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border transition-colors ${STATUS_COLORS[s]} border-current hover:opacity-80`}
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}