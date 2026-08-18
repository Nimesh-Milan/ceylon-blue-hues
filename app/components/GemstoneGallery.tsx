'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { GemstoneMedia } from '@/types/gemstone';

interface GemstoneGalleryProps {
    media: GemstoneMedia[];
    name: string;
}

// Treat anything not explicitly a video as an image, and match case-insensitively.
const isVideo = (m?: GemstoneMedia | null) => m?.type?.toLowerCase() === 'video';

export default function GemstoneGallery({ media, name }: GemstoneGalleryProps) {
    const [activeMedia, setActiveMedia] = useState<GemstoneMedia | null>(null);
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        setActiveMedia(media?.[0] || null);
        requestAnimationFrame(() => setIsShowing(true));
    }, [media]);

    return (
        <div
            className={`flex flex-col gap-6 transition-all duration-1000 ${
                isShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-lux)' }}
        >
            {/* Main stage */}
            <div className="relative aspect-[4/3] bg-cream border border-stone/10 overflow-hidden">
                <div key={activeMedia?.file_path} className="absolute inset-6 sm:inset-10 fade-media">
                    {activeMedia && !isVideo(activeMedia) ? (
                        <Image
                            src={activeMedia.file_path}
                            alt={name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    ) : activeMedia ? (
                        <video
                            key={activeMedia.file_path}
                            src={activeMedia.file_path}
                            controls
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-contain"
                        />
                    ) : null}
                </div>
            </div>

            {/* Thumbnail strip */}
            {media && media.length > 1 && (
                <div className="flex gap-5">
                    {media.map((mediaItem) => {
                        const isActive = activeMedia?.file_path === mediaItem.file_path;
                        return (
                            <button
                                key={mediaItem.file_path}
                                onClick={() => setActiveMedia(mediaItem)}
                                aria-label={`Show ${isVideo(mediaItem) ? 'video' : 'photo'}`}
                                aria-pressed={isActive}
                                className="group flex flex-col items-center gap-2.5"
                            >
                                <span className="relative w-14 h-14 sm:w-16 sm:h-16 overflow-hidden bg-cream">
                                    {!isVideo(mediaItem) ? (
                                        <Image
                                            src={mediaItem.file_path}
                                            alt={`${name} thumbnail`}
                                            fill
                                            className={`object-cover transition-opacity duration-300 ${
                                                isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'
                                            }`}
                                            sizes="64px"
                                        />
                                    ) : (
                                        <div
                                            className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
                                                isActive ? 'opacity-100 bg-stone/10' : 'opacity-50 bg-stone/5 group-hover:opacity-80'
                                            }`}
                                        >
                                            <svg className="w-5 h-5 text-stone/50" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm11.586 6.586l-4.293-4.293A1 1 0 0010 7v6a1 1 0 001.293.707l4.293-4.293a1 1 0 000-1.414z" />
                                            </svg>
                                        </div>
                                    )}
                                </span>
                                <span
                                    className={`h-px transition-all duration-500 ease-[var(--ease-lux)] bg-gold ${
                                        isActive ? 'w-6' : 'w-0'
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}