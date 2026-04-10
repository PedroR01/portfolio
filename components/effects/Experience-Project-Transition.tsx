"use client";

import { useRef } from "react";
import ExperienceSection from "../sections/Experience-Section";
import ProjectsSection from "../sections/Projects-Section";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceProjectTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        let transitionState: "experience" | "projects" = "experience";

        // Metodo para disparar el evento que envia la sección activa en base a la animación entre experiencia y proyectos a la navbar. Al tener una animación personalizada, es necesario emitir el evento para que la navbar sepa que sección está activa de forma precisa.
        const emitActiveSection = (section: "experience" | "projects") => {
          if (transitionState === section) return;
          transitionState = section;
          window.dispatchEvent(
            new CustomEvent("nav:set-active", { detail: { section } }),
          );
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=1500",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,

            onEnter: () => {
              window.dispatchEvent(
                new CustomEvent("nav:transition-active", {
                  detail: { active: true },
                }),
              );
            },
            onEnterBack: () => {
              window.dispatchEvent(
                new CustomEvent("nav:transition-active", {
                  detail: { active: true },
                }),
              );
            },
            onLeave: () => {
              window.dispatchEvent(
                new CustomEvent("nav:transition-active", {
                  detail: { active: false },
                }),
              );
            },
            onLeaveBack: () => {
              window.dispatchEvent(
                new CustomEvent("nav:transition-active", {
                  detail: { active: false },
                }),
              );
            },

            onUpdate: (self) => {
              const p = self.progress;
              const direction = self.direction;

              if (direction === 1) {
                emitActiveSection(p > 0.58 ? "projects" : "experience");
              } else {
                emitActiveSection(p < 0.42 ? "experience" : "projects");
              }
            },
          },
        });

        tl.fromTo(
          ".projects-layer",
          {
            clipPath: "circle(0% at 50% 10%)",
            scale: 0.95,
          },
          {
            clipPath: "circle(140% at 50% 10%)",
            scale: 1,
            ease: "power2.inOut",
          },
        ).to(
          ".experience-layer",
          {
            scaleX: 1.5,
            opacity: 0,
            ease: "power2.inOut",
          },
          "<",
        );
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="experience-layer py-32 relative z-10 h-screen transform-gpu will-change-transform">
        <ExperienceSection />
      </div>

      {/* La propiedad -mt-[100vh] hace que la sección de proyectos se desplace hacia arriba y ocupe el espacio de la sección de experiencia. Ahora es necesario por el pos relative, antes tenía absolute, lo que derivaba en errores en cuanto al espacio fisico ocupado en el DOM. */}
      <div className="projects-layer relative -mt-[100vh] z-20 [clip-path:circle(0%_at_50%_10%)] will-change-[clip-path]">
        <ProjectsSection />
      </div>
    </div>
  );
}
