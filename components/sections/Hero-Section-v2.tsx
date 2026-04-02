"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroSectionV2() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll parallax efect
  useGSAP(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=60%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Depth Fade sutil (sin blur) --> Este primero hace que parezca que se le hace zoom-out al contenedor.
      .to(
        ".hero-section",
        { scale: 0.96, y: -60, opacity: 0.85, ease: "none" },
        0,
      )
      .to(".hero-text-layer", { y: -40 }, 0)
      .to(".hero-image-layer", { y: -120, scale: 0.95 }, 0)
      .to(".hero-wrapper", { opacity: 0.6 }, 0);
  }, []);

  // Mouse parallax efect
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;

      gsap.to(".hero-content", {
        x,
        y,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Mouse tilt efecto en imagen
  useEffect(() => {
    const hero = document.querySelector(".hero-tilt");

    const move = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / 40;
      const y = (window.innerHeight / 2 - e.clientY) / 40;

      hero?.setAttribute(
        "style",
        `transform: rotateY(${x}deg) rotateX(${y}deg)`,
      );
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Animaciones titulo de entrada
  useGSAP(
    () => {
      gsap
        .timeline()
        .from(".hero-title span", {
          y: 100,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          ease: "power4.out",
        })
        .from(".hero-text", { y: 40, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(
          ".hero-cta",
          { scale: 0.8, opacity: 0, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.5",
        )
        .from(
          ".hero-image",
          { scale: 0.8, opacity: 0, duration: 1, ease: "power3.out" },
          "-=1",
        );
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden z-20 hero-section"
      id="hero"
    >
      <div className="absolute inset-0 bg-linear-to-br from-black via-zinc-900 to-black " />
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10 hero-wrapper">
        <div className="space-y-6 hero-text-layer">
          <p className="hero-text text-zinc-400 text-lg max-w-xl font-archivo font-light">
            Hola, soy Pedro
          </p>
          <p className="hero-text text-zinc-400 text-lg max-w-xl font-archivo font-light">
            Desarrollo software, aplicaciones web y videojuegos con enfoque en
            arquitectura sólida, decisiones justificadas y soluciones que
            realmente impactan.
          </p>

          <a
            href="#contact"
            className="hero-cta inline-block px-6 py-3  transition-color duration-300 ease-in-out border-accent-foreground border-2 rounded-lg hover:bg-accent-hover relative overflow-hidden font-archivo font-normal shadow-[0_5px_50px_-2px_rgba(11,210,150,0.2)]"
          >
            Conversemos
          </a>
        </div>
        <div className="space-y-6 hero-text-layer absolute left-0 bottom-0 h-full flex flex-col  justify-end px-6">
          <h1 className="hero-title text-4xl md:text-8xl font-bold leading-tight font-clash-display text-title">
            Diseñador <span className="md:text-5xl ml-6">y</span> Desarrollador
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center md:justify-end">
          <div className="hero-image-layer relative w-64 h-64 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              src="/img/hero-img.webp"
              alt="Foto de Pedro"
              fill
              className="object-cover hero-tilt"
              priority
            />
          </div>
          <div className="hero-socials-layer mt-8 md:mt-20">
            <p>(Añadir redes sociales...)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
