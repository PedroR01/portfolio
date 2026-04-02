export interface Experience {
    position: string;
    company: string;
    duration: string;
    location: string;
    description: string;
    links?: ExperienceLink;
    stack: string[];
}

interface ExperienceLink {
    web?: string;
    repositorio?: string;
}