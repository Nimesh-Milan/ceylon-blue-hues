import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET a single gemstone by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM gemstones WHERE id = ?',
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Gemstone not found' }, { status: 404 });
        }
        
        const [specs] = await pool.query(
            'SELECT label, value FROM gemstone_specs WHERE gemstone_id = ? ORDER BY display_order ASC',
            [id]
        );
        
        const gemstone = rows[0];
        gemstone.specs = specs;
        
        return NextResponse.json(gemstone);

    } catch (error) {
        console.error('Failed to fetch gemstone:', error);
        return NextResponse.json({ error: 'Failed to fetch gemstone' }, { status: 500 });
    }
}

// PATCH (update) a gemstone's details
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        // Basic validation
        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
        }

        // Explicitly list fields that are allowed to be updated
        const allowedFields = ['name', 'slug', 'description', 'origin', 'category', 'inquiry_only', 'availability'];
        const fieldsToUpdate = Object.keys(body).filter(field => allowedFields.includes(field));

        if (fieldsToUpdate.length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
        const values = fieldsToUpdate.map(field => body[field]);

        await pool.query(`UPDATE gemstones SET ${setClause} WHERE id = ?`, [...values, id]);

        return NextResponse.json({ success: true, message: 'Gemstone updated successfully' });
    } catch (error) {
        console.error('Failed to update gemstone:', error);
        return NextResponse.json({ error: 'Failed to update gemstone' }, { status: 500 });
    }
}

// DELETE a gemstone
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // TODO: Also delete associated media files from the filesystem
        await pool.query('DELETE FROM gemstone_media WHERE gemstone_id = ?', [id]);
        await pool.query('DELETE FROM gemstone_specs WHERE gemstone_id = ?', [id]);
        await pool.query('DELETE FROM gemstones WHERE id = ?', [id]);

        return NextResponse.json({ success: true, message: 'Gemstone deleted successfully' });
    } catch (error) {
        console.error('Failed to delete gemstone:', error);
        return NextResponse.json({ error: 'Failed to delete gemstone' }, { status: 500 });
    }
}