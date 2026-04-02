"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

export default function TestimonialsSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const element = container.current;
    if (!element) return;

    const width = element.scrollWidth / 2;

    gsap.to(element, {
      x: -width,
      duration: 40,
      ease: "linear",
      repeat: -1,
    });
  }, []);

  return (
    <section
      className="py-32 bg-zinc-950 overflow-hidden rounded-t-[40px] relative z-10"
      id="testimonials"
    >
      <h2 className="text-center text-3xl font-bold text-white mb-12">
        Testimonios
      </h2>
      <div className="whitespace-nowrap flex gap-12" ref={container}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="min-w-87.5 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl"
          >
            <p className="text-zinc-300">
              Excelente profesional, enfoque técnico impecable.
            </p>
            <div className="mt-4 text-sm text-zinc-500">Juan Pérez · CTO</div>
          </div>
        ))}
        {/* Duplicar mismo bloque para seamless */}
      </div>
    </section>
  );
}
