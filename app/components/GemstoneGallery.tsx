'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GemstoneMedia } from '@/types/gemstone';

interface GemstoneGalleryProps {
    media: GemstoneMedia[];
    name: string;
    onImageClick?: (imagePath: string) => void;
}

const isVideo = (m?: GemstoneMedia | null) => m?.type?.toLowerCase() === 'video';

export default function GemstoneGallery({ media, name, onImageClick }: GemstoneGalleryProps) {
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const activeMedia = media?.[activeMediaIndex] || null;

    if (!media || media.length === 0) return null;

    return (
        <div className="relative w-full flex-1 flex flex-col min-h-0">
            {/* Main stage */}
            <div className="flex-1 min-h-0 relative flex items-center justify-center p-4 md:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeMedia?.file_path || 'empty'}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative w-full h-full min-h-0 flex items-center justify-center z-10 group ${
                            !isVideo(activeMedia) ? 'mix-blend-multiply cursor-zoom-in' : ''
                        }`}
                        onClick={() => {
                            if (!isVideo(activeMedia) && onImageClick) {
                                onImageClick(activeMedia.file_path);
                            }
                        }}
                    >
                        {!isVideo(activeMedia) ? (
                            <img
                                src={activeMedia.file_path}
                                alt={name}
                                className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-[2s] ease-out"
                            />
                        ) : (
                            <video
                                key={activeMedia.file_path}
                                src={activeMedia.file_path}
                                controls
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Thumbnail strip */}
            {media.length > 1 && (
                <div className="relative h-24 md:h-32 border-t border-navy/5 flex items-center justify-center gap-4 z-50 bg-[#FDFBF7]/80 backdrop-blur-sm px-6 overflow-x-auto w-full shrink-0">
                    {media.map((mediaItem, idx) => {
                        const isActive = activeMediaIndex === idx;
                        return (
                            <button
                                key={mediaItem.id || mediaItem.file_path || idx}
                                onClick={() => setActiveMediaIndex(idx)}
                                aria-label={`Show ${isVideo(mediaItem) ? 'video' : 'photo'}`}
                                aria-pressed={isActive}
                                className={`relative z-10 cursor-pointer flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-sm border transition-all duration-300 overflow-hidden bg-transparent ${
                                    isActive
                                        ? 'border-navy shadow-md scale-105'
                                        : 'border-navy/10 opacity-50 hover:opacity-100 hover:border-navy/30'
                                } ${!isVideo(mediaItem) ? 'mix-blend-multiply' : ''}`}
                            >
                                {!isVideo(mediaItem) ? (
                                    <img
                                        src={mediaItem.file_path}
                                        alt={`${name} thumbnail`}
                                        className="w-full h-full object-cover p-1"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-navy/5 flex items-center justify-center p-1">
                                        <svg className="w-6 h-6 text-navy/40" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm11.586 6.586l-4.293-4.293A1 1 0 0010 7v6a1 1 0 001.293.707l4.293-4.293a1 1 0 000-1.414z" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}