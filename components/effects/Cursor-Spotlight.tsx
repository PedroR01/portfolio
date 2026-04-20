"use client";

import { useEffect, type CSSProperties, type RefObject } from "react";

type CursorSpotlightProps = {
  containerRef: RefObject<HTMLElement | null>;
  className?: string;
  style?: CSSProperties;
};

export default function CursorSpotlight({
  containerRef,
  className = "",
  style,
}: CursorSpotlightProps) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = container.getBoundingClientRect();
        const w = r.width || 1;
        const h = r.height || 1;
        const x = (e.clientX - r.left) / w;
        const y = (e.clientY - r.top) / h;
        container.style.setProperty("--mx", x.toFixed(4));
        container.style.setProperty("--my", y.toFixed(4));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [containerRef]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-2 mix-blend-screen cursor-spotlight-layer ${className}`}
      style={
        {
          ...style,
          background: `radial-gradient(
            circle var(--spotlight-size) at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%),
            var(--spotlight-inner),
            var(--spotlight-mid) 45%,
            var(--spotlight-outer) 70%
          )`,
          filter: "blur(40px)",
          opacity: 0.85,
        } as CSSProperties
      }
      aria-hidden
    />
  );
}
