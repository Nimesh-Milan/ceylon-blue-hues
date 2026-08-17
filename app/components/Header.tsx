'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    // Handle header background on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check on initial load
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const links = [
        { href: isHomePage ? '#about' : '/#about', label: 'About' },
        { href: isHomePage ? '#sustainability' : '/#sustainability', label: 'Sustainability' },
        { href: '/#gemstones', label: 'Collection' },
        { href: isHomePage ? '#contact' : '/#contact', label: 'Contact' },
    ];

    const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M4 7h16M4 12h16M4 17h16" />
        </svg>
    );

    const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );

    const solid = isScrolled || !isHomePage;
    const linkColor = solid ? 'text-mid hover:text-stone' : 'text-white/85 hover:text-white';

    return (
        <>
            <header
                className={`fixed top-0 inset-x-0 z-40 transition-all duration-700 ease-[var(--ease-lux)] ${
                    solid ? 'bg-cream/85 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_12px_30px_-15px_rgba(0,0,0,0.15)]' : 'bg-transparent'
                }`}
            >
                {/* Hairline gold accent — appears once the page has been engaged with */}
                <div
                    className={`h-px w-full bg-gradient-to-r from-transparent via-gold/70 to-transparent transition-opacity duration-700 ${
                        solid ? 'opacity-100' : 'opacity-0'
                    }`}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex items-center justify-between transition-all duration-500 ease-[var(--ease-lux)] ${solid ? 'h-[72px]' : 'h-24'}`}>
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 group">
                            <Image
                                src="/images/BlueHuesLogo.png"
                                alt="Blue Hues Ceylon"
                                width={150}
                                height={46}
                                className={`h-9 w-auto object-contain transition-all duration-500 ease-[var(--ease-lux)] group-hover:opacity-80 ${
                                    solid ? '' : 'brightness-0 invert'
                                }`}
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-10">
                            <nav className="flex items-center gap-9 text-[11px] font-medium tracking-[0.22em] uppercase">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`${linkColor} relative group py-2 transition-colors duration-300`}
                                    >
                                        <span>{link.label}</span>
                                        <span
                                            className={`absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gold transition-all duration-500 ease-[var(--ease-lux)] group-hover:w-full`}
                                        />
                                    </Link>
                                ))}
                            </nav>

                            <div className={`w-px h-4 ${solid ? 'bg-stone/15' : 'bg-white/25'}`} />

                            <button
                                onClick={() => console.log('Search clicked')}
                                aria-label="Search"
                                className={`${linkColor} transition-all duration-300 hover:scale-110`}
                            >
                                <SearchIcon className="w-[18px] h-[18px]" />
                            </button>

                            <Link
                                href="/#contact"
                                className={`group relative inline-flex justify-center items-center px-7 py-[10px] text-[11px] font-medium tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 ease-[var(--ease-lux)] ${
                                    solid
                                        ? 'text-white'
                                        : 'border border-white/40 text-white hover:border-white/70'
                                }`}
                            >
                                {solid && (
                                    <>
                                        <span className="absolute inset-0 bg-stone transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-0 origin-right" />
                                        <span className="absolute inset-0 bg-gold scale-x-0 transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-100 origin-left" />
                                    </>
                                )}
                                <span className="relative">Inquire</span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMenuOpen(true)}
                                aria-label="Open menu"
                                className={`${solid ? 'text-stone' : 'text-white'} hover:text-gold transition-colors duration-300`}
                            >
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Panel */}
            <div
                className={`fixed inset-0 z-50 bg-cream transition-opacity duration-500 ease-[var(--ease-lux)] ${
                    menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden={!menuOpen}
            >
                {/* faint radial glow for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(190,158,90,0.08),transparent_60%)]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex-shrink-0" onClick={() => setMenuOpen(false)}>
                            <Image
                                src="/images/BlueHuesLogo.png"
                                alt="Blue Hues Ceylon"
                                width={140}
                                height={44}
                                className="h-9 w-auto object-contain"
                                priority
                            />
                        </Link>
                        <button
                            onClick={() => setMenuOpen(false)}
                            aria-label="Close menu"
                            className="text-stone hover:text-gold hover:rotate-90 transition-all duration-500 ease-[var(--ease-lux)]"
                        >
                            <CloseIcon className="w-7 h-7" />
                        </button>
                    </div>
                </div>

                <div className="relative h-[calc(100vh-80px)] flex items-center justify-center -mt-10">
                    <nav className="flex flex-col items-center text-center gap-2">
                        {links.map((link, i) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    transitionDelay: menuOpen ? `${120 + i * 70}ms` : '0ms',
                                }}
                                className={`font-serif italic text-4xl text-stone hover:text-gold px-6 py-3 transition-all duration-500 ease-[var(--ease-lux)] ${
                                    menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div
                            style={{ transitionDelay: menuOpen ? `${120 + links.length * 70}ms` : '0ms' }}
                            className={`mt-6 h-px w-10 bg-gold/50 transition-all duration-500 ease-[var(--ease-lux)] ${
                                menuOpen ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                        <Link
                            href="/#contact"
                            onClick={() => setMenuOpen(false)}
                            style={{ transitionDelay: menuOpen ? `${180 + links.length * 70}ms` : '0ms' }}
                            className={`mt-6 inline-flex justify-center py-3 px-12 bg-stone text-white uppercase tracking-[0.2em] text-xs font-medium hover:bg-gold transition-all duration-500 ease-[var(--ease-lux)] ${
                                menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                            }`}
                        >
                            Inquire Now
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
}