"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import ProjectsSystem from "./project-system/Project-System";
import ProjectsSystemAnim from "./project-system/Project-System-Anim";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".projects-left", {
        x: -150,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".projects-right", {
        x: 150,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".projects-wrapper", {
        y: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: ".projects-wrapper",
          start: "top 100%",
          end: "top 40%",
          scrub: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className=" bg-black text-white relative min-h-screen z-40 py-16 content-center"
      id="projects"
    >
      {/* <div className="max-w-7xl mx-auto px-6 projects-wrapper">
        <div className="mb-16"> */}
      {/* <h2 className="text-[clamp(4rem,9vw,16rem)] text-center font-clash-display">
        Proyectos
      </h2> */}
      {/* <p className="text-center opacity-75 font-archivo -mt-6">
            This is where the fun begins
          </p>
        </div> */}
      {/* <ProjectsSystem /> */}
      <ProjectsSystemAnim />
      {/* <div className="font-archivo flex gap-8 justify-center">
          <button>filtro a</button>
          <button>filtro b</button>
          <button>filtro d</button>
          <button>filtro f</button>
          <button>filtro h</button>
        </div>
        <div className="grid md:grid-cols-2 gap-12 font-archivo">
          <div className="projects-left group cursor-pointer">
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src="/img/game-dev.webp"
                alt="Game Dev"
                fill
                className="object-cover group-hover:scale-110 transition duration-700"
              />
            </div>
            <h3 className="text-2xl mt-6 font-semibold">Game Developer</h3>
            <p className="text-zinc-400 mt-2">
              Ingeniería aplicada al desarrollo interactivo.
            </p>
          </div>

          <div className="projects-right group cursor-pointer">
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src="/img/software-dev.webp"
                alt="Software Dev"
                fill
                className="object-cover group-hover:scale-110 transition duration-700"
              />
            </div>
            <h3 className="text-2xl mt-6 font-semibold">Software Developer</h3>
            <p className="text-zinc-400 mt-2">
              Arquitectura limpia y soluciones escalables.
            </p>
          </div>
        </div> */}
      {/* </div> */}
    </section>
  );
}
