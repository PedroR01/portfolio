"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { X, ArrowUpRight } from "lucide-react";
import type { ProjectDetailProps } from "@/interfaces/Projects-Interface";
import ProjectPreview from "./Project-Preview";

export default function ProjectDetail({
  project,
  origin,
  onClose,
}: ProjectDetailProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: onClose,
    });
    if (content) {
      tl.to(content, {
        opacity: 0,
        y: 16,
        duration: 0.2,
        ease: "power2.in",
      });
    }
    tl.to(
      overlay,
      {
        clipPath: `circle(0% at ${origin.x}% ${origin.y}%)`,
        duration: 0.55,
        ease: "power2.inOut",
      },
      content ? "-=0.05" : 0,
    );
  }, [onClose, origin.x, origin.y]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay) return;

    gsap.set(overlay, {
      clipPath: `circle(0% at ${origin.x}% ${origin.y}%)`,
    });
    const tl = gsap.timeline();
    tl.to(overlay, {
      clipPath: `circle(150% at ${origin.x}% ${origin.y}%)`,
      duration: 0.65,
      ease: "power2.inOut",
    });
    if (content) {
      tl.fromTo(
        content,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        "-=0.25",
      );
    }

    return () => {
      tl.kill();
    };
  }, [origin.x, origin.y, project.id]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const node = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md will-change-[clip-path]"
      style={{ clipPath: `circle(0% at ${origin.x}% ${origin.y}%)` }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-detail-title"
    >
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-6 right-6 z-10 p-2 rounded-full border border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-foreground"
        aria-label="Cerrar"
      >
        <X size={22} />
      </button>

      <div
        ref={contentRef}
        className="h-full overflow-y-auto px-6 py-24 md:py-20 max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/50 shadow-2xl">
            <ProjectPreview
              key={project.id}
              project={project}
              variant="detail"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-6">
            <p className="font-archivo text-sm uppercase tracking-wider text-accent-foreground/90">
              {project.category === "game" ? "Videojuego" : "Software"}
            </p>
            <h2
              id="project-detail-title"
              className="font-clash-display text-3xl md:text-4xl text-title leading-tight"
            >
              {project.title}
            </h2>
            <p className="font-archivo text-base md:text-lg text-paragraph leading-relaxed">
              {project.description}
            </p>

            <div>
              <p className="font-archivo text-sm text-zinc-500 mb-3">Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-archivo text-sm px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-archivo px-5 py-2.5 rounded-lg bg-accent-btn text-black hover:bg-accent-btn-hover active:bg-accent-btn-active transition-colors border-2 border-accent-foreground/20"
                >
                  Ver sitio
                  <ArrowUpRight size={18} />
                </a>
              ) : null}
              {project.repo ? (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-archivo px-5 py-2.5 rounded-lg border border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10 transition-colors"
                >
                  Repositorio
                  <ArrowUpRight size={18} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(node, document.body);
}
