import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Inquiry extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    message: string;
    gemstone_slug: string;
    created_at: string;
}

export async function GET() {
    try {
        const [inquiries] = await pool.query<Inquiry[]>(
            'SELECT * FROM inquiries ORDER BY created_at DESC'
        );
        return NextResponse.json(inquiries);
    } catch (error) {
        console.error('Failed to fetch inquiries:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inquiries' },
            { status: 500 }
        );
    }
}