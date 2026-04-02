"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const navItems = [
  { label: "Inicio", id: "hero" },
  { label: "Experiencia", id: "experience" },
  { label: "Proyectos", id: "projects" },
  { label: "Testimonios", id: "testimonials" },
  { label: "Contacto", id: "contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("hero");
  const pillRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.id));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.6,
      },
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activeEl = document.querySelector(
      `[data-id="${active}"]`,
    ) as HTMLElement;

    if (activeEl && pillRef.current) {
      const { offsetLeft, offsetWidth } = activeEl;

      gsap.to(pillRef.current, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.4,
        ease: "power3.out",
      });

      gsap.fromTo(
        activeEl,
        { scale: 0.95 },
        { scale: 1, duration: 0.3, ease: "power3.out" },
      );
    }
  }, [active]);

  return (
    <div className="fixed top-6 md:left-1/2 md:right-auto right-0 -translate-x-1/2 z-100 font-archivo">
      <div
        ref={navRef}
        className="relative flex items-center gap-2 px-3 py-2 
                   bg-black/40 backdrop-blur-xl 
                   border border-white/10
                   rounded-full shadow-lg"
      >
        {/* Active Sliding Pill */}
        <div
          ref={pillRef}
          className="absolute h-9 bg-emerald-800 rounded-full hidden md:block"
          style={{ width: 0 }}
        />

        {/* Desktop Nav */}
        <div className="hidden md:flex relative">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-id={item.id}
              className="relative z-10 px-4 py-2 text-sm text-white transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-10 w-8 h-8 flex flex-col justify-center items-center gap-1 "
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      </div>
      {isOpen && (
        <div
          className="mt-4 bg-black/60 backdrop-blur-xl 
                        border border-white/10 
                        rounded-2xl p-6 flex flex-col gap-4 md:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setIsOpen(false)}
              className="text-white text-lg"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
