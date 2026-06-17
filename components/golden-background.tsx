"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function GoldenBackground() {
  const { scrollYProgress } = useScroll();
  const firstOrbY = useTransform(scrollYProgress, [0, 1], [0, -44]);
  const secondOrbY = useTransform(scrollYProgress, [0, 1], [0, 58]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-200/55 blur-3xl"
        style={{ y: firstOrbY }}
      />
      <motion.div
        className="absolute -right-24 top-36 h-80 w-80 rounded-full bg-yellow-300/35 blur-3xl"
        style={{ y: secondOrbY }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/65 to-transparent" />
    </div>
  );
}
