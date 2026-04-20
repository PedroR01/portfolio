"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ProjectCardProps } from "@/interfaces/Projects-Interface";
import ProjectPreview from "./Project-Preview";

export default function ProjectCard({
  project,
  isHovered,
  isAnyHovered,
  onHover,
  onOpen,
}: ProjectCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const float = floatRef.current;
      if (!float) return;
      const duration = gsap.utils.random(4, 6);
      gsap.to(float, {
        y: "+=6",
        duration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      if (isAnyHovered) {
        if (isHovered) {
          gsap.to(root, {
            scale: 1.04,
            opacity: 1,
            filter: "blur(0px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            duration: 0.4,
            ease: "power3.out",
          });
        } else {
          gsap.to(root, {
            scale: 0.97,
            opacity: 0.4,
            filter: "blur(3px)",
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            duration: 0.4,
            ease: "power3.out",
          });
        }
      } else {
        gsap.to(root, {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          duration: 0.4,
          ease: "power3.out",
        });
      }
    },
    { dependencies: [isHovered, isAnyHovered], scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="project-card h-full will-change-transform"
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div ref={floatRef} className="h-full">
        <div
          role="button"
          className="group w-full text-left h-full flex flex-col bg-background/70 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:cursor-pointer shadow-none transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-foreground/60"
          onClick={(e) => onOpen(e, project)}
        >
          <ProjectPreview
            project={project}
            variant="card"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="flex flex-col flex-1 p-5 md:p-6 gap-3">
            <h3 className="font-clash-display text-xl md:text-2xl text-title leading-tight">
              {project.title}
            </h3>
            <p className="font-archivo text-sm md:text-base text-paragraph line-clamp-2 leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto pt-1">
              {project.stack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="font-archivo text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
