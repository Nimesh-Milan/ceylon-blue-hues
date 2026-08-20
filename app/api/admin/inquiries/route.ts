import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Inquiry extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    related_gemstone_id: number | null;
    status: 'unread' | 'read' | 'replied' | 'archived';
    created_at: string;
}

export async function GET() {
    try {
        const [inquiries] = await pool.query<Inquiry[]>(
            `SELECT id, name, email, subject, message, related_gemstone_id, status, created_at
             FROM inquiries
             ORDER BY created_at DESC`
        );
        return NextResponse.json(inquiries);
    } catch (error) {
        console.error('Failed to fetch inquiries:', error);
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body as { id?: number; status?: string };

        if (!id || !status) {
            return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
        }

        const allowed = ['unread', 'read', 'replied', 'archived'];
        if (!allowed.includes(status)) {
            return NextResponse.json(
                { error: `status must be one of: ${allowed.join(', ')}` },
                { status: 400 }
            );
        }

        await pool.query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update inquiry:', error);
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'id is required' }, { status: 400 });
        }

        await pool.query('DELETE FROM inquiries WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete inquiry:', error);
        return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
    }
}
