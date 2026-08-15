'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Spec {
    label: string;
    value: string;
}

export default function NewGemstonePage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [origin, setOrigin] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [specs, setSpecs] = useState<Spec[]>([{ label: '', value: '' }]);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function slugify(text: string) {
        return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    function updateSpec(index: number, field: keyof Spec, value: string) {
        const updated = [...specs];
        updated[index][field] = value;
        setSpecs(updated);
    }

    function addSpecRow() {
        setSpecs([...specs, { label: '', value: '' }]);
    }

    function removeSpecRow(index: number) {
        setSpecs(specs.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSaving(true);

        const res = await fetch('/api/admin/gemstones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                slug: slugify(name),
                description,
                origin,
                category,
                specs: specs.filter((s) => s.label && s.value),
            }),
        });

        setSaving(false);

        if (res.ok) {
            router.push('/admin');
        } else {
            const data = await res.json();
            setError(data.error || 'Something went wrong');
        }
    }

    return (
        <div className="min-h-screen bg-[#F9F7F4] py-12 px-6">
            <div className="max-w-2xl mx-auto bg-white border border-[#6B6560]/15 rounded-xl shadow-sm p-8">
                <h1 className="text-2xl font-light text-[#1A1814] mb-6">Add Gemstone</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        placeholder="Name (e.g. Ceylon Blue Sapphire 3.48 Ct Heated)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-[#6B6560]/30 rounded-md focus:outline-none focus:border-[#1A1814]"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Origin (e.g. Sri Lanka)"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="px-4 py-3 border border-[#6B6560]/30 rounded-md focus:outline-none focus:border-[#1A1814]"
                        />
                        <input
                            placeholder="Category (e.g. sapphire)"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-4 py-3 border border-[#6B6560]/30 rounded-md focus:outline-none focus:border-[#1A1814]"
                        />
                    </div>

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-[#6B6560]/30 rounded-md focus:outline-none focus:border-[#1A1814] resize-none"
                    />

                    <div>
                        <p className="text-xs uppercase tracking-widest text-[#6B6560] mb-3">Specifications</p>
                        {specs.map((spec, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input
                                    placeholder="Label (e.g. Carat)"
                                    value={spec.label}
                                    onChange={(e) => updateSpec(i, 'label', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-[#6B6560]/30 rounded-md text-sm"
                                />
                                <input
                                    placeholder="Value (e.g. 3.48 ct)"
                                    value={spec.value}
                                    onChange={(e) => updateSpec(i, 'value', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-[#6B6560]/30 rounded-md text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSpecRow(i)}
                                    className="px-3 text-[#6B6560] hover:text-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSpecRow}
                            className="text-sm text-[#B8965A] mt-1"
                        >
                            + Add another spec
                        </button>
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 bg-[#1A1814] text-white rounded-md uppercase text-sm tracking-widest hover:bg-[#2c2924] transition disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Gemstone'}
                    </button>
                </form>
            </div>
        </div>
    );
}