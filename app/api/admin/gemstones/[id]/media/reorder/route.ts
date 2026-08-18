import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: gemstone_id } = await params;
        const { order } = await request.json();

        if (!Array.isArray(order)) {
            return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            for (let i = 0; i < order.length; i++) {
                const mediaId = order[i];
                const displayOrder = i;
                await connection.query(
                    'UPDATE gemstone_media SET display_order = ? WHERE id = ? AND gemstone_id = ?',
                    [displayOrder, mediaId, gemstone_id]
                );
            }
            await connection.commit();
            return NextResponse.json({ success: true });
        } catch (error) {
            await connection.rollback();
            console.error('Reorder failed:', error);
            // Provide more specific error message if possible
            const dbError = error as any;
            if (dbError.code === 'ER_BAD_FIELD_ERROR') {
                 return NextResponse.json({ error: `Database schema error: ${dbError.sqlMessage}` }, { status: 500 });
            }
            return NextResponse.json({ error: 'An error occurred while saving the new order.' }, { status: 500 });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Reorder request failed:', error);
        return NextResponse.json({ error: 'Reorder request failed' }, { status: 500 });
    }
}