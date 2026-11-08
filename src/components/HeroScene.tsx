'use client';

/**
 * A small 3D "site plan" -- a tilted grid of extruded plot blocks that
 * slowly orbits -- built entirely from Tailwind's native 3D utilities
 * (perspective-*, rotate-x-*, translate-z-*, transform-3d). Pure CSS,
 * no canvas/WebGL, so it stays cheap on an average mobile connection.
 * Hidden below lg: it's decorative, not content.
 */
const BLOCKS: { z: string; tone: string }[] = [
  { z: 'translate-z-[6px]', tone: 'border-white/25 bg-white/10' },
  { z: 'translate-z-[18px]', tone: 'border-accent/60 bg-accent/30' },
  { z: 'translate-z-[6px]', tone: 'border-white/25 bg-white/10' },
  { z: 'translate-z-[30px]', tone: 'border-accent-2/60 bg-accent-2/25' },
  { z: 'translate-z-[42px]', tone: 'border-accent/70 bg-accent/40' },
  { z: 'translate-z-[18px]', tone: 'border-accent-2/60 bg-accent-2/20' },
  { z: 'translate-z-[6px]', tone: 'border-white/25 bg-white/10' },
  { z: 'translate-z-[30px]', tone: 'border-accent/60 bg-accent/25' },
  { z: 'translate-z-[6px]', tone: 'border-white/25 bg-white/10' },
];

export default function HeroScene() {
  return (
    <div className="relative hidden h-80 items-center justify-center lg:flex" aria-hidden="true">
      <div className="absolute h-72 w-72 rounded-full bg-accent/25 blur-3xl animate-glow-pulse" />
      <div className="absolute h-52 w-52 translate-x-12 translate-y-10 rounded-full bg-accent-2/20 blur-3xl animate-glow-pulse" />

      <div className="perspective-[1400px] perspective-origin-center">
        <div className="transform-3d animate-hero-orbit">
          <div className="grid origin-center grid-cols-3 gap-2.5 transform-3d rotate-x-[58deg] rotate-z-[-6deg]">
            {BLOCKS.map((block, index) => (
              <div
                key={index}
                className={`h-11 w-11 rounded-md border shadow-[0_0_18px_-4px_rgba(139,92,246,0.5)] transform-3d ${block.z} ${block.tone}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute h-64 w-64 rounded-full border border-accent/20" />
    </div>
  );
}
