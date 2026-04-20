import type { Project, ProjectMediaType } from "@/interfaces/Projects-Interface";

export const FRAME_BY_CATEGORY = {
    software: "/img/frames/software-window.svg",
    game: "/img/frames/software-window.svg", // game-card.svg necesita un rediseño. Está pensado para una portada, no para un slider.
} as const;

export type ResolvedProjectSlide = {
    type: ProjectMediaType;
    src: string;
    poster?: string;
};

export type ResolvedProjectMedia = {
    frameSrc: string;
    slides: ResolvedProjectSlide[];
};

function resolveAssetPath(base: string, pathOrFile: string): string {
    if (pathOrFile.startsWith("/")) return pathOrFile;
    return `${base}/${pathOrFile}`;
}

/**
 * Resuelve rutas públicas para todos los medios de un proyecto.
 * Soporta src/poster relativos al directorio del proyecto o rutas absolutas.
 */
export function resolveProjectMedia(project: Project): ResolvedProjectMedia {
    const frameSrc = FRAME_BY_CATEGORY[project.category];
    const base = `/img/projects/${project.category}/${project.slug}`;

    const slides: ResolvedProjectSlide[] = project.media.map((item) => ({
        type: item.type,
        src: resolveAssetPath(base, item.src),
        poster: item.poster ? resolveAssetPath(base, item.poster) : undefined,
    }));

    return { frameSrc, slides };
}