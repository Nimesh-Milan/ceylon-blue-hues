'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Gemstone {
    id: number;
    name: string;
    slug: string;
    description: string;
    origin: string;
    category: string;
    inquiry_only: boolean;
}

interface Spec {
    label: string;
    value: string;
}

export default function EditGemstonePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [gemstone, setGemstone] = useState<Partial<Gemstone>>({});
    const [specs, setSpecs] = useState<Spec[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (id) {
            Promise.all([
                fetch(`/api/admin/gemstones/${id}`).then(res => res.json()),
                fetch(`/api/admin/gemstones/${id}/specs`).then(res => res.json())
            ]).then(([gemstoneData, specsData]) => {
                setGemstone(gemstoneData);
                setSpecs(specsData);
                setLoading(false);
            }).catch(err => {
                setError('Failed to fetch gemstone data.');
                setLoading(false);
            });
        }
    }, [id]);

    const handleGemstoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setGemstone(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSpecChange = (index: number, field: 'label' | 'value', value: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    const addSpec = () => {
        setSpecs([...specs, { label: '', value: '' }]);
    };

    const removeSpec = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const gemstoneUpdate = fetch(`/api/admin/gemstones/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gemstone),
            });
            const specsUpdate = fetch(`/api/admin/gemstones/${id}/specs`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(specs.filter(s => s.label && s.value)), // Only save specs with both label and value
            });

            const responses = await Promise.all([gemstoneUpdate, specsUpdate]);

            if (responses.some(res => !res.ok)) {
                throw new Error('Failed to save all changes. Please check the details and try again.');
            }

            router.push('/admin');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to permanently delete this gemstone and all its media?')) {
            setIsDeleting(true);
            setError('');
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

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error && !gemstone.id) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-cream py-10 px-6">
            <div className="max-w-2xl mx-auto">
                <Link href={`/admin/gemstones/${id}`} className="text-sm text-gold hover:text-stone transition-colors">
                    ← Back to Media Manager
                </Link>
                <h1 className="text-3xl font-light text-stone mt-4 mb-6">Edit Gemstone</h1>

                <form onSubmit={handleSubmit} className="bg-white border border-mid/15 rounded-xl shadow-sm p-8 space-y-6">
                    <fieldset>
                        <legend className="text-lg font-light text-stone mb-4">Details</legend>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-stone mb-1">Name</label>
                                <input type="text" name="name" id="name" value={gemstone.name || ''} onChange={handleGemstoneChange} className="w-full px-4 py-2 bg-white border border-mid/20 rounded-lg text-sm text-stone focus:outline-none focus:border-gold" />
                            </div>
                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-stone mb-1">Slug (URL)</label>
                                <input type="text" name="slug" id="slug" value={gemstone.slug || ''} onChange={handleGemstoneChange} className="w-full px-4 py-2 bg-white border border-mid/20 rounded-lg text-sm text-stone focus:outline-none focus:border-gold" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-stone mb-1">Description</label>
                                <textarea name="description" id="description" value={gemstone.description || ''} onChange={handleGemstoneChange} rows={5} className="w-full px-4 py-2 bg-white border border-mid/20 rounded-lg text-sm text-stone focus:outline-none focus:border-gold" />
                            </div>
                            <div>
                                <label htmlFor="origin" className="block text-sm font-medium text-stone mb-1">Origin</label>
                                <input type="text" name="origin" id="origin" value={gemstone.origin || ''} onChange={handleGemstoneChange} className="w-full px-4 py-2 bg-white border border-mid/20 rounded-lg text-sm text-stone focus:outline-none focus:border-gold" />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-stone mb-1">Category</label>
                                <input type="text" name="category" id="category" value={gemstone.category || ''} onChange={handleGemstoneChange} className="w-full px-4 py-2 bg-white border border-mid/20 rounded-lg text-sm text-stone focus:outline-none focus:border-gold" />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="inquiry_only" id="inquiry_only" checked={gemstone.inquiry_only || false} onChange={handleGemstoneChange} className="h-4 w-4 rounded border-mid/30 text-gold focus:ring-gold" />
                                <label htmlFor="inquiry_only" className="text-sm text-stone">Inquiry Only</label>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="pt-6 border-t border-mid/10">
                        <legend className="text-lg font-light text-stone mb-4">Specifications</legend>
                        <div className="space-y-4">
                            {specs.map((spec, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input type="text" placeholder="Label (e.g., Carat)" value={spec.label} onChange={(e) => handleSpecChange(index, 'label', e.target.value)} className="flex-1 px-4 py-2 bg-white border border-mid/20 rounded-lg text-sm text-stone focus:outline-none focus:border-gold" />
                                    <input type="text" placeholder="Value (e.g., 2.5)" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="flex-1 px-4 py-2 bg-white border border-mid/20 rounded-lg text-sm text-stone focus:outline-none focus:border-gold" />
                                    <button type="button" onClick={() => removeSpec(index)} className="text-red-500 hover:text-red-700 transition-colors">Remove</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addSpec} className="mt-4 text-sm text-gold hover:text-stone transition-colors">+ Add Specification</button>
                    </fieldset>

                    {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

                    <div className="flex items-center justify-between pt-6 border-t border-mid/10">
                        <button type="submit" className="px-6 py-2.5 bg-stone text-white rounded-full text-sm uppercase tracking-widest hover:bg-stone/85 transition">
                            Save All Changes
                        </button>
                        <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-6 py-2.5 bg-red-600 text-white rounded-full text-sm uppercase tracking-widest hover:bg-red-700 transition disabled:bg-red-400">
                            {isDeleting ? 'Deleting...' : 'Delete Gemstone'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}