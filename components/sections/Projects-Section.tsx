"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Waves from "@/components/effects/Waves";
import ProjectCard from "./project-system/Project-Card";
import ProjectDetail from "./project-system/Project-Detail";
import projectsData from "@/data/projects.json";
import type { Project } from "@/interfaces/Projects-Interface";
import type { MouseEvent } from "react";

gsap.registerPlugin(ScrollTrigger);

type Category = "all" | "software" | "game";

const allProjects = projectsData.projects as Project[];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterInteractionRef = useRef(false);
  const scrollStRef = useRef<ScrollTrigger | null>(null);

  const [category, setCategory] = useState<Category>("all");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [detailOrigin, setDetailOrigin] = useState({ x: 50, y: 45 });

  const filteredProjects = useMemo(() => {
    if (category === "all") return allProjects;
    return allProjects.filter((p) => p.category === category);
  }, [category]);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      scrollStRef.current?.kill();
      scrollStRef.current = ScrollTrigger.create({
        trigger: grid,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (filterInteractionRef.current) return;
          const cards = grid.querySelectorAll(".project-card");
          if (!cards.length) return;
          gsap.from(cards, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          });
        },
      });

      return () => {
        scrollStRef.current?.kill();
        scrollStRef.current = null;
      };
    },
    { scope: sectionRef },
  );

  const handleFilterChange = useCallback((newCat: Category) => {
    if (newCat === category) return;
    filterInteractionRef.current = true;

    const grid = gridRef.current;
    const cards = grid?.querySelectorAll(".project-card");
    if (!cards?.length) {
      setCategory(newCat);
      return;
    }

    gsap.to(cards, {
      scale: 0.92,
      opacity: 0,
      duration: 0.3,
      stagger: { each: 0.05 },
      ease: "power2.in",
      onComplete: () => {
        setCategory(newCat);
        requestAnimationFrame(() => {
          const next = gridRef.current?.querySelectorAll(".project-card");
          if (next?.length) {
            gsap.fromTo(
              next,
              { y: 40, opacity: 0, scale: 0.98 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.45,
                stagger: 0.08,
                ease: "power3.out",
              },
            );
          }
        });
      },
    });
  }, [category]);

  const handleOpen = useCallback((e: MouseEvent, project: Project) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setDetailOrigin({ x, y });
    setSelected(project);
  }, []);

  const handleDetailClose = useCallback(() => {
    setSelected(null);
  }, []);

  const isAnyHovered = hoveredId !== null;

  return (
    <section
      ref={sectionRef}
      className="bg-black text-white relative min-h-screen z-40 py-16 md:py-24 content-center overflow-hidden"
      id="projects"
    >
      <div className="absolute inset-0 z-0 opacity-[0.35] pointer-events-none">
        <Waves
          lineColor="#0f2f0e"
          backgroundColor="transparent"
          waveSpeedX={0.01}
          waveSpeedY={0.025}
          waveAmpX={24}
          waveAmpY={12}
          friction={0.62}
          tension={0.025}
          maxCursorMove={80}
          xGap={10}
          yGap={28}
        />
      </div>

      <h2 className="relative z-10 text-[clamp(4rem,9vw,16rem)] text-center font-clash-display opacity-15 pointer-events-none select-none">
        Proyectos
      </h2>

      <div className="relative z-20 max-w-7xl mx-auto px-6 -mt-8 md:-mt-12">
        <div
          className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-10 md:mb-14 font-archivo"
          role="tablist"
          aria-label="Filtrar proyectos"
        >
          {(
            [
              { id: "all" as const, label: "Todos" },
              { id: "software" as const, label: "Software" },
              { id: "game" as const, label: "Games" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={category === id}
              onClick={() => handleFilterChange(id)}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors duration-200 border ${
                category === id
                  ? "border-accent-foreground/50 text-accent-foreground bg-white/5"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isHovered={hoveredId === project.id}
              isAnyHovered={isAnyHovered}
              onHover={setHoveredId}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </div>

      {selected ? (
        <ProjectDetail
          key={selected.id}
          project={selected}
          origin={detailOrigin}
          onClose={handleDetailClose}
        />
      ) : null}
    </section>
  );
}
