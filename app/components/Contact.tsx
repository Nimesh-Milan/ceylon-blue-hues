'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInView } from '../hooks/useInView';

type Status = 'idle' | 'submitting' | 'success' | 'error';

// Inner component that uses useSearchParams (must be wrapped in Suspense)
function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [formRef, formInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const searchParams = useSearchParams();

  // Pre-populate from ?gemstone= URL param (set by detail page "Inquire" button)
  const gemstoneParam = searchParams.get('gemstone');
  const [relatedGemstone, setRelatedGemstone] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!gemstoneParam) return;
    // Fetch gemstone name from the slug
    fetch(`/api/gemstones/${gemstoneParam}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.name) setRelatedGemstone({ id: data.id, name: data.name });
      })
      .catch(() => null);
  }, [gemstoneParam]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    // Attach related gemstone id if we resolved one
    if (relatedGemstone) {
      (payload as Record<string, unknown>).related_gemstone_id = relatedGemstone.id;
    }

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  }

  const fieldStyles =
    'peer block w-full bg-transparent border-0 border-b border-mid/25 px-0 pt-2 pb-3 text-stone placeholder-transparent focus:outline-none focus:ring-0 focus:border-gold transition-colors duration-500 ease-[var(--ease-lux)]';

  const labelStyles =
    'text-[11px] tracking-[0.25em] uppercase text-mid/60 peer-focus:text-gold transition-colors duration-500 ease-[var(--ease-lux)]';

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-cream overflow-hidden">
      {/* watermark numeral */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-6 font-serif italic text-[220px] leading-none text-stone/[0.03] select-none hidden lg:block"
      >
        04
      </span>

      <div
        ref={formRef}
        className={`relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          formInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-lux)' }}
      >
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="h-px w-8 bg-gold/70" />
          <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-medium">
            Reach Us
          </span>
          <span className="h-px w-8 bg-gold/70" />
        </div>

        <h2 className="font-serif text-4xl md:text-5xl italic text-stone text-center mb-4">
          Get in Touch
        </h2>
        <p className="text-center text-lg text-mid mb-10 max-w-2xl mx-auto">
          Have a question or a special request? We would love to hear from you. Fill out the form
          below and we will get back to you as soon as possible.
        </p>

        {/* Gemstone pre-selection badge */}
        {relatedGemstone && (
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold font-medium">
                Regarding: {relatedGemstone.name}
              </span>
              <button
                type="button"
                onClick={() => setRelatedGemstone(null)}
                className="ml-1 text-gold/60 hover:text-gold transition-colors"
                aria-label="Remove gemstone selection"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {status === 'success' ? (
          <div className="text-center py-16 border-t border-b border-stone/10 animate-[fadeIn_600ms_var(--ease-lux)_both]">
            <p className="font-serif italic text-3xl text-stone mb-3">Thank You</p>
            <p className="text-mid/80 max-w-sm mx-auto">
              Your message has been received. A member of our team will be in touch shortly.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 text-[11px] tracking-[0.25em] uppercase text-gold hover:text-stone transition-colors duration-300"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10" aria-busy={status === 'submitting'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              <div>
                <label htmlFor="name" className={labelStyles}>
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  maxLength={100}
                  placeholder="Your Name"
                  className={fieldStyles}
                />
              </div>
              <div>
                <label htmlFor="email" className={labelStyles}>
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  maxLength={255}
                  placeholder="Your Email"
                  className={fieldStyles}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className={labelStyles}>
                Subject
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                required
                maxLength={200}
                placeholder="Subject"
                className={fieldStyles}
              />
            </div>

            <div>
              <label htmlFor="message" className={labelStyles}>
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={5}
                required
                maxLength={5000}
                placeholder="Your Message"
                className={`${fieldStyles} resize-none`}
              />
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                id="contact-submit"
                disabled={status === 'submitting'}
                className="group relative inline-flex justify-center items-center gap-3 py-4 px-14 overflow-hidden border border-gold text-[11px] font-medium tracking-[0.25em] uppercase disabled:opacity-60 disabled:cursor-wait"
              >
                <span className="absolute inset-0 bg-gold scale-x-0 origin-left transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-100" />
                <span className="relative text-gold transition-colors duration-500 group-hover:text-white">
                  {status === 'submitting' ? 'Sending' : 'Send Message'}
                </span>
                {status === 'submitting' && (
                  <span className="relative flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-gold group-hover:bg-white animate-[dotPulse_1.2s_ease-in-out_infinite]" />
                    <span className="w-1 h-1 rounded-full bg-gold group-hover:bg-white animate-[dotPulse_1.2s_ease-in-out_0.2s_infinite]" />
                    <span className="w-1 h-1 rounded-full bg-gold group-hover:bg-white animate-[dotPulse_1.2s_ease-in-out_0.4s_infinite]" />
                  </span>
                )}
              </button>
            </div>

            <p role="status" aria-live="polite" className="text-center min-h-[1.25rem]">
              {status === 'error' && (
                <span className="text-sm text-red-700/80">
                  There was an error sending your message. Please try again.
                </span>
              )}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

// Default export wraps in Suspense (required for useSearchParams in Next.js App Router)
export default function Contact() {
  return (
    <Suspense fallback={<div className="py-24 sm:py-32" />}>
      <ContactForm />
    </Suspense>
  );
}