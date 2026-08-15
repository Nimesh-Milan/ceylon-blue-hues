import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Gemstone extends RowDataPacket {
    id: number;
    name: string;
    slug: string;
    description: string;
    origin: string;
    category: string;
    inquiry_only: boolean;
    display_order: number;
}

interface Spec extends RowDataPacket {
    gemstone_id: number;
    label: string;
    value: string;
}

interface Media extends RowDataPacket {
    gemstone_id: number;
    file_path: string;
    type: 'image' | 'video';
}

export async function GET() {
    try {
        const [gemstones] = await pool.query<Gemstone[]>(
            'SELECT * FROM gemstones ORDER BY display_order ASC'
        );
        const [specs] = await pool.query<Spec[]>(
            'SELECT * FROM gemstone_specs ORDER BY display_order ASC'
        );
        const [media] = await pool.query<Media[]>(
            'SELECT * FROM gemstone_media ORDER BY display_order ASC'
        );

        const result = gemstones.map((gem) => ({
            ...gem,
            specs: specs.filter((s) => s.gemstone_id === gem.id),
            media: media.filter((m) => m.gemstone_id === gem.id),
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to fetch gemstones:', error);
        return NextResponse.json(
            { error: 'Failed to fetch gemstones' },
            { status: 500 }
        );
    }
}