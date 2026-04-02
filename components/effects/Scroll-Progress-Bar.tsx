"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    gsap.set(bar, { scaleX: 0.05, transformOrigin: "left" });
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 bg-zinc-800 z-9998">
      <div
        ref={barRef}
        className="h-full bg-emerald-400 origin-left scale-x-0"
      />
    </div>
  );
}
