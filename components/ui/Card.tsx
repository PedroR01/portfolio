interface CardProps {
  children: React.ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 transition hover:scale-[1.02] hover:border-emerald-500 duration-300">
      {children}
    </div>
  );
}
