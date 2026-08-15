'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Gemstone {
    id: number;
    name: string;
    slug: string;
    origin: string;
    category: string;
}

export default function AdminDashboard() {
    const [gemstones, setGemstones] = useState<Gemstone[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/gemstones')
            .then((res) => res.json())
            .then((data) => {
                setGemstones(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-[#F9F7F4] py-10 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-light text-[#1A1814]">Gemstone Collection</h1>
                    <Link
                        href="/admin/gemstones/new"
                        className="px-5 py-2.5 bg-[#1A1814] text-white rounded-full text-sm uppercase tracking-widest hover:bg-[#2c2924] transition"
                    >
                        + Add Gemstone
                    </Link>
                </div>

                {loading ? (
                    <p className="text-[#6B6560]">Loading...</p>
                ) : gemstones.length === 0 ? (
                    <p className="text-[#6B6560]">No gemstones yet. Add your first one above.</p>
                ) : (
                    <div className="bg-white border border-[#6B6560]/15 rounded-xl overflow-hidden">
                        {gemstones.map((gem) => (
                            <Link
                                key={gem.id}
                                href={`/admin/gemstones/${gem.id}`}
                                className="flex items-center justify-between px-6 py-4 border-b border-[#6B6560]/10 last:border-0 hover:bg-[#F9F7F4] transition"
                            >
                                <div>
                                    <p className="text-[#1A1814] font-medium">{gem.name}</p>
                                    <p className="text-xs text-[#6B6560] uppercase tracking-wide mt-1">
                                        {gem.origin} {gem.category && `· ${gem.category}`}
                                    </p>
                                </div>
                                <span className="text-[#6B6560]">→</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}