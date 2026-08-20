'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        setLoading(false);

        if (res.ok) {
            router.push('/admin');
        } else {
            const data = await res.json();
            setError(data.error || 'Access Denied');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream px-6 relative overflow-hidden">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg z-10 flex flex-col items-center"
            >
                <div className="mb-16 text-center">
                    <div className="flex justify-center mb-8"><Image src="/images/BlueHuesLogo.png" alt="Ceylon Blue Hues Logo" width={200} height={60} className="object-contain [filter:brightness(0)_invert(7%)_sepia(26%)_saturate(1512%)_hue-rotate(175deg)_brightness(96%)_contrast(95%)]" priority /></div>
                    <h1 className="text-5xl md:text-7xl font-serif italic text-navy leading-none tracking-tight">Private Access</h1>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-navy/20 py-4 text-center text-lg font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/30"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-navy/20 py-4 text-center text-lg font-serif italic text-navy focus:outline-none focus:border-gold transition-colors placeholder-navy/30"
                        />
                    </div>

                    {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-700/80 text-[10px] uppercase tracking-[0.2em] font-bold text-center mt-2">
                            {error}
                        </motion.p>
                    )}

                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative inline-flex justify-center items-center px-12 py-5 text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-navy border border-navy hover:text-gold hover:border-gold transition-colors duration-500 overflow-hidden bg-transparent disabled:opacity-50"
                        >
                            <motion.span 
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent skew-x-12 z-0"
                            />
                            <span className="relative z-10 transition-colors duration-500">{loading ? 'Authenticating...' : 'Enter Vault'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
