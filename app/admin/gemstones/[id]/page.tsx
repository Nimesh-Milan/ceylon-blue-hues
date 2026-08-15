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
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    async function loadMedia() {
        const res = await fetch('/api/gemstones');
        const all = await res.json();
        const gem = all.find((g: { id: number }) => g.id === Number(id));
        setMedia(gem?.media || []);
    }

    useEffect(() => {
        loadMedia();
    }, [id]);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

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
            const data = await res.json();
            setError(data.error || 'Upload failed');
        }

        e.target.value = '';
    }

    return (
        <div className="min-h-screen bg-[#F9F7F4] py-12 px-6">
            <div className="max-w-2xl mx-auto bg-white border border-[#6B6560]/15 rounded-xl shadow-sm p-8">
                <h1 className="text-2xl font-light text-[#1A1814] mb-6">Manage Media</h1>

                <label className="block border-2 border-dashed border-[#6B6560]/30 rounded-lg p-8 text-center cursor-pointer hover:border-[#B8965A] transition mb-6">
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                    <p className="text-[#6B6560] text-sm">
                        {uploading ? 'Uploading...' : 'Click to upload a photo or video'}
                    </p>
                </label>

                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                <div className="grid grid-cols-3 gap-3">
                    {media.map((m) => (
                        <div key={m.id} className="aspect-square rounded-lg overflow-hidden bg-[#F9F7F4] border border-[#6B6560]/15">
                            {m.type === 'image' ? (
                                <img src={m.file_path} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <video src={m.file_path} className="w-full h-full object-cover" muted />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}