export default function Footer() {
  const links = [
    { href: '#about', label: 'About' },
    { href: '#sustainability', label: 'Sustainability' },
    { href: '#gemstones', label: 'Collection' },
    { href: '#contact', label: 'Contact' },
  ];

  const contactDetails = [
    { label: 'Visit', value: 'Ceylon Blue Hues Pvt Ltd, Level 26, East Tower, World Trade Center, Echelon Square, Colombo 00100, Sri Lanka' },
    { label: 'Email', value: 'sales-us@ceybluehues.com', href: 'mailto:sales-us@ceybluehues.com' },
    { label: 'Call ', value: '+94 72 355 3882', href: 'tel:+94723553882' },
    { label: 'Hours', value: 'Mon–Sat, 9am–6pm' },
  ];

  return (
      <footer className="relative bg-cream text-mid border-t border-stone/10">
        {/* hairline gold accent — closes the loop with the header's top border */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1.3fr] gap-12 md:gap-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <a
                  href="#top"
                  className="font-serif italic text-3xl text-stone hover:text-gold transition-colors duration-500 ease-[var(--ease-lux)]"
              >
                Ceylon Blue Hues
              </a>
              <p className="text-[11px] tracking-[0.35em] uppercase text-mid/60 mt-3">
                Fine Ceylon Gemstones
              </p>
              <p className="text-sm text-mid/70 mt-5 max-w-xs mx-auto md:mx-0 leading-relaxed">
                Ethically sourced, artisanally crafted gemstones from the heart of Sri Lanka.
              </p>
            </div>

            {/* Explore */}
            <div className="text-center md:text-left">
              <h3 className="text-[11px] tracking-[0.3em] uppercase text-gold font-medium mb-5">
                Explore
              </h3>
              <nav className="flex flex-col items-center md:items-start gap-3 text-sm tracking-wide">
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className="relative group text-mid hover:text-stone transition-colors duration-300"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-500 ease-[var(--ease-lux)] group-hover:w-full" />
                    </a>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h3 className="text-[11px] tracking-[0.3em] uppercase text-gold font-medium mb-5">
                Contact
              </h3>
              <ul className="space-y-3 text-sm">
                {contactDetails.map((item) => (
                    <li key={item.label} className="flex flex-col md:flex-row md:gap-2 justify-center md:justify-start">
                      <span className="text-mid/50 tracking-wide">{item.label}</span>
                      {item.href ? (
                          <a href={item.href} className="text-stone hover:text-gold transition-colors duration-300">
                            {item.value}
                          </a>
                      ) : (
                          <span className="text-stone">{item.value}</span>
                      )}
                    </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-stone/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs tracking-wider text-mid/50 order-2 sm:order-1">
              &copy; {new Date().getFullYear()} Ceylon Blue Hues. All Rights Reserved.
            </p>
            <a
                href="#top"
                className="group order-1 sm:order-2 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-mid/60 hover:text-gold transition-colors duration-300"
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