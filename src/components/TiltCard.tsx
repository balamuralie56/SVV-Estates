'use client';

import { useRef } from 'react';

/**
 * 3D tilt + a pointer-following light glare, like a glossy keynote card.
 * Desktop/mouse only (coarse pointers are untouched) and capped at a
 * moderate angle so it reads as deliberate depth, not a toy.
 */
export default function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(1000px) rotateY(${(x - 0.5) * 10}deg) rotateX(${-(y - 0.5) * 10}deg) translateZ(0) scale3d(1.015, 1.015, 1.015)`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.35), transparent 55%)`;
      glareRef.current.style.opacity = '1';
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0) scale3d(1, 1, 1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0) scale3d(1, 1, 1)' }}
    >
      {children}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200"
        aria-hidden="true"
      />
    </div>
  );
}
