import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { RowDataPacket } from 'mysql2';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            const singleFile = formData.get('file') as File;
            if (singleFile) {
                files.push(singleFile);
            } else {
                return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
            }
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gemstones');
        await mkdir(uploadDir, { recursive: true });

        const [maxOrderResult] = await pool.query<RowDataPacket[]>(
            'SELECT MAX(display_order) as max_order FROM gemstone_media WHERE gemstone_id = ?',
            [id]
        );
        let currentOrder = maxOrderResult[0]?.max_order ?? -1;

        const uploadedPaths = [];

        for (const file of files) {
            const isVideo = file.type.startsWith('video/');
            const isImage = file.type.startsWith('image/');
            if (!isVideo && !isImage) continue;

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const safeName = `${Date.now()}-${Math.floor(Math.random()*1000)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filePath = path.join(uploadDir, safeName);
            await writeFile(filePath, buffer);

            const publicPath = `/uploads/gemstones/${safeName}`;
            currentOrder += 1;

            await pool.query(
                'INSERT INTO gemstone_media (gemstone_id, file_path, type, display_order) VALUES (?, ?, ?, ?)',
                [id, publicPath, isVideo ? 'video' : 'image', currentOrder]
            );
            uploadedPaths.push(publicPath);
        }

        return NextResponse.json({ success: true, paths: uploadedPaths });
    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { media_id } = await request.json();

        const [rows] = await pool.query(
            'SELECT file_path FROM gemstone_media WHERE id = ? AND gemstone_id = ?',
            [media_id, id]
        );

        const media = rows as any[];

        if (media.length === 0) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        const filePath = path.join(process.cwd(), 'public', media[0].file_path);
        
        try {
            await unlink(filePath);
        } catch (error) {
            console.error('File deletion failed:', error);
        }

        await pool.query('DELETE FROM gemstone_media WHERE id = ?', [media_id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Deletion failed:', error);
        return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [rows] = await pool.query(
            'SELECT * FROM gemstone_media WHERE gemstone_id = ? ORDER BY display_order ASC',
            [id]
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Failed to fetch media:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}
