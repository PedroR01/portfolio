import { Experience } from "@/interfaces/Experience-Interface";
import { ArrowUpRightIcon } from "lucide-react";

export default function ExperienceInfo({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <div className="space-y-6 exp-left font-archivo list-item list-disc text-accent-foreground">
      <div className="flex justify-between flex-wrap text-white">
        <div className="gap-2">
          <h3 className="text-2xl font-semibold">{experience.position}</h3>
          <p className="opacity-65 font-thin"> {experience.company} </p>
        </div>
        <p className="opacity-50 font-thin md:mt-0 mt-2">
          {experience.duration} <br /> {experience.location}
        </p>
      </div>
      <div className="space-y-2 text-white">
        <p className="tracking-wide opacity-80 font-normal">
          {experience.description}
        </p>
        <ul className="flex gap-4">
          {/* De esta forma se renderizan dinamicamente los links, recorriendo los links por sus campos. Si la key es "0" significa que no se introdujo ningun link */}
          {Object.entries(experience.links || {}).map(([key, value]) => {
            if (key == "0") return null;
            return (
              <li key={key}>
                <a
                  href={value}
                  target="_blank"
                  className="text-paragraph hover:underline hover:text-accent-foreground active:text-accent-foreground transition-colors duration-200"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <ArrowUpRightIcon
                    className="inline-block ml-1 mb-2"
                    size={16}
                  />
                </a>
              </li>
            );
          })}
        </ul>
        <ul className="flex flex-wrap gap-4 text-paragraph">
          {experience.stack?.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
