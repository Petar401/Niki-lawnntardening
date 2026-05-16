import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
  initial?: number; // 0..100
};

export function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
  className,
  initial = 50,
}: Props) {
  const [pos, setPos] = useState<number>(initial);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<boolean>(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      setFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [setFromClientX]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore drags that begin on the keyboard slider — that has its own input.
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    draggingRef.current = true;
    setFromClientX(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative isolate aspect-[4/3] w-full overflow-hidden rounded-lg ring-1 ring-stone/60 bg-stone/30 select-none',
        className,
      )}
      onPointerDown={onPointerDown}
    >
      {/* AFTER — full visible base layer */}
      <img
        src={after}
        alt={afterAlt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      {/* BEFORE — same size as container, clipped on the right via clip-path */}
      <img
        src={before}
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />

      {/* corner labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/75 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-cream">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-forest/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-cream">
        After
      </span>

      {/* divider */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-cream/85 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `${pos}%` }}
        aria-hidden="true"
      />
      {/* keyboard-accessible slider input — overlay, transparent */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Before-and-after comparison. Before — ${beforeAlt} After — ${afterAlt}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
      {/* Visible drag handle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream p-2 shadow-lift ring-1 ring-stone/70 transition-transform duration-150 group-hover:scale-110"
        style={{ left: `${pos}%` }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-forest" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6L4 12l5 6" />
          <path d="M15 6l5 6-5 6" />
        </svg>
      </div>
    </div>
  );
}
