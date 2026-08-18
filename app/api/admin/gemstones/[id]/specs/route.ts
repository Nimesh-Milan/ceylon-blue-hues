import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Spec {
    label: string;
    value: string;
    display_order: number;
}

// GET all specs for a gemstone
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [specs] = await pool.query<RowDataPacket[]>(
            'SELECT label, value FROM gemstone_specs WHERE gemstone_id = ? ORDER BY display_order ASC',
            [id]
        );
        return NextResponse.json(specs);
    } catch (error) {
        console.error('Failed to fetch specs:', error);
        return NextResponse.json({ error: 'Failed to fetch specs' }, { status: 500 });
    }
}

// PUT (overwrite) all specs for a gemstone
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const connection = await pool.getConnection();
    try {
        const { id: gemstone_id } = await params;
        const specs: Spec[] = await request.json();

        await connection.beginTransaction();

        // 1. Delete all existing specs for this gemstone
        await connection.query('DELETE FROM gemstone_specs WHERE gemstone_id = ?', [gemstone_id]);

        // 2. Insert the new specs if any were provided
        if (specs && specs.length > 0) {
            const values = specs.map((spec, index) => [
                gemstone_id,
                spec.label,
                spec.value,
                index // Use the array index as the display_order
            ]);
            await connection.query(
                'INSERT INTO gemstone_specs (gemstone_id, label, value, display_order) VALUES ?',
                [values]
            );
        }

        await connection.commit();
        return NextResponse.json({ success: true });

    } catch (error) {
        await connection.rollback();
        console.error('Failed to update specs:', error);
        return NextResponse.json({ error: 'Failed to update specs' }, { status: 500 });
    } finally {
        connection.release();
    }
}