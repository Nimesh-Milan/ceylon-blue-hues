'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Spec { label: string; value: string; }
interface Media { id: number; file_path: string; type: 'image' | 'video'; display_order: number; }

export default function UnifiedGemstoneEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    
    // Gemstone State
    const [gemstone, setGemstone] = useState<any>({});
    const [specs, setSpecs] = useState<Spec[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [savingDetails, setSavingDetails] = useState(false);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Media State
    const [media, setMedia] = useState<Media[]>([]);
    const [loadingMedia, setLoadingMedia] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [draggedId, setDraggedId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceInputRef = useRef<HTMLInputElement>(null);
    const [replaceId, setReplaceId] = useState<number | null>(null);

    // Load Data
    useEffect(() => {
        // Load Gemstone Details
        fetch(`/api/admin/gemstones/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setGemstone(data);
                if (data.specs) setSpecs(data.specs);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoadingDetails(false));

        // Load Media
        fetchMedia();
    }, [id]);

    const fetchMedia = async () => {
        try {
            const res = await fetch(`/api/admin/gemstones/${id}/media`);
            const data = await res.json();
            if (res.ok) setMedia(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingMedia(false);
        }
    };

    // --- Gemstone Details Handlers ---
    const handleGemstoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setGemstone({
            ...gemstone,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        });
    };

    const handleSpecChange = (index: number, field: keyof Spec, value: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    const addSpec = () => setSpecs([...specs, { label: '', value: '' }]);
    const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

    const handleSaveDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSavingDetails(true);
        try {
            const gemstoneUpdate = fetch(`/api/admin/gemstones/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gemstone),
            });
            const specsUpdate = fetch(`/api/admin/gemstones/${id}/specs`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(specs.filter(s => s.label && s.value)),
            });

            const responses = await Promise.all([gemstoneUpdate, specsUpdate]);
            if (responses.some(res => !res.ok)) throw new Error('Failed to save changes.');
            
            // Re-fetch to ensure sync
            const res = await fetch(`/api/admin/gemstones/${id}`);
            const data = await res.json();
            setGemstone(data);
            if (data.specs) setSpecs(data.specs);
            
            alert('Details saved successfully!');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSavingDetails(false);
        }
    };

    const handleDeleteGemstone = async () => {
        if (window.confirm('Permanently delete this gemstone and ALL its media?')) {
            setIsDeleting(true);
            try {
                const res = await fetch(`/api/admin/gemstones/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete gemstone.');
                router.push('/admin');
            } catch (err) {
                setError((err as Error).message);
                setIsDeleting(false);
            }
        }
    };

    // --- Media Handlers ---
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        const formData = new FormData();
        Array.from(e.target.files).forEach(file => formData.append('files', file));
        
        try {
            const res = await fetch(`/api/admin/gemstones/${id}/media`, { method: 'POST', body: formData });
            if (!res.ok) {
                const text = await res.text();
                throw new Error('Upload failed: ' + text);
            }
            await fetchMedia();
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            alert(err);
        } finally {
            setUploading(false);
        }
    };

    const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !replaceId) return;
        setBusyId(replaceId);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`/api/admin/gemstones/${id}/media/${replaceId}`, { method: 'PUT', body: formData });
            if (!res.ok) throw new Error('Failed to replace file');
            await fetchMedia();
            if (replaceInputRef.current) replaceInputRef.current.value = '';
        } catch (err) {
            alert(err);
        } finally {
            setBusyId(null);
            setReplaceId(null);
        }
    };

    const handleDeleteMedia = async (mediaId: number) => {
        setBusyId(mediaId);
        try {
            const res = await fetch(`/api/admin/gemstones/${id}/media`, { 
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ media_id: mediaId })
            });
            if (!res.ok) throw new Error('Failed to delete media');
            setMedia(media.filter(m => m.id !== mediaId));
        } catch (err) {
            alert(err);
        } finally {
            setBusyId(null);
            setConfirmDeleteId(null);
        }
    };

    const handleSetPrimary = async (mediaId: number) => {
        setBusyId(mediaId);
        try {
            const currentItem = media.find(m => m.id === mediaId);
            if (!currentItem) return;
            const newOrder = media.map(m => {
                if (m.id === mediaId) return { id: m.id, display_order: 0 };
                return { id: m.id, display_order: m.display_order + 1 };
            });
            const res = await fetch(`/api/admin/gemstones/${id}/media/reorder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newOrder.sort((a, b) => a.display_order - b.display_order).map(m => m.id) })
            });
            if (res.ok) await fetchMedia();
        } catch (e) {
            console.error(e);
        } finally {
            setBusyId(null);
        }
    };

    const handleDropReorder = async (targetId: number) => {
        if (draggedId === null || draggedId === targetId) return;
        const draggedIndex = media.findIndex(m => m.id === draggedId);
        const targetIndex = media.findIndex(m => m.id === targetId);
        if (draggedIndex === -1 || targetIndex === -1) return;

        const newMedia = [...media];
        const [draggedItem] = newMedia.splice(draggedIndex, 1);
        newMedia.splice(targetIndex, 0, draggedItem);
        setMedia(newMedia);

        try {
            await fetch(`/api/admin/gemstones/${id}/media/reorder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newMedia.map(m => m.id) })
            });
        } catch (e) {
            console.error(e);
        }
    };

    if (loadingDetails) return <div className="text-center py-20 font-serif text-navy">Loading Editor...</div>;

    return (
        <div className="min-h-screen bg-cream py-6 md:py-10 px-4 md:px-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/admin" className="text-[10px] uppercase font-bold tracking-widest text-navy/50 hover:text-navy transition-colors mb-2 block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-serif italic text-navy">
                            {gemstone.name ? `Editing: ${gemstone.name}` : 'Unified Editor'}
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: DETAILS & SPECS */}
                    <div className="lg:col-span-7 space-y-6">
                        <form onSubmit={handleSaveDetails} className="space-y-12">
                            <fieldset>
                                <legend className="text-3xl font-serif italic text-navy mb-8">Gemstone Details</legend>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[9px] font-bold text-navy/40 uppercase tracking-[0.3em] mb-2">Name</label>
                                        <input required type="text" name="name" value={gemstone.name || ''} onChange={handleGemstoneChange} className="w-full bg-transparent border-b border-navy/20 py-3 text-lg font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[9px] font-bold text-navy/40 uppercase tracking-[0.3em] mb-2">Slug (URL)</label>
                                            <input required type="text" name="slug" value={gemstone.slug || ''} onChange={handleGemstoneChange} className="w-full bg-transparent border-b border-navy/20 py-3 text-lg font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20" />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-navy/40 uppercase tracking-[0.3em] mb-2">Category</label>
                                            <input type="text" name="category" value={gemstone.category || ''} onChange={handleGemstoneChange} className="w-full bg-transparent border-b border-navy/20 py-3 text-lg font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[9px] font-bold text-navy/40 uppercase tracking-[0.3em] mb-2">Origin</label>
                                            <input type="text" name="origin" value={gemstone.origin || ''} onChange={handleGemstoneChange} className="w-full bg-transparent border-b border-navy/20 py-3 text-lg font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20" />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-navy/40 uppercase tracking-[0.3em] mb-2">Availability</label>
                                            <select name="availability" value={gemstone.availability || 'Available'} onChange={handleGemstoneChange} className="w-full bg-transparent border-b border-navy/20 py-3 text-lg font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20">
                                                <option value="Available">Available</option>
                                                <option value="Reserved">Reserved</option>
                                                <option value="Sold">Sold</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-navy/40 uppercase tracking-[0.3em] mb-2">Description</label>
                                        <textarea name="description" value={gemstone.description || ''} onChange={handleGemstoneChange} rows={5} className="w-full bg-transparent border-b border-navy/20 py-3 text-lg font-sans text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20 h-24 resize-none" />
                                    </div>
                                    <div className="flex items-center gap-3 pt-2">
                                        <input type="checkbox" name="inquiry_only" id="inquiry_only" checked={gemstone.inquiry_only || false} onChange={handleGemstoneChange} className="h-4 w-4 rounded border-navy/30 text-gold focus:ring-gold" />
                                        <label htmlFor="inquiry_only" className="text-xs text-navy font-bold uppercase tracking-widest">Inquiry Only</label>
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset className="pt-6 border-t border-navy/10">
                                <legend className="text-3xl font-serif italic text-navy mb-8">Specifications</legend>
                                <div className="space-y-3">
                                    {specs.map((spec, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input type="text" placeholder="Label (e.g., Carat)" value={spec.label} onChange={(e) => handleSpecChange(index, 'label', e.target.value)} className="flex-1 bg-transparent border-b border-navy/20 py-3 text-lg font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20" />
                                            <input type="text" placeholder="Value (e.g., 2.5)" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="flex-1 bg-transparent border-b border-navy/20 py-3 text-lg font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/20" />
                                            <button type="button" onClick={() => removeSpec(index)} className="text-red-500 hover:text-red-700 transition-colors px-2">×</button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addSpec} className="mt-4 text-[10px] font-bold tracking-widest uppercase text-gold hover:text-navy transition-colors">+ Add Specification</button>
                            </fieldset>

                            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-navy/10">
                                <button type="submit" disabled={savingDetails} className="px-8 py-3 bg-navy text-cream rounded-md text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold transition-colors disabled:opacity-50">
                                    {savingDetails ? 'Saving...' : 'Save Text Details'}
                                </button>
                                <button type="button" onClick={handleDeleteGemstone} disabled={isDeleting} className="px-4 py-3 text-red-500 rounded-md text-[10px] font-bold uppercase tracking-[0.2em] hover:text-red-700 transition disabled:opacity-50">
                                    {isDeleting ? 'Deleting...' : 'Delete Gemstone'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: MEDIA MANAGER */}
                    <div className="lg:col-span-5">
                        <div className="space-y-8 sticky top-32">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-serif italic text-navy">Media Manager</h2>
                                <div>
                                    <input type="file" multiple accept="image/*,video/*" className="hidden" ref={fileInputRef} onChange={handleUpload} />
                                    <input type="file" accept="image/*,video/*" className="hidden" ref={replaceInputRef} onChange={handleReplace} />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()} 
                                        disabled={uploading}
                                        className="px-4 py-2 bg-navy/5 text-navy border border-navy/10 hover:border-gold hover:text-gold transition-all text-[10px] uppercase tracking-widest font-bold rounded-md disabled:opacity-50"
                                    >
                                        {uploading ? 'Uploading...' : '+ Upload Files'}
                                    </button>
                                </div>
                            </div>

                            {loadingMedia ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-navy/5 animate-pulse rounded-md" />)}
                                </div>
                            ) : media.length === 0 ? (
                                <div className="text-center py-12 bg-navy/5 rounded-md border border-dashed border-navy/20">
                                    <p className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">No media uploaded</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-[10px] text-navy/50 tracking-widest uppercase mb-4">Drag to reorder · Hover for actions</p>
                                    <div className="grid grid-cols-2 gap-3">
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
                                                    onDragLeave={() => setDragOverId(prev => prev === m.id ? null : prev)}
                                                    onDrop={() => handleDropReorder(m.id)}
                                                    onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                                                    className={`relative aspect-square rounded-md overflow-hidden bg-cream border group cursor-grab active:cursor-grabbing transition-all ${
                                                        dragOverId === m.id ? 'border-gold ring-2 ring-gold/30' : 'border-navy/15'
                                                    } ${draggedId === m.id ? 'opacity-40' : ''}`}
                                                >
                                                    {m.type === 'image' ? (
                                                        <img src={m.file_path} alt="" className="w-full h-full object-cover pointer-events-none" />
                                                    ) : (
                                                        <video src={m.file_path} className="w-full h-full object-cover pointer-events-none" muted />
                                                    )}

                                                    {m.type === 'video' && <span className="absolute top-2 left-2 text-[8px] font-bold tracking-widest uppercase text-white bg-black/60 px-1.5 py-0.5 rounded">Video</span>}
                                                    {isCover && <span className="absolute top-2 right-2 text-[8px] font-bold tracking-widest uppercase text-white bg-gold px-1.5 py-0.5 rounded">Cover</span>}

                                                    {isBusy && (
                                                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                                            <span className="w-4 h-4 border-2 border-navy/30 border-t-gold rounded-full animate-spin" />
                                                        </div>
                                                    )}

                                                    {!isBusy && (
                                                        <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 ${isConfirming ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                            {isConfirming ? (
                                                                <>
                                                                    <p className="text-white text-[9px] uppercase tracking-widest mb-1">Delete?</p>
                                                                    <div className="flex gap-2">
                                                                        <button onClick={() => handleDeleteMedia(m.id)} className="px-3 py-1 bg-red-600 text-white text-[9px] uppercase tracking-widest font-bold rounded hover:bg-red-700">Yes</button>
                                                                        <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1 bg-white/20 text-white text-[9px] uppercase tracking-widest font-bold rounded hover:bg-white/30">No</button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex gap-2">
                                                                    {!isCover && (
                                                                        <button onClick={() => handleSetPrimary(m.id)} title="Set as Cover" className="w-8 h-8 rounded-full bg-white/20 hover:bg-gold flex items-center justify-center text-white transition-colors">
                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.285-3.958z" /></svg>
                                                                        </button>
                                                                    )}
                                                                    <button onClick={() => { setReplaceId(m.id); replaceInputRef.current?.click(); }} title="Replace" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                                    </button>
                                                                    <button onClick={() => setConfirmDeleteId(m.id)} title="Delete" className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-600 flex items-center justify-center text-white transition-colors">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

