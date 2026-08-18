import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { inquiryLimiter } from '@/lib/rateLimit';
import { headers } from 'next/headers';

// Validation helpers
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
    name: 100,
    email: 255,
    subject: 200,
    message: 5000,
};

export async function POST(request: Request) {
    // --- Rate limiting ---
    const headersList = await headers();
    const ip =
        headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        headersList.get('x-real-ip') ??
        'unknown';

    const { allowed, retryAfterSeconds } = inquiryLimiter.check(ip);
    if (!allowed) {
        return NextResponse.json(
            { message: `Too many requests. Please try again in ${retryAfterSeconds} seconds.` },
            {
                status: 429,
                headers: { 'Retry-After': String(retryAfterSeconds) },
            }
        );
    }

    // --- Parse body ---
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, subject, message, related_gemstone_id } = body as {
        name?: string;
        email?: string;
        subject?: string;
        message?: string;
        related_gemstone_id?: string | number | null;
    };

    // --- Presence validation ---
    const missing = (['name', 'email', 'subject', 'message'] as const).filter(
        (f) => !body[f] || String(body[f]).trim() === ''
    );
    if (missing.length > 0) {
        return NextResponse.json(
            { message: `Missing required fields: ${missing.join(', ')}` },
            { status: 400 }
        );
    }

    // --- Format validation ---
    if (!EMAIL_REGEX.test(String(email))) {
        return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    // --- Length validation ---
    const tooBig = (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).find(
        (field) => String(body[field] ?? '').length > LIMITS[field]
    );
    if (tooBig) {
        return NextResponse.json(
            { message: `${tooBig} must be ${LIMITS[tooBig]} characters or fewer` },
            { status: 400 }
        );
    }

    // --- Persist ---
    try {
        const [result] = await db.query(
            'INSERT INTO inquiries (name, email, subject, message, related_gemstone_id) VALUES (?, ?, ?, ?, ?)',
            [
                String(name).trim(),
                String(email).trim().toLowerCase(),
                String(subject).trim(),
                String(message).trim(),
                related_gemstone_id ?? null,
            ]
        );

        const insertId = (result as { insertId: number }).insertId;
        if (!insertId) throw new Error('Insert did not return an ID');

        return NextResponse.json(
            { message: 'Inquiry submitted successfully', id: insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
