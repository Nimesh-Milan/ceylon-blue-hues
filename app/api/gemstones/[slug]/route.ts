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

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const [gemstones] = await pool.query<Gemstone[]>(
            'SELECT * FROM gemstones WHERE slug = ?',
            [params.slug]
        );

        if (gemstones.length === 0) {
            return NextResponse.json({ error: 'Gemstone not found' }, { status: 404 });
        }

        const gemstone = gemstones[0];

        const [specs] = await pool.query<Spec[]>(
            'SELECT * FROM gemstone_specs WHERE gemstone_id = ? ORDER BY display_order ASC',
            [gemstone.id]
        );
        const [media] = await pool.query<Media[]>(
            'SELECT * FROM gemstone_media WHERE gemstone_id = ? ORDER BY display_order ASC',
            [gemstone.id]
        );

        const result = {
            ...gemstone,
            specs,
            media: media.map((m) => ({
                ...m,
                file_path: `/uploads/gemstones/${m.file_path}`,
            })),
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error(`Failed to fetch gemstone ${params.slug}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch gemstone' },
            { status: 500 }
        );
    }
}
