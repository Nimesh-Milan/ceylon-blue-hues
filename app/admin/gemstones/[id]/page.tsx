'use client';

import { useEffect, useState, use, useRef } from 'react';
import Link from 'next/link';

interface Media {
    id: number;
    file_path: string;
    type: 'image' | 'video';
    display_order: number;
}

type QueueItem = { key: string; name: string; status: 'pending' | 'uploading' | 'done' | 'error'; error?: string };

export default function GemstoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [media, setMedia] = useState<Media[]>([]);
    const [loadingMedia, setLoadingMedia] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');

    const [queue, setQueue] = useState<QueueItem[]>([]);
    const isUploading = queue.some((q) => q.status === 'pending' || q.status === 'uploading');

    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    const [draggedId, setDraggedId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);

    const replaceInputRef = useRef<HTMLInputElement>(null);
    const replacingIdRef = useRef<number | null>(null);

    async function loadMedia() {
        try {
            const res = await fetch(`/api/gemstones?id=${id}`);
            const gem = await res.json();
            const sorted = [...(gem?.media || [])].sort((a, b) => a.display_order - b.display_order);
            setMedia(sorted);
        } catch (e) {
            setError('Could not load media. Please try refreshing the page.');
        } finally {
            setLoadingMedia(false);
        }
    }

    useEffect(() => {
        loadMedia();
    }, [id]);

    async function uploadFiles(files: File[]) {
        const items: QueueItem[] = files.map((f) => ({
            key: `${f.name}-${Date.now()}-${Math.random()}`,
            name: f.name,
            status: 'pending',
        }));
        setQueue((q) => [...q, ...items]);
        setError('');

        for (let i = 0; i < files.length; i++) {
            const item = items[i];
            setQueue((q) => q.map((x) => (x.key === item.key ? { ...x, status: 'uploading' } : x)));

            const formData = new FormData();
            formData.append('file', files[i]);

            try {
                const res = await fetch(`/api/admin/gemstones/${id}/media`, { method: 'POST', body: formData });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || 'Upload failed');
                }
                setQueue((q) => q.map((x) => (x.key === item.key ? { ...x, status: 'done' } : x)));
            } catch (err) {
                setQueue((q) =>
                    q.map((x) => (x.key === item.key ? { ...x, status: 'error', error: (err as Error).message } : x))
                );
            }
        }

        await loadMedia();
        setTimeout(() => setQueue((q) => q.filter((x) => x.status === 'error')), 2500);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (files.length) await uploadFiles(files);
        e.target.value = '';
    }

    async function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length) await uploadFiles(files);
    }

    async function handleDelete(mediaId: number) {
        setBusyId(mediaId);
        setError('');
        try {
            const res = await fetch(`/api/admin/gemstones/${id}/media`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ media_id: mediaId }),
            });
            if (!res.ok) throw new Error('Could not delete this file. Please try again.');
            setMedia((prev) => prev.filter((m) => m.id !== mediaId));
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setBusyId(null);
            setConfirmDeleteId(null);
        }
    }

    async function persistOrder(orderedMedia: Media[]) {
        try {
            const res = await fetch(`/api/admin/gemstones/${id}/media/reorder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: orderedMedia.map((m) => m.id) }),
            });
            if (!res.ok) throw new Error('Could not save the new order.');
        } catch {
            setError('Could not save the new order. Please refresh and try again.');
        }
    }

    async function handleSetPrimary(mediaId: number) {
        setBusyId(mediaId);
        setError('');
        const previous = [...media];
        const next = [...media];
        const primary = next.find((m) => m.id === mediaId);
        if (!primary) return;
        const rest = next.filter((m) => m.id !== mediaId);
        const reordered = [primary, ...rest];
        setMedia(reordered);
        try {
            await persistOrder(reordered);
        } catch (err) {
            setMedia(previous);
            setError((err as Error).message);
        } finally {
            setBusyId(null);
        }
    }

    function triggerReplace(mediaId: number) {
        replacingIdRef.current = mediaId;
        replaceInputRef.current?.click();
    }

    async function handleReplaceFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        const mediaId = replacingIdRef.current;
        e.target.value = '';
        if (!file || mediaId == null) return;

        setBusyId(mediaId);
        setError('');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`/api/admin/gemstones/${id}/media/${mediaId}`, { method: 'PUT', body: formData });
            if (!res.ok) throw new Error('Could not replace this file. Please try again.');
            await loadMedia();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setBusyId(null);
        }
    }

    function handleDropReorder(targetId: number) {
        if (draggedId == null || draggedId === targetId) {
            setDraggedId(null);
            setDragOverId(null);
            return;
        }
        const next = [...media];
        const fromIndex = next.findIndex((m) => m.id === draggedId);
        const toIndex = next.findIndex((m) => m.id === targetId);
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        setMedia(next);
        setDraggedId(null);
        setDragOverId(null);
        persistOrder(next);
    }

    return (
        <div className="min-h-screen bg-cream py-12 px-6">
            <div className="max-w-2xl mx-auto bg-white border border-mid/15 rounded-xl shadow-sm p-8">
                <div className="flex items-baseline justify-between mb-6">
                    <h1 className="text-2xl font-light text-stone">Manage Media</h1>
                    <Link href={`/admin/gemstones/${id}/edit`} className="text-sm text-gold hover:text-stone transition-colors">
                        Edit Details →
                    </Link>
                </div>

                <input
                    ref={replaceInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleReplaceFile}
                    className="hidden"
                />

                <label
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-4 ${
                        isDragging ? 'border-gold bg-gold/5' : isUploading ? 'border-mid/20 cursor-wait' : 'border-mid/30 hover:border-gold'
                    }`}
                >
                    <input type="file" accept="image/*,video/*" multiple onChange={handleUpload} disabled={isUploading} className="hidden" />
                    <p className="text-mid text-sm"><span className="text-gold font-medium">Click to upload</span> or drag photos or videos here</p>
                    <p className="text-mid/50 text-xs mt-1">Select multiple files at once · JPG, PNG, MP4</p>
                </label>

                {queue.length > 0 && (
                    <ul className="mb-6 space-y-1.5">
                        {queue.map((item) => (
                            <li key={item.key} className="flex items-center gap-2 text-xs text-mid px-1">
                                {item.status === 'uploading' || item.status === 'pending' ? (
                                    <span className="w-3 h-3 border-2 border-mid/30 border-t-gold rounded-full animate-spin flex-shrink-0" />
                                ) : item.status === 'done' ? (
                                    <span className="text-green-600 flex-shrink-0">✓</span>
                                ) : (
                                    <span className="text-red-600 flex-shrink-0">⚠</span>
                                )}
                                <span className="truncate">{item.name}</span>
                                {item.status === 'error' && <span className="text-red-600 ml-auto">{item.error}</span>}
                            </li>
                        ))}
                    </ul>
                )}

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
                    <p className="text-center text-sm text-mid/60 py-6">No media yet — upload your first photo or video above.</p>
                ) : (
                    <>
                        <p className="text-xs text-mid/50 mb-3">Drag tiles to reorder · hover a tile for actions</p>
                        <div className="grid grid-cols-3 gap-3">
                            {media.map((m, index) => {
                                const isBusy = busyId === m.id;
                                const isConfirming = confirmDeleteId === m.id;
                                const isCover = index === 0;
                                return (
                                    <div
                                        key={m.id}
                                        draggable={!isBusy}
                                        onDragStart={() => setDraggedId(m.id)}
                                        onDragOver={(e) => { e.preventDefault(); setDragOverId(m.id); }}
                                        onDragLeave={() => setDragOverId((prev) => (prev === m.id ? null : prev))}
                                        onDrop={() => handleDropReorder(m.id)}
                                        onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                                        className={`relative aspect-square rounded-lg overflow-hidden bg-cream border group cursor-grab active:cursor-grabbing transition-all ${
                                            dragOverId === m.id ? 'border-gold ring-2 ring-gold/30' : 'border-mid/15'
                                        } ${draggedId === m.id ? 'opacity-40' : ''}`}
                                    >
                                        {m.type === 'image' ? (
                                            <img src={m.file_path} alt="" className="w-full h-full object-cover pointer-events-none" />
                                        ) : (
                                            <video src={m.file_path} className="w-full h-full object-cover pointer-events-none" muted />
                                        )}

                                        {m.type === 'video' && (
                                            <span className="absolute top-1.5 left-1.5 text-[9px] font-medium tracking-wide uppercase text-white bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded">Video</span>
                                        )}

                                        {isCover && (
                                            <span className="absolute top-1.5 right-1.5 text-[9px] font-medium tracking-wide uppercase text-white bg-gold/90 backdrop-blur-sm px-1.5 py-0.5 rounded">Cover</span>
                                        )}

                                        {isBusy && (
                                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                                <span className="w-5 h-5 border-2 border-mid/30 border-t-gold rounded-full animate-spin" />
                                            </div>
                                        )}

                                        {!isBusy && (
                                            <div className={`absolute inset-0 bg-black/55 flex items-center justify-center gap-3 transition-opacity duration-200 ${isConfirming ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                {isConfirming ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <p className="text-white text-[10px] tracking-wide">Delete this file?</p>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleDelete(m.id)} className="text-[10px] uppercase tracking-wide bg-red-600 text-white px-2.5 py-1 rounded hover:bg-red-700 transition-colors">Delete</button>
                                                            <button onClick={() => setConfirmDeleteId(null)} className="text-[10px] uppercase tracking-wide bg-white/20 text-white px-2.5 py-1 rounded hover:bg-white/30 transition-colors">Cancel</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {!isCover && (
                                                            <button onClick={() => handleSetPrimary(m.id)} title="Set as cover photo" aria-label="Set as cover photo" className="w-7 h-7 flex items-center justify-center rounded-full bg-white/15 hover:bg-gold/90 text-white transition-colors">
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.285-3.958z" /></svg>
                                                            </button>
                                                        )}
                                                        <button onClick={() => triggerReplace(m.id)} title="Replace file" aria-label="Replace file" className="w-7 h-7 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                                                        </button>
                                                        <button onClick={() => setConfirmDeleteId(m.id)} title="Delete file" aria-label="Delete file" className="w-7 h-7 flex items-center justify-center rounded-full bg-white/15 hover:bg-red-600 text-white transition-colors">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
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