'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Overview', href: '/admin' },
        { name: 'Collection', href: '/admin/gemstones' },
        { name: 'Inquiries', href: '/admin/inquiries' },
        { name: 'Journal', href: '/admin/journal' }
    ];

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="bg-[#FDFBF7] min-h-screen font-sans text-navy flex flex-col">
            
            {/* Minimalist Top Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-navy/5 px-6 lg:px-12 h-20 flex items-center justify-between">
                
                <div className="flex items-center gap-12">
                    <Link href="/admin"><Image src="/images/BlueHuesLogo.png" alt="CBH Admin" width={120} height={40} className="object-contain" priority /></Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                            return (
                                <Link 
                                    key={item.name} 
                                    href={item.href}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-colors relative ${
                                        isActive ? 'text-gold' : 'text-navy/50 hover:text-navy'
                                    }`}
                                >
                                    {item.name}
                                    {isActive && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <a href="/api/admin/logout" className="hidden md:block text-[9px] font-bold tracking-[0.3em] uppercase text-navy/40 hover:text-navy transition-colors">
                        Sign Out
                    </a>

                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-navy p-2 focus:outline-none"
                    >
                        <span className={`block w-5 h-px bg-navy mb-1.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                        <span className={`block w-5 h-px bg-navy mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-5 h-px bg-navy transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                    </button>
                </div>

            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 top-20 bg-cream z-40 flex flex-col p-6 animate-in fade-in duration-300">
                    <nav className="flex flex-col gap-8 items-center pt-12">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                            return (
                                <Link 
                                    key={item.name} 
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-[12px] font-bold tracking-[0.4em] uppercase ${
                                        isActive ? 'text-gold' : 'text-navy/50'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                        <div className="w-12 h-px bg-navy/10 my-4" />
                        <a href="/api/admin/logout" className="text-[12px] font-bold tracking-[0.4em] uppercase text-red-700/70">
                            Sign Out
                        </a>
                    </nav>
                </div>
            )}

            <main className="flex-1 pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
