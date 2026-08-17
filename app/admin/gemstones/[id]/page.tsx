'use client';

import { useEffect, useState, use } from 'react';

interface Media {
    id: number;
    file_path: string;
    type: 'image' | 'video';
}

export default function GemstoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [media, setMedia] = useState<Media[]>([]);
    const [loadingMedia, setLoadingMedia] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');

    async function loadMedia() {
        const res = await fetch('/api/gemstones');
        const all = await res.json();
        const gem = all.find((g: { id: number }) => g.id === Number(id));
        setMedia(gem?.media || []);
        setLoadingMedia(false);
    }

    useEffect(() => {
        loadMedia();
    }, [id]);

    async function uploadFile(file: File) {
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`/api/admin/gemstones/${id}/media`, {
            method: 'POST',
            body: formData,
        });

        setUploading(false);

        if (res.ok) {
            loadMedia();
        } else {
            const data = await res.json().catch(() => ({}));
            setError(data.error || 'Upload failed. Please try again.');
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) await uploadFile(file);
        e.target.value = '';
    }

    async function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await uploadFile(file);
    }

    return (
        <div className="min-h-screen bg-cream py-12 px-6">
            <div className="max-w-2xl mx-auto bg-white border border-mid/15 rounded-xl shadow-sm p-8">
                <div className="flex items-baseline justify-between mb-6">
                    <h1 className="text-2xl font-light text-stone">Manage Media</h1>
                    {!loadingMedia && media.length > 0 && (
                        <p className="text-sm text-mid">
                            {media.length} {media.length === 1 ? 'file' : 'files'}
                        </p>
                    )}
                </div>

                <label
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-6 ${
                        isDragging
                            ? 'border-gold bg-gold/5'
                            : uploading
                                ? 'border-mid/20 cursor-wait'
                                : 'border-mid/30 hover:border-gold'
                    }`}
                >
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                    {uploading ? (
                        <div className="flex items-center justify-center gap-2 text-mid text-sm">
                            <span className="w-3.5 h-3.5 border-2 border-mid/30 border-t-gold rounded-full animate-spin" />
                            Uploading...
                        </div>
                    ) : (
                        <>
                            <p className="text-mid text-sm">
                                <span className="text-gold font-medium">Click to upload</span> or drag a photo or video here
                            </p>
                            <p className="text-mid/50 text-xs mt-1">JPG, PNG, MP4 — up to your server's upload limit</p>
                        </>
                    )}
                </label>

                {error && (
                    <div className="flex items-start gap-2 text-red-700 text-sm mb-6 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                        <span className="flex-shrink-0 mt-0.5">⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                {loadingMedia ? (
                    <div className="grid grid-cols-3 gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="aspect-square rounded-lg bg-mid/10 relative overflow-hidden">
                                <div className="absolute inset-0 shimmer" />
                            </div>
                        ))}
                    </div>
                ) : media.length === 0 ? (
                    <p className="text-center text-sm text-mid/60 py-6">
                        No media yet — upload your first photo or video above.
                    </p>
                ) : (
                    <div className="grid grid-cols-3 gap-3">
                        {media.map((m) => (
                            <div
                                key={m.id}
                                className="relative aspect-square rounded-lg overflow-hidden bg-cream border border-mid/15 group"
                            >
                                {m.type === 'image' ? (
                                    <img src={m.file_path} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <video src={m.file_path} className="w-full h-full object-cover" muted />
                                )}
                                {m.type === 'video' && (
                                    <span className="absolute top-1.5 left-1.5 text-[9px] font-medium tracking-wide uppercase text-white bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded">
                                        Video
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .shimmer {
                    background: linear-gradient(90deg, transparent 0%, rgba(190, 158, 90, 0.15) 50%, transparent 100%);
                    background-size: 200% 100%;
                    animation: shimmer 1.6s ease-in-out infinite;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .shimmer { animation: none; }
                    .animate-spin { animation: none; }
                }
            `}</style>
        </div>
    );
}