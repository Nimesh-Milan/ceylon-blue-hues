import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import type { RowDataPacket } from 'mysql2';

async function checkAuth() {
    const cookieStore = await cookies();
    return cookieStore.get('admin_token')?.value;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const { id } = await params;
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM posts WHERE id = ?', [id]);
        if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(rows[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, slug, excerpt, content, cover_image, category } = body;
        
        await pool.query(
            `UPDATE posts 
             SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image = ?, category = ? 
             WHERE id = ?`,
            [title, slug, excerpt, content, cover_image, category, id]
        );
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    try {
        const { id } = await params;
        await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}