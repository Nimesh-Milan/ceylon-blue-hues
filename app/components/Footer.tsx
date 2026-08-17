export default function Footer() {
  const links = [
    { href: '#about', label: 'About' },
    { href: '#sustainability', label: 'Sustainability' },
    { href: '#gemstones', label: 'Collection' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
      <footer className="relative bg-stone text-cream/60">
        {/* hairline gold accent — closes the loop with the header's top border */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <a href="#top" className="font-serif italic text-3xl text-cream hover:text-gold transition-colors duration-500 ease-[var(--ease-lux)]">
              Blue Hues Ceylon
            </a>
            <p className="text-[11px] tracking-[0.35em] uppercase text-cream/40">
              Fine Ceylon Gemstones
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-[11px] tracking-[0.25em] uppercase mt-12">
            {links.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    className="relative group py-1 transition-colors duration-300 hover:text-cream"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gold transition-all duration-500 ease-[var(--ease-lux)] group-hover:w-full" />
                </a>
            ))}
          </nav>

          <div className="mt-14 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs tracking-wider text-cream/40 order-2 sm:order-1">
              &copy; {new Date().getFullYear()} Blue Hues Ceylon. All Rights Reserved.
            </p>
            <a
                href="#top"
                className="group order-1 sm:order-2 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-cream/50 hover:text-gold transition-colors duration-300"
            >
              Back to top
              <span className="transition-transform duration-500 ease-[var(--ease-lux)] group-hover:-translate-y-0.5">
                            ↑
                        </span>
            </a>
          </div>
        </div>
      </footer>
  );
}