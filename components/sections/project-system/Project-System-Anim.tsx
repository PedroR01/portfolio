"use client";

import ProjectNode from "./Project-Node";
import { Project } from "@/interfaces/Projects-Interface";
import { projects } from "@/data/projects.json";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const projectsData: Project[] = projects;

export default function ProjectsSystemAnim() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const physicsNodes = useRef<any[]>([]);
  const idleTimeline = useRef<gsap.core.Timeline | null>(null);
  const nodesRef = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      const nodes = gsap.utils.toArray<HTMLElement>(".project-node");
      nodesRef.current = nodes;

      idleTimeline.current = gsap.timeline({ repeat: -1 });

      nodes.forEach((node) => {
        const floatAmount = gsap.utils.random(10, 20);
        const duration = gsap.utils.random(4, 7);
        const scaleAmount = gsap.utils.random(0.02, 0.05);

        idleTimeline.current!.to(
          node,
          {
            y: `+=${floatAmount}`,
            scale: 1 + scaleAmount,
            duration: duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
            force3D: true,
          },
          gsap.utils.random(0, 2),
        );
      });
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      const nodes = gsap.utils.toArray<HTMLElement>(".project-node");
      nodesRef.current = nodes;

      const container = containerRef.current;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        nodes.forEach((node) => {
          const nodeRect = node.getBoundingClientRect();
          const nodeX = nodeRect.left + nodeRect.width / 2 - rect.left;
          const nodeY = nodeRect.top + nodeRect.height / 2 - rect.top;

          const dx = mouseX - nodeX;
          const dy = mouseY - nodeY;

          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = 300;
          const strength = 0.5;

          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * strength;

            gsap.to(node, {
              x: dx * force,
              y: dy * force,
              duration: 0.6,
              ease: "power3.out",
            });
          } else {
            gsap.to(node, {
              x: 0,
              y: 0,
              duration: 1,
              ease: "power3.out",
            });
          }
        });
      };

      container?.addEventListener("mousemove", handleMouseMove);

      return () => {
        container?.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: containerRef },
  );

  const nodeActivation = (id: number | null) => {
    if (!idleTimeline.current) return;

    if (id !== null) {
      // Pausar idle global
      idleTimeline.current.pause();

      nodesRef.current.forEach((node) => {
        if (Number(node.dataset.id) === id) {
          gsap.to(node, {
            scale: 1.25,
            filter: "blur(0px)",
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
          });
        } else {
          gsap.to(node, {
            scale: 0.8,
            opacity: 0.3,
            filter: "blur(4px)",
            duration: 0.4,
          });
        }
      });
    } else {
      // Reactivar sistema idle
      idleTimeline.current.resume();

      nodesRef.current.forEach((node) => {
        gsap.to(node, {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.4,
        });
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      <h2 className="text-[clamp(4rem,9vw,16rem)] text-center font-clash-display opacity-15">
        Proyectos
      </h2>

      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      {projectsData.map((project) => (
        <ProjectNode
          key={project.id}
          project={project}
          setActiveId={(id) => nodeActivation(id)}
        />
      ))}
    </section>
  );
}
