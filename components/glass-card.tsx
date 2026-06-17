import { clsx } from "clsx";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <section className={clsx("glass-panel rounded-[2rem] p-5 sm:p-6", className)}>
      {children}
    </section>
  );
}
