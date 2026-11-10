'use client';

import { useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface LightboxItem {
  url: string;
  kind: 'photo' | 'video';
  caption?: string;
}

export default function ImageLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const item = items[index];
  const hasMultiple = items.length > 1;

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [goPrev, goNext, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 sm:left-4"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      <div className="flex max-h-[90vh] max-w-[92vw] flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        {item.kind === 'video' ? (
           
          <video src={item.url} controls autoPlay className="max-h-[80vh] max-w-full rounded-lg" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={item.caption || ''} className="max-h-[80vh] max-w-full rounded-lg object-contain" />
        )}
        {item.caption && <p className="text-center text-sm text-gray-300">{item.caption}</p>}
        {hasMultiple && (
          <p className="text-xs font-semibold text-gray-400">
            {index + 1} / {items.length}
          </p>
        )}
      </div>

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 sm:right-4"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}
    </div>
  );
}
