import type { MouseEvent } from "react";

export type Project = {
  id: number;
  title: string;
  category: "game" | "software";
  description: string;
  image: string;
  stack: string[];
  link?: string;
  repo?: string;
};

export type ProjectCardProps = {
  project: Project;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: (id: number | null) => void;
  onOpen: (e: MouseEvent, project: Project) => void;
};

export type ProjectDetailProps = {
  project: Project;
  origin: { x: number; y: number };
  onClose: () => void;
};
