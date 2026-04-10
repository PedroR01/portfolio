"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navItems = [
  { label: "Inicio", id: "hero" },
  { label: "Experiencia", id: "experience" },
  { label: "Proyectos", id: "projects" },
  // { label: "Testimonios", id: "testimonials" },
  { label: "Contacto", id: "contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("hero");
  const pillRef = useRef<HTMLDivElement>(null);
  const transitionControlsRef = useRef(false); // Ref de control de transición
  const [isOpen, setIsOpen] = useState(false);

  // Encargado de observar la navegación de la sección activa.
  useEffect(() => {
    const observedIds = ["hero", "experience", "projects", "contact"];
    const sections = observedIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          const nextId = visible[0].target.id;
          // Si la transición está activa, experience/projects los maneja ScrollTrigger
          if (
            transitionControlsRef.current &&
            (nextId === "experience" || nextId === "projects")
          ) {
            return;
          }
          setActive(nextId);
        }
      },
      {
        threshold: 0,
        rootMargin: "-35% 0px -35% 0px",
      },
    );

    // Establece la observación por cada sección detectada.
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Listener personalizado para tomar los datos del evento nav:transition-active, y asociarlos al comportamiento de la navbar.
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ active?: boolean }>;
      transitionControlsRef.current = Boolean(custom.detail?.active);
    };

    // Asocia el metodo handler como event listener para el evento nav:transition-active, disparado por la transición entre experiencia y proyectos.
    window.addEventListener("nav:transition-active", handler as EventListener);

    return () =>
      window.removeEventListener(
        "nav:transition-active",
        handler as EventListener,
      );
  }, []);

  useEffect(() => {
    // Listener para estado emitido por la sección activa en la transición de experiencia - proyectos.
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ section?: string }>;
      const section = custom.detail?.section;
      if (section === "experience" || section === "projects") {
        setActive(section);
      }
    };

    window.addEventListener("nav:set-active", handler as EventListener);
    return () =>
      window.removeEventListener("nav:set-active", handler as EventListener);
  }, []);

  // Animación de la sección activa en la navbar.
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

  // Encargado de manejar el click en la navbar y navegar a la sección activa.
  const handleNavClick =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (id === "experience" || id === "projects") {
        const st = ScrollTrigger.getById("exp-project-transition");
        if (st) {
          const start = st.start;
          const end = st.end;
          const span = end - start;

          const target =
            id === "experience" ? start + span * 0.12 : start + span * 0.72;

          window.scrollTo({ top: target, behavior: "smooth" });
          return;
        }
      }

      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

  return (
    <div className="fixed top-6 md:left-1/2 md:right-auto right-0 -translate-x-1/2 z-100 font-archivo">
      <div
        ref={navRef}
        className="relative flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-lg"
      >
        <div
          ref={pillRef}
          className="absolute h-9 bg-emerald-800 rounded-full hidden md:block"
          style={{ width: 0 }}
        />

        <div className="hidden md:flex relative">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-id={item.id}
              onClick={handleNavClick(item.id)}
              className="relative z-10 px-4 py-2 text-sm text-white transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-10 w-8 h-8 flex flex-col justify-center items-center gap-1"
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
        <div className="mt-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                setIsOpen(false);
                handleNavClick(item.id)(e);
              }}
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
