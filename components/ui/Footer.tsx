import { ArrowUpRightIcon } from "lucide-react";

// components/sections/Footer-Section.tsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-2">
            <p className="font-clash-display text-xl tracking-wide">
              pedroPARdev
            </p>
            <p className="text-zinc-400 font-archivo text-sm max-w-md">
              Desarrollador Frontend construyendo experiencias web modernas,
              fluidas y enfocadas en detalle.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-archivo">
            <a
              href="https://github.com/PedroR01"
              rel="noopener noreferrer"
              target="_blank"
              className="text-paragraph hover:underline hover:text-accent-foreground active:text-accent-foreground transition-colors duration-200"
            >
              Github
              <ArrowUpRightIcon className="inline-block ml-1 mb-2" size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/robinetpedro/"
              rel="noopener noreferrer"
              target="_blank"
              className="text-paragraph hover:underline hover:text-accent-foreground active:text-accent-foreground transition-colors duration-200"
            >
              LinkedIn
              <ArrowUpRightIcon className="inline-block ml-1 mb-2" size={16} />
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col md:flex-row gap-2 md:items-center md:justify-between text-xs text-zinc-500 font-archivo">
          <p>© {year} Pedro Robinet. Made in Argentina 🇦🇷.</p>
        </div>
      </div>
    </footer>
  );
}
