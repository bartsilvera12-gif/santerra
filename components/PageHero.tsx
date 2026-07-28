"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/animations";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image = "/images/hero.png"
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 bg-santerra-black text-white overflow-hidden">
      <motion.img
        src={image}
        alt=""
        aria-hidden
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-santerra-black via-santerra-black/85 to-santerra-black/95" />
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, #C52A42 0 1px, transparent 1px 26px)" }}
      />
      <div className="relative max-w-[1320px] mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-10 h-[2px] bg-santerra-red" />
          <span className="text-[11px] tracking-[0.28em] uppercase text-white/70">{eyebrow}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="section-title text-[36px] md:text-[64px] leading-[1.02] max-w-3xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
            className="mt-5 text-white/75 text-lg max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
