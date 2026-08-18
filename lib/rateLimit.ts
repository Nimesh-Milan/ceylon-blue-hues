/**
 * In-memory rate limiter — no Redis required for MVP.
 * Resets on server restart; suitable for single-instance deployments.
 *
 * Usage:
 *   const limiter = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });
 *   const { allowed, retryAfterSeconds } = limiter.check(ip);
 */

interface Window {
    count: number;
    resetAt: number;
}

interface RateLimitResult {
    allowed: boolean;
    retryAfterSeconds?: number;
}

const store = new Map<string, Window>();

export function createRateLimiter({ max, windowMs }: { max: number; windowMs: number }) {
    return {
        check(key: string): RateLimitResult {
            const now = Date.now();
            const existing = store.get(key);

            if (!existing || now > existing.resetAt) {
                store.set(key, { count: 1, resetAt: now + windowMs });
                return { allowed: true };
            }

            if (existing.count >= max) {
                const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
                return { allowed: false, retryAfterSeconds };
            }

            existing.count += 1;
            return { allowed: true };
        },
    };
}

// Shared limiter for the public inquiry endpoint: 5 requests per 10 minutes
export const inquiryLimiter = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });
