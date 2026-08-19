import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { cookies } from 'next/headers';

async function checkAuth() {
    const cookieStore = await cookies();
    return cookieStore.get('admin_token')?.value;
}

export async function GET() {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM posts ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { title, slug, excerpt, content, cover_image, category } = body;
        
        const [result] = await pool.query(
            `INSERT INTO posts (title, slug, excerpt, content, cover_image, category) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, slug, excerpt, content, cover_image, category]
        );
        
        return NextResponse.json({ success: true, id: (result as any).insertId });
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}