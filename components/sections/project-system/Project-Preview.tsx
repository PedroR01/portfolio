"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveProjectMedia } from "@/lib/project-media";
import { ProjectPreviewProps } from "@/interfaces/Projects-Interface";

type SlideLoadState = {
  loaded: boolean;
  error: boolean;
};

const SWIPE_THRESHOLD_PX = 40;

// A11y: Accesibilidad para el texto de las capturas y vídeos.
function getSlideLabel(
  projectTitle: string,
  index: number,
  total: number,
  type: "image" | "video",
): string {
  const typeLabeled = type === "video" ? "vídeo" : "captura";
  return `${projectTitle} — ${typeLabeled} ${index + 1} de ${total}`;
}

export default function ProjectPreview({
  project,
  variant,
  sizes,
  priority = false,
  className = "",
}: ProjectPreviewProps) {
  const { frameSrc, slides } = useMemo(
    () => resolveProjectMedia(project),
    [project],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideStates, setSlideStates] = useState<
    Record<string, SlideLoadState>
  >({});

  const touchStartX = useRef<number | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const isDetail = variant === "detail";
  const totalSlides = slides.length;
  const hasMultipleSlides = totalSlides > 1;

  // Evita índices inválidos si cambia el dataset del proyecto
  const safeIndex =
    totalSlides === 0 ? 0 : Math.min(currentIndex, totalSlides - 1);

  // Funcion para cambiar el indice de la imagen actual con el tiempo de forma automatica.
  const moveSlideTo = useCallback(
    (delta: number) => {
      if (totalSlides <= 1) return;
      setCurrentIndex((prev) => (prev + delta + totalSlides) % totalSlides);
    },
    [totalSlides],
  );

  const jumpToSlide = useCallback(
    (index: number) => {
      if (totalSlides <= 0) return;
      const bounded = Math.max(0, Math.min(index, totalSlides - 1));
      setCurrentIndex(bounded);
    },
    [totalSlides],
  );

  const markLoaded = useCallback((key: string) => {
    setSlideStates((prev) => ({
      ...prev,
      [key]: { loaded: true, error: false },
    }));
  }, []);
  const markError = useCallback((key: string) => {
    setSlideStates((prev) => ({
      ...prev,
      [key]: { loaded: false, error: true },
    }));
  }, []);

  // Interacción con touch (dispositivos móviles).
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || totalSlides <= 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    // Evita interpretar taps como swipe
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    if (dx < 0) moveSlideTo(1);
    else moveSlideTo(-1);
  };

  // Render activo +/- 1 para evitar montar todos los medios
  const visibleIndexes = useMemo(() => {
    if (!totalSlides) return new Set<number>();
    if (totalSlides === 1) return new Set([0]);
    const prev = (safeIndex - 1 + totalSlides) % totalSlides;
    const next = (safeIndex + 1) % totalSlides;
    return new Set([prev, safeIndex, next]);
  }, [safeIndex, totalSlides]);

  // Pausa videos no activos para ahorrar CPU/GPU
  useEffect(() => {
    slides.forEach((slide, i) => {
      if (slide.type !== "video") return;
      const video = videoRefs.current[slide.src];
      if (!video) return;
      if (i === safeIndex) {
        void video.play().catch((err) => {
          console.warn("Autoplay bloqueado:", err);
        });
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          /* sin metadata aún: seek inválido */
        }
      }
    });
  }, [safeIndex, slides]);

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden bg-zinc-900/50 ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Galería de ${project.title}`}
    >
      {totalSlides === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/80 text-sm font-archivo text-zinc-500">
          Sin recursos multimedia
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <div
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${safeIndex * 100}%)` }}
          >
            {slides.map((slide, i) => {
              const key = slide.src;
              const state = slideStates[key];
              const isVisible = visibleIndexes.has(i);
              const isLoaded = !!state?.loaded;
              const hasError = !!state?.error;
              return (
                <div key={key} className="relative h-full min-w-full shrink-0">
                  {/* Skeleton / error fallback */}
                  {!isLoaded && !hasError && (
                    <div className="absolute inset-0 z-0 animate-pulse bg-zinc-800/80" />
                  )}
                  {hasError && (
                    <div className="absolute inset-0 z-0 flex items-center justify-center bg-zinc-800/90 text-xs font-archivo text-zinc-400">
                      Recurso no disponible
                    </div>
                  )}
                  {/* Mount diferido */}
                  {isVisible ? (
                    slide.type === "image" ? (
                      <Image
                        src={slide.src}
                        alt={getSlideLabel(
                          project.title,
                          i,
                          totalSlides,
                          "image",
                        )}
                        fill
                        className={`object-cover object-center transition-opacity duration-200 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        sizes={sizes}
                        priority={priority && i === 0}
                        onLoad={() => markLoaded(key)}
                        onError={() => markError(key)}
                      />
                    ) : (
                      <video
                        ref={(node) => {
                          videoRefs.current[slide.src] = node;
                        }}
                        className={`h-full w-full object-cover object-center transition-opacity duration-200 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        aria-label={getSlideLabel(
                          project.title,
                          i,
                          totalSlides,
                          "video",
                        )}
                        autoPlay
                        muted
                        loop
                        playsInline
                        disablePictureInPicture
                        disableRemotePlayback
                        preload={i === safeIndex ? "auto" : "metadata"}
                        poster={slide.poster}
                        onLoadedMetadata={() => markLoaded(key)}
                        onLoadedData={() => markLoaded(key)}
                        onError={() => markError(key)}
                        src={slide.src}
                      ></video>
                    )
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Image
        src={frameSrc}
        alt=""
        fill
        className="pointer-events-none z-10 select-none object-cover object-top-left"
        sizes={sizes}
        aria-hidden
      />
      {hasMultipleSlides ? (
        <>
          <div
            className={`absolute inset-x-0 bottom-0 z-20 flex justify-center gap-1.5 pb-2 ${
              isDetail
                ? "pb-3"
                : "opacity-0 transition-opacity group-hover:opacity-100"
            }`}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir al recurso ${i + 1}`}
                aria-current={i === safeIndex}
                className={`h-1.5 rounded-full transition-all ${
                  i === safeIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToSlide(i);
                }}
              />
            ))}
          </div>
          <div
            className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-1 ${
              isDetail
                ? ""
                : "opacity-0 transition-opacity group-hover:opacity-100"
            }`}
          >
            <button
              type="button"
              aria-label="Recurso anterior"
              className="pointer-events-auto rounded-full border border-white/20 bg-black/40 p-1.5 text-white backdrop-blur-sm hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                moveSlideTo(-1);
              }}
            >
              <ChevronLeft size={isDetail ? 22 : 18} />
            </button>
            <button
              type="button"
              aria-label="Recurso siguiente"
              className="pointer-events-auto rounded-full border border-white/20 bg-black/40 p-1.5 text-white backdrop-blur-sm hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                moveSlideTo(1);
              }}
            >
              <ChevronRight size={isDetail ? 22 : 18} />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
