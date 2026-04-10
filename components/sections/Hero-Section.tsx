"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRightIcon } from "lucide-react";
import Waves from "@/components/effects/Waves";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

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
      .to(".hero-section", { y: -60, opacity: 0.85, ease: "none" }, 0)
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
      const ctaElement = ctaRef.current;
      if (!ctaElement) return;

      gsap
        .timeline()
        .from(".hero-greeting", {
          y: 80,
          opacity: 0,
          duration: 0.7,
          ease: "power4.out",
        })
        .from(
          ".hero-title span",
          {
            y: 100,
            opacity: 0,
            stagger: 0.08,
            duration: 1,
            ease: "power4.out",
          },
          "<=0.4",
        )
        .from(".hero-text", { y: 40, opacity: 0, duration: 0.8 }, "-=0.6")
        .fromTo(
          ctaElement,
          { opacity: 0, scale: 0.8, immediateRender: false },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            onComplete: () => {
              if (ctaRef.current) {
                gsap.set(ctaRef.current, { clearProps: "opacity,transform" });
              }
            },
          },
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
      <Waves
        lineColor="#0f2f0e"
        backgroundColor="transparent"
        waveSpeedX={0.02}
        waveSpeedY={0.04}
        waveAmpX={30}
        waveAmpY={40}
        friction={0.62}
        tension={0.025}
        maxCursorMove={100}
        xGap={10}
        yGap={30}
      />

      <div className="absolute inset-0 bg-transparent" />
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10 hero-wrapper hero-content">
        <div className="space-y-6 hero-text-layer">
          <p className="hero-greeting text-zinc-400 text-lg max-w-xl font-archivo font-light">
            <span>👋</span> Hola, soy Pedro
          </p>
          <h1 className="hero-title text-4xl md:text-6xl font-bold leading-tight font-clash-display text-title">
            {"Diseñador y Desarrollador".split(" ").map((word, i) => (
              <span key={i} className="inline-block mr-3">
                {word}
              </span>
            ))}
          </h1>

          <p className="hero-text text-zinc-400 text-lg max-w-xl font-archivo font-light">
            Desarrollo software, aplicaciones web y videojuegos con enfoque en
            arquitectura sólida, decisiones justificadas y soluciones que
            realmente impactan.
          </p>

          <a
            ref={ctaRef}
            href="#contact"
            className="hero-cta inline-block px-6 py-3 transition-all duration-200 transform active:scale-75 rounded-lg bg-accent-btn hover:bg-accent-btn-hover active:bg-accent-btn-active relative overflow-hidden font-archivo font-normal border-accent-foreground border-2 shadow-[0_5px_50px_-2px_rgba(11,210,150,0.2)]"
          >
            Conversemos
          </a>
        </div>

        <div className="flex flex-col items-center justify-center md:justify-end">
          <div className="hero-image-layer relative w-64 h-64 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              src="/img/hero-portrait.jpg"
              alt="Foto de Pedro"
              fill
              className="object-cover hero-tilt"
              priority
            />
          </div>
          <ul className="hero-socials-layer mt-4 md:mt-8 font-archivo flex gap-4">
            <li>
              <a
                href="https://github.com/PedroR01"
                rel="noopener noreferrer"
                target="_blank"
                className="text-paragraph hover:underline hover:text-accent-foreground active:text-accent-foreground transition-colors duration-200"
              >
                Github
                <ArrowUpRightIcon
                  className="inline-block ml-1 mb-2"
                  size={16}
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/robinetpedro/"
                rel="noopener noreferrer"
                target="_blank"
                className="text-paragraph hover:underline hover:text-accent-foreground active:text-accent-foreground transition-colors duration-200"
              >
                LinkedIn
                <ArrowUpRightIcon
                  className="inline-block ml-1 mb-2"
                  size={16}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
