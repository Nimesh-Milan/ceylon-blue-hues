import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, slug, description, origin, category, specs } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO gemstones (name, slug, description, origin, category)
       VALUES (?, ?, ?, ?, ?)`,
            [name, slug, description || '', origin || '', category || '']
        );

        const gemstoneId = result.insertId;

        if (Array.isArray(specs) && specs.length > 0) {
            const specValues = specs.map((s: { label: string; value: string }, i: number) => [
                gemstoneId,
                s.label,
                s.value,
                i,
            ]);
            await pool.query(
                `INSERT INTO gemstone_specs (gemstone_id, label, value, display_order) VALUES ?`,
                [specValues]
            );
        }

        return NextResponse.json({ success: true, id: gemstoneId });
    } catch (error) {
        console.error('Failed to create gemstone:', error);
        return NextResponse.json({ error: 'Failed to create gemstone' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, slug, origin, category, display_order FROM gemstones ORDER BY display_order ASC'
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Failed to fetch gemstones:', error);
        return NextResponse.json({ error: 'Failed to fetch gemstones' }, { status: 500 });
    }
}