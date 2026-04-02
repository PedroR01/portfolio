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
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=1500",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          ".projects-layer",
          {
            clipPath: "circle(0% at 50% 40%)",
            scale: 0.95,
          },
          {
            clipPath: "circle(140% at 50% 40%)",
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

      <div className="projects-layer absolute inset-0 z-20 [clip-path:circle(0%_at_50%_40%)] will-change-[clip-path]">
        <ProjectsSection />
      </div>
    </div>
  );
}
