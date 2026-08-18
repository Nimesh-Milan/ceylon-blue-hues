import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string, mediaId: string }> }
) {
    try {
        const { id, mediaId } = await params;
        const { is_primary } = await request.json();

        if (is_primary) {
            await pool.query('UPDATE gemstone_media SET is_primary = false WHERE gemstone_id = ?', [id]);
            await pool.query('UPDATE gemstone_media SET is_primary = true WHERE id = ?', [mediaId]);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update failed:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string, mediaId: string }> }
) {
    try {
        const { mediaId } = await params;
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const [oldMediaRows] = await pool.query('SELECT file_path FROM gemstone_media WHERE id = ?', [mediaId]);
        const oldMedia = oldMediaRows as any[];

        if (oldMedia.length > 0) {
            const oldFilePath = path.join(process.cwd(), 'public', oldMedia[0].file_path);
            try {
                await unlink(oldFilePath);
            } catch (error) {
                console.error('Old file deletion failed:', error);
            }
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gemstones');
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const newFilePath = path.join(uploadDir, safeName);
        await writeFile(newFilePath, buffer);
        const newPublicPath = `/uploads/gemstones/${safeName}`;

        await pool.query('UPDATE gemstone_media SET file_path = ? WHERE id = ?', [newPublicPath, mediaId]);

        return NextResponse.json({ success: true, path: newPublicPath });
    } catch (error) {
        console.error('Replace failed:', error);
        return NextResponse.json({ error: 'Replace failed' }, { status: 500 });
    }
}