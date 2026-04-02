"use client";

import { ProjectProps } from "@/interfaces/Projects-Interface";
import { projectsNodes } from "@/data/projects.json";
import Image from "next/image";
import softwareWindow from "@/public/img/software-window.svg";
import gameWindow from "@/public/img/game-card.svg";

export default function ProjectNode({ project, setActiveId }: ProjectProps) {
  const sizeMap = {
    large: "w-48 h-48 md:w-64 md:h-64",
    medium: "w-36 h-36 md:w-48 md:h-48",
    small: "w-24 h-24 md:w-32 md:h-32",
  };

  const nodeData = projectsNodes.find((node) => node.id === project.id);

  if (!nodeData) return null;
  return (
    <div
      data-id={project.id}
      className={
        "project-node absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
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
          flex items-center justify-center
          text-white text-sm md:text-base
          tracking-wide
          cursor-pointer font-archivo text-center`}
      >
        <div className="relative w-full max-w-md">
          <Image
            src={project.category === "software" ? softwareWindow : gameWindow}
            layout="responsive"
            alt="software node style"
            width={150}
            height={150}
            className="w-full"
          />
          <div className="absolute top-0 transform left-1/2 -translate-x-1/2 w-[70%] text-center">
            <p>{project.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
