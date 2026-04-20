import type { MouseEvent } from "react";

export type ProjectMediaType = "image" | "video";

export type ProjectMediaItem = {
  type: ProjectMediaType;
  src: string;
  poster?: string;
};

export type Project = {
  id: number;
  title: string;
  category: "game" | "software";
  description: string;
  slug: string;
  media: ProjectMediaItem[];
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

export type ProjectPreviewProps = {
  project: Project;
  variant: "card" | "detail";
  sizes: string;
  priority?: boolean;
  className?: string;
};