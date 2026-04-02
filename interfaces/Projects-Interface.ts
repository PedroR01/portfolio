export type Project = {
    id: number;
    title: string;
    category: "game" | "software";
    description?: string;
    image?: string;
};

export type ProjectProps = {
    project: Project;
    activeId: number | null;
    setActiveId: (id: number | null) => void;
};

export type ProjectNode = {
    size: "large" | "medium" | "small";
    posX: number;
    posY: number;
};