'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="group relative inline-flex flex-col items-center overflow-hidden">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-navy font-bold transition-colors duration-500 group-hover:text-gold">
            {children}
        </span>
        <div className="absolute -bottom-1 left-1/2 right-1/2 h-[1px] bg-gold transition-all duration-500 group-hover:left-0 group-hover:right-0" />
    </Link>
);

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    return (
        <>
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
                mobileMenuOpen ? 'py-4 bg-cream' : (isScrolled ? 'py-4 bg-cream/80 backdrop-blur-md shadow-[0_10px_30px_-15px_rgba(4,20,44,0.05)]' : 'py-8 bg-transparent')
            }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                
                {/* Desktop Layout: Editorial Split */}
                <div className="hidden lg:grid grid-cols-3 items-center">
                    
                    {/* Left Navigation */}
                    <nav className="flex items-center gap-10 justify-start">
                        <NavLink href="/collection">Collection</NavLink>
                        <NavLink href="/#about">Heritage</NavLink>
                        <NavLink href="/#sustainability">Ethics</NavLink>
                    </nav>

                    {/* Center Logo */}
                    <div className="flex justify-center">
                        <Link href="/">
                            <Image
                                src="/images/BlueHuesLogo.png"
                                alt="Ceylon Blue Hues Logo"
                                width={200}
                                height={60}
                                className={`object-contain transition-transform duration-700 ${isScrolled ? 'scale-90' : 'scale-100'} [filter:brightness(0)_invert(7%)_sepia(26%)_saturate(1512%)_hue-rotate(175deg)_brightness(96%)_contrast(95%)]`}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right Navigation */}
                    <nav className="flex items-center gap-10 justify-end">
                        <NavLink href="/journal">Journal</NavLink>
                        <NavLink href="/#contact">Inquire</NavLink>
                        
                        <div className="w-px h-4 bg-navy/20 mx-2" />
                        
                        <Link href="/admin/login" className="font-sans text-[9px] font-bold tracking-[0.3em] uppercase text-navy/40 hover:text-gold transition-colors duration-500">
                            Staff
                        </Link>
                    </nav>
                </div>

                {/* Mobile Layout */}
                <div className="flex lg:hidden items-center justify-between">
                    <Link href="/">
                        <Image
                            src="/images/BlueHuesLogo.png"
                            alt="Ceylon Blue Hues Logo"
                            width={160}
                            height={48}
                            className="object-contain [filter:brightness(0)_invert(7%)_sepia(26%)_saturate(1512%)_hue-rotate(175deg)_brightness(96%)_contrast(95%)]"
                            priority
                        />
                    </Link>

                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-navy flex flex-col items-end gap-1.5 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold z-[60] relative"
                    >
                        <span className={`block w-6 h-[1px] bg-navy transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                        <span className={`block h-[1px] bg-navy transition-all duration-300 ${mobileMenuOpen ? 'w-0 opacity-0' : 'w-4'}`} />
                        <span className={`block w-6 h-[1px] bg-navy transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                    </button>
                </div>

            </div>

        </header>

            {/* Mobile Fullscreen Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 bg-cream z-40 flex flex-col items-center justify-center pt-20"
                    >
                        <nav className="flex flex-col items-center gap-10">
                            <Link href="/collection" onClick={() => setMobileMenuOpen(false)} className="font-serif text-4xl text-navy italic">Collection</Link>
                            <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="font-serif text-4xl text-navy italic">Heritage</Link>
                            <Link href="/#sustainability" onClick={() => setMobileMenuOpen(false)} className="font-serif text-4xl text-navy italic">Ethics</Link>
                            <Link href="/journal" onClick={() => setMobileMenuOpen(false)} className="font-serif text-4xl text-navy italic">Journal</Link>
                            <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="font-serif text-4xl text-navy italic">Inquire</Link>
                            <div className="w-12 h-px bg-gold/50 my-4" />
                            <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-navy/40">Staff Portal</Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
