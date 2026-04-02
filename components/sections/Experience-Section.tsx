"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExperienceInfo from "../ui/Experience-Info";
import experienceData from "@/data/experiences.json";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".exp-left", {
        x: -150,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".exp-right", {
        x: 150,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".experience-wrapper", {
        y: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: ".experience-wrapper",
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
      className=" bg-black text-white relative min-h-screen -mt-32 z-30 content-center px-8 md:px-0"
      id="experience"
    >
      {/* <div className="max-w-7xl mx-auto px-6 experience-wrapper"> */}
      <h2 className="text-[clamp(4rem,9vw,16rem)]  text-center absolute justify-self-center top-10 md:top-1/8 2xl:top-1/12 mb-16 cursor-default font-clash-display opacity-15 exp-right">
        Experiencia
      </h2>
      <div className="flex flex-col gap-12 max-w-4xl mx-auto  experience-wrapper">
        {experienceData.experiences.map((exp, index) => (
          <ExperienceInfo key={index} experience={exp} />
        ))}
      </div>
    </section>
  );
}
