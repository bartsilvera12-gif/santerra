"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { fadeUp, viewportOnce, EASE } from "@/lib/animations";

export default function BrandQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} className="relative h-[65vh] md:h-[85vh] overflow-hidden bg-santerra-black">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <img
          src="/images/property-3.png"
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-santerra-black via-santerra-black/70 to-santerra-black/40" />
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, #C52A42 0 1px, transparent 1px 26px)" }}
      />

      <div className="relative z-10 h-full max-w-[1100px] mx-auto px-5 md:px-10 flex flex-col justify-center text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-santerra-red" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-white/70">Santerra</span>
          </motion.div>

          <motion.blockquote
            variants={fadeUp}
            className="section-title text-[34px] md:text-[64px] lg:text-[72px] leading-[1.05] max-w-4xl"
          >
            <span className="text-santerra-red text-5xl md:text-7xl leading-none align-top">“</span>
            Cada propiedad tiene una historia.
            <br className="hidden md:block" /> Nosotros la contamos bien.
          </motion.blockquote>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-4 text-[11px] tracking-[0.28em] uppercase text-white/60"
          >
            <div className="w-8 h-[2px] bg-santerra-red" />
            Tu inversión, nuestro compromiso.
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
