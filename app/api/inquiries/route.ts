import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message, related_gemstone_id } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await db.query(
      'INSERT INTO inquiries (name, email, subject, message, related_gemstone_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, subject, message, related_gemstone_id || null]
    );

    // The result of an insert query is an array with an OK packet.
    // We can check the insertId to confirm the operation was successful.
    const insertId = (result as any).insertId;
    if (insertId) {
      return NextResponse.json({ message: 'Inquiry submitted successfully', id: insertId }, { status: 201 });
    } else {
      throw new Error('Failed to save inquiry to the database.');
    }

  } catch (error) {
    console.error('Error submitting inquiry:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
