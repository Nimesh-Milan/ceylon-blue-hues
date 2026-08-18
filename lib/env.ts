/**
 * Validates that all required environment variables are present.
 * Import this module early (e.g., in lib/db.ts) so missing vars are caught
 * at startup rather than mid-request.
 */

const REQUIRED_ENV_VARS = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
] as const;

for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
        throw new Error(
            `[Ceylon Blue Hues] Missing required environment variable: ${key}\n` +
            `Please add it to your .env.local file.`
        );
    }
}

// Export typed env for convenient access without the non-null assertion (!) elsewhere
export const env = {
    DB_HOST: process.env.DB_HOST as string,
    DB_USER: process.env.DB_USER as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    DB_NAME: process.env.DB_NAME as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    NODE_ENV: process.env.NODE_ENV ?? 'development',
};
