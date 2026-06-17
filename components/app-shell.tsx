"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Heart, History, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { GoldenBackground } from "@/components/golden-background";

const navItems = [
  { href: "/today", label: "Heute", icon: Sparkles },
  { href: "/history", label: "Historie", icon: History },
  { href: "/memories", label: "Momente", icon: Heart },
];

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export function AppShell({ children, title = "GREDAFUL", subtitle }: AppShellProps) {
  const pathname = usePathname();

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-28 pt-5 sm:max-w-lg">
      <GoldenBackground />
      <header className="mb-5 flex items-start justify-between gap-4 px-1">
        <div>
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-800/55">
            <CalendarDays size={14} />
            Abendritual
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-stone-950">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm leading-6 text-stone-700/75">{subtitle}</p> : null}
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4">{children}</div>
      <nav className="glass-panel fixed inset-x-4 bottom-4 z-20 mx-auto grid max-w-md grid-cols-3 rounded-full p-2 sm:max-w-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex min-h-12 flex-col items-center justify-center rounded-full text-[0.7rem] font-semibold transition",
                active ? "bg-white/80 text-amber-900 shadow-sm" : "text-stone-600 hover:bg-white/45",
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
