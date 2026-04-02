"use client";

import ProjectNode from "./Project-Node";
import { Project } from "@/interfaces/Projects-Interface";
import projectsData from "@/data/projects.json";

const projects: Project[] = projectsData.projects;

export default function ProjectsSystem() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <h2 className="text-[clamp(4rem,9vw,16rem)] text-center font-clash-display">
        Proyectos
      </h2>
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />

      {projects.map((project) => (
        <ProjectNode key={project.id} project={project} />
      ))}
    </section>
  );
}
