"use client";

import { ProjectProps } from "@/interfaces/Projects-Interface";
import { projectsNodes } from "@/data/projects.json";

export default function ProjectNode({
  project,
  activeId,
  setActiveId,
}: ProjectProps) {
  const sizeMap = {
    large: "w-48 h-48 md:w-64 md:h-64",
    medium: "w-36 h-36 md:w-48 md:h-48",
    small: "w-24 h-24 md:w-32 md:h-32",
  };

  const isActive = activeId === project.id;
  const nodeData = projectsNodes.find((node) => node.id === project.id);

  if (!nodeData) return null;
  return (
    <div
      className={
        "project-node absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-500 "
      }
      style={{
        top: `${nodeData.posY}%`,
        left: `${nodeData.posX}%`,
      }}
      onMouseEnter={() => setActiveId(project.id)}
      onMouseLeave={() => setActiveId(null)}
    >
      <div
        className={`
          ${sizeMap[nodeData.size]}
          rounded-full
          backdrop-blur-md
          border border-white/10
          bg-white/5
          flex items-center justify-center
          text-white text-sm md:text-base
          tracking-wide
          transition-all duration-500
          cursor-pointer
           ${isActive ? "shadow-[0_0_40px_rgba(255,255,255,0.15)] " : ""}
        `}
      >
        {project.title}
      </div>
    </div>
  );
}
