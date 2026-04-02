"use client";

import ProjectNode from "./Project-Node";
import { Project } from "@/interfaces/Projects-Interface";
import { projects } from "@/data/projects.json";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const projectsData: Project[] = projects;

export default function ProjectsSystemAnim() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  let activeTween: gsap.core.Tween | null = null;
  let idleTween: gsap.core.Tween | null = null;

  useGSAP(
    () => {
      // Aparición progresiva
      // gsap.from(".project-node", {
      //   opacity: 0.3,
      //   filter: "blur(8px)",
      //   scale: 0.8,
      //   duration: 1.8,
      //   stagger: 0.3,
      //   ease: "power3.out",
      // });

      // Movimiento orgánico idle
      gsap.utils.toArray<HTMLElement>(".project-node").forEach((node) => {
        idleTween = gsap.fromTo(
          node,
          {
            opacity: 0.3,
            filter: "blur(8px)",
            scale: 0.8,
            duration: 1.8,
            stagger: 0.3,
            ease: "power3.out",
          },
          {
            y: "+=12",
            opacity: 1,
            filter: "none",
            scale: 1,
            duration: gsap.utils.random(3, 5),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
        );
      });
    },
    { scope: containerRef },
  );

  const nodeActivation = (id: number | null) => {
    setActiveId(id);
    // Al activar un nodo, pausamos las animaciones de los nodos inactivos
    gsap.utils.toArray<HTMLElement>(".project-node").forEach((node) => {
      if (node.classList.contains("active-node")) {
        activeTween = gsap.to(node, {
          opacity: 1,
          filter: "none",
          scale: 1.2,
          duration: 0.5,
          stagger: 0.3,
          ease: "power3.out",
        });
      } else {
        idleTween?.pause();
      }
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      <h2
        className="text-[clamp(4rem,9vw,16rem)] text-center font-clash-display text-transparent opacity-90"
        style={{
          WebkitTextStroke: "2px oklch(76.52% 0.16221 163.779)",
          textShadow: "0 5px 10px oklch(76.52% 0.16221 163.779)",
        }}
      >
        Proyectos
      </h2>

      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />

      {projectsData.map((project) => (
        <ProjectNode
          key={project.id}
          project={project}
          activeId={activeId}
          setActiveId={(id) => nodeActivation(id)}
        />
      ))}
    </section>
  );
}
